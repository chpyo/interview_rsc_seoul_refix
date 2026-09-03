import { createServerFn } from "@tanstack/react-start";
import { geminiAudio } from "@/lib/ai/gemini";

export const transcribeAudio = createServerFn({ method: "POST" })
  .validator((input: { base64Data: string; mimeType: string }) => input)
  .handler(async ({ data }) => {
    try {
      const text = await geminiAudio(data);
      return { ok: true as const, text };
    } catch (err) {
      const message = err instanceof Error ? err.message : "음성 인식에 실패했습니다.";
      return { ok: false as const, error: message };
    }
  });
