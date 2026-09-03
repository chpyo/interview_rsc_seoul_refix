import { getSql } from "@/lib/db";
import { parseTranscript } from "@/lib/parse-transcript";
import { SAMPLE_TRANSCRIPT } from "@/lib/sample-transcript";
import { newId, padCode } from "@/lib/utils";

let seedPromise: Promise<void> | null = null;

export async function ensureSeed(): Promise<void> {
  seedPromise ??= (async () => {
    const sql = await getSql();
    await sql.query(
      `update sessions set researcher = $1 where id = $2 and (researcher is null or researcher = '')`,
      ["서울지역 인적자원개발위원회", "ses_harinlab"],
    );
    const existing = await sql<{ n: number }>`select count(*)::int as n from projects`;
    if ((existing[0]?.n ?? 0) > 0) return;

    const projectId = "proj_demo_ai_2026";
    const sessionId = "ses_harinlab";

    await sql.query(
      `insert into projects (id, title, year, kind, description)
       values ($1, $2, $3, $4, $5)`,
      [
        projectId,
        "2026년 AI 산업 심층조사",
        2026,
        "심층조사",
        "서울 지역 AI·소프트웨어 기업 현장 인터뷰. 아래 하린랩 건은 예시 자료입니다.",
      ],
    );

    const segments = parseTranscript(SAMPLE_TRANSCRIPT);
    const coded = segments.map((s) => ({ ...s, code: padCode(s.seq) }));

    await sql.query(
      `insert into sessions (
        id, project_id, title, session_date, session_kind, industry, size_label, district,
        researcher, status, original_filename, original_text, headline, minutes_overview, minutes_body,
        minutes_followups, unresolved, confirmed_at
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,'confirmed',$10,$11,$12,$13,$14,$15::jsonb,$16::jsonb, now()
      )`,
      [
        sessionId,
        projectId,
        "하린랩 (예시)",
        "2026-07-14",
        "기업 인터뷰",
        "AI",
        "42명",
        "구로구",
        "서울지역 인적자원개발위원회",
        "ai-sme-interview.txt",
        SAMPLE_TRANSCRIPT,
        "경력 MLOps 공석, 재직자 주말 집체 훈련이 채용보다 급함",
        "2026년 7월 14일 구로구 하린랩을 방문하여 대표와 인사팀장을 대상으로 AI 산업 심층조사를 진행하였다. 대화는 조사표 순서를 따르지 않고 채용 공석, 신입 이직, 재직자 훈련 방식, 수료-채용 연계를 중심으로 이어졌다.",
        `## 경력 MLOps 채용이 막혀 있다

경력 MLOps 인력이 6개월째 공석이다. 공고를 세 차례 냈고 연봉을 맞춰도 최종 단계에서 대기업으로 이동한다는 설명이 있었다. 모델을 개발하는 인력보다 현장에 올리고 평가하는 인력이 부족하다고 하였다.

## 신입 조기 이직과 재직자 재교육

작년 개발 신입 5명 중 3명이 6개월 내 이직하였다. 면담에서 성장이 보이지 않고 LLM 엔지니어링을 배울 기회가 없다는 말이 반복되었다. 대표는 경력 한 명을 뽑는 일보다 재직자 재교육이 급하다고 정리하였다.

## 주말 집체, LLM 운영 과정 수요

프롬프트 단기 특강은 이미 이수하였다. 필요한 내용은 RAG 적용, 평가 세트, 장애 시 롤백 등 운영이며 MLOps에 LLM 응용을 더한 8주 과정을 희망하였다. 주중 저녁은 배포 야근과 겹치고, 토요일 오전 집체와 자사 데이터 실습이 가능하다고 하였다. 보안상 외부 클라우드 실습은 어렵다고 하였다.

## 수료-채용 연계와 훈련 일정 공유

실무 과제가 있는 공동훈련 과정 수료생은 면접을 우선 검토할 수 있다고 하였다. 재직자 훈련 기간의 대체인력 지원, 수료-채용을 한곳에서 보는 창구, 분기 전 훈련 일정 공유를 요청하였다.

## 외국인력은 결론 없이 보류

외국인력은 검토만 한 상태이며 공공·대기업 프로젝트 보안 서약 때문에 결정을 미루고 있다.`,
        JSON.stringify([
          "희망 8주 과정의 구체 커리큘럼 초안을 공동훈련센터와 협의",
          "분기 전 훈련 일정 공유 창구 마련 여부 확인",
        ]),
        JSON.stringify(["외국인력 활용 여부는 결론 없이 언급만 됨"]),
      ],
    );

    for (const seg of coded) {
      await sql.query(
        `insert into segments (id, session_id, code, seq, speaker, ts, body)
         values ($1,$2,$3,$4,$5,$6,$7)`,
        [newId("seg"), sessionId, seg.code, seg.seq, seg.speaker, seg.ts, seg.body],
      );
    }

    const themes: Array<{
      title: string;
      summary: string;
      bullets: string[];
      sources: string[];
      quotes: Array<{ text: string; code: string }>;
      confidence: string;
    }> = [
      {
        title: "경력 MLOps가 6개월째 공석",
        summary:
          "모델을 현장에 올리고 평가하는 인력이 부족하다. 공고를 세 차례 냈고 연봉을 맞춰도 최종에서 대기업으로 이동한다.",
        bullets: ["MLOps 경력 6개월 공석", "개발보다 운영·평가 인력이 부족"],
        sources: ["S004"],
        quotes: [
          {
            text: "모델 만드는 사람보다 모델을 현장에 올려 두고 평가하는 사람이 없습니다.",
            code: "S004",
          },
        ],
        confidence: "high",
      },
      {
        title: "신입 조기 이직, 재직자 재교육이 급함",
        summary:
          "작년 개발 신입 5명 중 3명이 6개월 내 이직했다. 대표는 경력 한 명을 뽑는 일보다 재직자 재교육이 급하다고 보았다.",
        bullets: ["신입 5명 중 3명 조기 이직", "재직자 재교육이 채용보다 우선"],
        sources: ["S005", "S007", "S008"],
        quotes: [
          {
            text: "지금 급한 건 경력 한 명 뽑는 것보다 재직자 재교육입니다.",
            code: "S008",
          },
        ],
        confidence: "high",
      },
      {
        title: "주말 집체 LLM 운영 과정",
        summary:
          "프롬프트 특강은 이미 들었다. RAG, 평가 세트, 롤백 등 운영이 필요하고 토요일 오전 집체와 자사 데이터 실습을 원한다.",
        bullets: ["8주 MLOps+LLM 운영 과정", "토요 집체, 외부 클라우드는 어려움"],
        sources: ["S010", "S011"],
        quotes: [
          {
            text: "주중 저녁은 어렵습니다. 배포가 저녁에 몰려서 야근과 겹칩니다. 토요일 집체는 가능합니다.",
            code: "S011",
          },
        ],
        confidence: "high",
      },
      {
        title: "수료-채용 연계와 훈련 일정 공유",
        summary:
          "실무 과제가 있는 공동훈련 수료생은 면접을 우선 검토할 수 있다. 대체인력 지원과 분기 전 일정 공유를 요청했다.",
        bullets: ["수료생 면접 우선 검토 가능", "분기 전 훈련 일정 공유 요청"],
        sources: ["S013", "S019", "S020"],
        quotes: [
          {
            text: "실무 과제가 있는 과정이면 수료생 면접을 우선 검토할 수 있습니다.",
            code: "S013",
          },
        ],
        confidence: "medium",
      },
      {
        title: "외국인력은 보류",
        summary: "외국인력은 검토만 한 상태이며 보안 서약 때문에 결정을 미루고 있다.",
        bullets: ["결론 없이 언급만 됨"],
        sources: ["S015"],
        quotes: [],
        confidence: "low",
      },
    ];

    for (const [i, theme] of themes.entries()) {
      const themeId = newId("thm");
      await sql.query(
        `insert into themes (id, session_id, sort_order, title, summary, bullets, source_segment_ids, confidence)
         values ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8)`,
        [
          themeId,
          sessionId,
          i,
          theme.title,
          theme.summary,
          JSON.stringify(theme.bullets),
          JSON.stringify(theme.sources),
          theme.confidence,
        ],
      );
      for (const [qi, q] of theme.quotes.entries()) {
        await sql.query(
          `insert into excerpts (id, session_id, theme_id, segment_code, body, sort_order)
           values ($1,$2,$3,$4,$5,$6)`,
          [newId("ex"), sessionId, themeId, q.code, q.text, qi],
        );
      }
    }

    const facts = [
      ["종사자 수", "42명", "S002"],
      ["업종", "AI 소프트웨어", "S002"],
      ["MLOps 공석 기간", "6개월", "S004"],
      ["신입 조기 이직", "5명 중 3명", "S007"],
    ];
    for (const [label, value, code] of facts) {
      await sql.query(
        `insert into facts (id, session_id, label, value, segment_code) values ($1,$2,$3,$4,$5)`,
        [newId("fct"), sessionId, label, value, code],
      );
    }

    for (const label of ["재직자훈련", "MLOps", "주말집체", "수료채용연계"]) {
      await sql.query(`insert into tags (id, session_id, label) values ($1,$2,$3)`, [
        newId("tag"),
        sessionId,
        label,
      ]);
    }
  })();
  return seedPromise;
}
