import { createServerFn } from "@tanstack/react-start";
import { analyzeTranscript, rewriteMinutesFromThemes } from "@/lib/ai/analyze";
import { chatWithConfirmedCases } from "@/lib/ai/chat";
import type { ChatCaseContext, RelatedCase } from "@/lib/types";
import { synthesizeProject } from "@/lib/ai/cross";
import type { CrossSummary } from "@/lib/types";

export const analyzeSession = createServerFn({ method: "POST" })
  .validator((input: { meta: Parameters<typeof analyzeTranscript>[0]["meta"]; segments: Parameters<typeof analyzeTranscript>[0]["segments"] }) => input)
  .handler(async ({ data }) => {
    try {
      const result = await analyzeTranscript({
        meta: data.meta,
        segments: data.segments,
      });
      return { ok: true as const, result };
    } catch (err) {
      return { ok: false as const, error: err instanceof Error ? err.message : "분석 중 오류가 발생했습니다." };
    }
  });

export const rewriteMinutes = createServerFn({ method: "POST" })
  .validator(
    (input: {
      meta: {
        title: string;
        sessionKind: string;
        sessionDate: string | null;
        projectTitle: string;
      };
      themes: Parameters<typeof rewriteMinutesFromThemes>[0]["themes"];
      facts: Parameters<typeof rewriteMinutesFromThemes>[0]["facts"];
      unresolved: string[];
    }) => input,
  )
  .handler(async ({ data }) => {
    try {
      const minutes = await rewriteMinutesFromThemes(data);
      return { ok: true as const, minutes };
    } catch (err) {
      return { ok: false as const, error: err instanceof Error ? err.message : "회의록 생성 실패" };
    }
  });

export const generateCrossSummary = createServerFn({ method: "POST" })
  .validator(
    (input: {
      projectTitle: string;
      sessions: Parameters<typeof synthesizeProject>[0]["sessions"];
    }) => input,
  )
  .handler(async ({ data }) => {
    try {
      const summary: CrossSummary = await synthesizeProject(data);
      return { ok: true as const, summary };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "교차 요약에 실패했습니다.",
        summary: null as CrossSummary | null,
      };
    }
  });

export const askProjectAssistant = createServerFn({ method: "POST" })
  .validator(
    (input: {
      projectTitle?: string;
      query: string;
      cases: ChatCaseContext[];
      ranked: RelatedCase[];
    }) => input,
  )
  .handler(async ({ data }) => {
    try {
      const reply = await chatWithConfirmedCases(data);
      return { ok: true as const, ...reply };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "답변 생성 실패",
        answer: "",
        relatedCases: [] as RelatedCase[],
      };
    }
  });
