import type {
  ActionItem,
  CrossData,
  CrossSummary,
  Fact,
  Project,
  Segment,
  SessionAudio,
  SessionDetail,
  SessionStatus,
  SessionSummary,
  Theme,
} from "@/lib/types";
import { isConfidence, isStatus } from "@/lib/types";
import { asStringArray, newId } from "@/lib/utils";

export type ProjectRow = {
  id: string;
  title: string;
  year: number | null;
  kind: string;
  description: string;
  created_at: string;
  session_count?: number;
  confirmed_count?: number;
  draft_count?: number;
  cross_summary?: unknown;
  cross_summary_at?: string | null;
};

export type SessionRow = {
  id: string;
  project_id: string;
  project_title?: string;
  title: string;
  session_date: string | null;
  session_kind: string;
  industry: string;
  size_label: string;
  district: string;
  researcher?: string;
  status: string;
  original_filename: string;
  original_text?: string;
  audio_storage_path?: string;
  audio_mime_type?: string;
  audio_filename?: string;
  audio_size_bytes?: number;
  audio_duration_sec?: number | null;
  headline: string;
  minutes_overview?: string;
  minutes_body?: string;
  minutes_followups?: unknown;
  unresolved?: unknown;
  action_items?: unknown;
  analysis_error?: string;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  tag_labels?: unknown;
};

export type SegmentRow = {
  id: string;
  code: string;
  seq: number;
  speaker: string;
  ts: string;
  body: string;
};

export type ThemeRow = {
  id: string;
  sort_order: number;
  title: string;
  summary: string;
  bullets: unknown;
  source_segment_ids: unknown;
  confidence: string;
};

export type ExcerptRow = {
  id: string;
  theme_id: string | null;
  segment_code: string;
  body: string;
  sort_order: number;
};

export type FactRow = {
  id: string;
  label: string;
  value: string;
  segment_code: string;
};

export function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    year: row.year,
    kind: row.kind,
    description: row.description,
    createdAt: row.created_at,
    sessionCount: Number(row.session_count ?? 0),
    confirmedCount: Number(row.confirmed_count ?? 0),
    draftCount: Number(row.draft_count ?? 0),
  };
}

export function mapCrossSummary(value: unknown): CrossSummary | null {
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
          point: typeof rec.point === "string" ? rec.point : "",
          detail: typeof rec.detail === "string" ? rec.detail : "",
        };
      })
      .filter((t) => t.point),
    followups: followups.filter((x): x is string => typeof x === "string" && x.trim().length > 0),
  };
}

export function mapStatus(value: string): SessionStatus {
  return isStatus(value) ? value : "uploaded";
}

function mapAudio(row: SessionRow): SessionAudio | null {
  const storagePath = row.audio_storage_path?.trim() ?? "";
  if (!storagePath) return null;
  return {
    storagePath,
    mimeType: row.audio_mime_type ?? "audio/webm",
    filename: row.audio_filename ?? "recording.webm",
    sizeBytes: Number(row.audio_size_bytes ?? 0),
    durationSec: row.audio_duration_sec ?? null,
  };
}

export function mapSessionSummary(row: SessionRow): SessionSummary {
  return {
    id: row.id,
    projectId: row.project_id,
    projectTitle: row.project_title ?? "",
    title: row.title,
    sessionDate: row.session_date,
    sessionKind: row.session_kind,
    industry: row.industry,
    sizeLabel: row.size_label,
    district: row.district,
    researcher: row.researcher ?? "",
    status: mapStatus(row.status),
    headline: row.headline,
    minutesOverview: row.minutes_overview ?? "",
    originalFilename: row.original_filename,
    audio: mapAudio(row),
    tagLabels: asStringArray(row.tag_labels),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    confirmedAt: row.confirmed_at,
  };
}

export function mapSegment(row: SegmentRow): Segment {
  return {
    id: row.id,
    code: row.code,
    seq: row.seq,
    speaker: row.speaker,
    ts: row.ts,
    body: row.body,
  };
}

export function mapThemes(themeRows: ThemeRow[], excerptRows: ExcerptRow[]): Theme[] {
  return themeRows.map((row) => ({
    id: row.id,
    sortOrder: row.sort_order,
    title: row.title,
    summary: row.summary,
    bullets: asStringArray(row.bullets),
    sourceSegmentIds: asStringArray(row.source_segment_ids),
    quotes: excerptRows
      .filter((ex) => ex.theme_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((ex) => ({ text: ex.body, segmentId: ex.segment_code })),
    confidence: isConfidence(row.confidence) ? row.confidence : "medium",
  }));
}

export function mapFacts(rows: FactRow[]): Fact[] {
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    value: row.value,
    segmentCode: row.segment_code,
  }));
}

function mapActionItems(value: unknown): ActionItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const rec = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: typeof rec.id === "string" && rec.id ? rec.id : newId("act"),
      assignee: typeof rec.assignee === "string" ? rec.assignee : "",
      deadline: typeof rec.deadline === "string" ? rec.deadline : "",
      task: typeof rec.task === "string" ? rec.task : "",
      segmentCode: String(rec.segment_code ?? rec.segmentCode ?? ""),
    };
  });
}

export function mapSessionDetail(
  row: SessionRow,
  segments: SegmentRow[],
  themes: ThemeRow[],
  excerpts: ExcerptRow[],
  facts: FactRow[],
  tags: string[],
): SessionDetail {
  return {
    ...mapSessionSummary({ ...row, tag_labels: tags }),
    originalText: row.original_text ?? "",
    minutesOverview: row.minutes_overview ?? "",
    minutesBody: row.minutes_body ?? "",
    minutesFollowups: asStringArray(row.minutes_followups),
    unresolved: asStringArray(row.unresolved),
    actionItems: mapActionItems(row.action_items),
    analysisError: row.analysis_error ?? "",
    segments: segments
      .slice()
      .sort((a, b) => a.seq - b.seq)
      .map(mapSegment),
    themes: mapThemes(themes, excerpts),
    facts: mapFacts(facts),
  };
}

export function emptyCross(project: Project): CrossData {
  return {
    project,
    tagCounts: [],
    themes: [],
    quotes: [],
    facts: [],
    crossSummary: null,
    crossSummaryAt: null,
  };
}
