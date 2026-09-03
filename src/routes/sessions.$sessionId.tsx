import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Download,
  LoaderCircle,
  Pencil,
  Plus,
  ScanText,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/status-badge";
import { ThemeCard } from "@/components/theme-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  buildMinutesHtml,
  buildMinutesMarkdown,
  downloadHtml,
  downloadText,
  downloadWordDoc,
} from "@/lib/minutes-export";
import { uniqueSpeakers } from "@/lib/parse-transcript";
import { runAnalyzeSession, runRewriteMinutes } from "@/lib/ai/run";
import {
  getSession,
  saveSessionDraft,
  confirmSession,
  reopenSession,
  deleteSession,
  updateSegments,
  updateSessionAnalysis,
  updateSessionMeta,
  setSessionAnalysisError,
} from "@/lib/firebase-db";
import { mergeThemes, SESSION_KINDS, type Fact, type ActionItem, type SessionDetail, type Theme } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { cn, formatDateKo, newId } from "@/lib/utils";
import { NativeSelect } from "@/components/native-select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/sessions/$sessionId")({
  component: SessionWorkbench,
});

function cloneSession(s: SessionDetail) {
  return {
    headline: s.headline,
    minutesOverview: s.minutesOverview,
    minutesBody: s.minutesBody,
    minutesFollowups: [...s.minutesFollowups],
    unresolved: [...s.unresolved],
    tags: [...s.tagLabels],
    actionItems: s.actionItems.map((a) => ({ ...a })),
    themes: s.themes.map((t) => ({
      ...t,
      bullets: [...t.bullets],
      sourceSegmentIds: [...t.sourceSegmentIds],
      quotes: t.quotes.map((q) => ({ ...q })),
    })),
    facts: s.facts.map((f) => ({ ...f })),
  };
}

function SessionWorkbench() {
  const { user } = useAuth();
  const uid = user?.uid;
  const { sessionId } = Route.useParams();
  const { data: session, isLoading, error } = useQuery({
    queryKey: ["session", sessionId, uid],
    queryFn: () => getSession(uid!, sessionId),
    enabled: !!uid,
  });

  if (!uid) return null;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        <LoaderCircle className="mr-2 size-5 animate-spin" />
        세션을 불러오는 중
      </div>
    );
  }
  if (error || !session) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
        세션을 찾을 수 없습니다.
      </div>
    );
  }
  return <SessionEditor key={session.updatedAt} session={session} uid={uid} />;
}

function SessionEditor({ session, uid }: { session: SessionDetail; uid: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [draft, setDraft] = useState(() => cloneSession(session));
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(
    session.themes[0]?.id ?? null,
  );
  const [mobilePane, setMobilePane] = useState<"transcript" | "themes" | "minutes">("themes");
  const [workTab, setWorkTab] = useState<"themes" | "minutes" | "facts">("themes");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [sourceOnly, setSourceOnly] = useState(false);
  const [speakerEdits, setSpeakerEdits] = useState<Record<string, string>>({});
  const [exportOpen, setExportOpen] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);

  useEffect(() => {
    setDraft(cloneSession(session));
    setSelectedThemeId(session.themes[0]?.id ?? null);
    setEditingId(null);
    setCheckedIds([]);
    setSpeakerEdits({});
  }, [session]);

  const locked = session.status === "confirmed";
  const selected = draft.themes.find((t) => t.id === selectedThemeId) ?? null;
  const speakers = uniqueSpeakers(session.segments);

  const payload = useMemo(
    () => ({
      id: session.id,
      headline: draft.headline,
      minutesOverview: draft.minutesOverview,
      minutesBody: draft.minutesBody,
      minutesFollowups: draft.minutesFollowups,
      unresolved: draft.unresolved,
      tags: draft.tags,
      facts: draft.facts,
      actionItems: draft.actionItems,
      themes: draft.themes,
    }),
    [session.id, draft],
  );

  const exportSession = {
    ...session,
    ...draft,
    tagLabels: draft.tags,
  };

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ["session", session.id, uid] });
    await qc.invalidateQueries({ queryKey: ["sessions"] });
    await qc.invalidateQueries({ queryKey: ["projects"] });
    await qc.invalidateQueries({ queryKey: ["cross"] });
    await qc.invalidateQueries({ queryKey: ["library"] });
    await qc.invalidateQueries({ queryKey: ["tags"] });
  };

  const analyzeMut = useMutation({
    mutationFn: () =>
      runAnalyzeSession({
        meta: {
          title: session.title,
          sessionKind: session.sessionKind,
          sessionDate: session.sessionDate,
          industry: session.industry,
          district: session.district,
          sizeLabel: session.sizeLabel,
          projectTitle: session.projectTitle,
        },
        segments: session.segments.map((s) => ({
          seq: s.seq,
          speaker: s.speaker,
          ts: s.ts,
          body: s.body,
          code: s.code,
        })),
      }),
    onSuccess: async (res) => {
      if (res.ok) {
        await updateSessionAnalysis(uid, session.id, res.result);
        toast.success("주제 구조와 회의록 초안을 만들었습니다.");
        await refresh();
      } else {
        await setSessionAnalysisError(uid, session.id, res.error);
        toast.error(res.error);
        await refresh();
      }
    },
    onError: async (err: Error) => {
      await setSessionAnalysisError(uid, session.id, err.message);
      toast.error(err.message);
      await refresh();
    },
  });

  const saveMut = useMutation({
    mutationFn: () => saveSessionDraft(uid, payload),
    onSuccess: async () => {
      toast.success("초안을 저장했습니다.");
      await refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const confirmMut = useMutation({
    mutationFn: async () => {
      await saveSessionDraft(uid, payload);
      await confirmSession(uid, session.id);
    },
    onSuccess: async () => {
      toast.success("자료실에 올렸습니다.");
      await refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const reopenMut = useMutation({
    mutationFn: () => reopenSession(uid, session.id),
    onSuccess: async () => {
      toast.success("확정을 해제했습니다.");
      await refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const rewriteMut = useMutation({
    mutationFn: () =>
      runRewriteMinutes({
        meta: {
          title: session.title,
          sessionKind: session.sessionKind,
          sessionDate: session.sessionDate,
          projectTitle: session.projectTitle,
        },
        themes: draft.themes.map((t) => ({
          title: t.title,
          summary: t.summary,
          bullets: t.bullets,
          sourceSegments: t.sourceSegmentIds,
          quotes: t.quotes,
          confidence: t.confidence,
        })),
        facts: draft.facts.map((f) => ({
          label: f.label,
          value: f.value,
          segmentId: f.segmentCode,
        })),
        unresolved: draft.unresolved,
      }),
    onSuccess: async (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setDraft((d) => ({
        ...d,
        minutesOverview: res.minutes.overview,
        minutesBody: res.minutes.body,
        minutesFollowups: res.minutes.followups,
      }));
      toast.success("회의록 초안을 다시 썼습니다. 저장을 눌러 보관하세요.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteSession(uid, session.id),
    onSuccess: async () => {
      toast.success("삭제했습니다.");
      await qc.invalidateQueries({ queryKey: ["sessions"] });
      await qc.invalidateQueries({ queryKey: ["projects"] });
      await router.navigate({ to: "/" });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const speakerMut = useMutation({
    mutationFn: () =>
      updateSegments(uid, {
        id: session.id,
        segments: session.segments.map((seg) => ({
          seq: seg.seq,
          speaker: speakerEdits[seg.speaker] ?? seg.speaker,
          ts: seg.ts,
          body: seg.body,
          code: seg.code,
        })),
      }),
    onSuccess: async () => {
      toast.success("화자 이름을 고쳤습니다.");
      await refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function patchTheme(id: string, patch: Partial<Theme>) {
    setDraft((d) => ({
      ...d,
      themes: d.themes.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }

  function toggleSource(code: string) {
    if (!selected || locked) return;
    const has = selected.sourceSegmentIds.includes(code);
    patchTheme(selected.id, {
      sourceSegmentIds: has
        ? selected.sourceSegmentIds.filter((c) => c !== code)
        : [...selected.sourceSegmentIds, code],
    });
  }

  function addTheme() {
    const theme: Theme = {
      id: newId("thm"),
      sortOrder: draft.themes.length,
      title: "새 주제",
      summary: "",
      bullets: [],
      sourceSegmentIds: [],
      quotes: [],
      confidence: "medium",
    };
    setDraft((d) => ({ ...d, themes: [...d.themes, theme] }));
    setSelectedThemeId(theme.id);
    setEditingId(theme.id);
    setMobilePane("themes");
    setWorkTab("themes");
  }

  function removeTheme(id: string) {
    setDraft((d) => ({ ...d, themes: d.themes.filter((t) => t.id !== id) }));
    setCheckedIds((ids) => ids.filter((x) => x !== id));
    if (selectedThemeId === id) setSelectedThemeId(null);
    if (editingId === id) setEditingId(null);
  }

  function mergeSelected() {
    const picked = draft.themes.filter((t) => checkedIds.includes(t.id));
    if (picked.length < 2) {
      toast.error("병합할 주제를 두 개 이상 고르세요.");
      return;
    }
    const merged = mergeThemes(picked);
    const keepId = picked[0]!.id;
    const drop = new Set(picked.slice(1).map((t) => t.id));
    setDraft((d) => ({
      ...d,
      themes: d.themes
        .filter((t) => !drop.has(t.id))
        .map((t) => (t.id === keepId ? merged : t)),
    }));
    setCheckedIds([]);
    setSelectedThemeId(keepId);
    setEditingId(keepId);
    toast.success("주제를 한 장으로 합쳤습니다. 제목을 다듬고 저장하세요.");
  }

  function doExport(kind: "html" | "doc" | "md") {
    const html = buildMinutesHtml({
      session: exportSession,
      themes: draft.themes,
      facts: draft.facts,
      tags: draft.tags,
    });
    if (kind === "html") downloadHtml(`${session.title}-회의록.html`, html);
    else if (kind === "doc") downloadWordDoc(`${session.title}-회의록.doc`, html);
    else
      downloadText(
        `${session.title}-회의록.md`,
        buildMinutesMarkdown({
          session: exportSession,
          themes: draft.themes,
          facts: draft.facts,
          tags: draft.tags,
        }),
      );
    setExportOpen(false);
  }

  const visibleSegments =
    sourceOnly && selected
      ? session.segments.filter((s) => selected.sourceSegmentIds.includes(s.code))
      : session.segments;

  const jumpTo = (code: string) => {
    setSourceOnly(false);
    setMobilePane("transcript");
    requestAnimationFrame(() => {
      document.getElementById(`seg-${code}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const busy = analyzeMut.isPending || rewriteMut.isPending;
  const speakerDirty = speakers.some((n) => speakerEdits[n] && speakerEdits[n] !== n);

  return (
    <div className="flex flex-col gap-4">
      {busy ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-panel)]">
            <LoaderCircle className="size-5 animate-spin text-primary" />
            <p className="text-sm">
              {analyzeMut.isPending
                ? "구간을 읽고 주제를 나누고 있습니다."
                : "회의록 초안을 다시 쓰는 중입니다."}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-b border-border pb-4">
        <Link
          to="/projects/$projectId"
          params={{ projectId: session.projectId }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {session.projectTitle}
        </Link>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                {session.title}
              </h1>
              <StatusBadge status={session.status} />
              {!locked ? (
                <Button size="sm" variant="ghost" onClick={() => setMetaOpen(true)}>
                  <Pencil className="size-4" />
                  정보
                </Button>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {session.sessionKind} · {formatDateKo(session.sessionDate)}
              {session.researcher ? ` · ${session.researcher}` : ""}
              {session.district ? ` · ${session.district}` : ""}
              {session.industry ? ` · ${session.industry}` : ""}
              {session.sizeLabel ? ` · ${session.sizeLabel}` : ""}
            </p>
            {session.headline ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                {session.headline}
              </p>
            ) : null}
          </div>
          <div className="no-print flex flex-wrap gap-2">
            {!locked ? (
              <>
                <Button variant="outline" onClick={() => analyzeMut.mutate()} disabled={busy}>
                  <ScanText className="size-4" />
                  {session.themes.length ? "다시 분석" : "분석"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => saveMut.mutate()}
                  disabled={saveMut.isPending}
                >
                  초안 저장
                </Button>
                <Button onClick={() => confirmMut.mutate()} disabled={confirmMut.isPending}>
                  확정
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => reopenMut.mutate()}>
                확정 해제
              </Button>
            )}
            <div className="relative">
              <Button variant="outline" onClick={() => setExportOpen((v) => !v)}>
                <Download className="size-4" />
                내보내기
              </Button>
              {exportOpen ? (
                <div className="absolute right-0 z-20 mt-1 min-w-40 rounded-md border border-border bg-card p-1 shadow-[var(--shadow-panel)]">
                  <button
                    type="button"
                    className="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => doExport("html")}
                  >
                    HTML
                  </button>
                  <button
                    type="button"
                    className="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => doExport("doc")}
                  >
                    한글·Word
                  </button>
                  <button
                    type="button"
                    className="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => doExport("md")}
                  >
                    마크다운
                  </button>
                </div>
              ) : null}
            </div>
            {!locked ? (
              <Button
                variant="ghost"
                onClick={() => {
                  if (window.confirm("이 초안을 삭제할까요? 원문도 함께 지워집니다.")) {
                    deleteMut.mutate();
                  }
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>
        {session.analysisError ? (
          <p className="rounded-md border border-destructive/30 bg-card px-3 py-2 text-sm text-destructive">
            {session.analysisError}
          </p>
        ) : null}
      </div>

      <div className="no-print sticky top-14 z-30 flex gap-1 rounded-lg bg-muted p-1 lg:hidden">
        {(
          [
            ["transcript", "원문"],
            ["themes", "주제"],
            ["minutes", "회의록"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn(
              "h-9 flex-1 rounded-md text-sm font-medium",
              mobilePane === id ? "bg-card shadow-sm" : "",
            )}
            onClick={() => {
              setMobilePane(id);
              if (id === "themes") setWorkTab("themes");
              if (id === "minutes") setWorkTab("minutes");
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section
          className={cn(
            "min-h-[50vh] rounded-xl border border-border bg-card",
            mobilePane === "transcript" ? "" : "hidden lg:block",
          )}
        >
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-medium">원문 구간</h2>
              <p className="text-xs text-muted-foreground">
                주제를 고른 뒤 구간을 누르면 근거로 연결됩니다.
              </p>
            </div>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={sourceOnly}
                onChange={(e) => setSourceOnly(e.target.checked)}
                disabled={!selected}
              />
              근거만
            </label>
          </div>
          {!locked && speakers.length > 0 ? (
            <div className="flex flex-wrap items-end gap-2 border-b border-border px-4 py-3">
              {speakers.map((name) => (
                <label key={name} className="flex min-w-28 flex-1 flex-col gap-1">
                  <span className="text-[11px] text-muted-foreground">{name}</span>
                  <Input
                    value={speakerEdits[name] ?? name}
                    onChange={(e) =>
                      setSpeakerEdits((m) => ({ ...m, [name]: e.target.value }))
                    }
                  />
                </label>
              ))}
              <Button
                size="sm"
                variant="outline"
                disabled={!speakerDirty || speakerMut.isPending}
                onClick={() => speakerMut.mutate()}
              >
                화자 반영
              </Button>
            </div>
          ) : null}
          <ol className="p-2 lg:max-h-[70vh] lg:overflow-auto">
            {visibleSegments.length === 0 ? (
              <li className="px-3 py-8 text-center text-sm text-muted-foreground">
                이 주제에 연결된 구간이 없습니다.
              </li>
            ) : (
              visibleSegments.map((seg) => {
                const active = selected?.sourceSegmentIds.includes(seg.code);
                return (
                  <li key={seg.id} id={`seg-${seg.code}`}>
                    <button
                      type="button"
                      onClick={() => toggleSource(seg.code)}
                      className={cn(
                        "w-full rounded-lg px-3 py-3 text-left transition-colors",
                        active ? "bg-highlight" : "hover:bg-muted/70",
                      )}
                    >
                      <div className="flex items-baseline gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{seg.code}</span>
                        <span className="font-medium text-foreground">{seg.speaker}</span>
                        {seg.ts ? <span className="font-mono">{seg.ts}</span> : null}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                        {seg.body}
                      </p>
                    </button>
                  </li>
                );
              })
            )}
          </ol>
        </section>

        <section
          className={cn(
            "min-h-[50vh] rounded-xl border border-border bg-card",
            mobilePane === "transcript" ? "hidden lg:block" : "",
          )}
        >
          <Tabs
            value={workTab}
            onValueChange={(v) => {
              const tab = v as "themes" | "minutes" | "facts";
              setWorkTab(tab);
              setMobilePane(tab === "themes" ? "themes" : "minutes");
            }}
            className="p-4"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="themes">주제 {draft.themes.length}</TabsTrigger>
              <TabsTrigger value="minutes">회의록</TabsTrigger>
              <TabsTrigger value="facts">사실·액션</TabsTrigger>
            </TabsList>
            <TabsContent value="themes" className="flex flex-col gap-3">
              <div className="flex flex-wrap justify-end gap-2">
                {!locked ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={checkedIds.length < 2}
                    onClick={mergeSelected}
                  >
                    선택 병합
                  </Button>
                ) : null}
                <Button size="sm" variant="outline" disabled={locked} onClick={addTheme}>
                  <Plus className="size-4" />
                  주제 추가
                </Button>
              </div>
              {draft.themes.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  아직 주제가 없습니다. 분석을 누르면 대화에서 주제를 찾아 옵니다.
                </p>
              ) : (
                draft.themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    selected={theme.id === selectedThemeId}
                    checked={checkedIds.includes(theme.id)}
                    editing={editingId === theme.id}
                    locked={locked}
                    onSelect={() => setSelectedThemeId(theme.id)}
                    onToggleCheck={() =>
                      setCheckedIds((ids) =>
                        ids.includes(theme.id)
                          ? ids.filter((x) => x !== theme.id)
                          : [...ids, theme.id],
                      )
                    }
                    onStartEdit={() => {
                      setSelectedThemeId(theme.id);
                      setEditingId(theme.id);
                    }}
                    onChange={(patch) => patchTheme(theme.id, patch)}
                    onRemove={() => removeTheme(theme.id)}
                    onJump={jumpTo}
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="minutes" className="flex flex-col gap-3">
              {!locked ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="self-end"
                  onClick={() => rewriteMut.mutate()}
                  disabled={busy || draft.themes.length === 0}
                >
                  회의록 다시 쓰기
                </Button>
              ) : null}
              <label className="text-xs font-medium text-muted-foreground">개요</label>
              <Textarea
                rows={4}
                disabled={locked}
                value={draft.minutesOverview}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, minutesOverview: e.target.value }))
                }
              />
              <label className="text-xs font-medium text-muted-foreground">본문</label>
              <Textarea
                rows={14}
                disabled={locked}
                className="font-serif leading-relaxed"
                value={draft.minutesBody}
                onChange={(e) => setDraft((d) => ({ ...d, minutesBody: e.target.value }))}
              />
              <label className="text-xs font-medium text-muted-foreground">후속 확인</label>
              <Textarea
                rows={4}
                disabled={locked}
                value={draft.minutesFollowups.join("\n")}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    minutesFollowups: e.target.value.split("\n"),
                  }))
                }
              />
            </TabsContent>
            <TabsContent value="facts" className="flex flex-col gap-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">사실</h3>
                  {!locked ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          facts: [
                            ...d.facts,
                            { id: newId("fct"), label: "", value: "", segmentCode: "" },
                          ],
                        }))
                      }
                    >
                      추가
                    </Button>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  {draft.facts.map((fact, i) => (
                    <FactRow
                      key={fact.id}
                      fact={fact}
                      locked={locked}
                      onChange={(next) =>
                        setDraft((d) => ({
                          ...d,
                          facts: d.facts.map((f, idx) => (idx === i ? next : f)),
                        }))
                      }
                      onRemove={() =>
                        setDraft((d) => ({
                          ...d,
                          facts: d.facts.filter((_, idx) => idx !== i),
                        }))
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">액션 아이템 (실행 항목)</h3>
                  {!locked ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          actionItems: [
                            ...d.actionItems,
                            { id: newId("act"), assignee: "", deadline: "", task: "", segmentCode: "" },
                          ],
                        }))
                      }
                    >
                      추가
                    </Button>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  {draft.actionItems.map((act, i) => (
                    <ActionItemRow
                      key={act.id}
                      item={act}
                      locked={locked}
                      onChange={(next) =>
                        setDraft((d) => ({
                          ...d,
                          actionItems: d.actionItems.map((a, idx) => (idx === i ? next : a)),
                        }))
                      }
                      onRemove={() =>
                        setDraft((d) => ({
                          ...d,
                          actionItems: d.actionItems.filter((_, idx) => idx !== i),
                        }))
                      }
                    />
                  ))}
                  {draft.actionItems.length === 0 && (
                    <p className="text-sm text-muted-foreground">감지된 액션 아이템이 없습니다.</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-sm font-medium">검색 태그</h3>
                <Input
                  disabled={locked}
                  value={draft.tags.join(", ")}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    }))
                  }
                  placeholder="쉼표로 구분"
                />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium">미해소</h3>
                <Textarea
                  disabled={locked}
                  rows={3}
                  value={draft.unresolved.join("\n")}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, unresolved: e.target.value.split("\n") }))
                  }
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">한 줄 핵심</label>
                <Input
                  className="mt-1"
                  disabled={locked}
                  value={draft.headline}
                  onChange={(e) => setDraft((d) => ({ ...d, headline: e.target.value }))}
                />
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
      <SessionMetaDialog
        open={metaOpen}
        onOpenChange={setMetaOpen}
        session={session}
        uid={uid}
        onSaved={refresh}
      />
    </div>
  );
}

function FactRow({
  fact,
  locked,
  onChange,
  onRemove,
}: {
  fact: Fact;
  locked: boolean;
  onChange: (f: Fact) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_72px_40px] gap-2">
      <Input
        disabled={locked}
        value={fact.label}
        placeholder="항목"
        onChange={(e) => onChange({ ...fact, label: e.target.value })}
      />
      <Input
        disabled={locked}
        value={fact.value}
        placeholder="값"
        onChange={(e) => onChange({ ...fact, value: e.target.value })}
      />
      <Input
        disabled={locked}
        value={fact.segmentCode}
        className="font-mono text-xs"
        placeholder="S001"
        onChange={(e) => onChange({ ...fact, segmentCode: e.target.value })}
      />
      {!locked ? (
        <Button size="icon" variant="ghost" onClick={onRemove} aria-label="사실 삭제">
          <Trash2 className="size-4" />
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}

function ActionItemRow({
  item,
  locked,
  onChange,
  onRemove,
}: {
  item: ActionItem;
  locked: boolean;
  onChange: (a: ActionItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_2fr_72px_40px] gap-2 items-center bg-muted/40 p-2 rounded-lg border border-border/50">
      <Input
        disabled={locked}
        value={item.assignee}
        placeholder="담당자"
        className="h-8 text-sm"
        onChange={(e) => onChange({ ...item, assignee: e.target.value })}
      />
      <Input
        disabled={locked}
        value={item.deadline}
        placeholder="기한"
        className="h-8 text-sm"
        onChange={(e) => onChange({ ...item, deadline: e.target.value })}
      />
      <Input
        disabled={locked}
        value={item.task}
        placeholder="무엇을"
        className="h-8 text-sm"
        onChange={(e) => onChange({ ...item, task: e.target.value })}
      />
      <Input
        disabled={locked}
        value={item.segmentCode}
        className="font-mono text-xs h-8"
        placeholder="S001"
        onChange={(e) => onChange({ ...item, segmentCode: e.target.value })}
      />
      {!locked ? (
        <Button size="icon" variant="ghost" onClick={onRemove} aria-label="삭제" className="size-8">
          <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}

function SessionMetaDialog({
  open,
  onOpenChange,
  session,
  uid,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  session: SessionDetail;
  uid: string;
  onSaved: () => Promise<void>;
}) {
  const [title, setTitle] = useState(session.title);
  const [sessionDate, setSessionDate] = useState(session.sessionDate ?? "");
  const [sessionKind, setSessionKind] = useState(session.sessionKind);
  const [industry, setIndustry] = useState(session.industry);
  const [sizeLabel, setSizeLabel] = useState(session.sizeLabel);
  const [district, setDistrict] = useState(session.district);
  const [researcher, setResearcher] = useState(session.researcher);

  useEffect(() => {
    setTitle(session.title);
    setSessionDate(session.sessionDate ?? "");
    setSessionKind(session.sessionKind);
    setIndustry(session.industry);
    setSizeLabel(session.sizeLabel);
    setDistrict(session.district);
    setResearcher(session.researcher);
  }, [session]);

  const mutation = useMutation({
    mutationFn: () =>
      updateSessionMeta(uid, {
        id: session.id,
        title,
        sessionDate: sessionDate || null,
        sessionKind,
        industry,
        sizeLabel,
        district,
        researcher,
      }),
    onSuccess: async () => {
      toast.success("조사 정보를 저장했습니다.");
      onOpenChange(false);
      await onSaved();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>조사 정보</DialogTitle>
          <DialogDescription>대상명과 현장 메타를 고칩니다.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stitle">대상</Label>
            <Input id="stitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sdate">일자</Label>
              <Input
                id="sdate"
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skind">유형</Label>
              <NativeSelect
                id="skind"
                value={sessionKind}
                onChange={(e) => setSessionKind(e.target.value)}
              >
                {SESSION_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sind">업종</Label>
              <Input id="sind" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ssize">규모</Label>
              <Input id="ssize" value={sizeLabel} onChange={(e) => setSizeLabel(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sdist">지역</Label>
              <Input id="sdist" value={district} onChange={(e) => setDistrict(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sres">조사자</Label>
              <Input id="sres" value={researcher} onChange={(e) => setResearcher(e.target.value)} />
            </div>
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "저장 중" : "저장"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

