import { createServerFn } from "@tanstack/react-start";
import { geminiTranscribeMedia } from "@/lib/ai/gemini";
import { isOwnedAudioPath, normalizeAudioMime } from "@/lib/audio-path";
import { downloadUserAudio, requireAuth } from "@/lib/server/firebase-admin";

export const transcribeAudio = createServerFn({ method: "POST" })
  .validator((input: { storagePath: string; mimeType: string }) => input)
  .handler(async ({ data }) => {
    try {
      const uid = await requireAuth();
      if (!isOwnedAudioPath(uid, data.storagePath)) {
        return { ok: false as const, error: "오디오 경로가 올바르지 않습니다." };
      }
      const bytes = await downloadUserAudio(data.storagePath);
      const mimeType = normalizeAudioMime(data.mimeType);
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      const blob = new Blob([copy], { type: mimeType });
      const text = await geminiTranscribeMedia({ blob, mimeType });
      return { ok: true as const, text };
    } catch (err) {
      const message = err instanceof Error ? err.message : "음성 인식에 실패했습니다.";
      return { ok: false as const, error: message };
    }
  });
