import "../_libs/firebase.mjs";
import { a as setDoc, c as writeBatch, i as query, l as collection, n as getDoc, o as updateDoc, r as getDocs, s as where, t as deleteDoc, u as doc } from "../_libs/@firebase/firestore+[...].mjs";
import { n as db } from "./firebase-Bef2K2R_.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { c as cn, d as padCode, s as asStringArray, u as newId } from "./router-nD73BjZN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase-db-DEu-XjJh.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var SESSION_KINDS = [
	"기업 인터뷰",
	"FGI",
	"분과위",
	"협의체"
];
var PROJECT_KINDS = [
	"심층조사",
	"기초조사",
	"분과위",
	"협의체",
	"기타"
];
var CONFIDENCE_LABEL = {
	high: "높음",
	medium: "중간",
	low: "낮음"
};
var STATUS_LABEL = {
	uploaded: "원문",
	analyzed: "초안",
	confirmed: "확정"
};
function emptyCross(project) {
	return {
		project,
		tagCounts: [],
		themes: [],
		quotes: [],
		facts: [],
		crossSummary: null,
		crossSummaryAt: null
	};
}
function mergeThemes(themes) {
	const first = themes[0];
	if (!first) throw new Error("병합할 주제가 없습니다.");
	const rest = themes.slice(1);
	const rank = {
		low: 0,
		medium: 1,
		high: 2
	};
	let confidence = first.confidence;
	for (const t of rest) if (rank[t.confidence] < rank[confidence]) confidence = t.confidence;
	const sources = [...new Set(themes.flatMap((t) => t.sourceSegmentIds))];
	const bullets = [...new Set(themes.flatMap((t) => t.bullets.map((b) => b.trim())).filter(Boolean))];
	const quotes = themes.flatMap((t) => t.quotes.filter((q) => q.text.trim()));
	return {
		...first,
		title: themes.map((t) => t.title).join(" / "),
		summary: themes.map((t) => t.summary.trim()).filter(Boolean).join("\n\n"),
		bullets,
		sourceSegmentIds: sources,
		quotes,
		confidence
	};
}
var _jsxFileName = "/app/applet/src/components/ui/input.tsx";
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground shadow-none transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 6,
		columnNumber: 5
	}, this);
}
var BRACKET = /^\[([^\]]+)]\s*(\d{1,2}:\d{2}(?::\d{2})?)?\s*(.*)$/;
var SPEAKER_TS = /^(.{1,32}?)\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*$/;
var SPEAKER_COLON = /^(.{1,32}?)[:：]\s*(.*)$/;
function looksLikeSpeaker(raw) {
	const name = raw.trim();
	if (name.length < 1 || name.length > 24) return false;
	if (/[?!.。]/.test(name)) return false;
	if (name.includes("니다") || name.includes("요.")) return false;
	return (name.match(/\s/g) ?? []).length <= 3;
}
function pushBody(seg, line) {
	if (!seg) return;
	const t = line.trim();
	if (!t) return;
	seg.body = seg.body ? `${seg.body}\n${t}` : t;
}
/** Parse a speaker-and-segment organized transcript. Does not re-cut dialogue. */
function parseTranscript(raw) {
	const lines = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
	const segments = [];
	let current = null;
	const start = (speaker, ts, rest) => {
		current = {
			seq: segments.length + 1,
			speaker: speaker.trim() || "미분류",
			ts: ts.trim(),
			body: rest.trim()
		};
		segments.push(current);
	};
	for (const original of lines) {
		const trimmed = original.trimEnd().trim();
		if (!trimmed) continue;
		const bracket = BRACKET.exec(trimmed);
		if (bracket && looksLikeSpeaker(bracket[1] ?? "")) {
			start(bracket[1] ?? "미분류", bracket[2] ?? "", bracket[3] ?? "");
			continue;
		}
		const last = segments[segments.length - 1];
		const withTs = SPEAKER_TS.exec(trimmed);
		if (withTs && looksLikeSpeaker(withTs[1] ?? "") && !last?.body.endsWith(":")) {
			start(withTs[1] ?? "미분류", withTs[2] ?? "", "");
			continue;
		}
		const colon = SPEAKER_COLON.exec(trimmed);
		if (colon && looksLikeSpeaker(colon[1] ?? "")) {
			start(colon[1] ?? "미분류", "", colon[2] ?? "");
			continue;
		}
		if (!current) start("미분류", "", trimmed);
		else pushBody(current, trimmed);
	}
	return segments.filter((s) => s.body.trim().length > 0);
}
function uniqueSpeakers(segments) {
	const seen = /* @__PURE__ */ new Set();
	const list = [];
	for (const seg of segments) {
		const name = seg.speaker.trim() || "미분류";
		if (seen.has(name)) continue;
		seen.add(name);
		list.push(name);
	}
	return list;
}
function remapSpeakers(segments, map) {
	return segments.map((seg) => {
		const next = map[seg.speaker]?.trim();
		return next && next !== seg.speaker ? {
			...seg,
			speaker: next
		} : seg;
	});
}
function serializeSegments(segments) {
	return segments.map((seg) => {
		return `${seg.ts ? `[${seg.speaker}] ${seg.ts}` : `[${seg.speaker}]`}\n${seg.body}`;
	}).join("\n\n");
}
function decodeTranscriptFile(buffer) {
	const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
	const bad = (utf8.match(/\uFFFD/g) ?? []).length;
	if (bad === 0) return utf8;
	try {
		const korean = new TextDecoder("euc-kr", { fatal: false }).decode(buffer);
		if ((korean.match(/\uFFFD/g) ?? []).length < bad) return korean;
	} catch {}
	return utf8;
}
function asIso(value) {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "object" && value && "toDate" in value && typeof value.toDate === "function") return value.toDate().toISOString();
	return String(value);
}
function asStatus(raw, headline = "") {
	const value = typeof raw === "string" ? raw : "uploaded";
	if (value === "confirmed") return "confirmed";
	if (value === "analyzed") return "analyzed";
	if (value === "uploaded") return "uploaded";
	if (value === "draft") return headline.trim() ? "analyzed" : "uploaded";
	return "uploaded";
}
function requireOwner(data, uid) {
	if (!data || data.owner_uid !== uid) throw new Error("찾을 수 없습니다.");
	return data;
}
async function ownedDocs(uid, name, sessionId) {
	const constraints = sessionId ? [where("owner_uid", "==", uid), where("session_id", "==", sessionId)] : [where("owner_uid", "==", uid)];
	return (await getDocs(query(collection(db, name), ...constraints))).docs.map((d) => ({
		id: d.id,
		...d.data()
	}));
}
async function deleteOwned(uid, name, sessionId) {
	await commitChunks((await ownedDocs(uid, name, sessionId)).map((row) => ({
		type: "delete",
		path: [name, row.id]
	})));
}
async function commitChunks(ops) {
	for (let i = 0; i < ops.length; i += 400) {
		const chunk = ops.slice(i, i + 400);
		const batch = writeBatch(db);
		for (const op of chunk) {
			const ref = doc(db, op.path[0], op.path[1]);
			if (op.type === "delete") batch.delete(ref);
			else if (op.type === "set") batch.set(ref, op.data);
			else batch.update(ref, op.data);
		}
		await batch.commit();
	}
}
function mapProject(id, data) {
	return {
		id,
		title: String(data.title ?? ""),
		year: typeof data.year === "number" ? data.year : data.year ? Number(data.year) : null,
		kind: String(data.kind ?? "심층조사"),
		description: String(data.description ?? ""),
		createdAt: asIso(data.created_at),
		sessionCount: Number(data.sessionCount ?? data.session_count ?? 0),
		confirmedCount: Number(data.confirmedCount ?? data.confirmed_count ?? 0),
		draftCount: Number(data.draftCount ?? data.draft_count ?? 0)
	};
}
function mapSessionSummary(id, data) {
	const headline = String(data.headline ?? "");
	return {
		id,
		projectId: String(data.project_id ?? ""),
		projectTitle: String(data.projectTitle ?? data.project_title ?? ""),
		title: String(data.title ?? ""),
		sessionDate: data.session_date ? String(data.session_date) : null,
		sessionKind: String(data.session_kind ?? "기업 인터뷰"),
		industry: String(data.industry ?? ""),
		sizeLabel: String(data.size_label ?? ""),
		district: String(data.district ?? ""),
		researcher: String(data.researcher ?? ""),
		status: asStatus(data.status, headline),
		headline,
		originalFilename: String(data.original_filename ?? ""),
		tagLabels: asStringArray(data.tagLabels ?? data.tag_labels),
		createdAt: asIso(data.created_at),
		updatedAt: asIso(data.updated_at),
		confirmedAt: data.confirmed_at ? asIso(data.confirmed_at) : null
	};
}
function mapSegment(id, data) {
	return {
		id,
		code: String(data.code ?? ""),
		seq: Number(data.seq ?? 0),
		speaker: String(data.speaker ?? "미분류"),
		ts: String(data.ts ?? ""),
		body: String(data.body ?? "")
	};
}
function mapTheme(id, data, quotes) {
	return {
		id,
		sortOrder: Number(data.sort_order ?? data.sortOrder ?? 0),
		title: String(data.title ?? ""),
		summary: String(data.summary ?? ""),
		bullets: asStringArray(data.bullets),
		sourceSegmentIds: asStringArray(data.source_segment_ids ?? data.sourceSegmentIds),
		quotes,
		confidence: data.confidence === "high" || data.confidence === "low" || data.confidence === "medium" ? data.confidence : "medium"
	};
}
function mapFact(id, data) {
	return {
		id,
		label: String(data.label ?? ""),
		value: String(data.value ?? ""),
		segmentCode: String(data.segment_code ?? data.segmentCode ?? "")
	};
}
async function refreshProjectStats(uid, projectId) {
	const sessions = await listSessions(uid, projectId);
	const sessionCount = sessions.length;
	const confirmedCount = sessions.filter((s) => s.status === "confirmed").length;
	await updateDoc(doc(db, "projects", projectId), {
		sessionCount,
		confirmedCount,
		draftCount: sessionCount - confirmedCount
	});
}
async function listProjects(uid) {
	return (await getDocs(query(collection(db, "projects"), where("owner_uid", "==", uid)))).docs.map((d) => mapProject(d.id, d.data())).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}
async function getProject(uid, id) {
	const snap = await getDoc(doc(db, "projects", id));
	const data = requireOwner(snap.data(), uid);
	return mapProject(snap.id, data);
}
async function createProject(uid, data) {
	const title = data.title.trim();
	if (!title) throw new Error("프로젝트 이름을 입력하세요.");
	const id = newId("proj");
	await setDoc(doc(db, "projects", id), {
		owner_uid: uid,
		title,
		year: data.year,
		kind: data.kind || "심층조사",
		description: data.description.trim(),
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		sessionCount: 0,
		confirmedCount: 0,
		draftCount: 0
	});
	return { id };
}
async function deleteProject(uid, id) {
	requireOwner((await getDoc(doc(db, "projects", id))).data(), uid);
	const sessions = await listSessions(uid, id);
	for (const session of sessions) await deleteSession(uid, session.id);
	await deleteDoc(doc(db, "projects", id));
	return { ok: true };
}
async function listSessions(uid, projectId) {
	let rows = (await getDocs(query(collection(db, "sessions"), where("owner_uid", "==", uid)))).docs.map((d) => mapSessionSummary(d.id, d.data()));
	if (projectId) {
		rows = rows.filter((s) => s.projectId === projectId);
		rows.sort((a, b) => {
			if (a.sessionDate !== b.sessionDate) return (b.sessionDate || "").localeCompare(a.sessionDate || "");
			return (b.createdAt || "").localeCompare(a.createdAt || "");
		});
	} else rows.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
	return rows;
}
async function getSession(uid, id) {
	const snap = await getDoc(doc(db, "sessions", id));
	const data = requireOwner(snap.data(), uid);
	const summary = mapSessionSummary(snap.id, data);
	const actionItems = Array.isArray(data.action_items) ? data.action_items.map((a) => ({
		id: a.id || newId("act"),
		assignee: String(a.assignee ?? ""),
		deadline: String(a.deadline ?? ""),
		task: String(a.task ?? ""),
		segmentCode: String(a.segment_code ?? a.segmentCode ?? "")
	})) : [];
	const [segRows, themeRows, excerptRows, factRows] = await Promise.all([
		ownedDocs(uid, "segments", id),
		ownedDocs(uid, "themes", id),
		ownedDocs(uid, "excerpts", id),
		ownedDocs(uid, "facts", id)
	]);
	const themes = themeRows.map((t) => {
		const quotes = excerptRows.filter((e) => e.theme_id === t.id).sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)).map((e) => ({
			text: String(e.body ?? ""),
			segmentId: String(e.segment_code ?? "")
		}));
		return mapTheme(t.id, t, quotes);
	}).sort((a, b) => a.sortOrder - b.sortOrder);
	return {
		...summary,
		originalText: String(data.original_text ?? ""),
		minutesOverview: String(data.minutes_overview ?? ""),
		minutesBody: String(data.minutes_body ?? ""),
		minutesFollowups: asStringArray(data.minutes_followups),
		unresolved: asStringArray(data.unresolved),
		actionItems,
		analysisError: String(data.analysis_error ?? ""),
		segments: segRows.map((s) => mapSegment(s.id, s)).sort((a, b) => a.seq - b.seq),
		themes,
		facts: factRows.map((f) => mapFact(f.id, f))
	};
}
async function createSession(uid, data) {
	const title = data.title.trim();
	if (!title) throw new Error("대상 표시명을 입력하세요.");
	if (!data.projectId) throw new Error("프로젝트를 선택하세요.");
	const proj = requireOwner((await getDoc(doc(db, "projects", data.projectId))).data(), uid);
	const projectTitle = String(proj.title ?? "");
	const originalText = data.originalText || data.text || "";
	const parsed = data.segments && data.segments.length > 0 ? data.segments : parseTranscript(originalText);
	if (parsed.length === 0) throw new Error("읽을 구간이 없습니다.");
	const id = newId("sess");
	const now = (/* @__PURE__ */ new Date()).toISOString();
	await setDoc(doc(db, "sessions", id), {
		id,
		owner_uid: uid,
		project_id: data.projectId,
		projectTitle,
		title,
		session_date: data.sessionDate || null,
		session_kind: data.sessionKind || "기업 인터뷰",
		industry: data.industry || "",
		size_label: data.sizeLabel || "",
		district: data.district || "",
		researcher: data.researcher || "",
		original_filename: data.originalFilename || data.filename || "",
		original_text: originalText,
		status: "uploaded",
		headline: "",
		minutes_overview: "",
		minutes_body: "",
		minutes_followups: [],
		unresolved: [],
		action_items: [],
		analysis_error: "",
		tagLabels: [],
		created_at: now,
		updated_at: now,
		confirmed_at: null
	});
	await commitChunks(parsed.map((seg, i) => {
		const seq = Number(seg.seq ?? i + 1);
		const segId = newId("seg");
		return {
			type: "set",
			path: ["segments", segId],
			data: {
				id: segId,
				owner_uid: uid,
				session_id: id,
				seq,
				speaker: seg.speaker,
				ts: seg.ts || "",
				body: seg.body,
				code: "code" in seg && seg.code ? String(seg.code) : padCode(seq)
			}
		};
	}));
	await refreshProjectStats(uid, data.projectId);
	return {
		id,
		segmentCount: parsed.length
	};
}
async function updateSessionMeta(uid, data) {
	requireOwner((await getDoc(doc(db, "sessions", data.id))).data(), uid);
	await updateDoc(doc(db, "sessions", data.id), {
		title: data.title,
		session_date: data.sessionDate,
		session_kind: data.sessionKind,
		industry: data.industry,
		size_label: data.sizeLabel,
		district: data.district,
		researcher: data.researcher,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	return { ok: true };
}
async function updateSegments(uid, data) {
	requireOwner((await getDoc(doc(db, "sessions", data.id))).data(), uid);
	await deleteOwned(uid, "segments", data.id);
	await commitChunks(data.segments.map((seg) => {
		const segId = newId("seg");
		return {
			type: "set",
			path: ["segments", segId],
			data: {
				id: segId,
				owner_uid: uid,
				session_id: data.id,
				seq: seg.seq,
				speaker: seg.speaker,
				ts: seg.ts,
				body: seg.body,
				code: seg.code
			}
		};
	}));
	await updateDoc(doc(db, "sessions", data.id), {
		updated_at: (/* @__PURE__ */ new Date()).toISOString(),
		original_text: serializeSegments(data.segments.map((seg) => ({
			seq: seg.seq,
			speaker: seg.speaker,
			ts: seg.ts,
			body: seg.body
		})))
	});
	return { ok: true };
}
function draftFields(data) {
	return {
		headline: data.headline,
		minutes_overview: data.minutesOverview ?? data.minutes_overview ?? "",
		minutes_body: data.minutesBody ?? data.minutes_body ?? "",
		minutes_followups: data.minutesFollowups ?? data.minutes_followups ?? [],
		unresolved: data.unresolved ?? [],
		action_items: (data.actionItems || []).map((a) => ({
			id: a.id,
			assignee: a.assignee,
			deadline: a.deadline,
			task: a.task,
			segment_code: a.segmentCode
		})),
		tagLabels: data.tagLabels ?? data.tags ?? []
	};
}
async function replaceAnalysisCollections(uid, sessionId, themes, facts, tags) {
	await Promise.all([
		deleteOwned(uid, "tags", sessionId),
		deleteOwned(uid, "themes", sessionId),
		deleteOwned(uid, "excerpts", sessionId),
		deleteOwned(uid, "facts", sessionId)
	]);
	const ops = [];
	for (const tag of tags) {
		const tagId = newId("tag");
		ops.push({
			type: "set",
			path: ["tags", tagId],
			data: {
				id: tagId,
				owner_uid: uid,
				session_id: sessionId,
				label: tag
			}
		});
	}
	themes.forEach((t, idx) => {
		const tId = t.id?.startsWith("thm") || t.id?.startsWith("theme") ? t.id : newId("theme");
		ops.push({
			type: "set",
			path: ["themes", tId],
			data: {
				id: tId,
				owner_uid: uid,
				session_id: sessionId,
				sort_order: t.sortOrder ?? idx,
				title: t.title,
				summary: t.summary,
				bullets: t.bullets || [],
				source_segment_ids: t.sourceSegmentIds || [],
				confidence: t.confidence || "medium"
			}
		});
		(t.quotes || []).forEach((q, qIdx) => {
			if (!q.text?.trim()) return;
			const eId = newId("exc");
			ops.push({
				type: "set",
				path: ["excerpts", eId],
				data: {
					id: eId,
					owner_uid: uid,
					session_id: sessionId,
					theme_id: tId,
					body: q.text,
					segment_code: q.segmentId,
					sort_order: qIdx
				}
			});
		});
	});
	for (const f of facts) {
		if (!f.label?.trim() || !f.value?.trim()) continue;
		const fId = f.id?.startsWith("fct") || f.id?.startsWith("fact") ? f.id : newId("fact");
		ops.push({
			type: "set",
			path: ["facts", fId],
			data: {
				id: fId,
				owner_uid: uid,
				session_id: sessionId,
				label: f.label,
				value: f.value,
				segment_code: f.segmentCode || ""
			}
		});
	}
	await commitChunks(ops);
}
async function saveSessionDraft(uid, data) {
	const existing = requireOwner((await getDoc(doc(db, "sessions", data.id))).data(), uid);
	const fields = draftFields(data);
	const nextStatus = existing.status === "confirmed" ? "confirmed" : "analyzed";
	await updateDoc(doc(db, "sessions", data.id), {
		...fields,
		status: nextStatus,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	await replaceAnalysisCollections(uid, data.id, data.themes || [], data.facts || [], fields.tagLabels);
	return { ok: true };
}
async function updateSessionAnalysis(uid, id, result) {
	requireOwner((await getDoc(doc(db, "sessions", id))).data(), uid);
	await updateDoc(doc(db, "sessions", id), {
		headline: result.headline,
		minutes_overview: result.minutes.overview,
		minutes_body: result.minutes.body,
		minutes_followups: result.minutes.followups,
		unresolved: result.unresolved,
		action_items: (result.actionItems || []).map((a) => ({
			id: newId("act"),
			assignee: a.assignee,
			deadline: a.deadline,
			task: a.task,
			segment_code: a.segmentCode || a.segmentId || ""
		})),
		tagLabels: result.tags,
		status: "analyzed",
		analysis_error: "",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	await replaceAnalysisCollections(uid, id, result.themes.map((t, idx) => ({
		id: newId("theme"),
		sortOrder: idx,
		title: t.title,
		summary: t.summary,
		bullets: t.bullets || [],
		sourceSegmentIds: t.sourceSegmentIds || t.sourceSegments || [],
		quotes: t.quotes || [],
		confidence: t.confidence || "medium"
	})), result.facts.map((f) => ({
		id: newId("fact"),
		label: f.label,
		value: f.value,
		segmentCode: f.segmentCode || f.segmentId || ""
	})), result.tags || []);
	const session = mapSessionSummary(id, (await getDoc(doc(db, "sessions", id))).data());
	if (session.projectId) await refreshProjectStats(uid, session.projectId);
}
async function setSessionAnalysisError(uid, id, error) {
	requireOwner((await getDoc(doc(db, "sessions", id))).data(), uid);
	await updateDoc(doc(db, "sessions", id), {
		analysis_error: error,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
}
async function confirmSession(uid, id) {
	const data = requireOwner((await getDoc(doc(db, "sessions", id))).data(), uid);
	await updateDoc(doc(db, "sessions", id), {
		status: "confirmed",
		confirmed_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (data.project_id) await refreshProjectStats(uid, String(data.project_id));
	return { ok: true };
}
async function reopenSession(uid, id) {
	const data = requireOwner((await getDoc(doc(db, "sessions", id))).data(), uid);
	await updateDoc(doc(db, "sessions", id), {
		status: "analyzed",
		confirmed_at: null,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (data.project_id) await refreshProjectStats(uid, String(data.project_id));
	return { ok: true };
}
async function deleteSession(uid, id) {
	const data = requireOwner((await getDoc(doc(db, "sessions", id))).data(), uid);
	await Promise.all([
		deleteOwned(uid, "segments", id),
		deleteOwned(uid, "themes", id),
		deleteOwned(uid, "excerpts", id),
		deleteOwned(uid, "facts", id),
		deleteOwned(uid, "tags", id)
	]);
	await deleteDoc(doc(db, "sessions", id));
	if (data.project_id) await refreshProjectStats(uid, String(data.project_id));
	return { ok: true };
}
async function listTags(uid) {
	const sessions = await listSessions(uid);
	const confirmed = new Set(sessions.filter((s) => s.status === "confirmed").map((s) => s.id));
	const tags = await ownedDocs(uid, "tags");
	const counts = {};
	for (const t of tags) {
		if (!confirmed.has(String(t.session_id))) continue;
		const label = String(t.label ?? "").trim();
		if (!label) continue;
		counts[label] = (counts[label] || 0) + 1;
	}
	return Object.entries(counts).map(([label, count]) => ({
		label,
		count
	})).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "ko"));
}
async function searchLibrary(uid, q, tag) {
	const needle = q.trim().toLowerCase();
	const sessions = (await listSessions(uid)).filter((s) => s.status === "confirmed");
	const byId = new Map(sessions.map((s) => [s.id, s]));
	if (new Set(sessions.map((s) => s.id)).size === 0) return [];
	const [excerpts, themes, facts] = await Promise.all([
		ownedDocs(uid, "excerpts"),
		ownedDocs(uid, "themes"),
		ownedDocs(uid, "facts")
	]);
	const hasTag = (sid) => !tag || (byId.get(sid)?.tagLabels ?? []).includes(tag);
	const matches = (...parts) => !needle || parts.join(" ").toLowerCase().includes(needle);
	const hits = [];
	for (const t of themes) {
		const sid = String(t.session_id);
		const s = byId.get(sid);
		if (!s || !hasTag(sid)) continue;
		if (!matches(String(t.title ?? ""), String(t.summary ?? ""), asStringArray(t.bullets).join(" "))) continue;
		hits.push({
			kind: "theme",
			id: t.id,
			sessionId: sid,
			sessionTitle: s.title,
			projectTitle: s.projectTitle,
			sessionDate: s.sessionDate,
			title: String(t.title ?? ""),
			body: String(t.summary ?? ""),
			segmentCode: "",
			tags: s.tagLabels
		});
	}
	for (const e of excerpts) {
		const sid = String(e.session_id);
		const s = byId.get(sid);
		if (!s || !hasTag(sid)) continue;
		if (!matches(String(e.body ?? ""))) continue;
		const theme = themes.find((t) => t.id === e.theme_id);
		hits.push({
			kind: "excerpt",
			id: e.id,
			sessionId: sid,
			sessionTitle: s.title,
			projectTitle: s.projectTitle,
			sessionDate: s.sessionDate,
			title: String(theme?.title ?? "인용"),
			body: String(e.body ?? ""),
			segmentCode: String(e.segment_code ?? ""),
			tags: s.tagLabels
		});
	}
	for (const f of facts) {
		const sid = String(f.session_id);
		const s = byId.get(sid);
		if (!s || !hasTag(sid)) continue;
		if (!matches(String(f.label ?? ""), String(f.value ?? ""))) continue;
		hits.push({
			kind: "fact",
			id: f.id,
			sessionId: sid,
			sessionTitle: s.title,
			projectTitle: s.projectTitle,
			sessionDate: s.sessionDate,
			title: String(f.label ?? ""),
			body: String(f.value ?? ""),
			segmentCode: String(f.segment_code ?? ""),
			tags: s.tagLabels
		});
	}
	return hits;
}
function mapCrossSummary(value) {
	if (!value || typeof value !== "object") return null;
	const obj = value;
	const repeated = Array.isArray(obj.repeated) ? obj.repeated : [];
	const tensions = Array.isArray(obj.tensions) ? obj.tensions : [];
	const followups = Array.isArray(obj.followups) ? obj.followups : [];
	return {
		overview: typeof obj.overview === "string" ? obj.overview : "",
		repeated: repeated.map((item) => {
			const rec = item && typeof item === "object" ? item : {};
			return {
				claim: typeof rec.claim === "string" ? rec.claim : "",
				sessionTitles: asStringArray(rec.sessionTitles ?? rec.session_titles),
				evidence: typeof rec.evidence === "string" ? rec.evidence : ""
			};
		}).filter((r) => r.claim),
		tensions: tensions.map((item) => {
			const rec = item && typeof item === "object" ? item : {};
			return {
				point: typeof rec.point === "string" ? rec.point : String(rec.issue ?? ""),
				detail: typeof rec.detail === "string" ? rec.detail : [rec.perspectiveA, rec.perspectiveB].filter((x) => typeof x === "string").join(" / ")
			};
		}).filter((t) => t.point),
		followups: followups.filter((x) => typeof x === "string" && x.trim().length > 0)
	};
}
async function getCrossAnalysis(uid, projectId) {
	const project = await getProject(uid, projectId);
	const sessions = (await listSessions(uid, projectId)).filter((s) => s.status === "confirmed");
	if (sessions.length === 0) return emptyCross(project);
	const details = await Promise.all(sessions.map((s) => getSession(uid, s.id)));
	const tagCounts = {};
	const themes = [];
	const quotes = [];
	const facts = [];
	for (const d of details) {
		for (const label of d.tagLabels) tagCounts[label] = (tagCounts[label] || 0) + 1;
		for (const t of d.themes) {
			themes.push({
				sessionId: d.id,
				sessionTitle: d.title,
				title: t.title,
				summary: t.summary
			});
			for (const q of t.quotes) quotes.push({
				sessionId: d.id,
				sessionTitle: d.title,
				themeTitle: t.title,
				text: q.text,
				segmentCode: q.segmentId
			});
		}
		for (const f of d.facts) facts.push({
			sessionId: d.id,
			sessionTitle: d.title,
			label: f.label,
			value: f.value
		});
	}
	const pdata = (await getDoc(doc(db, "projects", projectId))).data() ?? {};
	return {
		project: {
			...project,
			confirmedCount: sessions.length,
			sessionCount: project.sessionCount,
			draftCount: project.draftCount
		},
		tagCounts: Object.entries(tagCounts).map(([label, count]) => ({
			label,
			count
		})).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "ko")),
		themes,
		quotes,
		facts,
		crossSummary: mapCrossSummary(pdata.cross_summary),
		crossSummaryAt: pdata.cross_summary_at ? asIso(pdata.cross_summary_at) : null
	};
}
async function saveCrossSummary(uid, projectId, summary) {
	requireOwner((await getDoc(doc(db, "projects", projectId))).data(), uid);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	await updateDoc(doc(db, "projects", projectId), {
		cross_summary: summary,
		cross_summary_at: now
	});
	return { at: now };
}
async function listProjectAssistantContext(uid, projectId) {
	const sessions = (await listSessions(uid, projectId)).filter((s) => s.status === "confirmed" || s.status === "analyzed");
	return (await Promise.all(sessions.map((s) => getSession(uid, s.id)))).map((d) => ({
		title: d.title,
		themes: d.themes.map((t) => ({
			title: t.title,
			summary: t.summary
		})),
		facts: d.facts.map((f) => ({
			label: f.label,
			value: f.value
		})),
		quotes: d.themes.flatMap((t) => t.quotes.map((q) => ({
			text: q.text,
			themeTitle: t.title
		})))
	}));
}
//#endregion
export { updateSessionMeta as A, saveSessionDraft as C, uniqueSpeakers as D, setSessionAnalysisError as E, updateSegments as O, saveCrossSummary as S, serializeSegments as T, listTags as _, STATUS_LABEL as a, remapSpeakers as b, createSession as c, deleteSession as d, getCrossAnalysis as f, listSessions as g, listProjects as h, SESSION_KINDS as i, updateSessionAnalysis as k, decodeTranscriptFile as l, listProjectAssistantContext as m, Input as n, confirmSession as o, getSession as p, PROJECT_KINDS as r, createProject as s, CONFIDENCE_LABEL as t, deleteProject as u, mergeThemes as v, searchLibrary as w, reopenSession as x, parseTranscript as y };
