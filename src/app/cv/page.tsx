"use client";

import Link from "next/link";
import { HERO, CHAPTERS, SKILL_GROUPS, PRESS } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * Visual CV — magazine-grade printable resume with world thumbnails
 * and colored skill tags. Rich on screen, clean in print.
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
      {/* No-print nav */}
      <div
        className="no-print"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
          background: "rgba(250, 248, 244, 0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #0e082011",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            padding: "6px 14px",
            color: "#0e0820",
            border: "1px solid #0e082022",
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
              fontSize: 11,
              letterSpacing: "0.12em",
              padding: "6px 14px",
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
              fontSize: 11,
              letterSpacing: "0.12em",
              padding: "6px 14px",
              color: "#faf8f4",
              background: "#0e0820",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Save PDF
          </button>
        </div>
      </div>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 60px" }}>
        {/* Header with world art accent */}
        <header
          style={{
            position: "relative",
            marginBottom: 48,
            padding: "40px 32px",
            background: "#0e0820",
            color: "#f0ece4",
            overflow: "hidden",
          }}
        >
          {/* BG art */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${WORLDS.origin.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.2,
              filter: "blur(1px)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(14,8,32,0.9) 0%, rgba(14,8,32,0.7) 100%)",
            }}
          />
          <div style={{ position: "relative", zIndex: 2 }}>
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              {HERO.name}
            </h1>
            <p style={{ fontSize: 15, opacity: 0.8, marginBottom: 4 }}>
              {HERO.tagline}
            </p>
            <p style={{ fontSize: 13, opacity: 0.5 }}>
              {HERO.location} · {HERO.email}
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              {Object.entries(HERO.links).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "rgba(240,236,228,0.5)",
                    textDecoration: "none",
                    textTransform: "capitalize",
                    padding: "3px 8px",
                    border: "1px solid rgba(240,236,228,0.2)",
                  }}
                >
                  {key}
                </a>
              ))}
            </div>
          </div>
        </header>

        {/* Stats grid */}
        <section style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 1,
              background: "#0e082011",
              border: "1px solid #0e082011",
            }}
          >
            {HERO.stats.map((s) => (
              <div key={s.label} style={{ padding: "14px 12px", background: "#faf8f4" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#0e0820" }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0e082077", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bio */}
        <section style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#0e0820cc", maxWidth: 640 }}>
            {HERO.bio}
          </p>
        </section>

        {/* Experience — with world thumbnails */}
        <section style={{ marginBottom: 48 }}>
          <SectionTitle>Experience</SectionTitle>

          {CHAPTERS.map((ch) => {
            const world = WORLDS[ch.id];
            return (
              <article
                key={ch.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: 16,
                  marginBottom: 28,
                  paddingBottom: 28,
                  borderBottom: "1px solid #0e082009",
                }}
              >
                {/* World thumbnail */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    backgroundImage: `url(${world?.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: `2px solid ${world?.accent ?? "#ccc"}44`,
                    flexShrink: 0,
                  }}
                />

                {/* Content */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{ch.org}</h3>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#0e082066" }}>{ch.year}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#0e082077", marginBottom: 8 }}>
                    {ch.role}
                  </div>
                  {ch.paragraphs.map((p, i) => (
                    <p key={i} style={{ fontSize: 13, lineHeight: 1.7, color: "#0e0820bb", margin: "0 0 6px" }}>{p}</p>
                  ))}
                  {/* Outcomes as colored tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
                    {ch.outcomes.map((o, i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          padding: "3px 8px",
                          background: `${world?.accent ?? "#666"}15`,
                          color: `${world?.accent ?? "#666"}`,
                          border: `1px solid ${world?.accent ?? "#666"}33`,
                          letterSpacing: "0.03em",
                          filter: "saturate(0.8)",
                        }}
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                  {/* Skill earned */}
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: ch.skill.color }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#0e082088" }}>
                      {ch.skill.name} ({ch.skill.family})
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Skills */}
        <section style={{ marginBottom: 48 }}>
          <SectionTitle>Skills & Tools</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {SKILL_GROUPS.map((g) => (
              <div key={g.title}>
                <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: "#0e0820aa" }}>
                  {g.title}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {g.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        background: "#0e082006",
                        color: "#0e0820aa",
                        border: "1px solid #0e082011",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Press */}
        <section style={{ marginBottom: 48 }}>
          <SectionTitle>Press & Features</SectionTitle>
          {PRESS.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "baseline",
                padding: "10px 0",
                borderBottom: "1px solid #0e082008",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#0e082055", minWidth: 90, flexShrink: 0, fontWeight: 600 }}>
                {p.outlet}
              </span>
              <span style={{ fontSize: 13, color: "#0e0820aa" }}>{p.title}</span>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer style={{ textAlign: "center", padding: "24px 0", borderTop: "1px solid #0e082011" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#0e082044", letterSpacing: "0.12em" }}>
            {HERO.name} · {HERO.email} · {new Date().getFullYear()}
          </p>
        </footer>
      </main>

      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#0e082055",
        marginBottom: 20,
        paddingBottom: 8,
        borderBottom: "2px solid #0e0820",
      }}
    >
      {children}
    </h2>
  );
}
