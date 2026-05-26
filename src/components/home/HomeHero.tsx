"use client";

import Link from "next/link";
import { HERO } from "@/content/resume";

/**
 * Landing hero — cinematic, confident, aspirational.
 * Inspired by game menu screens. Big name, clear CTAs.
 */
export function HomeHero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(24px, 8vw, 120px)",
        overflow: "hidden",
      }}
    >
      {/* Multi-layered ambient background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 70% 50%, rgba(251, 191, 36, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 20% 80%, rgba(34, 211, 238, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse 40% 40% at 80% 20%, rgba(236, 72, 153, 0.02) 0%, transparent 50%)
          `,
          animation: "hero-ambient 12s ease-in-out infinite alternate",
        }}
      />

      {/* Decorative grid overlay — very subtle */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(240, 236, 228, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240, 236, 228, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
        {/* Location tag */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(240, 236, 228, 0.35)",
            marginBottom: 24,
          }}
        >
          {HERO.location}
        </div>

        {/* Name — biggest element, draws the eye */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 9vw, 96px)",
            fontWeight: 700,
            color: "#f0ece4",
            lineHeight: 0.95,
            marginBottom: 20,
            letterSpacing: "-0.02em",
          }}
        >
          {HERO.name}
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(18px, 2.8vw, 30px)",
            fontWeight: 400,
            color: "rgba(240, 236, 228, 0.65)",
            lineHeight: 1.35,
            marginBottom: 12,
          }}
        >
          {HERO.tagline}
        </p>

        {/* Bio */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(14px, 1.5vw, 16px)",
            color: "rgba(240, 236, 228, 0.4)",
            lineHeight: 1.7,
            maxWidth: 540,
            marginBottom: 44,
          }}
        >
          {HERO.bio}
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 64 }}>
          <Link
            href="/play"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "16px 36px",
              color: "#050310",
              background: "#f0ece4",
              textDecoration: "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            Experience the Journey
          </Link>
          <Link
            href="/cv"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "16px 36px",
              color: "#f0ece4",
              border: "1px solid rgba(240, 236, 228, 0.2)",
              textDecoration: "none",
            }}
          >
            Download CV
          </Link>
        </div>

        {/* Stats — horizontal strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            gap: 1,
            background: "rgba(240, 236, 228, 0.06)",
            border: "1px solid rgba(240, 236, 228, 0.06)",
          }}
        >
          {HERO.stats.map((s) => (
            <div
              key={s.label}
              style={{
                padding: "20px 16px",
                background: "#050310",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  fontWeight: 600,
                  color: "#f0ece4",
                  marginBottom: 4,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  color: "rgba(240, 236, 228, 0.35)",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes hero-ambient {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </section>
  );
}
