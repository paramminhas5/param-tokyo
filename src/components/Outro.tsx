"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HERO, CHAPTERS, COMPANIES } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * Outro — the earned finale.
 *
 * Sections:
 * 1. Heading + bio
 * 2. Skills collected (staggered reveal)
 * 3. Stats (count-up)
 * 4. Skill dependency graph (bigger labels, readable)
 * 5. WHAT'S BEING BUILT NOW — Iterate + CCD cards
 * 6. Company ticker
 * 7. CTAs + social
 */
export function Outro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible,          setVisible]          = useState(false);
  const [skillsRevealed,   setSkillsRevealed]   = useState<boolean[]>(
    new Array(CHAPTERS.length).fill(false)
  );
  const [countersStarted,  setCountersStarted]  = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    CHAPTERS.forEach((_, i) => {
      setTimeout(() => {
        setSkillsRevealed((prev) => { const n = [...prev]; n[i] = true; return n; });
      }, 200 + i * 120);
    });
    setTimeout(() => setCountersStarted(true), 600);
  }, [visible]);

  // "What's next" chapters — the two active ones
  const nowChapters = CHAPTERS.filter((ch) => ch.year === "Now");

  return (
    <section ref={sectionRef} id="outro" style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center",
      background: "linear-gradient(160deg, #0a0a1e 0%, #050310 100%)",
      padding: "80px clamp(24px, 8vw, 80px) 80px",
      overflow: "hidden",
    }}>

      {/* Ambient glows */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse 70% 50% at 20% 50%, rgba(251,191,36,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 50%, rgba(34,211,238,0.03) 0%, transparent 60%)
        `,
        pointerEvents: "none",
      }} />

      {/* Top line */}
      <div style={{
        width: 1, height: 60,
        background: "linear-gradient(180deg, rgba(251,191,36,0.5), transparent)",
        marginBottom: 40,
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease",
      }} />

      {/* Heading */}
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(28px, 5vw, 52px)",
        fontWeight: 600, color: "#f0ece4",
        textAlign: "center", marginBottom: 12, lineHeight: 1.1,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
      }}>
        That&apos;s the journey so far.
      </h2>
      <p style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(14px, 1.6vw, 18px)",
        color: "rgba(240,236,228,0.45)",
        textAlign: "center", maxWidth: 520,
        lineHeight: 1.65, marginBottom: 56,
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.3s",
      }}>
        {HERO.bio}
      </p>

      {/* Skills collected */}
      <div style={{ marginBottom: 56, textAlign: "center", width: "100%", maxWidth: 700 }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "rgba(240,236,228,0.25)", marginBottom: 20,
          opacity: visible ? 1 : 0, transition: "opacity 0.6s ease",
        }}>
          Skills collected
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {CHAPTERS.map((ch, i) => {
            const accent = WORLDS[ch.id]?.accent ?? ch.skill.color;
            return (
              <span key={ch.id} style={{
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em",
                color: accent, padding: "7px 16px",
                background: `${accent}0e`, border: `1px solid ${accent}33`,
                boxShadow: skillsRevealed[i] ? `0 0 18px ${accent}22` : "none",
                opacity: skillsRevealed[i] ? 1 : 0,
                transform: skillsRevealed[i] ? "scale(1) translateY(0)" : "scale(0.6) translateY(10px)",
                transition: "opacity 400ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 400ms ease",
              }}>
                {ch.skill.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "flex", flexWrap: "wrap",
        gap: "clamp(20px, 4vw, 48px)",
        justifyContent: "center", marginBottom: 64,
      }}>
        {HERO.stats.map((s, i) => (
          <StatItem key={s.label} stat={s} started={countersStarted} delay={i * 100} />
        ))}
      </div>

      {/* Skill dependency graph */}
      <div style={{ marginBottom: 64, width: "100%", maxWidth: 800 }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "rgba(240,236,228,0.25)", marginBottom: 20,
          textAlign: "center",
          opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.5s",
        }}>
          Skill dependency tree — how each chapter built on the last
        </div>
        <SkillGraph visible={visible} />
      </div>

      {/* ── WHAT'S BEING BUILT NOW ─────────────────────────────────────── */}
      <div style={{
        width: "100%", maxWidth: 760, marginBottom: 64,
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.7s",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "rgba(240,236,228,0.25)",
          marginBottom: 24, textAlign: "center",
        }}>
          What&apos;s being built now
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: nowChapters.length > 1 ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr",
          gap: 16,
        }}>
          {nowChapters.map((ch) => {
            const accent = WORLDS[ch.id]?.accent ?? ch.skill.color;
            const poster = WORLDS[ch.id]?.poster;
            return (
              <div key={ch.id} style={{
                position: "relative",
                background: "rgba(5,3,16,0.7)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${accent}33`,
                borderTop: `2px solid ${accent}`,
                overflow: "hidden",
                display: "flex", gap: 0,
              }}>
                {/* Poster image — right side */}
                {poster && (
                  <div style={{
                    width: 100, flexShrink: 0,
                    backgroundImage: `url(${poster})`,
                    backgroundSize: "cover", backgroundPosition: "center top",
                    opacity: 0.55,
                    minHeight: 160,
                  }} />
                )}
                {/* Content */}
                <div style={{ padding: "20px 20px 20px", flex: 1 }}>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 8,
                    letterSpacing: "0.28em", textTransform: "uppercase",
                    color: accent, marginBottom: 6,
                  }}>
                    Active · {ch.role}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(18px, 2.5vw, 24px)",
                    fontWeight: 700, color: "#f0ece4", lineHeight: 1.1,
                    marginBottom: 8,
                    textShadow: `0 0 30px ${accent}33`,
                  }}>
                    {ch.org}
                  </div>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13, color: "rgba(240,236,228,0.6)",
                    lineHeight: 1.6, margin: "0 0 14px",
                  }}>
                    {ch.cliff}
                  </p>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    color: accent, letterSpacing: "0.05em",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: accent, boxShadow: `0 0 8px ${accent}`,
                      animation: "now-pulse 2s ease-in-out infinite",
                    }} />
                    Building now
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Company ticker */}
      <div style={{ marginBottom: 56, width: "100vw", overflow: "hidden" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "rgba(240,236,228,0.2)",
          textAlign: "center", marginBottom: 16,
        }}>
          Brands &amp; partners worked with
        </div>
        <CompanyTicker />
      </div>

      {/* CTAs */}
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap",
        justifyContent: "center", marginBottom: 32,
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.9s",
      }}>
        <a href={`mailto:${HERO.email}`} style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em",
          textTransform: "uppercase", padding: "14px 32px",
          color: "#050310", background: "#f0ece4", textDecoration: "none",
          transition: "opacity 200ms",
        }}>
          Get in touch
        </a>
        <Link href="/cv" style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em",
          textTransform: "uppercase", padding: "13px 31px",
          color: "#f0ece4", background: "transparent",
          border: "2px solid rgba(240,236,228,0.3)", textDecoration: "none",
          transition: "border-color 200ms",
        }}>
          View full CV
        </Link>
      </div>

      {/* Social links */}
      <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
        {Object.entries(HERO.links).map(([key, url]) => (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em",
            textTransform: "capitalize", color: "rgba(240,236,228,0.3)",
            textDecoration: "none", transition: "color 200ms",
          }}>
            {key}
          </a>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em",
        color: "rgba(240,236,228,0.14)", textAlign: "center",
      }}>
        Param Tokyo · Scroll-driven narrative · {new Date().getFullYear()}
      </div>

      <style>{`
        @keyframes now-pulse {
          0%, 100% { box-shadow: 0 0 6px currentColor; }
          50%       { box-shadow: 0 0 16px currentColor; }
        }
      `}</style>
    </section>
  );
}

// ── Stat count-up ─────────────────────────────────────────────────────────────
function StatItem({ stat, started, delay }: {
  stat: { label: string; value: string };
  started: boolean;
  delay: number;
}) {
  const [display, setDisplay] = useState("—");

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      const match = stat.value.match(/^([₹$])?([\d.]+)([A-Za-z+%]*)/);
      if (!match) { setDisplay(stat.value); return; }
      const prefix = match[1] ?? "", suffix = match[3] ?? "";
      const target = parseFloat(match[2]);
      const isFloat = match[2].includes(".");
      let step = 0;
      const steps = 40;
      const iv = setInterval(() => {
        step++;
        const val = (target * step) / steps;
        setDisplay(prefix + (isFloat ? val.toFixed(1) : Math.round(val).toString()) + suffix);
        if (step >= steps) clearInterval(iv);
      }, 28);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, stat.value, delay]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(22px, 4vw, 38px)",
        fontWeight: 700, color: "#f0ece4", lineHeight: 1, marginBottom: 5,
      }}>
        {display}
      </div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em",
        textTransform: "uppercase", color: "rgba(240,236,228,0.38)",
      }}>
        {stat.label}
      </div>
    </div>
  );
}

// ── Skill dependency graph — bigger labels ─────────────────────────────────────
function SkillGraph({ visible }: { visible: boolean }) {
  const W = 800, H = 280;
  const nodes = CHAPTERS.map((ch, i) => ({
    id: ch.skill.name, org: ch.org,
    x: 44 + (i / (CHAPTERS.length - 1)) * (W - 88),
    y: H / 2,
    color: ch.skill.color, label: ch.skill.name, i,
  }));
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edges: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  CHAPTERS.forEach((ch) => {
    const target = nodeMap[ch.skill.name];
    if (!target) return;
    ch.builtOn.forEach((dep) => {
      const src = nodeMap[dep];
      if (src) edges.push({ x1: src.x, y1: src.y, x2: target.x, y2: target.y, color: target.color });
    });
  });

  return (
    <div style={{ width: "100%", overflowX: "auto", opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.8s" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", minWidth: 520, height: "auto", display: "block" }}
        aria-label="Skill dependency tree"
      >
        {edges.map((e, i) => (
          <line key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={e.color} strokeOpacity={0.2} strokeWidth={1.5} strokeDasharray="4 5"
          />
        ))}
        <line x1={44} y1={H / 2} x2={W - 44} y2={H / 2}
          stroke="rgba(240,236,228,0.07)" strokeWidth={1} />
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={20} fill={n.color} fillOpacity={0.07} />
            <circle cx={n.x} cy={n.y} r={9} fill={n.color} fillOpacity={0.9} />
            <circle cx={n.x} cy={n.y} r={9} fill="none" stroke={n.color} strokeOpacity={0.5} strokeWidth={1.5} />
            <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
              fill="#050310" fontSize={9} fontWeight={700} style={{ fontFamily: "monospace" }}>
              {n.i + 1}
            </text>
            {/* Skill name — bigger, alternating */}
            <text
              x={n.x} y={n.i % 2 === 0 ? n.y - 26 : n.y + 32}
              textAnchor="middle" fill={n.color} fontSize={10} fillOpacity={0.9}
              style={{ fontFamily: "monospace" }}>
              {n.label}
            </text>
            {/* Org name */}
            <text
              x={n.x} y={n.i % 2 === 0 ? n.y - 40 : n.y + 46}
              textAnchor="middle" fill="rgba(240,236,228,0.35)" fontSize={8.5}
              style={{ fontFamily: "monospace" }}>
              {n.org}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Company ticker ─────────────────────────────────────────────────────────────
function CompanyTicker() {
  const doubled = [...COMPANIES, ...COMPANIES];
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{
        display: "flex", gap: 40,
        animation: "ticker-scroll 28s linear infinite",
        width: "max-content",
      }}>
        {doubled.map((c, i) => (
          <span key={i} style={{
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(240,236,228,0.25)",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>
            {c}
            <span style={{ marginLeft: 40, color: "rgba(240,236,228,0.1)" }}>·</span>
          </span>
        ))}
      </div>
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 80,
        background: "linear-gradient(90deg, #050310, transparent)", pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: 80,
        background: "linear-gradient(270deg, #050310, transparent)", pointerEvents: "none",
      }} />
    </div>
  );
}
