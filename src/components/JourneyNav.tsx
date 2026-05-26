"use client";

import { useProgress } from "@/game/progress";
import { CHAPTERS } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * Minimal vertical dot navigation — fixed right side.
 * Elegant, unobtrusive. Expands to show chapter name on active world.
 */
export function JourneyNav() {
  const { worldIndex, totalProgress } = useProgress();

  return (
    <>
      {/* Right-side dots */}
      <nav
        aria-label="Journey navigation"
        style={{
          position: "fixed",
          right: "clamp(12px, 2vw, 28px)",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
          zIndex: 50,
          opacity: worldIndex >= 0 ? 1 : 0,
          transition: "opacity 500ms ease",
        }}
      >
        {CHAPTERS.map((ch, i) => {
          const world = WORLDS[ch.id];
          const active = i === worldIndex;
          return (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              aria-label={`${ch.org} — ${ch.year}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
              }}
            >
              {/* Label — only shows on active */}
              {active && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    color: "rgba(240, 236, 228, 0.5)",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    animation: "nav-fade-in 300ms ease-out",
                  }}
                >
                  {ch.org}
                </span>
              )}
              {/* Dot */}
              <div
                style={{
                  width: active ? 8 : 4,
                  height: active ? 8 : 4,
                  borderRadius: "50%",
                  background: active ? (world?.accent ?? "#f0ece4") : "rgba(240, 236, 228, 0.2)",
                  transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: active ? `0 0 10px ${world?.accent}88` : "none",
                  flexShrink: 0,
                }}
              />
            </a>
          );
        })}
      </nav>

      {/* Top-left world indicator */}
      {worldIndex >= 0 && worldIndex < CHAPTERS.length && (
        <div
          style={{
            position: "fixed",
            top: "clamp(16px, 3vh, 24px)",
            left: "clamp(16px, 3vw, 32px)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "rgba(240, 236, 228, 0.4)",
              textTransform: "uppercase",
            }}
          >
            {String(worldIndex + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
          </div>
        </div>
      )}

      {/* Overall progress bar — very thin, top of screen */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 60,
          background: "rgba(240, 236, 228, 0.05)",
          opacity: worldIndex >= 0 ? 1 : 0,
          transition: "opacity 500ms ease",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${totalProgress * 100}%`,
            background: "rgba(240, 236, 228, 0.25)",
            transition: "width 100ms linear",
          }}
        />
      </div>

      <style>{`
        @keyframes nav-fade-in {
          from { opacity: 0; transform: translateX(4px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
