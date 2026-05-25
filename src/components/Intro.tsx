"use client";

import { useEffect, useState } from "react";
import { HERO, CHAPTERS } from "@/content/resume";
import { UI_ASSETS } from "@/game/journey";

const titleCard = UI_ASSETS.titleCard;
const paperBg = UI_ASSETS.paperBg;

/**
 * Cinematic title screen.
 * Title card fades in, scanlines overlay, "PRESS ↓" blinks, stats scroll in.
 */
export function Intro() {
  const [phase, setPhase] = useState<"black" | "card" | "content">("black");
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    // Sequence: black → card fade (600ms) → content (1200ms)
    const t1 = setTimeout(() => setPhase("card"), 400);
    const t2 = setTimeout(() => setPhase("content"), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 620);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.25rem 3rem",
        overflow: "hidden",
        backgroundImage: `url(${paperBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark base overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, rgba(10,10,20,0.45) 0%, rgba(10,10,20,0.85) 100%)",
        }}
      />

      {/* Scanlines */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)",
          pointerEvents: "none",
        }}
      />

      {/* CRT vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Title card */}
      <div
        style={{
          position: "relative",
          opacity: phase === "black" ? 0 : 1,
          transform: phase === "black" ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 700ms ease, transform 700ms ease",
          textAlign: "center",
          maxWidth: 680,
          width: "100%",
        }}
      >
        {/* Title card image */}
        <div style={{ marginBottom: 20, position: "relative", display: "inline-block" }}>
          <img
            src={titleCard}
            alt="Param Tokyo"
            style={{
              maxWidth: "min(420px, 90vw)",
              height: "auto",
              display: "block",
              margin: "0 auto",
              imageRendering: "auto",
              filter: "drop-shadow(0 12px 32px rgba(251,191,36,0.3)) drop-shadow(0 0 60px rgba(0,0,0,0.8))",
            }}
          />
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: phase === "content" ? 1 : 0,
            transform: phase === "content" ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 600ms 200ms ease, transform 600ms 200ms ease",
          }}
        >
          <p
            style={{
              fontFamily: "monospace", fontSize: 11,
              letterSpacing: "0.32em", textTransform: "uppercase",
              color: "#fbbf24", marginBottom: 8,
            }}
          >
            ◤ A Playable Résumé · {CHAPTERS.length} Worlds ◥
          </p>

          <h1
            style={{
              fontSize: "clamp(2rem, 7vw, 4.5rem)",
              lineHeight: 0.95,
              color: "#f0ece4",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              fontFamily: "var(--font-display, inherit)",
              marginBottom: 12,
            }}
          >
            {HERO.name}
          </h1>

          <p
            style={{
              fontFamily: "monospace", fontSize: 12,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#ff6b5b", marginBottom: 10,
            }}
          >
            {HERO.tagline}
          </p>

          <p
            style={{
              color: "rgba(240,236,228,0.75)",
              maxWidth: 500, margin: "0 auto 28px",
              lineHeight: 1.6, fontSize: 14,
            }}
          >
            {HERO.bio}
          </p>

          {/* Press to play */}
          <div style={{ marginBottom: 32 }}>
            <a
              href={`#${CHAPTERS[0].id}`}
              style={{
                display: "inline-block",
                padding: "14px 28px",
                fontFamily: "monospace",
                fontSize: 12,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                background: "rgba(10,10,20,0.92)",
                color: blink ? "#fbbf24" : "rgba(251,191,36,0.4)",
                border: "2px solid #fbbf24",
                boxShadow: "0 0 0 4px rgba(10,10,20,0.92), 0 0 0 5px rgba(251,191,36,0.35), 0 18px 40px rgba(0,0,0,0.7)",
                textDecoration: "none",
                transition: "color 200ms ease",
              }}
            >
              ▼ PRESS ↓ TO PLAY
            </a>
          </div>

          {/* Stat grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            {HERO.stats.slice(0, 6).map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "10px 8px",
                  border: "1px solid rgba(251,191,36,0.25)",
                  background: "rgba(10,10,20,0.7)",
                  opacity: phase === "content" ? 1 : 0,
                  transform: phase === "content" ? "translateY(0)" : "translateY(6px)",
                  transition: `opacity 400ms ${300 + i * 60}ms ease, transform 400ms ${300 + i * 60}ms ease`,
                }}
              >
                <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#fbbf24", letterSpacing: "0.02em" }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,236,228,0.55)", marginTop: 3 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Initial black screen */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          background: "#050310",
          opacity: phase === "black" ? 1 : 0,
          transition: "opacity 400ms ease",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
