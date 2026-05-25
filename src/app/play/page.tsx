import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play",
  description: "Param Minhas — playable résumé. Scroll through 9 worlds.",
};

/**
 * Placeholder for the cinematic 9-world experience.
 *
 * PR 2 wires the existing scroll-driven components (Intro, GlobalHero, WorldStage,
 * Hud, SkillBelt, MiniGame, WorldCard, WorldTransition, Outro) here.
 * PR 3 generates the pixel-art assets via FAL.
 */
export default function PlayPage() {
  return (
    <main
      className="game-chrome"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050310",
        padding: "0 16px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
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
          ◤ Loading worlds ◥
        </p>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
            color: "#f0ece4",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-display)",
            marginBottom: 14,
          }}
        >
          The cinematic version is being built.
        </h1>
        <p
          style={{
            color: "rgba(240,236,228,0.7)",
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          Nine pixel-art worlds. Spring-physics hero. Mini-games per chapter. Coming online next.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#fbbf24",
            border: "2px solid #fbbf24",
            textDecoration: "none",
          }}
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
