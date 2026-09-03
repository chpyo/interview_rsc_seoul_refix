import { n as geminiJson, r as geminiText } from "./gemini-CkYo7lCa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cross-DMzKlu2X.js
var SYSTEM = `당신은 서울지역 인적자원개발위원회의 조사 연구원입니다.
기업 현장조사·FGI·분과위 녹취를 읽고, 이번 대화에서 실제로 나온 주제로만 정리합니다.

규칙:
1. 원문에 없는 수치·결론·기업 사정을 만들지 마십시오.
2. 모든 요지·사실·인용은 source_segments / segment_id로 구간 코드를 적으십시오. 코드는 S001 형식입니다.
3. 주제 제목은 이 대화의 언어를 쓰십시오. 미리 정한 조사표 항목명으로 바꾸지 마십시오.
4. 안 나온 항목을 "해당 없음" 섹션으로 만들지 마십시오.
5. 구어는 보고서체로 다듬되, quotes.text는 원문을 유지하십시오.
6. 애매하면 confidence를 low로 두고 unresolved에 이유를 적으십시오.
7. 응답은 JSON 객체만 출력하십시오.`;
var SCHEMA_HINT = `{
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
  "unresolved": ["결론 없이 언급만 된 사항"]
}
confidence는 high, medium, low 중 하나.`;
function formatSegments(segments) {
	return segments.map((s) => `[${s.code}] ${s.speaker}${s.ts ? ` (${s.ts})` : ""}\n${s.body}`).join("\n\n");
}
function asArr$1(v) {
	return Array.isArray(v) ? v : [];
}
function str$1(v) {
	return typeof v === "string" ? v.trim() : "";
}
function normalizeConfidence(v) {
	if (v === "high" || v === "low" || v === "medium") return v;
	return "medium";
}
function normalizeAnalysis(raw, validCodes) {
	const obj = raw && typeof raw === "object" ? raw : {};
	const keepCode = (code) => validCodes.has(code) ? code : "";
	const themes = asArr$1(obj.themes).map((item) => {
		const t = item && typeof item === "object" ? item : {};
		const sources = asArr$1(t.source_segments ?? t.sourceSegments).map((c) => keepCode(str$1(c))).filter(Boolean);
		const quotes = asArr$1(t.quotes).map((q) => {
			const rec = q && typeof q === "object" ? q : {};
			const segmentId = keepCode(str$1(rec.segment_id ?? rec.segmentId));
			return {
				text: str$1(rec.text),
				segmentId
			};
		}).filter((q) => q.text && q.segmentId);
		return {
			title: str$1(t.title) || "제목 없는 주제",
			summary: str$1(t.summary),
			bullets: asArr$1(t.bullets).map((b) => str$1(b)).filter(Boolean),
			sourceSegments: sources,
			quotes,
			confidence: normalizeConfidence(t.confidence)
		};
	}).filter((t) => t.title);
	const minutesObj = obj.minutes && typeof obj.minutes === "object" ? obj.minutes : {};
	return {
		headline: str$1(obj.headline),
		themes,
		facts: asArr$1(obj.facts).map((item) => {
			const f = item && typeof item === "object" ? item : {};
			return {
				label: str$1(f.label),
				value: str$1(f.value),
				segmentId: keepCode(str$1(f.segment_id ?? f.segmentId))
			};
		}).filter((f) => f.label && f.value),
		tags: asArr$1(obj.tags).map((t) => str$1(t)).filter(Boolean).slice(0, 16),
		minutes: {
			overview: str$1(minutesObj.overview),
			body: str$1(minutesObj.body),
			followups: asArr$1(minutesObj.followups).map((x) => str$1(x)).filter(Boolean)
		},
		unresolved: asArr$1(obj.unresolved).map((x) => str$1(x)).filter(Boolean)
	};
}
var MAX_CHUNK_CHARS = 14e3;
function chunkBySize(segments) {
	const chunks = [];
	let current = [];
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
async function analyzeTranscript(input) {
	const validCodes = new Set(input.segments.map((s) => s.code));
	const metaBlock = [
		`프로젝트: ${input.meta.projectTitle}`,
		`대상: ${input.meta.title}`,
		`유형: ${input.meta.sessionKind}`,
		`일자: ${input.meta.sessionDate ?? "미기재"}`,
		`업종: ${input.meta.industry || "미기재"}`,
		`지역: ${input.meta.district || "미기재"}`,
		`규모: ${input.meta.sizeLabel || "미기재"}`
	].join("\n");
	const chunks = chunkBySize(input.segments);
	if (chunks.length === 1) return normalizeAnalysis(await geminiJson({
		system: SYSTEM,
		user: `다음 녹취를 분석하십시오.\n\n${metaBlock}\n\n출력 스키마:\n${SCHEMA_HINT}\n\n녹취:\n${formatSegments(chunks[0] ?? [])}`
	}), validCodes);
	const partials = [];
	for (const [i, chunk] of chunks.entries()) {
		const raw = await geminiJson({
			system: SYSTEM,
			user: `긴 녹취의 ${i + 1}/${chunks.length} 부분입니다. 이 구간의 주제·사실·인용만 JSON으로 추출하십시오. minutes는 비워 두어도 됩니다.\n\n${metaBlock}\n\n출력 스키마:\n${SCHEMA_HINT}\n\n녹취:\n${formatSegments(chunk)}`
		});
		partials.push(raw);
	}
	return normalizeAnalysis(await geminiJson({
		system: SYSTEM,
		user: `아래는 같은 인터뷰를 나눈 부분 분석입니다. 주제를 중복 없이 병합하고 회의록 초안을 작성하십시오. 원문에 없는 내용을 보태지 마십시오.\n\n${metaBlock}\n\n출력 스키마:\n${SCHEMA_HINT}\n\n부분 분석 JSON:\n${JSON.stringify(partials)}`
	}), validCodes);
}
async function rewriteMinutesFromThemes(input) {
	const raw = await geminiJson({
		system: SYSTEM,
		user: `검수된 주제 카드를 바탕으로 회의록 초안만 JSON으로 쓰십시오. 키는 minutes 하나만 있어도 됩니다. overview, body, followups를 채우십시오. body는 ## 주제제목 구조. 없는 사실을 만들지 마십시오.\n\n프로젝트: ${input.meta.projectTitle}\n대상: ${input.meta.title}\n유형: ${input.meta.sessionKind}\n일자: ${input.meta.sessionDate ?? "미기재"}\n\nthemes: ${JSON.stringify(input.themes)}\nfacts: ${JSON.stringify(input.facts)}\nunresolved: ${JSON.stringify(input.unresolved)}`
	});
	const normalized = normalizeAnalysis(raw, /* @__PURE__ */ new Set());
	if (normalized.minutes.overview || normalized.minutes.body) return normalized.minutes;
	const obj = raw && typeof raw === "object" ? raw : {};
	return {
		overview: typeof obj.overview === "string" ? obj.overview : "",
		body: typeof obj.body === "string" ? obj.body : "",
		followups: Array.isArray(obj.followups) ? obj.followups.filter((x) => typeof x === "string") : []
	};
}
async function chatWithProjectData(input) {
	const payload = input.sessions.map((s) => ({
		대상: s.title,
		주제: s.themes,
		사실: s.facts,
		인용: s.quotes.slice(0, 5)
	}));
	return geminiText({
		system: `당신은 서울지역 인적자원개발위원회의 리서치 어시스턴트입니다.
제공된 인터뷰 데이터를 바탕으로 사용자의 질문에 답변하세요.
데이터에 없는 내용을 지어내지 말고, 데이터에 있는 사실과 인용구를 활용해 설득력 있게 답변하세요.`,
		user: `프로젝트: ${input.projectTitle}
데이터: ${JSON.stringify(payload)}

사용자 질문: ${input.query}`
	});
}
function str(v) {
	return typeof v === "string" ? v.trim() : "";
}
function asArr(v) {
	return Array.isArray(v) ? v : [];
}
async function synthesizeProject(input) {
	const payload = input.sessions.map((s) => ({
		대상: s.title,
		일자: s.sessionDate,
		업종: s.industry,
		지역: s.district,
		한줄: s.headline,
		태그: s.tags,
		주제: s.themes,
		사실: s.facts,
		인용: s.quotes.slice(0, 8)
	}));
	const raw = await geminiJson({
		system: `당신은 서울지역 인적자원개발위원회의 조사 연구원입니다.
여러 확정 인터뷰를 비교해 반복된 주장과 긴장만 정리합니다.
원문에 없는 수치·기업 사정을 만들지 마십시오. JSON 객체만 출력하십시오.`,
		user: `프로젝트: ${input.projectTitle}
확정 인터뷰 ${input.sessions.length}건입니다. 한 건에서만 나온 이야기는 repeated에 넣지 마십시오.

출력:
{
  "overview": "교차 요약 한 문단",
  "repeated": [{"claim":"반복된 주장","sessionTitles":["대상명"],"evidence":"근거 한 줄"}],
  "tensions": [{"point":"서로 다른 점","detail":"설명"}],
  "followups": ["후속 확인"]
}

자료:
${JSON.stringify(payload)}`
	});
	const obj = raw && typeof raw === "object" ? raw : {};
	return {
		overview: str(obj.overview),
		repeated: asArr(obj.repeated).map((item) => {
			const rec = item && typeof item === "object" ? item : {};
			return {
				claim: str(rec.claim),
				sessionTitles: asArr(rec.sessionTitles ?? rec.session_titles).map((x) => str(x)).filter(Boolean),
				evidence: str(rec.evidence)
			};
		}).filter((r) => r.claim),
		tensions: asArr(obj.tensions).map((item) => {
			const rec = item && typeof item === "object" ? item : {};
			return {
				point: str(rec.point),
				detail: str(rec.detail)
			};
		}).filter((t) => t.point),
		followups: asArr(obj.followups).map((x) => str(x)).filter(Boolean)
	};
}
//#endregion
export { synthesizeProject as i, chatWithProjectData as n, rewriteMinutesFromThemes as r, analyzeTranscript as t };
