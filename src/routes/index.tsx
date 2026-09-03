import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/status-badge";
import { NativeSelect } from "@/components/native-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProject, listProjects, listSessions } from "@/lib/firebase-db";
import { PROJECT_KINDS } from "@/lib/types";
import { formatDateKo } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user } = useAuth();
  const uid = user?.uid;
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery({
    queryKey: ["projects", uid],
    queryFn: () => listProjects(uid!),
    enabled: !!uid,
  });
  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", uid],
    queryFn: () => listSessions(uid!),
    enabled: !!uid,
  });

  const confirmed = sessions.filter((s) => s.status === "confirmed").length;
  const drafts = sessions.filter((s) => s.status !== "confirmed").length;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">
            서울 현장조사
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            녹취를 근거로 남깁니다
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            화자가 정리된 텍스트를 올리면, 이번 대화에서 나온 주제로 회의록 초안을 만들고
            확정본만 자료실에 쌓습니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            프로젝트
          </Button>
          <Button asChild>
            <Link to="/upload" search={{ projectId: undefined }}>
              새 녹취
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {[
          { label: "프로젝트", value: projects.length },
          { label: "확정", value: confirmed },
          { label: "초안·원문", value: drafts },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-lg">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-serif text-2xl font-semibold tabular-nums">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-semibold">프로젝트</h2>
        </div>
        {projects.length === 0 ? (
          <Empty label="아직 프로젝트가 없습니다." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((p) => (
              <Link key={p.id} to="/projects/$projectId" params={{ projectId: p.id }}>
                <Card className="h-full rounded-lg transition-colors hover:border-primary/40">
                  <CardContent className="flex h-full flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {p.year ?? "연도 미정"} · {p.kind}
                        </p>
                        <h3 className="mt-1 font-serif text-lg font-semibold">{p.title}</h3>
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {p.confirmedCount}/{p.sessionCount}
                      </span>
                    </div>
                    {p.description ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl font-semibold">최근 인터뷰</h2>
        {sessions.length === 0 ? (
          <Empty label="업로드된 녹취가 없습니다." />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {sessions.slice(0, 8).map((s) => (
              <li key={s.id}>
                <Link
                  to="/sessions/$sessionId"
                  params={{ sessionId: s.id }}
                  className="flex flex-col gap-1 px-4 py-3.5 transition-colors hover:bg-muted/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.projectTitle} · {s.sessionKind} · {formatDateKo(s.sessionDate)}
                      {s.headline ? ` · ${s.headline}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {uid ? (
        <CreateProjectDialog
          uid={uid}
          open={open}
          onOpenChange={setOpen}
          onCreated={async () => {
            await qc.invalidateQueries({ queryKey: ["projects", uid] });
          }}
        />
      ) : null}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function CreateProjectDialog({
  uid,
  open,
  onOpenChange,
  onCreated,
}: {
  uid: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("2026");
  const [kind, setKind] = useState("심층조사");
  const [description, setDescription] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      createProject(uid, {
        title,
        year: year ? Number(year) : null,
        kind,
        description,
      }),
    onSuccess: async () => {
      toast.success("프로젝트를 만들었습니다.");
      setTitle("");
      setDescription("");
      onOpenChange(false);
      await onCreated();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 프로젝트</DialogTitle>
          <DialogDescription>연도·유형으로 조사 단위를 나눕니다.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ptitle">이름</Label>
            <Input
              id="ptitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="2026년 AI 산업 심층조사"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pyear">연도</Label>
              <Input
                id="pyear"
                inputMode="numeric"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pkind">유형</Label>
              <NativeSelect
                id="pkind"
                value={kind}
                onChange={(e) => setKind(e.target.value)}
              >
                {PROJECT_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pdesc">설명</Label>
            <Textarea
              id="pdesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "만드는 중" : "만들기"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
