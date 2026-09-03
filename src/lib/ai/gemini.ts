export const GEMINI_TEXT_MODEL = "gemini-2.5-flash";
export const GEMINI_STT_MODEL = "gemini-2.5-flash";

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
      responseMimeType: input.json ? "application/json" : undefined,
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
      responseMimeType: input.json ? "application/json" : undefined,
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
}): Promise<unknown> {
  const run = async () => parseJsonContent(await generate({ ...input, json: true }));
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

export async function geminiAudio(input: {
  base64Data: string;
  mimeType: string;
  prompt?: string;
}): Promise<string> {
  const prompt =
    input.prompt ||
    `당신은 전문 전사(Transcription) AI입니다.
제공된 오디오의 내용을 빠짐없이 텍스트로 변환하세요.
가능하면 화자(예: 화자1, 화자2)를 구분하고 시간(예: 00:00:15)을 표기하여
"[화자1] 00:00:15
발화내용" 형식으로 작성하세요. 설명이나 머리말은 넣지 마세요.`;
  return generate({
    model: GEMINI_STT_MODEL,
    user: prompt,
    audio: { mimeType: input.mimeType, data: input.base64Data },
    temperature: 0.1,
  });
}
