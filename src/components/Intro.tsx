import { Link } from "@tanstack/react-router";
import { HERO, CHAPTERS } from "@/content/resume";
import paperBg from "@/assets/game/ui/paper-bg.jpg";

/**
 * Intro screen. No character — the hero only appears once the journey starts.
 * Pure sprite-style chrome over a riso paper backdrop.
 */
export function Intro() {
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
      {/* Subtle dark vignette so text reads */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(10,10,20,0.25) 0%, rgba(10,10,20,0.7) 100%)",
        }}
      />

      <div style={{ position: "relative", maxWidth: 720, textAlign: "center" }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "#fbbf24" }}>
          ◤ A Playable Résumé · 9 Worlds ◥
        </span>
        <h1
          style={{
            marginTop: 18, fontSize: "clamp(2.5rem, 8vw, 5.5rem)", lineHeight: 0.95,
            color: "#f0ece4", fontWeight: 600, letterSpacing: "-0.02em",
            fontFamily: "var(--font-display, inherit)",
          }}
        >
          {HERO.name}
        </h1>
        <p style={{ marginTop: 16, fontFamily: "monospace", fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ff6b5b" }}>
          {HERO.tagline}
        </p>
        <p style={{ marginTop: 14, color: "rgba(240,236,228,0.78)", maxWidth: 560, margin: "14px auto 0", lineHeight: 1.55, fontSize: 15 }}>
          {HERO.bio}
        </p>

        {/* Press to play sign */}
        <div style={{ marginTop: 36, display: "flex", justifyContent: "center" }}>
          <a
            href={`#${CHAPTERS[0].id}`}
            style={{
              position: "relative",
              padding: "16px 28px",
              fontFamily: "monospace",
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              background: "rgba(10,10,20,0.9)",
              color: "#fbbf24",
              border: "2px solid #fbbf24",
              boxShadow: "0 0 0 4px rgba(10,10,20,0.9), 0 0 0 5px rgba(251,191,36,0.4), 0 18px 36px rgba(0,0,0,0.7)",
              textDecoration: "none",
            }}
          >
            ▼ Press ↓ to play
          </a>
        </div>

        <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, maxWidth: 560, margin: "36px auto 0" }}>
          {HERO.stats.slice(0, 6).map((s) => (
            <div
              key={s.label}
              style={{
                padding: "10px 8px",
                background: "rgba(10,10,20,0.65)",
                border: "1px solid rgba(240,236,228,0.18)",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: "#f0ece4" }}>{s.value}</div>
              <div style={{ marginTop: 2, fontFamily: "monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,236,228,0.55)", lineHeight: 1.2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          <Link to="/cv" style={linkStyle}>⬇ Full CV</Link>
          <a href={`mailto:${HERO.email}`} style={linkStyle}>✉ Email</a>
          <a href={HERO.links.linkedin} target="_blank" rel="noreferrer" style={linkStyle}>LinkedIn</a>
        </div>
      </div>
    </section>
  );
}

const linkStyle: React.CSSProperties = {
  padding: "6px 12px",
  border: "1px solid rgba(240,236,228,0.3)",
  color: "rgba(240,236,228,0.85)",
  textDecoration: "none",
};
