"use client";

import Link from "next/link";
import { HERO, CHAPTERS } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * Outro — the final screen after all 9 worlds.
 *
 * Shows:
 * - All 9 skill pills collected
 * - Key stats as large numbers
 * - Contact CTAs
 * - Links
 */
export function Outro() {
  return (
    <section
      id="outro"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(160deg, #0a0a1e 0%, #050310 100%)",
        padding: "80px clamp(24px, 8vw, 80px) 80px",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 20% 50%, rgba(251,191,36,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 50%, rgba(34,211,238,0.03) 0%, transparent 60%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Decorative line */}
      <div
        style={{
          width: 1,
          height: 60,
          background: "linear-gradient(180deg, rgba(251,191,36,0.4), transparent)",
          marginBottom: 40,
        }}
      />

      {/* Heading */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 600,
          color: "#f0ece4",
          textAlign: "center",
          marginBottom: 12,
          lineHeight: 1.1,
        }}
      >
        That&apos;s the journey so far.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(14px, 1.6vw, 18px)",
          color: "rgba(240,236,228,0.45)",
          textAlign: "center",
          maxWidth: 500,
          lineHeight: 1.65,
          marginBottom: 48,
        }}
      >
        {HERO.bio}
      </p>

      {/* Skills collected */}
      <div style={{ marginBottom: 52, textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.25)",
            marginBottom: 16,
          }}
        >
          Skills collected
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            maxWidth: 600,
          }}
        >
          {CHAPTERS.map((ch) => {
            const accent = WORLDS[ch.id]?.accent ?? ch.skill.color;
            return (
              <span
                key={ch.id}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: accent,
                  padding: "6px 14px",
                  background: `${accent}0e`,
                  border: `1px solid ${accent}33`,
                  boxShadow: `0 0 14px ${accent}10`,
                }}
              >
                {ch.skill.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(20px, 4vw, 48px)",
          justifyContent: "center",
          marginBottom: 52,
        }}
      >
        {HERO.stats.map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 4vw, 38px)",
                fontWeight: 700,
                color: "#f0ece4",
                lineHeight: 1,
                marginBottom: 5,
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
                color: "rgba(240,236,228,0.38)",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 36,
        }}
      >
        <a
          href={`mailto:${HERO.email}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "14px 28px",
            color: "#050310",
            background: "#f0ece4",
            textDecoration: "none",
          }}
        >
          Get in touch
        </a>
        <Link
          href="/cv"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "14px 28px",
            color: "#f0ece4",
            background: "transparent",
            border: "1px solid rgba(240,236,228,0.22)",
            textDecoration: "none",
          }}
        >
          View full CV
        </Link>
      </div>

      {/* Social links */}
      <div style={{ display: "flex", gap: 20 }}>
        {Object.entries(HERO.links).map(([key, url]) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "capitalize",
              color: "rgba(240,236,228,0.3)",
              textDecoration: "none",
              transition: "color 200ms",
            }}
          >
            {key}
          </a>
        ))}
      </div>

      {/* Footer note */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.18em",
          color: "rgba(240,236,228,0.14)",
          whiteSpace: "nowrap",
        }}
      >
        Param Tokyo · Built with scroll-driven parallax · {new Date().getFullYear()}
      </div>
    </section>
  );
}
