import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildQuotePackHtml, downloadHtml, downloadWordDoc } from "@/lib/minutes-export";
import { listTags, searchLibrary } from "@/lib/firebase-db";
import { useAuth } from "@/lib/auth-context";
import type { LibraryHit } from "@/lib/types";
import { formatDateKo } from "@/lib/utils";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

const KIND_LABEL = { excerpt: "인용", theme: "주제", fact: "사실" } as const;

function groupHits(hits: LibraryHit[]) {
  const map = new Map<string, LibraryHit[]>();
  for (const hit of hits) {
    const list = map.get(hit.sessionId) ?? [];
    list.push(hit);
    map.set(hit.sessionId, list);
  }
  return [...map.values()];
}

function LibraryPage() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [submitted, setSubmitted] = useState({ q: "", tag: "" });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags", uid],
    queryFn: () => listTags(uid!),
    enabled: !!uid,
  });
  const { data: hits = [], isFetching } = useQuery({
    queryKey: ["library", uid, submitted],
    queryFn: () => searchLibrary(uid!, submitted.q, submitted.tag || undefined),
    enabled: !!uid,
  });

  const groups = useMemo(() => groupHits(hits), [hits]);

  function exportPack(kind: "html" | "doc") {
    const html = buildQuotePackHtml({ query: submitted.q, tag: submitted.tag, hits });
    const name = `인용집${submitted.tag ? `-${submitted.tag}` : ""}${submitted.q ? `-${submitted.q}` : ""}`;
    if (kind === "html") downloadHtml(`${name}.html`, html);
    else downloadWordDoc(`${name}.doc`, html);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">자료실</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            확정된 주제, 인용, 사실만 검색합니다. 검색 결과는 인용집으로 내보낼 수 있습니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={hits.length === 0}
            onClick={() => exportPack("html")}
          >
            <Download className="size-4" />
            HTML
          </Button>
          <Button
            variant="outline"
            disabled={hits.length === 0}
            onClick={() => exportPack("doc")}
          >
            한글·Word
          </Button>
        </div>
      </div>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted({ q, tag });
        }}
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="재직자훈련, 주말 집체, MLOps…"
            className="pl-10"
          />
        </div>
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
              setSubmitted({ q, tag: "" });
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
                setSubmitted({ q, tag: next });
              }}
            >
              {t.label} {t.count}
            </button>
          ))}
        </div>
      ) : null}

      {hits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
          확정된 근거가 없거나, 검색어와 맞는 항목이 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((group) => {
            const first = group[0]!;
            return (
              <section key={first.sessionId} className="flex flex-col gap-3">
                <h2 className="font-serif text-lg font-semibold">
                  {first.sessionTitle}
                  <span className="ml-2 font-sans text-xs font-normal text-muted-foreground">
                    {first.projectTitle} · {formatDateKo(first.sessionDate)}
                  </span>
                </h2>
                <ul className="flex flex-col gap-3">
                  {group.map((hit) => (
                    <li key={`${hit.kind}-${hit.id}`}>
                      <Link
                        to="/sessions/$sessionId"
                        params={{ sessionId: hit.sessionId }}
                        className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{KIND_LABEL[hit.kind]}</Badge>
                          {hit.segmentCode ? (
                            <span className="font-mono text-xs text-muted-foreground">
                              {hit.segmentCode}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-2 font-serif text-lg font-semibold">{hit.title}</h3>
                        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                          {hit.body}
                        </p>
                        {hit.tags.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {hit.tags.map((label) => (
                              <span key={label} className="text-xs text-muted-foreground">
                                #{label}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
