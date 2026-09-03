export const SESSION_KINDS = ["기업 인터뷰", "FGI", "분과위", "협의체"] as const;
export const PROJECT_KINDS = ["심층조사", "기초조사", "분과위", "협의체", "기타"] as const;
export const STATUSES = ["uploaded", "analyzed", "confirmed"] as const;

export type SessionKind = (typeof SESSION_KINDS)[number];
export type ProjectKind = (typeof PROJECT_KINDS)[number];
export type SessionStatus = (typeof STATUSES)[number];
export type Confidence = "high" | "medium" | "low";

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};

export type Project = {
  id: string;
  title: string;
  year: number | null;
  kind: string;
  description: string;
  createdAt: string;
  sessionCount: number;
  confirmedCount: number;
  draftCount: number;
};

export type Segment = {
  id: string;
  code: string;
  seq: number;
  speaker: string;
  ts: string;
  body: string;
};

export type Quote = {
  text: string;
  segmentId: string;
};

export type Theme = {
  id: string;
  sortOrder: number;
  title: string;
  summary: string;
  bullets: string[];
  sourceSegmentIds: string[];
  quotes: Quote[];
  confidence: Confidence;
};

export type Fact = {
  id: string;
  label: string;
  value: string;
  segmentCode: string;
};

export type ActionItem = {
  id: string;
  assignee: string;
  deadline: string;
  task: string;
  segmentCode: string;
};

export type SessionAudio = {
  storagePath: string;
  mimeType: string;
  filename: string;
  sizeBytes: number;
  durationSec: number | null;
};

export type SessionSummary = {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  sessionDate: string | null;
  sessionKind: string;
  industry: string;
  sizeLabel: string;
  district: string;
  researcher: string;
  status: SessionStatus;
  headline: string;
  minutesOverview: string;
  originalFilename: string;
  audio: SessionAudio | null;
  tagLabels: string[];
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
};

export type SessionDetail = SessionSummary & {
  originalText: string;
  minutesBody: string;
  minutesFollowups: string[];
  unresolved: string[];
  actionItems: ActionItem[];
  analysisError: string;
  segments: Segment[];
  themes: Theme[];
  facts: Fact[];
};

export type LibraryCaseFilter = {
  q?: string;
  tag?: string;
  projectId?: string;
};

export type RelatedCase = {
  sessionId: string;
  sessionTitle: string;
  projectTitle: string;
  sessionDate: string | null;
  headline: string;
  reason: string;
};

export type ChatGroundedReply = {
  answer: string;
  relatedCases: RelatedCase[];
};

export type ChatCaseContext = {
  sessionId: string;
  title: string;
  projectTitle: string;
  sessionDate: string | null;
  headline: string;
  minutesOverview: string;
  themes: Array<{ title: string; summary: string; quotes: Array<{ text: string; segmentId: string }> }>;
  facts: Array<{ label: string; value: string; segmentCode: string }>;
};

export type CrossSummary = {
  overview: string;
  repeated: Array<{
    claim: string;
    sessionTitles: string[];
    evidence: string;
  }>;
  tensions: Array<{ point: string; detail: string }>;
  followups: string[];
};

export type CrossData = {
  project: Project;
  tagCounts: { label: string; count: number }[];
  themes: { sessionId: string; sessionTitle: string; title: string; summary: string }[];
  quotes: {
    sessionId: string;
    sessionTitle: string;
    themeTitle: string;
    text: string;
    segmentCode: string;
  }[];
  facts: { sessionId: string; sessionTitle: string; label: string; value: string }[];
  crossSummary: CrossSummary | null;
  crossSummaryAt: string | null;
};

export const STATUS_LABEL: Record<SessionStatus, string> = {
  uploaded: "원문",
  analyzed: "초안",
  confirmed: "확정",
};

export function isStatus(value: string): value is SessionStatus {
  return STATUSES.includes(value as SessionStatus);
}

export function isConfidence(value: string): value is Confidence {
  return value === "high" || value === "medium" || value === "low";
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

export function mergeThemes(themes: Theme[]): Theme {
  const first = themes[0];
  if (!first) {
    throw new Error("병합할 주제가 없습니다.");
  }
  const rest = themes.slice(1);
  const rank = { low: 0, medium: 1, high: 2 };
  let confidence: Confidence = first.confidence;
  for (const t of rest) {
    if (rank[t.confidence] < rank[confidence]) confidence = t.confidence;
  }
  const sources = [...new Set(themes.flatMap((t) => t.sourceSegmentIds))];
  const bullets = [...new Set(themes.flatMap((t) => t.bullets.map((b) => b.trim())).filter(Boolean))];
  const quotes = themes.flatMap((t) => t.quotes.filter((q) => q.text.trim()));
  return {
    ...first,
    title: themes.map((t) => t.title).join(" / "),
    summary: themes
      .map((t) => t.summary.trim())
      .filter(Boolean)
      .join("\n\n"),
    bullets,
    sourceSegmentIds: sources,
    quotes,
    confidence,
  };
}
