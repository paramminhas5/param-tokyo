import Link from "next/link";
import type { Metadata } from "next";
import { HERO } from "@/content/resume";

export const metadata: Metadata = {
  title: "Param Minhas — Founder & Operator",
  description: HERO.tagline,
};

/**
 * Holding-pattern homepage for the Next.js migration (PR 1).
 *
 * PR 2 replaces this with the full premium one-pager landing.
 * Deliberately minimal but on-brand so the migration ships green.
 */
export default function HomePage() {
  return (
    <main
      className="game-chrome"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.25rem 3rem",
        background: "#050310",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.18) 0%, transparent 60%)",
        }}
      />

      <div style={{ position: "relative", maxWidth: 640, width: "100%", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#fbbf24",
            marginBottom: 16,
          }}
        >
          ◤ A Playable Résumé · 9 Worlds ◥
        </p>

        <h1
          style={{
            fontSize: "clamp(2.25rem, 7vw, 4.75rem)",
            lineHeight: 0.95,
            color: "#f0ece4",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            fontFamily: "var(--font-display)",
            marginBottom: 12,
          }}
        >
          {HERO.name}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#ff6b5b",
            marginBottom: 14,
          }}
        >
          {HERO.tagline}
        </p>

        <p
          style={{
            color: "rgba(240,236,228,0.75)",
            maxWidth: 520,
            margin: "0 auto 36px",
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          {HERO.bio}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
            marginBottom: 40,
          }}
        >
          <Link
            href="/play"
            style={{
              padding: "12px 24px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              background: "#fbbf24",
              color: "#050310",
              border: "2px solid #fbbf24",
              boxShadow:
                "0 0 0 4px rgba(10,10,20,0.92), 0 0 0 5px rgba(251,191,36,0.35), 0 18px 40px rgba(0,0,0,0.7)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ▶ Play the résumé
          </Link>
          <Link
            href="/cv"
            style={{
              padding: "12px 24px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#f0ece4",
              border: "2px solid rgba(240,236,228,0.3)",
              textDecoration: "none",
            }}
          >
            ⬇ Read the CV
          </Link>
          <a
            href={`mailto:${HERO.email}`}
            style={{
              padding: "12px 24px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#fbbf24",
              border: "2px solid rgba(251,191,36,0.5)",
              textDecoration: "none",
            }}
          >
            ✉ Hire
          </a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          {HERO.stats.slice(0, 6).map((s) => (
            <div
              key={s.label}
              style={{
                padding: "10px 8px",
                border: "1px solid rgba(251,191,36,0.25)",
                background: "rgba(10,10,20,0.7)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fbbf24",
                  letterSpacing: "0.02em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(240,236,228,0.55)",
                  marginTop: 3,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 48,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.4)",
          }}
        >
          {HERO.location}
        </p>
      </div>
    </main>
  );
}
