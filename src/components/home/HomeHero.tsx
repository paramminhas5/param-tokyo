"use client";

import Link from "next/link";
import { useState } from "react";
import { HERO } from "@/content/resume";
import { UI_ASSETS } from "@/game/journey";
import { HirePanel } from "../HirePanel";

/**
 * Premium landing hero. Magazine-cover layout — title poster on the left as the
 * primary visual, name/tagline/CTAs on the right. Stacks vertically on mobile.
 *
 * Intentionally quieter than /play — no scanlines, no vignette, no auto-anim
 * sequencing. The point is to let the user choose where to go.
 */
export function HomeHero() {
  const [hireOpen, setHireOpen] = useState(false);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "clamp(5rem, 10vw, 8rem) 1.25rem 4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 25% 30%, rgba(251,191,36,0.10) 0%, transparent 60%), " +
          "radial-gradient(ellipse at 75% 70%, rgba(232,67,147,0.08) 0%, transparent 55%), " +
          "#050310",
      }}
    >
      {/* Subtle grid overlay (faint architectural feel) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(240,236,228,0.025) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(240,236,228,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1100,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.15fr)",
          gap: "clamp(2rem, 5vw, 4rem)",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* LEFT — Title poster */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "relative",
              aspectRatio: "5 / 6",
              padding: 8,
              background: "rgba(10,10,20,0.7)",
              border: "2px solid rgba(251,191,36,0.6)",
              boxShadow:
                "0 0 0 4px rgba(5,3,16,0.92), 0 0 0 5px rgba(251,191,36,0.25), 0 36px 80px rgba(0,0,0,0.7)",
            }}
          >
            <img
              src={UI_ASSETS.titleCard}
              alt="Param Tokyo — title poster"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                imageRendering: "pixelated",
                display: "block",
              }}
            />
            {/* Scanlines pass over the poster only */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 8,
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
                pointerEvents: "none",
                mixBlendMode: "multiply",
              }}
            />
            {/* Corner pixel notches */}
            {(["topL", "topR", "botL", "botR"] as const).map((c) => (
              <span
                key={c}
                aria-hidden
                style={{
                  position: "absolute",
                  width: 12,
                  height: 12,
                  background: "#fbbf24",
                  ...(c.startsWith("top") ? { top: -2 } : { bottom: -2 }),
                  ...(c.endsWith("L") ? { left: -2 } : { right: -2 }),
                }}
              />
            ))}
          </div>
          <p
            style={{
              marginTop: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(240,236,228,0.55)",
              textAlign: "center",
            }}
          >
            ◤ A Playable Résumé · 9 Worlds · 15 Years ◥
          </p>
        </div>

        {/* RIGHT — Title + CTAs */}
        <div>
          <h1
            style={{
              fontSize: "clamp(2.75rem, 8vw, 6rem)",
              lineHeight: 0.92,
              color: "#f0ece4",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              fontFamily: "var(--font-display)",
              marginBottom: 14,
            }}
          >
            {HERO.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#ff6b5b",
              marginBottom: 18,
            }}
          >
            {HERO.tagline}
          </p>

          <p
            style={{
              color: "rgba(240,236,228,0.78)",
              maxWidth: 580,
              marginBottom: 32,
              lineHeight: 1.65,
              fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)",
            }}
          >
            {HERO.bio}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 36,
            }}
          >
            <PixelButton href="/play" variant="primary">
              ▶ Play the résumé
            </PixelButton>
            <PixelButton href="/cv" variant="ghost">
              ⬇ Read the CV
            </PixelButton>
            <PixelButton onClick={() => setHireOpen(true)} variant="outline">
              ✉ Hire me
            </PixelButton>
          </div>

          {/* Compact stat strip — 6 stats in a tight grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 1,
              maxWidth: 580,
              border: "1px solid rgba(251,191,36,0.18)",
              background: "rgba(251,191,36,0.18)",
            }}
          >
            {HERO.stats.map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "12px 10px",
                  background: "#0a0814",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fbbf24",
                    letterSpacing: "0.01em",
                    lineHeight: 1.1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: "var(--font-mono)",
                    fontSize: 8,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(240,236,228,0.55)",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              marginTop: 24,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(240,236,228,0.4)",
            }}
          >
            ↓ Scroll · {HERO.location}
          </p>
        </div>
      </div>

      <HirePanel open={hireOpen} onClose={() => setHireOpen(false)} />

      <style>{`
        @media (max-width: 760px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: left;
          }
          .hero-grid > div:first-child {
            max-width: 320px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}

function PixelButton({
  href,
  onClick,
  children,
  variant,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant: "primary" | "ghost" | "outline";
}) {
  const base = {
    padding: "13px 24px",
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.24em",
    textTransform: "uppercase" as const,
    fontWeight: 700,
    textDecoration: "none",
    cursor: "pointer",
    border: "2px solid",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    display: "inline-block",
    position: "relative" as const,
  };

  const styles =
    variant === "primary"
      ? {
          ...base,
          background: "#fbbf24",
          color: "#050310",
          borderColor: "#fbbf24",
          boxShadow:
            "0 0 0 4px rgba(10,10,20,0.92), 0 0 0 5px rgba(251,191,36,0.4), 0 16px 36px rgba(0,0,0,0.6)",
        }
      : variant === "outline"
        ? {
            ...base,
            background: "transparent",
            color: "#fbbf24",
            borderColor: "rgba(251,191,36,0.6)",
          }
        : {
            ...base,
            background: "transparent",
            color: "#f0ece4",
            borderColor: "rgba(240,236,228,0.3)",
          };

  if (href) {
    return (
      <Link href={href} style={styles}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} type="button" style={styles}>
      {children}
    </button>
  );
}
