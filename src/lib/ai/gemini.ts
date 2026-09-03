import { AUDIO_INLINE_MAX_BYTES, normalizeAudioMime } from "@/lib/audio-path";

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash";
export const GEMINI_STT_MODEL = "gemini-2.5-flash";

const TRANSCRIBE_PROMPT = `당신은 전문 전사(Transcription) AI입니다.
제공된 오디오의 내용을 빠짐없이 텍스트로 변환하세요.
가능하면 화자(예: 화자1, 화자2)를 구분하고 시간(예: 00:00:15)을 표기하여
"[화자1] 00:00:15
발화내용" 형식으로 작성하세요. 설명이나 머리말은 넣지 마세요.`;

export function getGeminiApiKey(): string {
  if (typeof process === "undefined" || !process.env) return "";
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ""
  );
}

export function isGeminiKeyError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err ?? "");
  return /API 키|api key|GEMINI_API_KEY|API_KEY_INVALID|PERMISSION_DENIED|blocked/i.test(
    message,
  );
}

export function parseJsonContent(text: string): unknown {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(trimmed) as unknown;
}

type GenerateInput = {
  system?: string;
  user?: string;
  temperature?: number;
  json?: boolean;
  schema?: { [key: string]: unknown };
  model?: string;
  audio?: { mimeType: string; data: string };
};

async function generateViaApiKey(input: GenerateInput): Promise<string> {
  const key = getGeminiApiKey();
  if (!key) throw new Error("Gemini API 키가 없습니다. GEMINI_API_KEY를 설정하세요.");
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: key });
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
  if (input.audio) {
    parts.push({ inlineData: { mimeType: input.audio.mimeType, data: input.audio.data } });
  }
  if (input.user) parts.push({ text: input.user });
  const res = await ai.models.generateContent({
    model: input.model || GEMINI_TEXT_MODEL,
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction: input.system || undefined,
      temperature: input.temperature ?? 0.2,
      ...(input.json
        ? {
            responseMimeType: "application/json" as const,
            ...(input.schema ? { responseJsonSchema: input.schema } : {}),
          }
        : {}),
    },
  });
  const content = res.text?.trim();
  if (!content) throw new Error("Gemini 응답이 비어 있습니다.");
  return content;
}

async function generateViaFirebase(input: GenerateInput): Promise<string> {
  const { getAI, getGenerativeModel, GoogleAIBackend } = await import("firebase/ai");
  const { app } = await import("@/lib/firebase");
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, {
    model: input.model || GEMINI_TEXT_MODEL,
    systemInstruction: input.system || undefined,
    generationConfig: {
      temperature: input.temperature ?? 0.2,
      ...(input.json
        ? {
            responseMimeType: "application/json" as const,
            ...(input.schema ? { responseJsonSchema: input.schema } : {}),
          }
        : {}),
    },
  });
  const parts: Array<string | { inlineData: { mimeType: string; data: string } }> = [];
  if (input.audio) {
    parts.push({ inlineData: { mimeType: input.audio.mimeType, data: input.audio.data } });
  }
  if (input.user) parts.push(input.user);
  const result = await model.generateContent(
    parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts,
  );
  const content = result.response.text()?.trim();
  if (!content) throw new Error("Gemini 응답이 비어 있습니다.");
  return content;
}

async function generate(input: GenerateInput): Promise<string> {
  if (getGeminiApiKey()) {
    try {
      return await generateViaApiKey(input);
    } catch (err) {
      if (typeof window === "undefined" || !isGeminiKeyError(err)) throw err;
    }
  }
  if (typeof window !== "undefined") {
    return generateViaFirebase(input);
  }
  throw new Error("Gemini API 키가 없습니다. GEMINI_API_KEY를 설정하세요.");
}

export async function geminiJson(input: {
  system?: string;
  user: string;
  temperature?: number;
  schema?: { [key: string]: unknown };
}): Promise<unknown> {
  const run = async () =>
    parseJsonContent(await generate({ ...input, json: true, schema: input.schema }));
  try {
    return await run();
  } catch (err) {
    if (err instanceof SyntaxError) return await run();
    throw err;
  }
}

export async function geminiText(input: {
  system?: string;
  user: string;
  temperature?: number;
}): Promise<string> {
  return generate({ ...input, json: false, temperature: input.temperature ?? 0.3 });
}

async function blobToBase64(blob: Blob): Promise<string> {
  if (typeof FileReader !== "undefined") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  const buf = Buffer.from(await blob.arrayBuffer());
  return buf.toString("base64");
}

async function waitForGeminiFile(
  ai: { files: { get: (params: { name: string }) => Promise<{ state?: string; uri?: string; mimeType?: string }> } },
  name: string,
) {
  for (let i = 0; i < 40; i++) {
    const file = await ai.files.get({ name });
    const state = String(file.state ?? "");
    if (state === "ACTIVE") return file;
    if (state === "FAILED") throw new Error("오디오 파일 처리에 실패했습니다.");
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("오디오 파일 처리가 너무 오래 걸립니다.");
}

async function transcribeViaFilesApi(blob: Blob, mimeType: string): Promise<string> {
  const key = getGeminiApiKey();
  if (!key) throw new Error("Gemini API 키가 없습니다. GEMINI_API_KEY를 설정하세요.");
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: key });
  const uploaded = await ai.files.upload({
    file: blob,
    config: { mimeType },
  });
  const name = uploaded.name;
  if (!name) throw new Error("Gemini 파일 업로드에 실패했습니다.");
  try {
    const ready = uploaded.state === "ACTIVE" ? uploaded : await waitForGeminiFile(ai, name);
    const res = await ai.models.generateContent({
      model: GEMINI_STT_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { fileData: { fileUri: ready.uri, mimeType: ready.mimeType || mimeType } },
            { text: TRANSCRIBE_PROMPT },
          ],
        },
      ],
      config: { temperature: 0.1 },
    });
    const content = res.text?.trim();
    if (!content) throw new Error("Gemini 응답이 비어 있습니다.");
    return content;
  } finally {
    await ai.files.delete({ name }).catch(() => undefined);
  }
}

async function transcribeInline(blob: Blob, mimeType: string): Promise<string> {
  const data = await blobToBase64(blob);
  return generate({
    model: GEMINI_STT_MODEL,
    user: TRANSCRIBE_PROMPT,
    audio: { mimeType, data },
    temperature: 0.1,
  });
}

export async function geminiTranscribeMedia(input: {
  blob: Blob;
  mimeType: string;
}): Promise<string> {
  const mime = normalizeAudioMime(input.mimeType || input.blob.type);
  const blob = input.blob.type ? input.blob : new Blob([input.blob], { type: mime });

  if (getGeminiApiKey()) {
    try {
      return await transcribeViaFilesApi(blob, mime);
    } catch (err) {
      if (blob.size <= AUDIO_INLINE_MAX_BYTES) {
        try {
          return await transcribeInline(blob, mime);
        } catch (inlineErr) {
          throw err instanceof Error ? err : inlineErr;
        }
      }
      throw err;
    }
  }

  if (typeof window !== "undefined") {
    if (blob.size > AUDIO_INLINE_MAX_BYTES) {
      throw new Error("원본은 보관됐습니다. 긴 녹음 전사는 서버 GEMINI_API_KEY가 필요합니다.");
    }
    return transcribeInline(blob, mime);
  }

  throw new Error("Gemini API 키가 없습니다. GEMINI_API_KEY를 설정하세요.");
}

export async function geminiAudio(input: {
  base64Data: string;
  mimeType: string;
  prompt?: string;
}): Promise<string> {
  const bytes = Uint8Array.from(atob(input.base64Data), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: normalizeAudioMime(input.mimeType) });
  return geminiTranscribeMedia({ blob, mimeType: input.mimeType });
}
