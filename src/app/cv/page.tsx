"use client";

import Link from "next/link";
import { useEffect } from "react";
import { HERO, CHAPTERS, SKILL_GROUPS, PRESS, SKILLS } from "@/content/resume";
import { WORLDS, UI_ASSETS } from "@/game/journey";
import { SkillIcon } from "@/components/SkillIcon";

/**
 * Magazine-grade printable CV.
 *
 * Header: large display title + the FAL-generated title poster (3:4 portrait).
 * Body: each of the 9 chapters as a two-column row — chapter poster on the left,
 * dense narrative on the right with year, role, hook, paragraphs, outcomes.
 * Footer: skills grid (using the real skill-sheet icons), press, education, contact.
 *
 * Print mode: grayscale-friendly. `print-color-adjust: exact` is set on poster
 * images so the silhouette art prints with its actual ink. `break-inside: avoid`
 * keeps each chapter row whole across page boundaries.
 *
 * The page autoload-prints once (so "Save as PDF" is one click); users can
 * trigger again via the floating button.
 */
export default function CvPage() {
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.print();
      } catch {
        /* noop — print blocked, that's fine */
      }
    }, 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f1e6",
        color: "#0e0820",
        fontFamily: "var(--font-display)",
      }}
    >
      {/* Floating action bar (no-print) */}
      <div
        className="no-print"
        style={{
          position: "fixed",
          top: 14,
          left: 14,
          right: 14,
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <Link
          href="/"
          style={{
            pointerEvents: "auto",
            padding: "10px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#f6f1e6",
            background: "#0e0820",
            textDecoration: "none",
            border: "2px solid #0e0820",
          }}
        >
          ← Back
        </Link>
        <div style={{ display: "flex", gap: 8, pointerEvents: "auto" }}>
          <Link
            href="/play"
            style={{
              padding: "10px 14px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#0e0820",
              background: "transparent",
              textDecoration: "none",
              border: "2px solid #0e0820",
            }}
          >
            ▶ Play
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: "10px 14px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#0e0820",
              background: "#fbbf24",
              border: "2px solid #0e0820",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ⬇ Save as PDF
          </button>
        </div>
      </div>

      <main className="cv-print" style={{ maxWidth: 940, margin: "0 auto", padding: "60px 32px 80px" }}>
        {/* HEADER — Title poster + display title ───────────────────────────── */}
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(180px, 240px) 1fr",
            gap: 32,
            paddingBottom: 28,
            borderBottom: "3px solid #0e0820",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                aspectRatio: "3 / 4",
                background: "#0e0820",
                border: "2px solid #0e0820",
                padding: 6,
              }}
            >
              <img
                src={UI_ASSETS.titleCard}
                alt="Param Tokyo — title poster"
                className="cv-poster"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  imageRendering: "pixelated",
                  display: "block",
                }}
              />
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#0e0820",
                opacity: 0.6,
              }}
            >
              ◤ A Résumé in 9 Chapters ◥
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#0e0820",
                opacity: 0.55,
              }}
            >
              Curriculum Vitae · 2026
            </p>
            <h1
              style={{
                marginTop: 8,
                fontSize: "clamp(2.5rem, 7vw, 4.25rem)",
                lineHeight: 0.95,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                color: "#0e0820",
              }}
            >
              {HERO.name}
            </h1>
            <p
              style={{
                marginTop: 10,
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#dc2626",
              }}
            >
              {HERO.tagline}
            </p>
            <p
              style={{
                marginTop: 14,
                color: "#0e0820",
                opacity: 0.85,
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              {HERO.bio}
            </p>
            <p
              style={{
                marginTop: 14,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#0e0820",
                opacity: 0.7,
                lineHeight: 1.6,
              }}
            >
              {HERO.email} · {HERO.location}
              <br />
              {stripProto(HERO.links.linkedin)} · {stripProto(HERO.links.twitter)} · {stripProto(HERO.links.site)}
            </p>
          </div>
        </header>

        {/* HIGHLIGHTS ───────────────────────────────────────────────────────── */}
        <Section kicker="Highlights">
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 0,
              listStyle: "none",
              border: "1px solid #0e0820",
              background: "#0e0820",
            }}
          >
            {HERO.stats.map((s) => (
              <li
                key={s.label}
                style={{
                  padding: "14px 12px",
                  background: "#f6f1e6",
                  borderRight: "1px solid #0e0820",
                  borderBottom: "1px solid #0e0820",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0e0820",
                    letterSpacing: "0.01em",
                    lineHeight: 1.1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#0e0820",
                    opacity: 0.65,
                  }}
                >
                  {s.label}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* EXPERIENCE — 9 chapter rows ───────────────────────────────────────── */}
        <Section kicker={`Experience · ${CHAPTERS.length} chapters`}>
          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {CHAPTERS.map((c) => {
              const w = WORLDS[c.id];
              const accent = w?.accent ?? "#fbbf24";
              return (
                <li
                  key={c.id}
                  className="cv-chapter"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(120px, 160px) 1fr",
                    gap: 24,
                    padding: "20px 0",
                    borderBottom: "1px solid rgba(14,8,32,0.18)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "3 / 4",
                      background: "#0e0820",
                      border: `2px solid ${accent}`,
                      padding: 4,
                    }}
                  >
                    <img
                      src={w?.poster}
                      alt={`${c.org} chapter poster`}
                      className="cv-poster"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        imageRendering: "pixelated",
                        display: "block",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: -1,
                        right: -1,
                        background: accent,
                        color: "#0e0820",
                        padding: "2px 6px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                      }}
                    >
                      {String(c.index).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#0e0820",
                        opacity: 0.55,
                      }}
                    >
                      World {String(c.index).padStart(2, "0")} · {c.year}
                    </div>
                    <h3
                      style={{
                        marginTop: 4,
                        fontSize: 22,
                        lineHeight: 1.05,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "#0e0820",
                      }}
                    >
                      {c.org}
                    </h3>
                    <div
                      style={{
                        marginTop: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#0e0820",
                        opacity: 0.65,
                      }}
                    >
                      {c.role}
                    </div>

                    <p
                      style={{
                        marginTop: 12,
                        color: "#0e0820",
                        fontSize: 13.5,
                        lineHeight: 1.55,
                        fontStyle: "italic",
                      }}
                    >
                      {c.hook}
                    </p>

                    <ul
                      style={{
                        marginTop: 8,
                        paddingLeft: 18,
                        color: "#0e0820",
                        opacity: 0.85,
                        fontSize: 13,
                        lineHeight: 1.55,
                      }}
                    >
                      {c.paragraphs.map((p, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>
                          {p}
                        </li>
                      ))}
                    </ul>

                    {c.outcomes.length > 0 && (
                      <div
                        style={{
                          marginTop: 12,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 4,
                        }}
                      >
                        {c.outcomes.map((o) => (
                          <span
                            key={o}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 10,
                              padding: "3px 6px",
                              border: "1px solid #0e0820",
                              color: "#0e0820",
                              background: "rgba(14,8,32,0.04)",
                            }}
                          >
                            {o}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>

        {/* SKILLS — earned + family grouping ──────────────────────────────── */}
        <Section kicker="Skills · Forged across worlds">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {(Object.keys(SKILLS) as (keyof typeof SKILLS)[]).map((id) => {
              const s = SKILLS[id];
              return (
                <div
                  key={id}
                  className="cv-skill"
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: 10,
                    background: "rgba(14,8,32,0.04)",
                    border: "1px solid rgba(14,8,32,0.15)",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 36,
                      height: 36,
                      display: "grid",
                      placeItems: "center",
                      background: "#0e0820",
                    }}
                  >
                    <SkillIcon id={id} size={28} earned />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#0e0820",
                        opacity: 0.55,
                      }}
                    >
                      {s.family}
                    </div>
                    <div
                      style={{
                        marginTop: 2,
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#0e0820",
                        lineHeight: 1.2,
                      }}
                    >
                      {s.name}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#0e0820",
                        opacity: 0.6,
                      }}
                    >
                      {s.earnedIn} · {s.year}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wider skill groups list */}
          <div
            style={{
              marginTop: 22,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            {SKILL_GROUPS.map((g) => (
              <div key={g.title}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#0e0820",
                    fontWeight: 700,
                    paddingBottom: 4,
                    borderBottom: "1.5px solid #0e0820",
                  }}
                >
                  {g.title}
                </div>
                <p
                  style={{
                    marginTop: 8,
                    color: "#0e0820",
                    opacity: 0.85,
                    fontSize: 12.5,
                    lineHeight: 1.55,
                  }}
                >
                  {g.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* PRESS ──────────────────────────────────────────────────────────── */}
        <Section kicker="Selected Press">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {PRESS.map((p, i) => (
              <li
                key={p.title}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(120px, 160px) 1fr",
                  gap: 16,
                  padding: "10px 0",
                  borderTop: i === 0 ? "1px solid rgba(14,8,32,0.2)" : "none",
                  borderBottom: "1px solid rgba(14,8,32,0.2)",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#0e0820",
                    fontWeight: 700,
                  }}
                >
                  {p.outlet}
                </span>
                <span style={{ color: "#0e0820", fontSize: 13.5, lineHeight: 1.4 }}>{p.title}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* EDUCATION ──────────────────────────────────────────────────────── */}
        <Section kicker="Education">
          <p style={{ color: "#0e0820", fontSize: 14, lineHeight: 1.55 }}>
            <strong>Bachelor of Engineering, Computer Science</strong> · Bangalore Institute of Technology
            <br />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                opacity: 0.65,
              }}
            >
              Supplemented by 15 years of shipping.
            </span>
          </p>
        </Section>

        {/* CONTACT ────────────────────────────────────────────────────────── */}
        <Section kicker="Contact · Hire">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <ContactRow label="Email" value={HERO.email} href={`mailto:${HERO.email}`} />
            <ContactRow label="Location" value={HERO.location} />
            <ContactRow label="LinkedIn" value={stripProto(HERO.links.linkedin)} href={HERO.links.linkedin} />
            <ContactRow label="X / Twitter" value={stripProto(HERO.links.twitter)} href={HERO.links.twitter} />
            <ContactRow label="Site" value={stripProto(HERO.links.site)} href={HERO.links.site} />
            <ContactRow label="Play résumé" value="paramminhas.com/play" href="/play" />
          </div>
        </Section>

        <footer
          style={{
            marginTop: 60,
            paddingTop: 24,
            borderTop: "1px solid rgba(14,8,32,0.25)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#0e0820",
            opacity: 0.55,
            textAlign: "center",
          }}
        >
          {HERO.name} · {HERO.email} · {new Date().getFullYear()}
          <br />
          <span style={{ opacity: 0.7 }}>Cover poster + chapter art generated via FAL pixel-art pipeline.</span>
        </footer>
      </main>

      <style>{`
        /* Print: white paper, ink type, full-bleed posters with their own ink. */
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
          .cv-print { padding: 0 !important; max-width: none !important; }
          .cv-poster {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .cv-chapter { break-inside: avoid; page-break-inside: avoid; }
          .cv-skill   { break-inside: avoid; page-break-inside: avoid; }
          .no-print   { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 36 }}>
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#0e0820",
          fontWeight: 700,
          marginBottom: 14,
          paddingBottom: 6,
          borderBottom: "2px solid #0e0820",
        }}
      >
        ▸ {kicker}
      </h2>
      {children}
    </section>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px 12px",
        background: "rgba(14,8,32,0.04)",
        border: "1px solid rgba(14,8,32,0.15)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#0e0820",
          opacity: 0.55,
        }}
      >
        {label}
      </span>
      <span
        style={{
          marginTop: 2,
          fontSize: 13,
          color: "#0e0820",
          wordBreak: "break-all",
        }}
      >
        {value}
      </span>
    </div>
  );
  if (href) {
    return (
      <a href={href} style={{ textDecoration: "none" }} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
}

function stripProto(url: string): string {
  return url.replace(/^https?:\/\//, "");
}
