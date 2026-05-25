"use client";

import Link from "next/link";
import { CHAPTERS, SKILLS } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * Horizontal-scrolling chapter card strip.
 *
 * Each card uses the FAL-generated Olly-Moss-poster as its primary visual —
 * a single image-per-card composition, much cleaner than the prior bg+fg
 * composite. Click → /play#worldId scrolls into the corresponding section.
 *
 * Mobile: native horizontal scroll with snap.
 * Desktop: same strip, fits more cards per viewport.
 */
export function WorldsPreview() {
  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(4rem, 8vw, 6rem) 0",
        background: "#0a0814",
        borderTop: "1px solid rgba(240,236,228,0.06)",
        borderBottom: "1px solid rgba(240,236,228,0.06)",
      }}
    >
      <SectionHeader
        kicker={`${CHAPTERS.length} Worlds · Click to enter`}
        title="Pick a chapter."
        sub="Each is a self-contained world with its own art, music, and miniature challenge. The hero walks through it as you scroll."
      />

      <div
        style={{
          marginTop: 36,
          paddingLeft: "clamp(1rem, 5vw, 4rem)",
          paddingRight: "clamp(1rem, 5vw, 4rem)",
          display: "flex",
          gap: 18,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 24,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(251,191,36,0.4) rgba(255,255,255,0.05)",
        }}
      >
        {CHAPTERS.map((c) => {
          const w = WORLDS[c.id] ?? WORLDS.origin;
          const earnedSkill = SKILLS[c.skill];
          return (
            <Link
              key={c.id}
              href={`/play#${c.id}`}
              style={{
                position: "relative",
                flex: "0 0 auto",
                width: "min(280px, 78vw)",
                aspectRatio: "3 / 4",
                scrollSnapAlign: "start",
                background: "#000",
                border: `2px solid ${w.accent}`,
                color: "#f0ece4",
                textDecoration: "none",
                overflow: "hidden",
                boxShadow: "0 14px 38px rgba(0,0,0,0.55)",
              }}
            >
              {/* Poster art */}
              <img
                src={w.poster}
                alt={`${c.org} poster`}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  imageRendering: "pixelated",
                }}
              />

              {/* Vignette + scanlines pass */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(10,10,20,0.5) 0%, transparent 30%, transparent 55%, rgba(10,10,20,0.96) 100%)",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
                  pointerEvents: "none",
                  mixBlendMode: "multiply",
                }}
              />

              {/* Top label row */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  right: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: w.accent, fontWeight: 700 }}>
                  World {String(c.index).padStart(2, "0")}
                </span>
                <span style={{ color: "rgba(240,236,228,0.7)" }}>{c.year}</span>
              </div>

              {/* Bottom info panel */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "16px 16px 18px",
                }}
              >
                <h3
                  style={{
                    fontSize: 20,
                    lineHeight: 1.05,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    fontFamily: "var(--font-display)",
                    color: "#f0ece4",
                  }}
                >
                  {c.org}
                </h3>
                <p
                  style={{
                    marginTop: 4,
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(240,236,228,0.55)",
                  }}
                >
                  {c.role}
                </p>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: w.accent,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      background: w.accent,
                    }}
                  />
                  {earnedSkill.name} · enter →
                </div>
              </div>

              {/* Corner pixel notches */}
              {(["topL", "topR", "botL", "botR"] as const).map((corner) => (
                <span
                  key={corner}
                  aria-hidden
                  style={{
                    position: "absolute",
                    width: 8,
                    height: 8,
                    background: w.accent,
                    ...(corner.startsWith("top") ? { top: 4 } : { bottom: 4 }),
                    ...(corner.endsWith("L") ? { left: 4 } : { right: 4 }),
                    opacity: 0.85,
                  }}
                />
              ))}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function SectionHeader({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "0 clamp(1rem, 5vw, 4rem)",
        textAlign: "left",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "#fbbf24",
        }}
      >
        ◤ {kicker} ◥
      </p>
      <h2
        style={{
          marginTop: 12,
          fontSize: "clamp(1.85rem, 5vw, 3.25rem)",
          lineHeight: 1.05,
          color: "#f0ece4",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          fontFamily: "var(--font-display)",
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            marginTop: 12,
            color: "rgba(240,236,228,0.7)",
            fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)",
            lineHeight: 1.6,
            maxWidth: 640,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
