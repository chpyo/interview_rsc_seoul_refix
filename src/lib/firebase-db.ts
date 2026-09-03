import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { buildCorpusText, rankCorpus, type CorpusDoc, type CorpusHit } from "./ai/corpus";
import { runEmbedText } from "./ai/run";
import { parseTranscript, serializeSegments } from "./parse-transcript";
import {
  emptyCross,
  type ActionItem,
  type ChatCaseContext,
  type CrossData,
  type CrossSummary,
  type Fact,
  type LibraryCaseFilter,
  type Project,
  type Segment,
  type SessionAudio,
  type SessionDetail,
  type SessionStatus,
  type SessionSummary,
  type Theme,
} from "./types";
import { asStringArray, newId, padCode } from "./utils";

function asIso(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return String(value);
}

function asStatus(raw: unknown, headline = ""): SessionStatus {
  const value = typeof raw === "string" ? raw : "uploaded";
  if (value === "confirmed") return "confirmed";
  if (value === "analyzed") return "analyzed";
  if (value === "uploaded") return "uploaded";
  if (value === "draft") return headline.trim() ? "analyzed" : "uploaded";
  return "uploaded";
}

function requireOwner(data: DocumentData | undefined, uid: string): DocumentData {
  if (!data || data.owner_uid !== uid) throw new Error("찾을 수 없습니다.");
  return data;
}

async function ownedDocs(uid: string, name: string, sessionId?: string) {
  const constraints = sessionId
    ? [where("owner_uid", "==", uid), where("session_id", "==", sessionId)]
    : [where("owner_uid", "==", uid)];
  const snap = await getDocs(query(collection(db, name), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DocumentData & { id: string });
}

async function deleteOwned(uid: string, name: string, sessionId: string) {
  const rows = await ownedDocs(uid, name, sessionId);
  await commitChunks(rows.map((row) => ({ type: "delete" as const, path: [name, row.id] })));
}

type BatchOp =
  | { type: "delete"; path: [string, string] }
  | { type: "set"; path: [string, string]; data: DocumentData }
  | { type: "update"; path: [string, string]; data: DocumentData };

async function commitChunks(ops: BatchOp[]) {
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

function mapProject(id: string, data: DocumentData): Project {
  return {
    id,
    title: String(data.title ?? ""),
    year: typeof data.year === "number" ? data.year : data.year ? Number(data.year) : null,
    kind: String(data.kind ?? "심층조사"),
    description: String(data.description ?? ""),
    createdAt: asIso(data.created_at),
    sessionCount: Number(data.sessionCount ?? data.session_count ?? 0),
    confirmedCount: Number(data.confirmedCount ?? data.confirmed_count ?? 0),
    draftCount: Number(data.draftCount ?? data.draft_count ?? 0),
  };
}

function mapAudio(data: DocumentData): SessionAudio | null {
  const storagePath = String(data.audio_storage_path ?? "").trim();
  if (!storagePath) return null;
  return {
    storagePath,
    mimeType: String(data.audio_mime_type ?? "audio/webm"),
    filename: String(data.audio_filename ?? "recording.webm"),
    sizeBytes: Number(data.audio_size_bytes ?? 0),
    durationSec:
      data.audio_duration_sec == null || data.audio_duration_sec === ""
        ? null
        : Number(data.audio_duration_sec),
  };
}

function audioFields(audio?: SessionAudio | null) {
  if (!audio) return {};
  return {
    audio_storage_path: audio.storagePath,
    audio_mime_type: audio.mimeType,
    audio_filename: audio.filename,
    audio_size_bytes: audio.sizeBytes,
    audio_duration_sec: audio.durationSec,
  };
}

function mapSessionSummary(id: string, data: DocumentData): SessionSummary {
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
    minutesOverview: String(data.minutes_overview ?? data.minutesOverview ?? ""),
    originalFilename: String(data.original_filename ?? ""),
    audio: mapAudio(data),
    tagLabels: asStringArray(data.tagLabels ?? data.tag_labels),
    createdAt: asIso(data.created_at),
    updatedAt: asIso(data.updated_at),
    confirmedAt: data.confirmed_at ? asIso(data.confirmed_at) : null,
  };
}

function mapSegment(id: string, data: DocumentData): Segment {
  return {
    id,
    code: String(data.code ?? ""),
    seq: Number(data.seq ?? 0),
    speaker: String(data.speaker ?? "미분류"),
    ts: String(data.ts ?? ""),
    body: String(data.body ?? ""),
  };
}

function mapTheme(id: string, data: DocumentData, quotes: Theme["quotes"]): Theme {
  return {
    id,
    sortOrder: Number(data.sort_order ?? data.sortOrder ?? 0),
    title: String(data.title ?? ""),
    summary: String(data.summary ?? ""),
    bullets: asStringArray(data.bullets),
    sourceSegmentIds: asStringArray(data.source_segment_ids ?? data.sourceSegmentIds),
    quotes,
    confidence:
      data.confidence === "high" || data.confidence === "low" || data.confidence === "medium"
        ? data.confidence
        : "medium",
  };
}

function mapFact(id: string, data: DocumentData): Fact {
  return {
    id,
    label: String(data.label ?? ""),
    value: String(data.value ?? ""),
    segmentCode: String(data.segment_code ?? data.segmentCode ?? ""),
  };
}

export async function refreshProjectStats(uid: string, projectId: string) {
  const sessions = await listSessions(uid, projectId);
  const sessionCount = sessions.length;
  const confirmedCount = sessions.filter((s) => s.status === "confirmed").length;
  await updateDoc(doc(db, "projects", projectId), {
    sessionCount,
    confirmedCount,
    draftCount: sessionCount - confirmedCount,
  });
}

export async function listProjects(uid: string): Promise<Project[]> {
  const snap = await getDocs(query(collection(db, "projects"), where("owner_uid", "==", uid)));
  return snap.docs
    .map((d) => mapProject(d.id, d.data()))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function getProject(uid: string, id: string): Promise<Project> {
  const snap = await getDoc(doc(db, "projects", id));
  const data = requireOwner(snap.data(), uid);
  return mapProject(snap.id, data);
}

export async function createProject(
  uid: string,
  data: { title: string; year: number | null; kind: string; description: string },
) {
  const title = data.title.trim();
  if (!title) throw new Error("프로젝트 이름을 입력하세요.");
  const id = newId("proj");
  await setDoc(doc(db, "projects", id), {
    owner_uid: uid,
    title,
    year: data.year,
    kind: data.kind || "심층조사",
    description: data.description.trim(),
    created_at: new Date().toISOString(),
    sessionCount: 0,
    confirmedCount: 0,
    draftCount: 0,
  });
  return { id };
}

export async function updateProject(
  uid: string,
  id: string,
  data: { title: string; year: number | null; kind: string; description: string },
) {
  const snap = await getDoc(doc(db, "projects", id));
  requireOwner(snap.data(), uid);
  const title = data.title.trim();
  if (!title) throw new Error("프로젝트 이름을 입력하세요.");
  await updateDoc(doc(db, "projects", id), {
    title,
    year: data.year,
    kind: data.kind || "심층조사",
    description: data.description.trim(),
  });
  const sessions = await listSessions(uid, id);
  await commitChunks(
    sessions.map((s) => ({
      type: "update" as const,
      path: ["sessions", s.id] as [string, string],
      data: { projectTitle: title },
    })),
  );
  return { ok: true };
}

export async function deleteProject(uid: string, id: string) {
  const snap = await getDoc(doc(db, "projects", id));
  requireOwner(snap.data(), uid);
  const sessions = await listSessions(uid, id);
  for (const session of sessions) {
    await deleteSession(uid, session.id);
  }
  await deleteDoc(doc(db, "projects", id));
  return { ok: true };
}

export async function listSessions(uid: string, projectId?: string): Promise<SessionSummary[]> {
  const snap = await getDocs(query(collection(db, "sessions"), where("owner_uid", "==", uid)));
  let rows = snap.docs.map((d) => mapSessionSummary(d.id, d.data()));
  if (projectId) {
    rows = rows.filter((s) => s.projectId === projectId);
    rows.sort((a, b) => {
      if (a.sessionDate !== b.sessionDate) return (b.sessionDate || "").localeCompare(a.sessionDate || "");
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
  } else {
    rows.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  }
  return rows;
}

export async function getSession(uid: string, id: string): Promise<SessionDetail> {
  const snap = await getDoc(doc(db, "sessions", id));
  const data = requireOwner(snap.data(), uid);
  const summary = mapSessionSummary(snap.id, data);

  const actionItems: ActionItem[] = Array.isArray(data.action_items)
    ? data.action_items.map((a: any) => ({
        id: a.id || newId("act"),
        assignee: String(a.assignee ?? ""),
        deadline: String(a.deadline ?? ""),
        task: String(a.task ?? ""),
        segmentCode: String(a.segment_code ?? a.segmentCode ?? ""),
      }))
    : [];

  const [segRows, themeRows, excerptRows, factRows] = await Promise.all([
    ownedDocs(uid, "segments", id),
    ownedDocs(uid, "themes", id),
    ownedDocs(uid, "excerpts", id),
    ownedDocs(uid, "facts", id),
  ]);

  const themes = themeRows
    .map((t) => {
      const quotes = excerptRows
        .filter((e) => e.theme_id === t.id)
        .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
        .map((e) => ({ text: String(e.body ?? ""), segmentId: String(e.segment_code ?? "") }));
      return mapTheme(t.id, t, quotes);
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

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
    facts: factRows.map((f) => mapFact(f.id, f)),
  };
}

type CreateSessionInput = {
  projectId: string;
  title: string;
  sessionDate?: string | null;
  sessionKind?: string;
  industry?: string;
  sizeLabel?: string;
  district?: string;
  researcher?: string;
  originalFilename?: string;
  filename?: string;
  originalText?: string;
  text?: string;
  audio?: SessionAudio | null;
  segments?: Array<{ seq?: number; speaker: string; ts?: string; body: string; code?: string }>;
};

export async function createSession(uid: string, data: CreateSessionInput) {
  const title = data.title.trim();
  if (!title) throw new Error("대상 표시명을 입력하세요.");
  if (!data.projectId) throw new Error("프로젝트를 선택하세요.");

  const projSnap = await getDoc(doc(db, "projects", data.projectId));
  const proj = requireOwner(projSnap.data(), uid);
  const projectTitle = String(proj.title ?? "");

  const originalText = data.originalText || data.text || "";
  const parsed =
    data.segments && data.segments.length > 0
      ? data.segments
      : parseTranscript(originalText);

  if (parsed.length === 0 && !data.audio) throw new Error("읽을 구간이 없습니다.");

  const id = newId("sess");
  const now = new Date().toISOString();
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
    original_filename: data.originalFilename || data.filename || data.audio?.filename || "",
    original_text: originalText,
    ...audioFields(data.audio),
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
    confirmed_at: null,
  });

  const ops: BatchOp[] = parsed.map((seg, i) => {
    const seq = Number(seg.seq ?? i + 1);
    const segId = newId("seg");
    return {
      type: "set" as const,
      path: ["segments", segId] as [string, string],
      data: {
        id: segId,
        owner_uid: uid,
        session_id: id,
        seq,
        speaker: seg.speaker,
        ts: seg.ts || "",
        body: seg.body,
        code: "code" in seg && seg.code ? String(seg.code) : padCode(seq),
      },
    };
  });
  await commitChunks(ops);
  await refreshProjectStats(uid, data.projectId);
  return { id, segmentCount: parsed.length };
}

export async function updateSessionMeta(
  uid: string,
  data: {
    id: string;
    title: string;
    sessionDate: string | null;
    sessionKind: string;
    industry: string;
    sizeLabel: string;
    district: string;
    researcher: string;
  },
) {
  const snap = await getDoc(doc(db, "sessions", data.id));
  requireOwner(snap.data(), uid);
  await updateDoc(doc(db, "sessions", data.id), {
    title: data.title,
    session_date: data.sessionDate,
    session_kind: data.sessionKind,
    industry: data.industry,
    size_label: data.sizeLabel,
    district: data.district,
    researcher: data.researcher,
    updated_at: new Date().toISOString(),
  });
  return { ok: true };
}

export async function updateSegments(
  uid: string,
  data: { id: string; segments: Array<{ seq: number; speaker: string; ts: string; body: string; code: string }> },
) {
  const snap = await getDoc(doc(db, "sessions", data.id));
  requireOwner(snap.data(), uid);
  await deleteOwned(uid, "segments", data.id);
  const ops: BatchOp[] = data.segments.map((seg) => {
    const segId = newId("seg");
    return {
      type: "set" as const,
      path: ["segments", segId] as [string, string],
      data: {
        id: segId,
        owner_uid: uid,
        session_id: data.id,
        seq: seg.seq,
        speaker: seg.speaker,
        ts: seg.ts,
        body: seg.body,
        code: seg.code,
      },
    };
  });
  await commitChunks(ops);
  await updateDoc(doc(db, "sessions", data.id), {
    updated_at: new Date().toISOString(),
    original_text: serializeSegments(
      data.segments.map((seg) => ({
        seq: seg.seq,
        speaker: seg.speaker,
        ts: seg.ts,
        body: seg.body,
      })),
    ),
  });
  return { ok: true };
}

type DraftPayload = {
  id: string;
  headline: string;
  minutesOverview?: string;
  minutes_overview?: string;
  minutesBody?: string;
  minutes_body?: string;
  minutesFollowups?: string[];
  minutes_followups?: string[];
  unresolved: string[];
  actionItems?: ActionItem[];
  tags?: string[];
  tagLabels?: string[];
  themes: Theme[];
  facts: Fact[];
  status?: SessionStatus;
};

function draftFields(data: DraftPayload) {
  return {
    headline: data.headline,
    minutes_overview: data.minutesOverview ?? data.minutes_overview ?? "",
    minutes_body: data.minutesBody ?? data.minutes_body ?? "",
    minutes_followups: data.minutesFollowups ?? data.minutes_followups ?? [],
    unresolved: data.unresolved ?? [],
    action_items: (data.actionItems || []).map(a => ({
      id: a.id,
      assignee: a.assignee,
      deadline: a.deadline,
      task: a.task,
      segment_code: a.segmentCode,
    })),
    tagLabels: data.tagLabels ?? data.tags ?? [],
  };
}

async function replaceAnalysisCollections(uid: string, sessionId: string, themes: Theme[], facts: Fact[], tags: string[]) {
  await Promise.all([
    deleteOwned(uid, "tags", sessionId),
    deleteOwned(uid, "themes", sessionId),
    deleteOwned(uid, "excerpts", sessionId),
    deleteOwned(uid, "facts", sessionId),
  ]);

  const ops: BatchOp[] = [];
  for (const tag of tags) {
    const tagId = newId("tag");
    ops.push({
      type: "set",
      path: ["tags", tagId],
      data: { id: tagId, owner_uid: uid, session_id: sessionId, label: tag },
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
        confidence: t.confidence || "medium",
      },
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
          sort_order: qIdx,
        },
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
        segment_code: f.segmentCode || "",
      },
    });
  }
  await commitChunks(ops);
}

export async function saveSessionDraft(uid: string, data: DraftPayload) {
  const snap = await getDoc(doc(db, "sessions", data.id));
  const existing = requireOwner(snap.data(), uid);
  const fields = draftFields(data);
  const nextStatus: SessionStatus =
    existing.status === "confirmed" ? "confirmed" : "analyzed";
  await updateDoc(doc(db, "sessions", data.id), {
    ...fields,
    status: nextStatus,
    updated_at: new Date().toISOString(),
  });
  await replaceAnalysisCollections(uid, data.id, data.themes || [], data.facts || [], fields.tagLabels);
  return { ok: true };
}

export async function updateSessionAnalysis(
  uid: string,
  id: string,
  result: {
    headline: string;
    minutes: { overview: string; body: string; followups: string[] };
    unresolved: string[];
    actionItems?: Array<{ assignee: string; deadline: string; task: string; segmentId?: string; segmentCode?: string }>;
    tags: string[];
    facts: Array<{ label: string; value: string; segmentId?: string; segmentCode?: string }>;
    themes: Array<{
      title: string;
      summary: string;
      bullets?: string[];
      sourceSegments?: string[];
      sourceSegmentIds?: string[];
      quotes: Array<{ text: string; segmentId: string }>;
      confidence?: Theme["confidence"];
    }>;
  },
) {
  const snap = await getDoc(doc(db, "sessions", id));
  requireOwner(snap.data(), uid);
  await updateDoc(doc(db, "sessions", id), {
    headline: result.headline,
    minutes_overview: result.minutes.overview,
    minutes_body: result.minutes.body,
    minutes_followups: result.minutes.followups,
    unresolved: result.unresolved,
    action_items: (result.actionItems || []).map(a => ({
      id: newId("act"),
      assignee: a.assignee,
      deadline: a.deadline,
      task: a.task,
      segment_code: a.segmentCode || a.segmentId || "",
    })),
    tagLabels: result.tags,
    status: "analyzed",
    analysis_error: "",
    updated_at: new Date().toISOString(),
  });
  const themes: Theme[] = result.themes.map((t, idx) => ({
    id: newId("theme"),
    sortOrder: idx,
    title: t.title,
    summary: t.summary,
    bullets: t.bullets || [],
    sourceSegmentIds: t.sourceSegmentIds || t.sourceSegments || [],
    quotes: t.quotes || [],
    confidence: t.confidence || "medium",
  }));
  const facts: Fact[] = result.facts.map((f) => ({
    id: newId("fact"),
    label: f.label,
    value: f.value,
    segmentCode: f.segmentCode || f.segmentId || "",
  }));
  await replaceAnalysisCollections(uid, id, themes, facts, result.tags || []);
  const session = mapSessionSummary(id, (await getDoc(doc(db, "sessions", id))).data()!);
  if (session.projectId) await refreshProjectStats(uid, session.projectId);
}

export async function updateSessionMinutes(
  uid: string,
  id: string,
  minutes: { overview: string; body: string; followups: string[] },
) {
  const snap = await getDoc(doc(db, "sessions", id));
  requireOwner(snap.data(), uid);
  await updateDoc(doc(db, "sessions", id), {
    minutes_overview: minutes.overview,
    minutes_body: minutes.body,
    minutes_followups: minutes.followups,
    updated_at: new Date().toISOString(),
  });
}

export async function setSessionAnalysisError(uid: string, id: string, error: string) {
  const snap = await getDoc(doc(db, "sessions", id));
  requireOwner(snap.data(), uid);
  await updateDoc(doc(db, "sessions", id), {
    analysis_error: error,
    updated_at: new Date().toISOString(),
  });
}

export async function confirmSession(uid: string, id: string) {
  const snap = await getDoc(doc(db, "sessions", id));
  const data = requireOwner(snap.data(), uid);
  const detail = await getSession(uid, id);
  const corpusText = buildCorpusText({
    title: detail.title,
    headline: detail.headline,
    minutesOverview: detail.minutesOverview,
    tags: detail.tagLabels,
    themes: detail.themes,
    facts: detail.facts,
  });
  let embedding: number[] | null = null;
  try {
    embedding = await runEmbedText(corpusText, "RETRIEVAL_DOCUMENT");
  } catch {
    embedding = null;
  }
  await updateDoc(doc(db, "sessions", id), {
    status: "confirmed",
    confirmed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    corpus_text: corpusText,
    corpus_themes: detail.themes.map((t) => t.title),
    corpus_embedding: embedding,
  });
  if (data.project_id) await refreshProjectStats(uid, String(data.project_id));
  return { ok: true };
}

export async function reopenSession(uid: string, id: string) {
  const snap = await getDoc(doc(db, "sessions", id));
  const data = requireOwner(snap.data(), uid);
  await updateDoc(doc(db, "sessions", id), {
    status: "analyzed",
    confirmed_at: null,
    updated_at: new Date().toISOString(),
  });
  if (data.project_id) await refreshProjectStats(uid, String(data.project_id));
  return { ok: true };
}

export async function deleteSession(uid: string, id: string) {
  const snap = await getDoc(doc(db, "sessions", id));
  const data = requireOwner(snap.data(), uid);
  const audioPath = String(data.audio_storage_path ?? "");
  await Promise.all([
    deleteOwned(uid, "segments", id),
    deleteOwned(uid, "themes", id),
    deleteOwned(uid, "excerpts", id),
    deleteOwned(uid, "facts", id),
    deleteOwned(uid, "tags", id),
  ]);
  if (audioPath) {
    const { deleteUserAudio } = await import("./audio");
    await deleteUserAudio(audioPath).catch(() => undefined);
  }
  await deleteDoc(doc(db, "sessions", id));
  if (data.project_id) await refreshProjectStats(uid, String(data.project_id));
  return { ok: true };
}

export async function listTags(uid: string): Promise<{ label: string; count: number }[]> {
  const sessions = await listSessions(uid);
  const confirmed = new Set(sessions.filter((s) => s.status === "confirmed").map((s) => s.id));
  const tags = await ownedDocs(uid, "tags");
  const counts: Record<string, number> = {};
  for (const t of tags) {
    if (!confirmed.has(String(t.session_id))) continue;
    const label = String(t.label ?? "").trim();
    if (!label) continue;
    counts[label] = (counts[label] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "ko"));
}

export async function listLibraryCases(
  uid: string,
  filter: LibraryCaseFilter = {},
): Promise<SessionSummary[]> {
  const needle = (filter.q ?? "").trim().toLowerCase();
  const tag = filter.tag?.trim();
  const projectId = filter.projectId?.trim();
  let rows = (await listSessions(uid)).filter((s) => s.status === "confirmed");
  if (projectId) rows = rows.filter((s) => s.projectId === projectId);
  if (tag) rows = rows.filter((s) => s.tagLabels.includes(tag));
  if (needle) {
    rows = rows.filter((s) =>
      [
        s.title,
        s.headline,
        s.minutesOverview,
        s.projectTitle,
        s.sessionKind,
        s.district,
        s.industry,
        s.researcher,
        ...s.tagLabels,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }
  rows.sort((a, b) => {
    if (a.sessionDate !== b.sessionDate) {
      return (b.sessionDate || "").localeCompare(a.sessionDate || "");
    }
    return (b.confirmedAt || b.updatedAt || "").localeCompare(a.confirmedAt || a.updatedAt || "");
  });
  return rows;
}

function mapCrossSummary(value: unknown): CrossSummary | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  const repeated = Array.isArray(obj.repeated) ? obj.repeated : [];
  const tensions = Array.isArray(obj.tensions) ? obj.tensions : [];
  const followups = Array.isArray(obj.followups) ? obj.followups : [];
  return {
    overview: typeof obj.overview === "string" ? obj.overview : "",
    repeated: repeated
      .map((item) => {
        const rec = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          claim: typeof rec.claim === "string" ? rec.claim : "",
          sessionTitles: asStringArray(rec.sessionTitles ?? rec.session_titles),
          evidence: typeof rec.evidence === "string" ? rec.evidence : "",
        };
      })
      .filter((r) => r.claim),
    tensions: tensions
      .map((item) => {
        const rec = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          point: typeof rec.point === "string" ? rec.point : String(rec.issue ?? ""),
          detail:
            typeof rec.detail === "string"
              ? rec.detail
              : [rec.perspectiveA, rec.perspectiveB].filter((x) => typeof x === "string").join(" / "),
        };
      })
      .filter((t) => t.point),
    followups: followups.filter((x): x is string => typeof x === "string" && x.trim().length > 0),
  };
}

export async function getCrossAnalysis(uid: string, projectId: string): Promise<CrossData> {
  const project = await getProject(uid, projectId);
  const sessions = (await listSessions(uid, projectId)).filter((s) => s.status === "confirmed");
  if (sessions.length === 0) return emptyCross(project);

  const details = await Promise.all(sessions.map((s) => getSession(uid, s.id)));
  const tagCounts: Record<string, number> = {};
  const themes: CrossData["themes"] = [];
  const quotes: CrossData["quotes"] = [];
  const facts: CrossData["facts"] = [];

  for (const d of details) {
    for (const label of d.tagLabels) tagCounts[label] = (tagCounts[label] || 0) + 1;
    for (const t of d.themes) {
      themes.push({ sessionId: d.id, sessionTitle: d.title, title: t.title, summary: t.summary });
      for (const q of t.quotes) {
        quotes.push({
          sessionId: d.id,
          sessionTitle: d.title,
          themeTitle: t.title,
          text: q.text,
          segmentCode: q.segmentId,
        });
      }
    }
    for (const f of d.facts) {
      facts.push({ sessionId: d.id, sessionTitle: d.title, label: f.label, value: f.value });
    }
  }

  const projSnap = await getDoc(doc(db, "projects", projectId));
  const pdata = projSnap.data() ?? {};

  return {
    project: {
      ...project,
      confirmedCount: sessions.length,
      sessionCount: project.sessionCount,
      draftCount: project.draftCount,
    },
    tagCounts: Object.entries(tagCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "ko")),
    themes,
    quotes,
    facts,
    crossSummary: mapCrossSummary(pdata.cross_summary),
    crossSummaryAt: pdata.cross_summary_at ? asIso(pdata.cross_summary_at) : null,
  };
}

export async function saveCrossSummary(uid: string, projectId: string, summary: CrossSummary) {
  const snap = await getDoc(doc(db, "projects", projectId));
  requireOwner(snap.data(), uid);
  const now = new Date().toISOString();
  await updateDoc(doc(db, "projects", projectId), {
    cross_summary: summary,
    cross_summary_at: now,
  });
  return { at: now };
}

export async function searchConfirmedCases(
  uid: string,
  searchQuery: string,
  opts?: { projectId?: string; limit?: number },
): Promise<CorpusHit[]> {
  const snap = await getDocs(query(collection(db, "sessions"), where("owner_uid", "==", uid)));
  const docs: CorpusDoc[] = [];
  for (const row of snap.docs) {
    const data = row.data();
    if (asStatus(data.status, String(data.headline ?? "")) !== "confirmed") continue;
    if (opts?.projectId && String(data.project_id ?? "") !== opts.projectId) continue;
    const title = String(data.title ?? "");
    const headline = String(data.headline ?? "");
    const minutesOverview = String(data.minutes_overview ?? data.minutesOverview ?? "");
    const tagLabels = asStringArray(data.tagLabels ?? data.tag_labels);
    const themeTitles = asStringArray(data.corpus_themes);
    const corpusText =
      String(data.corpus_text ?? "").trim() ||
      buildCorpusText({ title, headline, minutesOverview, tags: tagLabels });
    const embedding = Array.isArray(data.corpus_embedding)
      ? data.corpus_embedding.map((n) => Number(n)).filter((n) => Number.isFinite(n))
      : null;
    docs.push({
      sessionId: row.id,
      sessionTitle: title,
      projectId: String(data.project_id ?? ""),
      projectTitle: String(data.projectTitle ?? data.project_title ?? ""),
      sessionDate: data.session_date ? String(data.session_date) : null,
      headline,
      corpusText,
      themeTitles,
      embedding: embedding && embedding.length > 0 ? embedding : null,
    });
  }
  let queryEmbedding: number[] | null = null;
  try {
    queryEmbedding = await runEmbedText(searchQuery, "RETRIEVAL_QUERY");
  } catch {
    queryEmbedding = null;
  }
  return rankCorpus(searchQuery, docs, queryEmbedding, opts?.limit ?? 5);
}

export async function loadChatCaseContext(uid: string, sessionIds: string[]): Promise<ChatCaseContext[]> {
  const out: ChatCaseContext[] = [];
  for (const id of sessionIds) {
    const d = await getSession(uid, id);
    if (d.status !== "confirmed") continue;
    out.push({
      sessionId: d.id,
      title: d.title,
      projectTitle: d.projectTitle,
      sessionDate: d.sessionDate,
      headline: d.headline,
      minutesOverview: d.minutesOverview,
      themes: d.themes.map((t) => ({
        title: t.title,
        summary: t.summary,
        quotes: t.quotes.map((q) => ({ text: q.text, segmentId: q.segmentId })),
      })),
      facts: d.facts.map((f) => ({ label: f.label, value: f.value, segmentCode: f.segmentCode })),
    });
  }
  return out;
}
