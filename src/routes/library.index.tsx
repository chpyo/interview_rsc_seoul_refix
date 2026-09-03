import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LoaderCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { NativeSelect } from "@/components/native-select";
import { RelatedCases } from "@/components/related-cases";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { askConfirmedCorpus } from "@/lib/ai/ask-corpus";
import { listLibraryCases, listProjects, listTags } from "@/lib/firebase-db";
import { useAuth } from "@/lib/auth-context";
import type { ChatGroundedReply, SessionSummary } from "@/lib/types";
import { formatDateKo } from "@/lib/utils";

export const Route = createFileRoute("/library/")({
  component: LibraryPage,
});

function groupByProject(cases: SessionSummary[]) {
  const map = new Map<string, { projectId: string; projectTitle: string; items: SessionSummary[] }>();
  for (const item of cases) {
    const key = item.projectId || item.projectTitle || "unassigned";
    const group = map.get(key);
    if (group) {
      group.items.push(item);
    } else {
      map.set(key, {
        projectId: item.projectId,
        projectTitle: item.projectTitle || "프로젝트 미지정",
        items: [item],
      });
    }
  }
  return [...map.values()];
}

function LibraryPage() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [projectId, setProjectId] = useState("");
  const [submitted, setSubmitted] = useState({ q: "", tag: "", projectId: "" });
  const [ask, setAsk] = useState("");
  const [askResult, setAskResult] = useState<ChatGroundedReply | null>(null);

  const askMut = useMutation({
    mutationFn: async (question: string) => {
      if (!uid) throw new Error("로그인이 필요합니다.");
      return askConfirmedCorpus(uid, question, {
        projectId: projectId || undefined,
      });
    },
    onSuccess: (res) => setAskResult(res),
    onError: (err: Error) => toast.error(err.message),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags", uid],
    queryFn: () => listTags(uid!),
    enabled: !!uid,
  });
  const { data: projects = [] } = useQuery({
    queryKey: ["projects", uid],
    queryFn: () => listProjects(uid!),
    enabled: !!uid,
  });
  const { data: cases = [], isFetching } = useQuery({
    queryKey: ["library", uid, submitted],
    queryFn: () => listLibraryCases(uid!, submitted),
    enabled: !!uid,
  });

  const groups = useMemo(() => groupByProject(cases), [cases]);
  const filtered = Boolean(submitted.q || submitted.tag || submitted.projectId);

  function applyFilters(next: { q: string; tag: string; projectId: string }) {
    setSubmitted(next);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">자료실</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          확정된 회의록입니다. 질문하면 비슷한 주제의 회의가 나오고, 누르면 그 회의록으로 갑니다.
        </p>
      </div>

      <form
        className="flex flex-col gap-3 rounded-md border border-border bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const question = ask.trim();
          if (!question || askMut.isPending) return;
          askMut.mutate(question);
        }}
      >
        <label className="text-sm font-medium" htmlFor="library-ask">
          자료실에 묻기
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="library-ask"
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            placeholder="재직자훈련, 주말 집체처럼 주제로 물어보세요"
            className="flex-1"
            disabled={askMut.isPending}
          />
          <Button type="submit" disabled={!ask.trim() || askMut.isPending}>
            {askMut.isPending ? "찾는 중" : "비슷한 회의 찾기"}
          </Button>
        </div>
        {askMut.isPending ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            확정된 회의록에서 비슷한 주제를 고르고 있습니다.
          </p>
        ) : null}
        {askResult ? (
          <div className="flex flex-col gap-3 border-t border-border pt-3">
            <RelatedCases cases={askResult.relatedCases} />
            {askResult.answer ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{askResult.answer}</p>
            ) : null}
          </div>
        ) : null}
      </form>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters({ q, tag, projectId });
        }}
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="회의명, 개요, 지역, 조사자…"
            className="pl-10"
          />
        </div>
        {projects.length > 0 ? (
          <NativeSelect
            className="sm:w-52"
            value={projectId}
            onChange={(e) => {
              const next = e.target.value;
              setProjectId(next);
              applyFilters({ q, tag, projectId: next });
            }}
            aria-label="프로젝트"
          >
            <option value="">모든 프로젝트</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </NativeSelect>
        ) : null}
        <Button type="submit" disabled={isFetching}>
          {isFetching ? "찾는 중" : "검색"}
        </Button>
      </form>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            className={`h-8 rounded-full border px-3 text-xs ${
              tag === "" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
            }`}
            onClick={() => {
              setTag("");
              applyFilters({ q, tag: "", projectId });
            }}
          >
            전체
          </button>
          {tags.map((t) => (
            <button
              key={t.label}
              type="button"
              className={`h-8 rounded-full border px-3 text-xs tabular-nums ${
                tag === t.label
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card"
              }`}
              onClick={() => {
                const next = tag === t.label ? "" : t.label;
                setTag(next);
                applyFilters({ q, tag: next, projectId });
              }}
            >
              {t.label} {t.count}
            </button>
          ))}
        </div>
      ) : null}

      {cases.length === 0 ? (
        <EmptyState
          action={
            filtered ? undefined : (
              <Button asChild variant="outline" size="sm">
                <Link to="/upload" search={{ projectId: undefined }}>
                  새 녹취
                </Link>
              </Button>
            )
          }
        >
          {filtered
            ? "검색 조건에 맞는 회의록이 없습니다."
            : "확정된 회의록이 없습니다. 세션에서 확정하면 여기에 쌓습니다."}
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((group) => (
            <section key={group.projectId || group.projectTitle} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-serif text-lg font-semibold">{group.projectTitle}</h2>
                <span className="text-xs tabular-nums text-muted-foreground">{group.items.length}건</span>
              </div>
              <ul className="grid gap-3">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      to="/library/$sessionId"
                      params={{ sessionId: item.id }}
                      className="block"
                    >
                      <Card className="border-l-2 border-l-inju transition-colors hover:border-primary/40">
                        <CardContent className="flex flex-col gap-2 p-5">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {item.sessionKind} · {formatDateKo(item.sessionDate)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {[item.researcher, item.district, item.industry].filter(Boolean).join(" · ") ||
                              "조사 정보 미기재"}
                          </p>
                          {item.headline ? (
                            <p className="text-sm leading-relaxed text-ink-soft">{item.headline}</p>
                          ) : null}
                          {item.minutesOverview ? (
                            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                              {item.minutesOverview}
                            </p>
                          ) : null}
                          {item.tagLabels.length > 0 ? (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.tagLabels.map((label) => (
                                <span key={label} className="text-xs text-muted-foreground">
                                  #{label}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
