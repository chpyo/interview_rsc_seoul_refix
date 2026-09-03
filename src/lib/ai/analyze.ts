import { geminiJson } from "@/lib/ai/gemini";
import type { ParsedSegment } from "@/lib/parse-transcript";
import type { Confidence } from "@/lib/types";

export type AnalysisResult = {
  headline: string;
  themes: Array<{
    title: string;
    summary: string;
    bullets: string[];
    sourceSegments: string[];
    quotes: Array<{ text: string; segmentId: string }>;
    confidence: Confidence;
  }>;
  facts: Array<{ label: string; value: string; segmentId: string }>;
  tags: string[];
  minutes: { overview: string; body: string; followups: string[] };
  unresolved: string[];
  actionItems: Array<{ assignee: string; deadline: string; task: string; segmentId: string }>;
};

const SYSTEM = `당신은 서울지역 인적자원개발위원회의 조사 연구원입니다.
기업 현장조사·FGI·분과위 녹취를 읽고, 이번 대화에서 실제로 나온 주제로만 정리합니다.

규칙:
1. 원문에 없는 수치·결론·기업 사정을 만들지 마십시오.
2. 모든 요지·사실·인용은 source_segments / segment_id로 구간 코드를 적으십시오. 코드는 S001 형식입니다.
3. 주제 제목은 이 대화의 언어를 쓰십시오. 미리 정한 조사표 항목명으로 바꾸지 마십시오.
4. 안 나온 항목을 "해당 없음" 섹션으로 만들지 마십시오.
5. 구어는 보고서체로 다듬되, quotes.text는 원문을 유지하십시오.
6. 애매하면 confidence를 low로 두고 unresolved에 이유를 적으십시오.
7. 응답은 JSON 객체만 출력하십시오.`;

const SCHEMA_HINT = `{
  "headline": "한 줄 핵심",
  "themes": [
    {
      "title": "이번 대화의 주제 제목",
      "summary": "2~5문장 요지",
      "bullets": ["핵심 한 줄"],
      "source_segments": ["S001"],
      "quotes": [{ "text": "원문 한두 문장", "segment_id": "S001" }],
      "confidence": "high"
    }
  ],
  "facts": [{ "label": "종사자 수", "value": "42명", "segment_id": "S002" }],
  "tags": ["재직자훈련"],
  "minutes": {
    "overview": "일시·대상·목적을 포함한 개요 한 문단",
    "body": "마크다운. ## 주제제목 아래 요지. 나온 주제만.",
    "followups": ["후속 확인 사항"]
  },
  "unresolved": ["결론 없이 언급만 된 사항"],
  "actionItems": [
    {
      "assignee": "김팀장 (미정이면 빈 문자열)",
      "deadline": "다음 주 금요일 (미정이면 빈 문자열)",
      "task": "시장조사 보고서 작성",
      "segmentId": "S003"
    }
  ]
}
confidence는 high, medium, low 중 하나.`;

function formatSegments(segments: Array<ParsedSegment & { code: string }>): string {
  return segments
    .map((s) => `[${s.code}] ${s.speaker}${s.ts ? ` (${s.ts})` : ""}\n${s.body}`)
    .join("\n\n");
}

function asArr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function normalizeConfidence(v: unknown): Confidence {
  if (v === "high" || v === "low" || v === "medium") return v;
  return "medium";
}

function normalizeAnalysis(raw: unknown, validCodes: Set<string>): AnalysisResult {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const keepCode = (code: string) => (validCodes.has(code) ? code : "");

  const themes = asArr(obj.themes)
    .map((item) => {
      const t = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      const sources = asArr(t.source_segments ?? t.sourceSegments)
        .map((c) => keepCode(str(c)))
        .filter(Boolean);
      const quotes = asArr(t.quotes)
        .map((q) => {
          const rec = q && typeof q === "object" ? (q as Record<string, unknown>) : {};
          const segmentId = keepCode(str(rec.segment_id ?? rec.segmentId));
          return { text: str(rec.text), segmentId };
        })
        .filter((q) => q.text && q.segmentId);
      return {
        title: str(t.title) || "제목 없는 주제",
        summary: str(t.summary),
        bullets: asArr(t.bullets).map((b) => str(b)).filter(Boolean),
        sourceSegments: sources,
        quotes,
        confidence: normalizeConfidence(t.confidence),
      };
    })
    .filter((t) => t.title);

  const minutesObj =
    obj.minutes && typeof obj.minutes === "object"
      ? (obj.minutes as Record<string, unknown>)
      : {};

  return {
    headline: str(obj.headline),
    themes,
    facts: asArr(obj.facts)
      .map((item) => {
        const f = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          label: str(f.label),
          value: str(f.value),
          segmentId: keepCode(str(f.segment_id ?? f.segmentId)),
        };
      })
      .filter((f) => f.label && f.value),
    tags: asArr(obj.tags)
      .map((t) => str(t))
      .filter(Boolean)
      .slice(0, 16),
    minutes: {
      overview: str(minutesObj.overview),
      body: str(minutesObj.body),
      followups: asArr(minutesObj.followups).map((x) => str(x)).filter(Boolean),
    },
    unresolved: asArr(obj.unresolved).map((x) => str(x)).filter(Boolean),
    actionItems: asArr(obj.actionItems ?? obj.action_items)
      .map((item) => {
        const a = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          assignee: str(a.assignee),
          deadline: str(a.deadline),
          task: str(a.task),
          segmentId: keepCode(str(a.segment_id ?? a.segmentId)),
        };
      })
      .filter((a) => a.task),
  };
}

const MAX_CHUNK_CHARS = 14000;

function chunkBySize(segments: Array<ParsedSegment & { code: string }>) {
  const chunks: Array<Array<ParsedSegment & { code: string }>> = [];
  let current: Array<ParsedSegment & { code: string }> = [];
  let size = 0;
  for (const seg of segments) {
    const n = seg.body.length + 48;
    if (current.length && size + n > MAX_CHUNK_CHARS) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(seg);
    size += n;
  }
  if (current.length) chunks.push(current);
  return chunks;
}

export async function analyzeTranscript(input: {
  meta: {
    title: string;
    sessionKind: string;
    sessionDate: string | null;
    industry: string;
    district: string;
    sizeLabel: string;
    projectTitle: string;
  };
  segments: Array<ParsedSegment & { code: string }>;
}): Promise<AnalysisResult> {
  const validCodes = new Set(input.segments.map((s) => s.code));
  const metaBlock = [
    `프로젝트: ${input.meta.projectTitle}`,
    `대상: ${input.meta.title}`,
    `유형: ${input.meta.sessionKind}`,
    `일자: ${input.meta.sessionDate ?? "미기재"}`,
    `업종: ${input.meta.industry || "미기재"}`,
    `지역: ${input.meta.district || "미기재"}`,
    `규모: ${input.meta.sizeLabel || "미기재"}`,
  ].join("\n");

  const chunks = chunkBySize(input.segments);

  if (chunks.length === 1) {
    const raw = await geminiJson({
      system: SYSTEM,
      user: `다음 녹취를 분석하십시오.\n\n${metaBlock}\n\n출력 스키마:\n${SCHEMA_HINT}\n\n녹취:\n${formatSegments(chunks[0] ?? [])}`,
    });
    return normalizeAnalysis(raw, validCodes);
  }

  const partials: unknown[] = [];
  for (const [i, chunk] of chunks.entries()) {
    const raw = await geminiJson({
      system: SYSTEM,
      user: `긴 녹취의 ${i + 1}/${chunks.length} 부분입니다. 이 구간의 주제·사실·인용만 JSON으로 추출하십시오. minutes는 비워 두어도 됩니다.\n\n${metaBlock}\n\n출력 스키마:\n${SCHEMA_HINT}\n\n녹취:\n${formatSegments(chunk)}`,
    });
    partials.push(raw);
  }

  const merged = await geminiJson({
    system: SYSTEM,
    user: `아래는 같은 인터뷰를 나눈 부분 분석입니다. 주제를 중복 없이 병합하고 회의록 초안을 작성하십시오. 원문에 없는 내용을 보태지 마십시오.\n\n${metaBlock}\n\n출력 스키마:\n${SCHEMA_HINT}\n\n부분 분석 JSON:\n${JSON.stringify(partials)}`,
  });
  return normalizeAnalysis(merged, validCodes);
}

export async function rewriteMinutesFromThemes(input: {
  meta: {
    title: string;
    sessionKind: string;
    sessionDate: string | null;
    projectTitle: string;
  };
  themes: AnalysisResult["themes"];
  facts: AnalysisResult["facts"];
  unresolved: string[];
}): Promise<AnalysisResult["minutes"]> {
  const raw = await geminiJson({
    system: SYSTEM,
    user: `검수된 주제 카드를 바탕으로 회의록 초안만 JSON으로 쓰십시오. 키는 minutes 하나만 있어도 됩니다. overview, body, followups를 채우십시오. body는 ## 주제제목 구조. 없는 사실을 만들지 마십시오.\n\n프로젝트: ${input.meta.projectTitle}\n대상: ${input.meta.title}\n유형: ${input.meta.sessionKind}\n일자: ${input.meta.sessionDate ?? "미기재"}\n\nthemes: ${JSON.stringify(input.themes)}\nfacts: ${JSON.stringify(input.facts)}\nunresolved: ${JSON.stringify(input.unresolved)}`,
  });
  const normalized = normalizeAnalysis(raw, new Set());
  if (normalized.minutes.overview || normalized.minutes.body) {
    return normalized.minutes;
  }
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    overview: typeof obj.overview === "string" ? obj.overview : "",
    body: typeof obj.body === "string" ? obj.body : "",
    followups: Array.isArray(obj.followups)
      ? obj.followups.filter((x): x is string => typeof x === "string")
      : [],
  };
}
