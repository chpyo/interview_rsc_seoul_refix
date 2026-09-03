import { analyzeTranscript, rewriteMinutesFromThemes } from "@/lib/ai/analyze";
import { chatWithProjectData } from "@/lib/ai/chat";
import { synthesizeProject } from "@/lib/ai/cross";
import { geminiAudio, isGeminiKeyError } from "@/lib/ai/gemini";
import {
  analyzeSession,
  askProjectAssistant,
  generateCrossSummary,
  rewriteMinutes,
} from "@/lib/server/sessions";
import { transcribeAudio } from "@/lib/server/stt";
import type { CrossSummary } from "@/lib/types";

function failMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

function shouldClientFallback(err: unknown) {
  return typeof window !== "undefined" && isGeminiKeyError(err);
}

export async function runAnalyzeSession(payload: Parameters<typeof analyzeTranscript>[0]) {
  try {
    const res = await analyzeSession({ data: payload });
    if (res.ok) return res;
    if (!shouldClientFallback(res.error)) return res;
  } catch (err) {
    if (!shouldClientFallback(err)) {
      return { ok: false as const, error: failMessage(err, "분석 중 오류가 발생했습니다.") };
    }
  }
  try {
    const result = await analyzeTranscript(payload);
    return { ok: true as const, result };
  } catch (err) {
    return { ok: false as const, error: failMessage(err, "분석 중 오류가 발생했습니다.") };
  }
}

export async function runRewriteMinutes(payload: Parameters<typeof rewriteMinutesFromThemes>[0]) {
  try {
    const res = await rewriteMinutes({ data: payload });
    if (res.ok) return res;
    if (!shouldClientFallback(res.error)) return res;
  } catch (err) {
    if (!shouldClientFallback(err)) {
      return { ok: false as const, error: failMessage(err, "회의록 생성 실패") };
    }
  }
  try {
    const minutes = await rewriteMinutesFromThemes(payload);
    return { ok: true as const, minutes };
  } catch (err) {
    return { ok: false as const, error: failMessage(err, "회의록 생성 실패") };
  }
}

export async function runCrossSummary(payload: Parameters<typeof synthesizeProject>[0]) {
  try {
    const res = await generateCrossSummary({ data: payload });
    if (res.ok) return res;
    if (!shouldClientFallback(res.error)) return res;
  } catch (err) {
    if (!shouldClientFallback(err)) {
      return {
        ok: false as const,
        error: failMessage(err, "교차 요약에 실패했습니다."),
        summary: null as CrossSummary | null,
      };
    }
  }
  try {
    const summary = await synthesizeProject(payload);
    return { ok: true as const, summary };
  } catch (err) {
    return {
      ok: false as const,
      error: failMessage(err, "교차 요약에 실패했습니다."),
      summary: null as CrossSummary | null,
    };
  }
}

export async function runProjectAssistant(payload: Parameters<typeof chatWithProjectData>[0]) {
  try {
    const res = await askProjectAssistant({ data: payload });
    if (res.ok) return res;
    if (!shouldClientFallback(res.error)) return res;
  } catch (err) {
    if (!shouldClientFallback(err)) {
      return { ok: false as const, error: failMessage(err, "답변 생성 실패"), answer: "" };
    }
  }
  try {
    const answer = await chatWithProjectData(payload);
    return { ok: true as const, answer };
  } catch (err) {
    return { ok: false as const, error: failMessage(err, "답변 생성 실패"), answer: "" };
  }
}

export async function runTranscribeAudio(payload: { base64Data: string; mimeType: string }) {
  try {
    const res = await transcribeAudio({ data: payload });
    if (res.ok) return res;
    if (!shouldClientFallback(res.error)) return res;
  } catch (err) {
    if (!shouldClientFallback(err)) {
      return { ok: false as const, error: failMessage(err, "음성 인식에 실패했습니다.") };
    }
  }
  try {
    const text = await geminiAudio(payload);
    return { ok: true as const, text };
  } catch (err) {
    return { ok: false as const, error: failMessage(err, "음성 인식에 실패했습니다.") };
  }
}
