"use client";

import Link from "next/link";
import { HERO, CHAPTERS, SKILL_GROUPS, PRESS } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * CV page — dark themed, matching the game's visual language.
 * Each experience entry has the world's accent colour + faint poster background.
 * Two modes: dark screen, white on print.
 */
export default function CvPage() {
  const INK  = "#050310";
  const FG   = "#f0ece4";
  const MUTED = "rgba(240,236,228,0.45)";
  const DIM   = "rgba(240,236,228,0.25)";

  return (
    <div style={{
      minHeight: "100vh",
      background: INK,
      color: FG,
      fontFamily: "var(--font-display)",
    }}>

      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <div className="no-print" style={{
        position: "fixed", top: 0, left: 0, right: 0,
        padding: "10px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        zIndex: 50,
        background: "rgba(5,3,16,0.94)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(240,236,228,0.07)",
      }}>
        <Link href="/" style={{
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em",
          color: MUTED, textDecoration: "none", textTransform: "uppercase",
        }}>
          ← Experience
        </Link>
        <button
          onClick={() => window.print()}
          style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em",
            padding: "5px 14px", color: INK, background: FG,
            border: "none", cursor: "pointer", textTransform: "uppercase",
          }}
        >
          Save PDF
        </button>
      </div>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px 80px" }}>

        {/* ── HEADER ────────────────────────────────────────────────── */}
        <header style={{ marginBottom: 48, paddingTop: 24 }}>
          <h1 style={{
            fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 700,
            lineHeight: 1.05, marginBottom: 8, color: FG,
          }}>
            {HERO.name}
          </h1>
          <p style={{ fontSize: 15, color: MUTED, marginBottom: 4 }}>{HERO.tagline}</p>
          <p style={{ fontSize: 13, color: DIM }}>
            {HERO.location} · <a href={`mailto:${HERO.email}`} style={{ color: DIM, textDecoration: "none" }}>{HERO.email}</a>
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            {Object.entries(HERO.links).map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                color: DIM, textDecoration: "none", textTransform: "capitalize",
                padding: "3px 8px", border: "1px solid rgba(240,236,228,0.12)",
                transition: "border-color 200ms",
              }}>
                {key}
              </a>
            ))}
          </div>
        </header>

        {/* ── STATS ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 44 }}>
          <SectionLabel title="Numbers" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px, 3vw, 32px)" }}>
            {HERO.stats.map((s) => (
              <div key={s.label}>
                <span style={{ fontSize: 22, fontWeight: 700, color: FG }}>{s.value}</span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em",
                  color: DIM, marginLeft: 7, textTransform: "uppercase",
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── BIO ───────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 14, lineHeight: 1.78, color: MUTED, maxWidth: 600 }}>
            {HERO.bio}
          </p>
        </section>

        {/* ── EXPERIENCE ────────────────────────────────────────────── */}
        <section style={{ marginBottom: 52 }}>
          <SectionLabel title="Experience" />

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {CHAPTERS.map((ch) => {
              const world  = WORLDS[ch.id];
              const accent = world?.accent ?? "#666";
              const poster = world?.poster;

              return (
                <article key={ch.id} style={{
                  position: "relative",
                  overflow: "hidden",
                  background: "rgba(240,236,228,0.02)",
                  border: "1px solid rgba(240,236,228,0.06)",
                  borderLeft: `3px solid ${accent}`,
                  marginBottom: 12,
                }}>
                  {/* Faint poster bg */}
                  {poster && (
                    <div aria-hidden style={{
                      position: "absolute", top: 0, right: 0, bottom: 0,
                      width: "28%",
                      backgroundImage: `url(${poster})`,
                      backgroundSize: "cover", backgroundPosition: "center top",
                      opacity: 0.06,
                      maskImage: "linear-gradient(270deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(270deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
                    }} />
                  )}

                  <div style={{ padding: "20px 24px", position: "relative" }}>
                    {/* Header row */}
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", marginBottom: 4, flexWrap: "wrap", gap: 8,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Chapter badge */}
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: accent, display: "grid", placeItems: "center", flexShrink: 0,
                          boxShadow: `0 2px 10px ${accent}44`,
                        }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#050310" }}>
                            {ch.index}
                          </span>
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: FG }}>{ch.org}</h3>
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: DIM, paddingTop: 4 }}>
                        {ch.year}
                      </span>
                    </div>

                    {/* Role */}
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: 11,
                      color: MUTED, marginBottom: 12, marginLeft: 40,
                      letterSpacing: "0.05em",
                    }}>
                      {ch.role}
                    </div>

                    {/* Cliff note */}
                    <p style={{
                      fontSize: 14, fontWeight: 500, color: FG,
                      lineHeight: 1.55, margin: "0 0 10px", marginLeft: 40,
                    }}>
                      {ch.cliff}
                    </p>

                    {/* Paragraphs */}
                    {ch.paragraphs.map((p, i) => (
                      <p key={i} style={{
                        fontSize: 13, lineHeight: 1.72,
                        color: "rgba(240,236,228,0.6)",
                        margin: "0 0 6px", marginLeft: 40,
                      }}>
                        {p}
                      </p>
                    ))}

                    {/* Outcomes */}
                    <div style={{
                      display: "flex", flexWrap: "wrap", gap: 5,
                      marginTop: 12, marginLeft: 40,
                    }}>
                      {ch.outcomes.map((o) => (
                        <span key={o} style={{
                          fontFamily: "var(--font-mono)", fontSize: 9,
                          padding: "3px 8px",
                          background: `${accent}0d`,
                          color: accent,
                          border: `1px solid ${accent}2a`,
                        }}>
                          {o}
                        </span>
                      ))}
                    </div>

                    {/* Skill */}
                    <div style={{
                      marginTop: 12, marginLeft: 40,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: ch.skill.color, boxShadow: `0 0 6px ${ch.skill.color}66`,
                      }} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: MUTED }}>
                        {ch.skill.name}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: DIM }}>
                        ({ch.skill.family})
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── SKILLS & TOOLS ────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <SectionLabel title="Skills & Tools" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {SKILL_GROUPS.map((g) => (
              <div key={g.title}>
                <h3 style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600,
                  marginBottom: 8, color: MUTED,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  {g.title}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {g.items.map((item) => (
                    <span key={item} style={{
                      fontSize: 11, padding: "3px 7px",
                      background: "rgba(240,236,228,0.04)",
                      color: MUTED,
                      border: "1px solid rgba(240,236,228,0.08)",
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRESS ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <SectionLabel title="Press" />
          {PRESS.map((p, i) => (
            <div key={i} style={{
              display: "flex", gap: 14, padding: "9px 0",
              borderBottom: "1px solid rgba(240,236,228,0.04)",
              alignItems: "baseline",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                color: DIM, minWidth: 90, flexShrink: 0, fontWeight: 600,
              }}>
                {p.outlet}
              </span>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: 13, color: MUTED, textDecoration: "none",
                  borderBottom: "1px solid rgba(240,236,228,0.15)",
                  transition: "border-color 200ms",
                }}>
                  {p.title}
                </a>
              ) : (
                <span style={{ fontSize: 13, color: MUTED }}>{p.title}</span>
              )}
            </div>
          ))}
        </section>

        <footer style={{
          textAlign: "center", paddingTop: 24,
          borderTop: "1px solid rgba(240,236,228,0.07)",
        }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: DIM, letterSpacing: "0.15em" }}>
            {HERO.name} · {HERO.email} · {new Date().getFullYear()}
          </p>
        </footer>
      </main>

      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; color: #0e0820 !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
    }}>
      <h2 style={{
        fontFamily: "var(--font-mono)", fontSize: 9,
        letterSpacing: "0.3em", textTransform: "uppercase",
        color: "rgba(240,236,228,0.3)", margin: 0,
      }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: 1, background: "rgba(240,236,228,0.07)" }} />
    </div>
  );
}
