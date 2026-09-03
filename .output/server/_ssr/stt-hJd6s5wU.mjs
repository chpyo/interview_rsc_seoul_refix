import { t as createServerFn } from "./ssr.mjs";
import { t as geminiAudio } from "./gemini-CkYo7lCa.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stt-hJd6s5wU.js
var transcribeAudio_createServerFn_handler = createServerRpc({
	id: "bb714c9ebbdcbeb29a5a04c991bccbe5f2b70c3f721c44e52acb038493f922e4",
	name: "transcribeAudio",
	filename: "src/lib/server/stt.ts"
}, (opts) => transcribeAudio.__executeServer(opts));
var transcribeAudio = createServerFn({ method: "POST" }).validator((input) => input).handler(transcribeAudio_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			text: await geminiAudio(data)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "음성 인식에 실패했습니다."
		};
	}
});
//#endregion
export { transcribeAudio_createServerFn_handler };
