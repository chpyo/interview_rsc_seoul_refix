import { t as createServerFn } from "./ssr.mjs";
import { i as synthesizeProject, n as chatWithProjectData, r as rewriteMinutesFromThemes, t as analyzeTranscript } from "./cross-BUUf8Sjl.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sessions-RvsMoGz1.js
var analyzeSession_createServerFn_handler = createServerRpc({
	id: "2a879a43978b93019c6481a9e5fc02c4cdf039704ec9b4d0831d41f4d9535b17",
	name: "analyzeSession",
	filename: "src/lib/server/sessions.ts"
}, (opts) => analyzeSession.__executeServer(opts));
var analyzeSession = createServerFn({ method: "POST" }).validator((input) => input).handler(analyzeSession_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			result: await analyzeTranscript({
				meta: data.meta,
				segments: data.segments
			})
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "분석 중 오류가 발생했습니다."
		};
	}
});
var rewriteMinutes_createServerFn_handler = createServerRpc({
	id: "3586a278f89f1147f8a2adb7e2e204d4dbaea7ca47f4b343eea566462ccb743b",
	name: "rewriteMinutes",
	filename: "src/lib/server/sessions.ts"
}, (opts) => rewriteMinutes.__executeServer(opts));
var rewriteMinutes = createServerFn({ method: "POST" }).validator((input) => input).handler(rewriteMinutes_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			minutes: await rewriteMinutesFromThemes(data)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "회의록 생성 실패"
		};
	}
});
var generateCrossSummary_createServerFn_handler = createServerRpc({
	id: "60dfd76f06d4b1e29345f77057730593a51e771ca193624152ff3c3d474a2452",
	name: "generateCrossSummary",
	filename: "src/lib/server/sessions.ts"
}, (opts) => generateCrossSummary.__executeServer(opts));
var generateCrossSummary = createServerFn({ method: "POST" }).validator((input) => input).handler(generateCrossSummary_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			summary: await synthesizeProject(data)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "교차 요약에 실패했습니다.",
			summary: null
		};
	}
});
var askProjectAssistant_createServerFn_handler = createServerRpc({
	id: "cdaa15bed1b0afc647c05975c67e1490a5832ba05bf30114490a94aaec095b60",
	name: "askProjectAssistant",
	filename: "src/lib/server/sessions.ts"
}, (opts) => askProjectAssistant.__executeServer(opts));
var askProjectAssistant = createServerFn({ method: "POST" }).validator((input) => input).handler(askProjectAssistant_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			answer: await chatWithProjectData(data)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "답변 생성 실패",
			answer: ""
		};
	}
});
//#endregion
export { analyzeSession_createServerFn_handler, askProjectAssistant_createServerFn_handler, generateCrossSummary_createServerFn_handler, rewriteMinutes_createServerFn_handler };
