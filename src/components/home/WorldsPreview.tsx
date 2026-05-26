"use client";

import Link from "next/link";
import { CHAPTERS } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * Horizontal scrollable chapter cards — links to /play#worldId
 */
export function WorldsPreview() {
  return (
    <section
      style={{
        padding: "80px 0",
        borderTop: "1px solid rgba(240, 236, 228, 0.06)",
      }}
    >
      <div style={{ padding: "0 clamp(24px, 8vw, 120px)", marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 3vw, 32px)",
            fontWeight: 600,
            color: "#f0ece4",
            marginBottom: 8,
          }}
        >
          The Journey
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.12em",
            color: "rgba(240, 236, 228, 0.4)",
          }}
        >
          9 chapters. 15 years. Scroll sideways or click to explore.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          padding: "0 clamp(24px, 8vw, 120px) 24px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {CHAPTERS.map((ch) => {
          const world = WORLDS[ch.id];
          return (
            <Link
              key={ch.id}
              href={`/play#${ch.id}`}
              style={{
                flexShrink: 0,
                width: "clamp(240px, 28vw, 320px)",
                scrollSnapAlign: "start",
                textDecoration: "none",
                position: "relative",
                overflow: "hidden",
                background: world?.ink ?? "#1a1a2e",
                border: `1px solid ${world?.accent ?? "#333"}22`,
                transition: "border-color 300ms, transform 200ms",
              }}
            >
              {/* Poster image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  backgroundImage: `url(${world?.poster})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.7,
                }}
              />
              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "40px 16px 16px",
                  background: `linear-gradient(180deg, transparent 0%, ${world?.ink ?? "#1a1a2e"}ee 60%)`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: world?.accent ?? "#fbbf24",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  {String(ch.index).padStart(2, "0")} · {ch.year}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#f0ece4",
                    marginBottom: 4,
                  }}
                >
                  {ch.org}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "rgba(240, 236, 228, 0.5)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {ch.role}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
