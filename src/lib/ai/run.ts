import { analyzeTranscript, rewriteMinutesFromThemes } from "@/lib/ai/analyze";
import { chatWithConfirmedCases } from "@/lib/ai/chat";
import { synthesizeProject } from "@/lib/ai/cross";
import { geminiEmbed } from "@/lib/ai/embed";
import { geminiTranscribeMedia, isGeminiKeyError } from "@/lib/ai/gemini";
import { embedText } from "@/lib/server/embed";
import {
  analyzeSession,
  askProjectAssistant,
  generateCrossSummary,
  rewriteMinutes,
} from "@/lib/server/sessions";
import type { ChatGroundedReply, RelatedCase } from "@/lib/types";
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

export async function runEmbedText(
  text: string,
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY",
): Promise<number[] | null> {
  try {
    const res = await embedText({ data: { text, taskType } });
    if (res.embedding) return res.embedding;
  } catch (err) {
    if (!shouldClientFallback(err)) return null;
  }
  try {
    return await geminiEmbed(text, taskType);
  } catch {
    return null;
  }
}

export async function runProjectAssistant(payload: Parameters<typeof chatWithConfirmedCases>[0]): Promise<
  { ok: true; answer: string; relatedCases: RelatedCase[] } | { ok: false; error: string; answer: string; relatedCases: RelatedCase[] }
> {
  const empty = { answer: "", relatedCases: [] as RelatedCase[] };
  try {
    const res = await askProjectAssistant({ data: payload });
    if (res.ok) return res;
    if (!shouldClientFallback(res.error)) return res;
  } catch (err) {
    if (!shouldClientFallback(err)) {
      return { ok: false as const, error: failMessage(err, "답변 생성 실패"), ...empty };
    }
  }
  try {
    const reply: ChatGroundedReply = await chatWithConfirmedCases(payload);
    return { ok: true as const, ...reply };
  } catch (err) {
    return { ok: false as const, error: failMessage(err, "답변 생성 실패"), ...empty };
  }
}

function shouldClientAudioFallback(err: unknown) {
  const message = err instanceof Error ? err.message : String(err ?? "");
  return (
    shouldClientFallback(err) ||
    /storage|bucket|download|Unauthorized|오디오 경로/i.test(message)
  );
}

export async function runTranscribeAudio(payload: {
  blob: Blob;
  mimeType: string;
  storagePath?: string;
}) {
  if (payload.storagePath) {
    try {
      const res = await transcribeAudio({
        data: { storagePath: payload.storagePath, mimeType: payload.mimeType },
      });
      if (res.ok) return res;
      if (!shouldClientAudioFallback(res.error)) return res;
    } catch (err) {
      if (!shouldClientAudioFallback(err)) {
        return { ok: false as const, error: failMessage(err, "음성 인식에 실패했습니다.") };
      }
    }
  }
  try {
    const text = await geminiTranscribeMedia({
      blob: payload.blob,
      mimeType: payload.mimeType,
    });
    return { ok: true as const, text };
  } catch (err) {
    return { ok: false as const, error: failMessage(err, "음성 인식에 실패했습니다.") };
  }
}
