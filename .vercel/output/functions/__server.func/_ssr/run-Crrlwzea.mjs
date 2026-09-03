import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as isGeminiKeyError, t as geminiAudio } from "./gemini-CkYo7lCa.mjs";
import { i as synthesizeProject, n as chatWithProjectData, r as rewriteMinutesFromThemes, t as analyzeTranscript } from "./cross-DMzKlu2X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/run-Crrlwzea.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var analyzeSession = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("2a879a43978b93019c6481a9e5fc02c4cdf039704ec9b4d0831d41f4d9535b17"));
var rewriteMinutes = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("3586a278f89f1147f8a2adb7e2e204d4dbaea7ca47f4b343eea566462ccb743b"));
var generateCrossSummary = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("60dfd76f06d4b1e29345f77057730593a51e771ca193624152ff3c3d474a2452"));
var askProjectAssistant = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("cdaa15bed1b0afc647c05975c67e1490a5832ba05bf30114490a94aaec095b60"));
var transcribeAudio = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("bb714c9ebbdcbeb29a5a04c991bccbe5f2b70c3f721c44e52acb038493f922e4"));
function failMessage(err, fallback) {
	return err instanceof Error ? err.message : fallback;
}
function shouldClientFallback(err) {
	return typeof window !== "undefined" && isGeminiKeyError(err);
}
async function runAnalyzeSession(payload) {
	try {
		const res = await analyzeSession({ data: payload });
		if (res.ok) return res;
		if (!shouldClientFallback(res.error)) return res;
	} catch (err) {
		if (!shouldClientFallback(err)) return {
			ok: false,
			error: failMessage(err, "분석 중 오류가 발생했습니다.")
		};
	}
	try {
		return {
			ok: true,
			result: await analyzeTranscript(payload)
		};
	} catch (err) {
		return {
			ok: false,
			error: failMessage(err, "분석 중 오류가 발생했습니다.")
		};
	}
}
async function runRewriteMinutes(payload) {
	try {
		const res = await rewriteMinutes({ data: payload });
		if (res.ok) return res;
		if (!shouldClientFallback(res.error)) return res;
	} catch (err) {
		if (!shouldClientFallback(err)) return {
			ok: false,
			error: failMessage(err, "회의록 생성 실패")
		};
	}
	try {
		return {
			ok: true,
			minutes: await rewriteMinutesFromThemes(payload)
		};
	} catch (err) {
		return {
			ok: false,
			error: failMessage(err, "회의록 생성 실패")
		};
	}
}
async function runCrossSummary(payload) {
	try {
		const res = await generateCrossSummary({ data: payload });
		if (res.ok) return res;
		if (!shouldClientFallback(res.error)) return res;
	} catch (err) {
		if (!shouldClientFallback(err)) return {
			ok: false,
			error: failMessage(err, "교차 요약에 실패했습니다."),
			summary: null
		};
	}
	try {
		return {
			ok: true,
			summary: await synthesizeProject(payload)
		};
	} catch (err) {
		return {
			ok: false,
			error: failMessage(err, "교차 요약에 실패했습니다."),
			summary: null
		};
	}
}
async function runProjectAssistant(payload) {
	try {
		const res = await askProjectAssistant({ data: payload });
		if (res.ok) return res;
		if (!shouldClientFallback(res.error)) return res;
	} catch (err) {
		if (!shouldClientFallback(err)) return {
			ok: false,
			error: failMessage(err, "답변 생성 실패"),
			answer: ""
		};
	}
	try {
		return {
			ok: true,
			answer: await chatWithProjectData(payload)
		};
	} catch (err) {
		return {
			ok: false,
			error: failMessage(err, "답변 생성 실패"),
			answer: ""
		};
	}
}
async function runTranscribeAudio(payload) {
	try {
		const res = await transcribeAudio({ data: payload });
		if (res.ok) return res;
		if (!shouldClientFallback(res.error)) return res;
	} catch (err) {
		if (!shouldClientFallback(err)) return {
			ok: false,
			error: failMessage(err, "음성 인식에 실패했습니다.")
		};
	}
	try {
		return {
			ok: true,
			text: await geminiAudio(payload)
		};
	} catch (err) {
		return {
			ok: false,
			error: failMessage(err, "음성 인식에 실패했습니다.")
		};
	}
}
//#endregion
export { runTranscribeAudio as a, runRewriteMinutes as i, runCrossSummary as n, runProjectAssistant as r, runAnalyzeSession as t };
