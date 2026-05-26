import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Easter Egg",
  description: "You found the hidden world.",
  robots: { index: false },
};

/**
 * Easter egg page — preserves a reference to the old Pokemon-style game.
 * Hidden, not indexed. A nod to the original build.
 */
export default function LegacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#050310",
        color: "#f0ece4",
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "rgba(251, 191, 36, 0.6)",
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        You found the hidden world
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        The Original Build
      </h1>

      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 15,
          color: "rgba(240, 236, 228, 0.5)",
          maxWidth: 400,
          lineHeight: 1.7,
          marginBottom: 8,
        }}
      >
        This resume was first built as a Pokemon-style pixel art game with NPCs,
        skill pickups, and mini-games. Those sprites still live in the assets folder —
        a record of iteration.
      </p>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "rgba(240, 236, 228, 0.3)",
          marginBottom: 32,
          letterSpacing: "0.1em",
        }}
      >
        v0 → v1: from pixel art to atmospheric narrative.
      </p>

      {/* Show some of the old assets */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          maxWidth: 400,
          width: "100%",
          marginBottom: 40,
        }}
      >
        {["origin", "grp", "hab", "octo", "solesearch", "fere"].map((id) => (
          <div
            key={id}
            style={{
              aspectRatio: "3/4",
              backgroundImage: `url(/game/posters/${id}.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.5,
              border: "1px solid rgba(251, 191, 36, 0.15)",
            }}
          />
        ))}
      </div>

      <Link
        href="/play"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          padding: "12px 24px",
          color: "#f0ece4",
          border: "1px solid rgba(240, 236, 228, 0.2)",
          textDecoration: "none",
        }}
      >
        Back to the journey
      </Link>
    </main>
  );
}
