"use client";

import { HERO, CHAPTERS, SKILL_GROUPS, PRESS } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * CV as a full-screen modal overlay — accessible from within the game.
 * Print-optimized. Dark themed to match the game world.
 */
export function CvModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(5, 3, 16, 0.95)",
        backdropFilter: "blur(8px)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Close + Print buttons */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(5, 3, 16, 0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(240,236,228,0.06)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#f0ece4",
            background: "none",
            border: "1px solid rgba(240,236,228,0.2)",
            padding: "6px 14px",
            cursor: "pointer",
          }}
        >
          ← Back to journey
        </button>
        <button
          onClick={() => window.print()}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#050310",
            background: "#f0ece4",
            border: "none",
            padding: "6px 14px",
            cursor: "pointer",
          }}
        >
          Save PDF
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px", color: "#f0ece4" }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, marginBottom: 8 }}>
            {HERO.name}
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "rgba(240,236,228,0.6)", letterSpacing: "0.1em" }}>
            {HERO.tagline}
          </p>
          <p style={{ fontSize: 13, color: "rgba(240,236,228,0.4)", marginTop: 6 }}>
            {HERO.location} · {HERO.email}
          </p>
          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 20 }}>
            {HERO.stats.map(s => (
              <div key={s.label}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{s.value}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(240,236,228,0.4)", marginLeft: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Experience timeline */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: 20, paddingBottom: 8, borderBottom: "1px solid rgba(240,236,228,0.1)" }}>
            Experience
          </h2>
          {CHAPTERS.map(ch => {
            const world = WORLDS[ch.id];
            return (
              <article key={ch.id} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid rgba(240,236,228,0.04)", display: "flex", gap: 16 }}>
                {/* Accent dot */}
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: world?.accent ?? "#666", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#fff" }}>{ch.index}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{ch.org}</h3>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(240,236,228,0.4)" }}>{ch.year}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(240,236,228,0.5)", marginTop: 2, marginBottom: 10 }}>{ch.role}</div>
                  {ch.paragraphs.map((p, i) => (
                    <p key={i} style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(240,236,228,0.65)", margin: "0 0 6px" }}>{p}</p>
                  ))}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
                    {ch.outcomes.map((o, i) => (
                      <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 9, padding: "3px 8px", color: "rgba(240,236,228,0.6)", border: "1px solid rgba(240,236,228,0.1)", background: "rgba(240,236,228,0.03)" }}>{o}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: ch.skill.color }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(240,236,228,0.5)" }}>{ch.skill.name}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Skills */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid rgba(240,236,228,0.1)" }}>
            Skills & Tools
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
            {SKILL_GROUPS.map(g => (
              <div key={g.title}>
                <h3 style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(240,236,228,0.5)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{g.title}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {g.items.map(item => (
                    <span key={item} style={{ fontSize: 11, padding: "2px 6px", color: "rgba(240,236,228,0.6)", border: "1px solid rgba(240,236,228,0.08)" }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Press */}
        <section>
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid rgba(240,236,228,0.1)" }}>
            Press
          </h2>
          {PRESS.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(240,236,228,0.03)", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(240,236,228,0.4)", minWidth: 80, flexShrink: 0 }}>{p.outlet}</span>
              <span style={{ fontSize: 13, color: "rgba(240,236,228,0.6)" }}>{p.title}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
