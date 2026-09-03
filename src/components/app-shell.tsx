import { Link, useRouterState } from "@tanstack/react-router";
import { FilePlus2, FolderOpen, Library, UserRound, LogIn, LogOut } from "lucide-react";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { to: "/", label: "조사", icon: FolderOpen, match: "home" as const },
  { to: "/library", label: "자료실", icon: Library, match: "library" as const },
  { to: "/upload", label: "새 녹취", icon: FilePlus2, match: "upload" as const },
] as const;

function navActive(pathname: string, match: (typeof NAV)[number]["match"]) {
  if (match === "home") return pathname === "/" || pathname.startsWith("/projects") || pathname.startsWith("/sessions");
  if (match === "library") return pathname.startsWith("/library");
  return pathname.startsWith("/upload");
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const wide = pathname.startsWith("/sessions/");
  const { user, login, logout, loading } = useAuth();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className={cn("mx-auto flex h-14 items-center justify-between gap-3 px-4", wide ? "max-w-7xl" : "max-w-6xl")}>
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                <rect x="3" y="2" width="10" height="12" rx="1" fill="currentColor" opacity="0.25" />
                <rect x="5" y="5" width="6" height="1.2" rx="0.4" fill="currentColor" />
                <rect x="5" y="7.5" width="6" height="1.2" rx="0.4" fill="currentColor" />
                <rect x="5" y="10" width="4" height="1.2" rx="0.4" fill="currentColor" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-sm leading-none font-semibold tracking-tight">
                현장베이스
              </span>
              <span className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                기업 현장조사 근거 노트
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => {
                const active = navActive(pathname, item.match);
                const Icon = item.icon;
                return item.to === "/upload" ? (
                  <Link
                    key={item.to}
                    to="/upload"
                    search={{ projectId: undefined }}
                    className={cn(
                      "inline-flex h-11 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground" : "text-ink-soft hover:bg-muted",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "inline-flex h-11 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground" : "text-ink-soft hover:bg-muted",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={logout}
              >
                <LogOut className="size-4 mr-1.5" />
                <span className="hidden max-w-28 truncate sm:inline">
                  {user.displayName || "로그아웃"}
                </span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                disabled={loading}
              >
                <LogIn className="size-4 mr-1.5" />
                Google 로그인
              </Button>
            )}
          </div>
        </div>
      </header>

      <div
        className={cn(
          "mx-auto px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-16",
          wide ? "max-w-7xl" : "max-w-6xl",
        )}
      >
        {user ? children : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UserRound className="size-16 text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">로그인이 필요합니다</h2>
            <p className="text-muted-foreground mb-6">현장베이스를 사용하려면 Google 계정으로 로그인해주세요.</p>
            <Button onClick={login} size="lg">
              <LogIn className="size-4 mr-2" />
              Google 로그인
            </Button>
          </div>
        )}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
        <div className="grid grid-cols-3">
          {NAV.map((item) => {
            const active = navActive(pathname, item.match);
            const Icon = item.icon;
            const className = cn(
              "flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
              active ? "text-primary" : "text-muted-foreground",
            );
            return item.to === "/upload" ? (
              <Link key={item.to} to="/upload" search={{ projectId: undefined }} className={className}>
                <Icon className="size-5" />
                {item.label}
              </Link>
            ) : (
              <Link key={item.to} to={item.to} className={className}>
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
