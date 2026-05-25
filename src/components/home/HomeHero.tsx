"use client";

import Link from "next/link";
import { useState } from "react";
import { HERO } from "@/content/resume";
import { UI_ASSETS } from "@/game/journey";
import { HirePanel } from "../HirePanel";

/**
 * Premium landing hero. Big display title, tagline, three primary actions.
 * Uses the title-card PNG as a behind-the-text glow accent (Olly Moss tip).
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
        padding: "clamp(4rem, 10vw, 8rem) 1.25rem 4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.10) 0%, transparent 65%), #050310",
      }}
    >
      {/* Background poster echo */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "32%",
          transform: "translate(-50%, -50%)",
          width: "min(720px, 110vw)",
          opacity: 0.10,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      >
        <img
          src={UI_ASSETS.titleCard}
          alt=""
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(240,236,228,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(240,236,228,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 880, width: "100%", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "#fbbf24",
            marginBottom: 28,
          }}
        >
          ◤ A Playable Résumé · 9 Worlds · 15 Years ◥
        </p>

        <h1
          style={{
            fontSize: "clamp(2.75rem, 9vw, 6.5rem)",
            lineHeight: 0.92,
            color: "#f0ece4",
            fontWeight: 700,
            letterSpacing: "-0.035em",
            fontFamily: "var(--font-display)",
            marginBottom: 18,
          }}
        >
          {HERO.name}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.75rem, 1.4vw, 0.95rem)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#ff6b5b",
            marginBottom: 16,
          }}
        >
          {HERO.tagline}
        </p>

        <p
          style={{
            color: "rgba(240,236,228,0.78)",
            maxWidth: 580,
            margin: "0 auto 40px",
            lineHeight: 1.65,
            fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
          }}
        >
          {HERO.bio}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
            marginBottom: 56,
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

        {/* Stat strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 1,
            maxWidth: 720,
            margin: "0 auto",
            border: "1px solid rgba(251,191,36,0.18)",
            background: "rgba(251,191,36,0.18)",
          }}
        >
          {HERO.stats.map((s) => (
            <div
              key={s.label}
              style={{
                padding: "16px 12px",
                background: "#0a0814",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
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
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(240,236,228,0.55)",
                  marginTop: 6,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 36,
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

      <HirePanel open={hireOpen} onClose={() => setHireOpen(false)} />
    </section>
  );
}

/** Chunky pixel button with corner notches. Three visual variants. */
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
    padding: "14px 26px",
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

  const inner = (
    <>
      {children}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -2,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 0 0, currentColor 2px, transparent 2px) 0 0/100% 100% no-repeat, radial-gradient(circle at 100% 0, currentColor 2px, transparent 2px) 0 0/100% 100% no-repeat, radial-gradient(circle at 0 100%, currentColor 2px, transparent 2px) 0 0/100% 100% no-repeat, radial-gradient(circle at 100% 100%, currentColor 2px, transparent 2px) 0 0/100% 100% no-repeat",
          color: variant === "primary" ? "#050310" : "#fbbf24",
          opacity: 0.35,
        }}
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} style={styles}>
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} type="button" style={styles}>
      {inner}
    </button>
  );
}
