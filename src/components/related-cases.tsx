import { Link } from "@tanstack/react-router";
import type { RelatedCase } from "@/lib/types";
import { formatDateKo } from "@/lib/utils";

export function RelatedCases({
  cases,
  onOpen,
}: {
  cases: RelatedCase[];
  onOpen?: () => void;
}) {
  if (cases.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">비슷한 주제의 회의</p>
      <ul className="flex flex-col gap-2">
        {cases.map((item) => (
          <li key={item.sessionId}>
            <Link
              to="/library/$sessionId"
              params={{ sessionId: item.sessionId }}
              onClick={onOpen}
              className="block rounded-md border border-border border-l-2 border-l-inju bg-card px-3 py-2.5 pl-3 transition-colors hover:border-primary/40"
            >
              <p className="font-serif text-sm font-semibold">{item.sessionTitle}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.projectTitle}
                {item.sessionDate ? ` · ${formatDateKo(item.sessionDate)}` : ""}
              </p>
              {item.reason ? (
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{item.reason}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
