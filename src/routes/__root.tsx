import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AuthProvider as FirebaseAuthProvider } from "@/lib/auth-context";
import { AuthProvider } from "@/lib/auth/provider";
import { queryClient } from "@/lib/query-client";
import appCss from "../styles.css?url";

const APP_NAME = "현장베이스";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content: "기업 현장조사 녹취를 주제 구조와 회의록으로 정리하고 근거로 쌓습니다.",
      },
      { name: "theme-color", content: "#2f4f45" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600&family=Noto+Serif+KR:wght@500;600;700&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="ko" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <FirebaseAuthProvider>
            <QueryClientProvider client={queryClient}>
              <AppShell>
                <Outlet />
              </AppShell>
              <Toaster
                position="bottom-center"
                toastOptions={{
                  className: "font-sans",
                }}
              />
            </QueryClientProvider>
          </FirebaseAuthProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
