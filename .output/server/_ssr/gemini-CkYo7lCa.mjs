//#region node_modules/.nitro/vite/services/ssr/assets/gemini-CkYo7lCa.js
var GEMINI_STT_MODEL = "gemini-2.5-flash";
function getGeminiApiKey() {
	if (typeof process === "undefined" || !process.env) return "";
	return process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || "";
}
function isGeminiKeyError(err) {
	const message = err instanceof Error ? err.message : String(err ?? "");
	return /API 키|api key|GEMINI_API_KEY|API_KEY_INVALID|PERMISSION_DENIED|blocked/i.test(message);
}
function parseJsonContent(text) {
	const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
	return JSON.parse(trimmed);
}
async function generateViaApiKey(input) {
	const key = getGeminiApiKey();
	if (!key) throw new Error("Gemini API 키가 없습니다. GEMINI_API_KEY를 설정하세요.");
	const { GoogleGenAI } = await import("../_libs/@google/genai.mjs").then((n) => n.t);
	const ai = new GoogleGenAI({ apiKey: key });
	const parts = [];
	if (input.audio) parts.push({ inlineData: {
		mimeType: input.audio.mimeType,
		data: input.audio.data
	} });
	if (input.user) parts.push({ text: input.user });
	const content = (await ai.models.generateContent({
		model: input.model || "gemini-2.5-flash",
		contents: [{
			role: "user",
			parts
		}],
		config: {
			systemInstruction: input.system || void 0,
			temperature: input.temperature ?? .2,
			responseMimeType: input.json ? "application/json" : void 0
		}
	})).text?.trim();
	if (!content) throw new Error("Gemini 응답이 비어 있습니다.");
	return content;
}
async function generateViaFirebase(input) {
	const { getAI, getGenerativeModel, GoogleAIBackend } = await import("../_libs/firebase.mjs").then((n) => n.t);
	const { app } = await import("./firebase-Bef2K2R_.mjs").then((n) => n.r);
	const model = getGenerativeModel(getAI(app, { backend: new GoogleAIBackend() }), {
		model: input.model || "gemini-2.5-flash",
		systemInstruction: input.system || void 0,
		generationConfig: {
			temperature: input.temperature ?? .2,
			responseMimeType: input.json ? "application/json" : void 0
		}
	});
	const parts = [];
	if (input.audio) parts.push({ inlineData: {
		mimeType: input.audio.mimeType,
		data: input.audio.data
	} });
	if (input.user) parts.push(input.user);
	const content = (await model.generateContent(parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts)).response.text()?.trim();
	if (!content) throw new Error("Gemini 응답이 비어 있습니다.");
	return content;
}
async function generate(input) {
	if (getGeminiApiKey()) try {
		return await generateViaApiKey(input);
	} catch (err) {
		if (typeof window === "undefined" || !isGeminiKeyError(err)) throw err;
	}
	if (typeof window !== "undefined") return generateViaFirebase(input);
	throw new Error("Gemini API 키가 없습니다. GEMINI_API_KEY를 설정하세요.");
}
async function geminiJson(input) {
	const run = async () => parseJsonContent(await generate({
		...input,
		json: true
	}));
	try {
		return await run();
	} catch (err) {
		if (err instanceof SyntaxError) return await run();
		throw err;
	}
}
async function geminiText(input) {
	return generate({
		...input,
		json: false,
		temperature: input.temperature ?? .3
	});
}
async function geminiAudio(input) {
	return generate({
		model: GEMINI_STT_MODEL,
		user: input.prompt || `당신은 전문 전사(Transcription) AI입니다.
제공된 오디오의 내용을 빠짐없이 텍스트로 변환하세요.
가능하면 화자(예: 화자1, 화자2)를 구분하고 시간(예: 00:00:15)을 표기하여
"[화자1] 00:00:15
발화내용" 형식으로 작성하세요. 설명이나 머리말은 넣지 마세요.`,
		audio: {
			mimeType: input.mimeType,
			data: input.base64Data
		},
		temperature: .1
	});
}
//#endregion
export { isGeminiKeyError as i, geminiJson as n, geminiText as r, geminiAudio as t };
