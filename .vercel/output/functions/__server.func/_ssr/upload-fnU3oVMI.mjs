import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as LoaderCircle, o as Square, r as Upload, v as FileText, x as Circle } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useAuth, d as padCode, i as Route$2, o as Button } from "./router-cvInbm9-.mjs";
import { D as uniqueSpeakers, T as serializeSegments, b as remapSpeakers, c as createSession, h as listProjects, i as SESSION_KINDS, l as decodeTranscriptFile, n as Input, y as parseTranscript } from "./firebase-db-C0hxaiff.mjs";
import { n as CardContent, t as Card } from "./card-CDRODdii.mjs";
import { a as runTranscribeAudio } from "./run-Crrlwzea.mjs";
import { n as NativeSelect, r as Textarea, t as Label } from "./textarea-DJXeVAEG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/upload-fnU3oVMI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/** Minimal ZIP reader for DOCX/HWPX (store + deflate). */
function u16(view, offset) {
	return view.getUint16(offset, true);
}
function u32(view, offset) {
	return view.getUint32(offset, true);
}
async function inflateRaw(data) {
	if (typeof DecompressionStream !== "undefined") {
		const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
		return new Uint8Array(await new Response(stream).arrayBuffer());
	}
	const { inflateRawSync } = await import("node:zlib");
	return inflateRawSync(data);
}
function findEocd(bytes) {
	const start = Math.max(0, bytes.length - 65557);
	for (let i = bytes.length - 22; i >= start; i -= 1) if (bytes[i] === 80 && bytes[i + 1] === 75 && bytes[i + 2] === 5 && bytes[i + 3] === 6) return i;
	return -1;
}
function isZip(buffer) {
	const b = new Uint8Array(buffer);
	return b.length >= 4 && b[0] === 80 && b[1] === 75;
}
function isOleCompound(buffer) {
	const b = new Uint8Array(buffer);
	return b.length >= 8 && b[0] === 208 && b[1] === 207 && b[2] === 17 && b[3] === 224;
}
async function unzip(buffer) {
	const bytes = new Uint8Array(buffer);
	const view = new DataView(buffer);
	const files = /* @__PURE__ */ new Map();
	const decoder = new TextDecoder("utf-8");
	const eocd = findEocd(bytes);
	if (eocd < 0) throw new Error("압축 문서를 읽지 못했습니다.");
	const cdOffset = u32(view, eocd + 16);
	const cdCount = u16(view, eocd + 10);
	let offset = cdOffset;
	for (let i = 0; i < cdCount; i += 1) {
		if (u32(view, offset) !== 33639248) break;
		const method = u16(view, offset + 10);
		const compSize = u32(view, offset + 20);
		const nameLen = u16(view, offset + 28);
		const extraLen = u16(view, offset + 30);
		const commentLen = u16(view, offset + 32);
		const localOff = u32(view, offset + 42);
		const name = decoder.decode(bytes.subarray(offset + 46, offset + 46 + nameLen));
		const localNameLen = u16(view, localOff + 26);
		const localExtra = u16(view, localOff + 28);
		const dataStart = localOff + 30 + localNameLen + localExtra;
		const compressed = bytes.subarray(dataStart, dataStart + compSize);
		if (method === 0) files.set(name, compressed.slice());
		else if (method === 8) files.set(name, await inflateRaw(compressed));
		offset += 46 + nameLen + extraLen + commentLen;
	}
	return files;
}
function decodeEntities(text) {
	return text.replace(/* @__PURE__ */ new RegExp("&amp;", "gi"), "&").replace(/* @__PURE__ */ new RegExp("&lt;", "gi"), "<").replace(/* @__PURE__ */ new RegExp("&gt;", "gi"), ">").replace(/* @__PURE__ */ new RegExp("&quot;", "gi"), "\"").replace(/* @__PURE__ */ new RegExp("&apos;", "gi"), "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(Number.parseInt(n, 16)));
}
function xmlToPlainText(xml) {
	return decodeEntities(xml.replace(/<\/w:p>/gi, "\n").replace(/<w:br\b[^>]*>/gi, "\n").replace(/<w:tab\b[^>]*>/gi, "	").replace(/<\/hp:p>/gi, "\n").replace(/<\/hs:p>/gi, "\n").replace(/<hp:lineBreak\b[^>]*>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function textFromFiles(files, names) {
	const decoder = new TextDecoder("utf-8");
	const parts = [];
	for (const name of names) {
		const data = files.get(name);
		if (!data) continue;
		parts.push(xmlToPlainText(decoder.decode(data)));
	}
	return parts.filter(Boolean).join("\n\n");
}
async function extractOfficeText(filename, buffer) {
	const lower = filename.toLowerCase();
	if (lower.endsWith(".txt") || lower.endsWith(".md")) return decodeTranscriptFile(buffer);
	if (isOleCompound(buffer) || lower.endsWith(".hwp") && !isZip(buffer)) throw new Error("구형 한글 문서(.hwp)는 읽을 수 없습니다. 한글에서 HWPX 또는 TXT로 저장해 주세요.");
	if (lower.endsWith(".doc") && !isZip(buffer)) throw new Error("구형 Word 문서(.doc)는 읽을 수 없습니다. DOCX 또는 텍스트로 저장해 주세요.");
	if (!isZip(buffer)) return decodeTranscriptFile(buffer);
	const files = await unzip(buffer);
	if (lower.endsWith(".docx") || files.has("word/document.xml")) {
		const text = textFromFiles(files, ["word/document.xml"]);
		if (!text) throw new Error("DOCX에서 본문을 찾지 못했습니다.");
		return text;
	}
	const hwpxSections = [...files.keys()].filter((name) => /^Contents\/section\d+\.xml$/i.test(name)).sort();
	if (lower.endsWith(".hwpx") || hwpxSections.length > 0) {
		const text = textFromFiles(files, hwpxSections);
		if (!text) throw new Error("HWPX에서 본문을 찾지 못했습니다.");
		return text;
	}
	throw new Error("지원하지 않는 파일입니다. TXT, MD, DOCX, HWPX를 올려 주세요.");
}
var KEY = "hyunjang-researcher";
function getStoredResearcher() {
	if (typeof window === "undefined") return "";
	try {
		return localStorage.getItem(KEY)?.trim() ?? "";
	} catch {
		return "";
	}
}
function setStoredResearcher(name) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(KEY, name.trim());
	} catch {}
}
var _jsxFileName = "/app/applet/src/routes/upload.tsx?tsr-split=component";
function UploadPage() {
	const { user } = useAuth();
	const uid = user?.uid;
	const { projectId: qProject } = Route$2.useSearch();
	const navigate = useNavigate();
	const { data: liveProjects = [] } = useQuery({
		queryKey: ["projects", uid],
		queryFn: () => listProjects(uid),
		enabled: !!uid
	});
	const [projectId, setProjectId] = (0, import_react.useState)(qProject ?? liveProjects[0]?.id ?? "");
	const [title, setTitle] = (0, import_react.useState)("");
	const [sessionDate, setSessionDate] = (0, import_react.useState)("");
	const [sessionKind, setSessionKind] = (0, import_react.useState)("기업 인터뷰");
	const [industry, setIndustry] = (0, import_react.useState)("");
	const [sizeLabel, setSizeLabel] = (0, import_react.useState)("");
	const [district, setDistrict] = (0, import_react.useState)("");
	const [researcher, setResearcher] = (0, import_react.useState)("");
	const [filename, setFilename] = (0, import_react.useState)("");
	const [text, setText] = (0, import_react.useState)("");
	const [speakerMap, setSpeakerMap] = (0, import_react.useState)({});
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const [reading, setReading] = (0, import_react.useState)(false);
	const [isRecording, setIsRecording] = (0, import_react.useState)(false);
	const [recordingTime, setRecordingTime] = (0, import_react.useState)(0);
	const mediaRecorderRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	const audioChunksRef = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		setResearcher(getStoredResearcher());
	}, []);
	(0, import_react.useEffect)(() => {
		if (!projectId && liveProjects[0]?.id) setProjectId(qProject ?? liveProjects[0].id);
	}, [
		liveProjects,
		projectId,
		qProject
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (timerRef.current) window.clearInterval(timerRef.current);
		};
	}, []);
	const [isTranscribing, setIsTranscribing] = (0, import_react.useState)(false);
	const parsed = (0, import_react.useMemo)(() => text ? parseTranscript(text) : [], [text]);
	const speakers = (0, import_react.useMemo)(() => uniqueSpeakers(parsed), [parsed]);
	const remapped = (0, import_react.useMemo)(() => remapSpeakers(parsed, speakerMap), [parsed, speakerMap]);
	async function fileToBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const base64 = reader.result.split(",")[1];
				resolve(base64 ?? "");
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}
	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) audioChunksRef.current.push(event.data);
			};
			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
				stream.getTracks().forEach((track) => track.stop());
				setIsRecording(false);
				if (timerRef.current) window.clearInterval(timerRef.current);
				await handleAudioData(audioBlob, "녹음본.webm");
			};
			mediaRecorder.start();
			setIsRecording(true);
			setRecordingTime(0);
			timerRef.current = window.setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1e3);
		} catch (err) {
			toast.error("마이크 권한을 허용해주세요.");
		}
	};
	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) mediaRecorderRef.current.stop();
	};
	const formatTime = (seconds) => {
		return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
	};
	async function handleAudioData(file, defaultName) {
		setIsTranscribing(true);
		try {
			const base64Data = await fileToBase64(file);
			const res = await runTranscribeAudio({
				base64Data,
				mimeType: file.type
			});
			if (!res.ok) toast.error(res.error);
			else {
				setText(res.text);
				const name = file.name || defaultName;
				setFilename(name);
				setSpeakerMap({});
				if (!title) setTitle(name.replace(/\.(mp3|wav|m4a|aac|webm)$/i, ""));
				toast.success("음성 전사가 완료되었습니다.");
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "음성을 처리하지 못했습니다.");
		} finally {
			setIsTranscribing(false);
		}
	}
	async function onFile(file) {
		if (file.type.startsWith("audio/")) {
			await handleAudioData(file, file.name);
			return;
		}
		setReading(true);
		try {
			const raw = await extractOfficeText(file.name, await file.arrayBuffer());
			setText(raw);
			setFilename(file.name);
			setSpeakerMap({});
			if (!title) setTitle(file.name.replace(/\.(txt|md|docx|hwpx|hwp|doc)$/i, ""));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "파일을 읽지 못했습니다.");
		} finally {
			setReading(false);
		}
	}
	const mutation = useMutation({
		mutationFn: () => createSession(uid, {
			projectId,
			title,
			sessionDate: sessionDate || null,
			sessionKind,
			industry,
			sizeLabel,
			district,
			researcher,
			filename: filename || "붙여넣기.txt",
			originalText: serializeSegments(remapped),
			segments: remapped.map((seg, i) => ({
				seq: i + 1,
				speaker: seg.speaker,
				ts: seg.ts,
				body: seg.body,
				code: padCode(i + 1)
			}))
		}),
		onSuccess: (res) => {
			setStoredResearcher(researcher);
			toast.success(`구간 ${res.segmentCount}개를 읽었습니다.`);
			navigate({
				to: "/sessions/$sessionId",
				params: { sessionId: res.id }
			});
		},
		onError: (err) => toast.error(err.message)
	});
	const canSubmit = projectId && title.trim() && remapped.length > 0;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "font-serif text-3xl font-semibold tracking-tight",
				children: "녹취 올리기"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 207,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "화자와 구간이 나뉜 텍스트, 워드, 한글(HWPX)을 받습니다. 음성 파일(.mp3, .wav, .m4a)을 올리면 AI가 직접 전사합니다."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 208,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 206,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "rounded-lg",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
					className: "flex flex-col gap-4 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							onDragOver: (e) => {
								e.preventDefault();
								setDragOver(true);
							},
							onDragLeave: () => setDragOver(false),
							onDrop: (e) => {
								e.preventDefault();
								setDragOver(false);
								const file = e.dataTransfer.files[0];
								if (file) onFile(file);
							},
							className: `flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center transition-colors ${dragOver ? "border-primary bg-highlight" : "border-border bg-muted/40"}`,
							children: [
								isTranscribing ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-5 text-primary animate-spin" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 224,
									columnNumber: 31
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "size-5 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 224,
									columnNumber: 95
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-sm font-medium",
									children: isTranscribing ? "음성을 텍스트로 변환하는 중..." : reading ? "파일을 읽는 중..." : "파일을 놓거나 선택"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 225,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs text-muted-foreground",
									children: ".txt .docx .hwpx 또는 음성 파일 (.mp3, .wav, .m4a)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 228,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "file",
									accept: ".txt,.md,.docx,.hwpx,.hwp,.doc,text/plain,audio/*",
									className: "sr-only",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (file) onFile(file);
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 231,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 215,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/20 p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-base font-semibold",
									children: "앱에서 직접 녹음하기"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 237,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm text-muted-foreground text-center",
									children: "회의나 인터뷰를 실시간으로 녹음하고 즉시 분석합니다."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 238,
									columnNumber: 13
								}, this),
								isRecording ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-col items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xl font-mono text-destructive font-medium animate-pulse",
										children: formatTime(recordingTime)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 242,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "destructive",
										onClick: stopRecording,
										className: "gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Square, {
											className: "size-4",
											fill: "currentColor"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 246,
											columnNumber: 19
										}, this), "녹음 중지 및 분석"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 245,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 241,
									columnNumber: 28
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									onClick: startRecording,
									variant: "outline",
									className: "gap-2 border-primary text-primary hover:bg-primary/5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Circle, {
										className: "size-4 text-destructive",
										fill: "currentColor"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 250,
										columnNumber: 17
									}, this), "녹음 시작"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 249,
									columnNumber: 24
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 236,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "paste",
							children: "또는 텍스트 붙여넣기"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 255,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
							id: "paste",
							className: "mt-1.5 font-mono text-sm",
							rows: 8,
							value: text,
							placeholder: `[대표] 00:01:12\n경력 MLOps가 비어 있습니다.\n\n조사원: 훈련은 어떤 방식이 가능하신가요.`,
							onChange: (e) => {
								setText(e.target.value);
								if (!filename) setFilename("붙여넣기.txt");
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 256,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 254,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"형식 예: ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
									className: "font-mono text-xs",
									children: "[대표] 00:01:12"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 262,
									columnNumber: 19
								}, this),
								" 다음 줄에 발화, 또는",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
									className: "font-mono text-xs",
									children: "조사원: …"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 263,
									columnNumber: 13
								}, this),
								" · ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									className: "underline underline-offset-2",
									href: "/samples/ai-sme-interview.txt",
									download: true,
									children: "예시 파일 받기"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 265,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 261,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 214,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 213,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				className: "flex flex-col gap-4",
				onSubmit: (e) => {
					e.preventDefault();
					mutation.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
								label: "프로젝트",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NativeSelect, {
									value: projectId,
									onChange: (e) => setProjectId(e.target.value),
									required: true,
									children: [liveProjects.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "",
										children: "먼저 프로젝트를 만드세요"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 279,
										columnNumber: 44
									}, this) : null, liveProjects.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: p.id,
										children: p.title
									}, p.id, false, {
										fileName: _jsxFileName,
										lineNumber: 280,
										columnNumber: 38
									}, this))]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 278,
									columnNumber: 13
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 277,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
								label: "대상 표시명",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: title,
									onChange: (e) => setTitle(e.target.value),
									placeholder: "하린랩, 또는 익명코드",
									required: true
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 286,
									columnNumber: 13
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 285,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
								label: "일자",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									type: "date",
									value: sessionDate,
									onChange: (e) => setSessionDate(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 289,
									columnNumber: 13
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 288,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
								label: "유형",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NativeSelect, {
									value: sessionKind,
									onChange: (e) => setSessionKind(e.target.value),
									children: SESSION_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: k,
										children: k
									}, k, false, {
										fileName: _jsxFileName,
										lineNumber: 293,
										columnNumber: 39
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 292,
									columnNumber: 13
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 291,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
								label: "업종",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: industry,
									onChange: (e) => setIndustry(e.target.value),
									placeholder: "AI, 콘텐츠…",
									list: "industry-hints"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 299,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("datalist", {
									id: "industry-hints",
									children: [
										"AI",
										"IT·소프트웨어",
										"콘텐츠",
										"바이오헬스",
										"금융",
										"사회서비스"
									].map((x) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: x }, x, false, {
										fileName: _jsxFileName,
										lineNumber: 301,
										columnNumber: 75
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 300,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 298,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
								label: "규모",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: sizeLabel,
									onChange: (e) => setSizeLabel(e.target.value),
									placeholder: "42명"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 305,
									columnNumber: 13
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 304,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
								label: "지역",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: district,
									onChange: (e) => setDistrict(e.target.value),
									placeholder: "구로구"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 308,
									columnNumber: 13
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 307,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
								label: "조사자",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: researcher,
									onChange: (e) => setResearcher(e.target.value),
									placeholder: "서울지역 인적자원개발위원회"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 311,
									columnNumber: 13
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 310,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 276,
						columnNumber: 9
					}, this),
					speakers.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-sm font-medium",
								children: "화자 이름"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 316,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "파일의 표기를 조사원·직함으로 고칩니다. 본문은 그대로 둡니다."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 317,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3 grid gap-2 sm:grid-cols-2",
								children: speakers.map((name) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "w-24 shrink-0 truncate text-xs text-muted-foreground",
										children: name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 322,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										value: speakerMap[name] ?? name,
										onChange: (e) => setSpeakerMap((m) => ({
											...m,
											[name]: e.target.value
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 325,
										columnNumber: 19
									}, this)]
								}, name, true, {
									fileName: _jsxFileName,
									lineNumber: 321,
									columnNumber: 37
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 320,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 315,
						columnNumber: 32
					}, this) : null,
					remapped.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mb-2 flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "size-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 335,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-medium",
								children: [
									"구간 ",
									remapped.length,
									"개"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 336,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground",
								children: filename
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 337,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 334,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "max-h-64 overflow-auto rounded-lg border border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
								className: "sticky top-0 bg-muted text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2 font-medium",
										children: "코드"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 343,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2 font-medium",
										children: "화자"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 344,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2 font-medium",
										children: "시각"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 345,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2 font-medium",
										children: "본문"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 346,
										columnNumber: 21
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 342,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 341,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: remapped.map((seg) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2 font-mono text-xs",
										children: ["S", String(seg.seq).padStart(3, "0")]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 351,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2 whitespace-nowrap",
										children: seg.speaker
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 354,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2 font-mono text-xs text-muted-foreground",
										children: seg.ts || "—"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 355,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "max-w-0 truncate px-3 py-2 text-muted-foreground",
										children: seg.body
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 358,
										columnNumber: 23
									}, this)
								]
							}, seg.seq, true, {
								fileName: _jsxFileName,
								lineNumber: 350,
								columnNumber: 40
							}, this)) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 349,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 340,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 339,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 333,
						columnNumber: 32
					}, this) : text ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-destructive",
						children: "구간을 읽지 못했습니다. 화자 표기를 확인해 주세요."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 365,
						columnNumber: 27
					}, this) : null,
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						type: "submit",
						disabled: !canSubmit || mutation.isPending,
						className: "self-start",
						children: mutation.isPending ? "저장 중" : "작업대로 보내기"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 369,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 272,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 205,
		columnNumber: 10
	}, this);
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: label }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 383,
			columnNumber: 7
		}, this), children]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 382,
		columnNumber: 10
	}, this);
}
//#endregion
export { UploadPage as component };
