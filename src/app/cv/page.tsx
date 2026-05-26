"use client";

import Link from "next/link";
import { HERO, CHAPTERS, SKILL_GROUPS, PRESS } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * Visual CV — timeline-style infographic resume.
 * Numbered accent badges per chapter, clear skill dots, readable tags.
 */
export default function CvPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf8f4",
        color: "#0e0820",
        fontFamily: "var(--font-display)",
      }}
    >
      {/* Top bar */}
      <div
        className="no-print"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
          background: "rgba(250, 248, 244, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #0e082011",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#0e0820",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          ← Home
        </Link>
        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href="/play"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              padding: "5px 12px",
              color: "#0e0820",
              border: "1px solid #0e082022",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Experience
          </Link>
          <button
            onClick={() => window.print()}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              padding: "5px 12px",
              color: "#faf8f4",
              background: "#0e0820",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            PDF
          </button>
        </div>
      </div>

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "72px 24px 60px" }}>
        {/* Header */}
        <header style={{ marginBottom: 40, paddingTop: 20 }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 6 }}>
            {HERO.name}
          </h1>
          <p style={{ fontSize: 15, color: "#0e0820aa", marginBottom: 4 }}>{HERO.tagline}</p>
          <p style={{ fontSize: 13, color: "#0e082077" }}>{HERO.location} · {HERO.email}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {Object.entries(HERO.links).map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#0e082055", textDecoration: "none", textTransform: "capitalize", padding: "2px 6px", border: "1px solid #0e082015" }}>
                {key}
              </a>
            ))}
          </div>
        </header>

        {/* Stats */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {HERO.stats.map((s) => (
              <div key={s.label}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#0e0820" }}>{s.value}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", color: "#0e082066", marginLeft: 6, textTransform: "uppercase" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Bio */}
        <section style={{ marginBottom: 44 }}>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "#0e0820bb", maxWidth: 580 }}>{HERO.bio}</p>
        </section>

        {/* Timeline Experience */}
        <section style={{ marginBottom: 44 }}>
          <CvSection title="Experience" />

          <div style={{ position: "relative", paddingLeft: 40 }}>
            {/* Vertical timeline line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 15,
                width: 2,
                background: "linear-gradient(180deg, #0e082022 0%, #0e082011 100%)",
              }}
            />

            {CHAPTERS.map((ch) => {
              const world = WORLDS[ch.id];
              return (
                <article
                  key={ch.id}
                  style={{
                    position: "relative",
                    marginBottom: 32,
                    paddingBottom: 32,
                    borderBottom: "1px solid #0e082006",
                  }}
                >
                  {/* Timeline badge — numbered circle */}
                  <div
                    style={{
                      position: "absolute",
                      left: -40,
                      top: 2,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: world?.accent ?? "#666",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: `0 2px 8px ${world?.accent ?? "#666"}33`,
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                      {ch.index}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{ch.org}</h3>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#0e082055" }}>{ch.year}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#0e082077", marginBottom: 10 }}>
                    {ch.role}
                  </div>

                  {/* Paragraphs */}
                  {ch.paragraphs.map((p, i) => (
                    <p key={i} style={{ fontSize: 13, lineHeight: 1.7, color: "#0e0820aa", margin: "0 0 6px" }}>{p}</p>
                  ))}

                  {/* Outcomes */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
                    {ch.outcomes.map((o, i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          padding: "3px 8px",
                          background: "#0e082006",
                          color: "#0e0820aa",
                          border: "1px solid #0e082011",
                        }}
                      >
                        {o}
                      </span>
                    ))}
                  </div>

                  {/* Skill */}
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: ch.skill.color, boxShadow: `0 0 4px ${ch.skill.color}44` }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#0e082088" }}>
                      {ch.skill.name}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#0e082044" }}>
                      ({ch.skill.family})
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: 44 }}>
          <CvSection title="Skills & Tools" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {SKILL_GROUPS.map((g) => (
              <div key={g.title}>
                <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: "#0e082088", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {g.title}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {g.items.map((item) => (
                    <span key={item} style={{ fontSize: 11, padding: "3px 7px", background: "#0e082005", color: "#0e0820aa", border: "1px solid #0e082011" }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Press */}
        <section style={{ marginBottom: 40 }}>
          <CvSection title="Press" />
          {PRESS.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #0e082006", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#0e082055", minWidth: 80, flexShrink: 0, fontWeight: 600 }}>{p.outlet}</span>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: "#0e0820aa", textDecoration: "none", borderBottom: "1px solid #0e082022" }}>
                  {p.title}
                </a>
              ) : (
                <span style={{ fontSize: 13, color: "#0e0820aa" }}>{p.title}</span>
              )}
            </div>
          ))}
        </section>

        <footer style={{ textAlign: "center", paddingTop: 20, borderTop: "1px solid #0e082011" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#0e082033", letterSpacing: "0.15em" }}>
            {HERO.name} · {HERO.email} · {new Date().getFullYear()}
          </p>
        </footer>
      </main>

      <style>{`@media print { @page { size: A4; margin: 12mm; } .no-print { display: none !important; } }`}</style>
    </div>
  );
}

function CvSection({ title }: { title: string }) {
  return (
    <h2 style={{
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      color: "#0e082044",
      marginBottom: 18,
      paddingBottom: 8,
      borderBottom: "2px solid #0e0820",
    }}>
      {title}
    </h2>
  );
}
