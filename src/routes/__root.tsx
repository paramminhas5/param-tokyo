import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#050310", color: "#f0ece4", padding: "0 16px" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", fontFamily: "Space Mono, monospace", color: "#fbbf24" }}>404</h1>
        <p style={{ fontFamily: "Space Mono, monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,236,228,0.6)", marginTop: 12 }}>World not found</p>
        <Link to="/" style={{ display: "inline-block", marginTop: 24, fontFamily: "Space Mono, monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fbbf24", border: "2px solid #fbbf24", padding: "10px 20px", textDecoration: "none" }}>
          ← Back to start
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#050310", color: "#f0ece4", padding: "0 16px" }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <h1 style={{ fontFamily: "Space Mono, monospace", fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ff6b5b" }}>LOAD ERROR</h1>
        <p style={{ fontFamily: "Space Mono, monospace", fontSize: 10, color: "rgba(240,236,228,0.5)", marginTop: 12 }}>{error.message}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
          <button onClick={() => { router.invalidate(); reset(); }} style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", background: "#fbbf24", color: "#050310", border: "none", padding: "10px 16px", cursor: "pointer" }}>
            RETRY
          </button>
          <a href="/" style={{ fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0ece4", border: "1px solid rgba(240,236,228,0.3)", padding: "10px 16px", textDecoration: "none" }}>
            HOME
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Param Minhas — Founder & Operator" },
      { name: "description", content: "Param Minhas — 15 years of building across e-commerce, real estate, conversational AI, sneaker culture, and AI-native marketing." },
      { name: "author", content: "Param Minhas" },
      { name: "theme-color", content: "#050310" },
      { property: "og:title", content: "Param Minhas — Playable Résumé" },
      { property: "og:description", content: "15 years of building. Play the resume." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@paramminhas" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <MobileTouchHandler />
      </body>
    </html>
  );
}

/** Maps touch swipe to scroll — makes the game playable on mobile */
function MobileTouchHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let startY = 0;
    let startTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      const dt = Date.now() - startTime;
      if (Math.abs(dy) < 10) return; // tap, not swipe
      // Momentum: scale scroll distance by swipe speed
      const velocity = Math.abs(dy / dt); // px/ms
      const scrollAmt = dy * (1 + velocity * 2);
      window.scrollBy({ top: scrollAmt, behavior: "smooth" });
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
