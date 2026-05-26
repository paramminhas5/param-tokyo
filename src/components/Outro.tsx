"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { HERO, CHAPTERS, COMPANIES } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * Outro — the earned finale.
 *
 * Sections:
 * 1. Closing heading + bio
 * 2. Skills assembled one-by-one on scroll-enter (IntersectionObserver)
 * 3. Stats with count-up animation
 * 4. Skill dependency graph (SVG — shows builtOn connections)
 * 5. Company ticker marquee
 * 6. CTAs + social links
 */
export function Outro() {
  const sectionRef                        = useRef<HTMLDivElement>(null);
  const [visible, setVisible]             = useState(false);
  const [skillsRevealed, setSkillsRevealed] = useState<boolean[]>(
    new Array(CHAPTERS.length).fill(false)
  );
  const [countersStarted, setCountersStarted] = useState(false);

  // Trigger on enter
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Stagger skill reveals after section becomes visible
  useEffect(() => {
    if (!visible) return;
    CHAPTERS.forEach((_, i) => {
      setTimeout(() => {
        setSkillsRevealed((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + i * 140);
    });
    setTimeout(() => setCountersStarted(true), 800);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      id="outro"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(160deg, #0a0a1e 0%, #050310 100%)",
        padding: "80px clamp(24px, 8vw, 80px) 80px",
        overflow: "hidden",
      }}
    >
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
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
      }} />

      {/* ── HEADING ── */}
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
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 0.3s",
      }}>
        {HERO.bio}
      </p>

      {/* ── SKILLS COLLECTED — staggered reveal ── */}
      <div style={{ marginBottom: 56, textAlign: "center", width: "100%", maxWidth: 680 }}>
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
                background: `${accent}0e`,
                border: `1px solid ${accent}33`,
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

      {/* ── STATS — count-up ── */}
      <div style={{
        display: "flex", flexWrap: "wrap",
        gap: "clamp(20px, 4vw, 48px)",
        justifyContent: "center", marginBottom: 64,
      }}>
        {HERO.stats.map((s, i) => (
          <StatItem key={s.label} stat={s} started={countersStarted} delay={i * 120} />
        ))}
      </div>

      {/* ── SKILL DEPENDENCY GRAPH ── */}
      <div style={{ marginBottom: 60, width: "100%", maxWidth: 760 }}>
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

      {/* ── COMPANY TICKER ── */}
      <div style={{ marginBottom: 56, width: "100vw", overflow: "hidden" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "rgba(240,236,228,0.2)",
          textAlign: "center", marginBottom: 16,
        }}>
          Brands & partners worked with
        </div>
        <CompanyTicker />
      </div>

      {/* ── CTAs ── */}
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap",
        justifyContent: "center", marginBottom: 32,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 0.8s",
      }}>
        <a href={`mailto:${HERO.email}`} style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em",
          textTransform: "uppercase", padding: "14px 28px",
          color: "#050310", background: "#f0ece4", textDecoration: "none",
          transition: "background 200ms",
        }}>
          Get in touch
        </a>
        <Link href="/cv" style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em",
          textTransform: "uppercase", padding: "14px 28px",
          color: "#f0ece4", background: "transparent",
          border: "1px solid rgba(240,236,228,0.22)", textDecoration: "none",
        }}>
          View full CV
        </Link>
      </div>

      {/* Social links */}
      <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
        {Object.entries(HERO.links).map(([key, url]) => (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em",
            textTransform: "capitalize", color: "rgba(240,236,228,0.3)", textDecoration: "none",
            transition: "color 200ms",
          }}>
            {key}
          </a>
        ))}
      </div>

      {/* Footer note */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em",
        color: "rgba(240,236,228,0.14)", textAlign: "center",
      }}>
        Param Tokyo · Scroll-driven narrative · {new Date().getFullYear()}
      </div>
    </section>
  );
}

// ── Stat item with count-up animation ────────────────────────────────────────
function StatItem({ stat, started, delay }: {
  stat: { label: string; value: string };
  started: boolean;
  delay: number;
}) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      // Extract numeric prefix, animate to it
      const match = stat.value.match(/^([₹$])?([\d.]+)([A-Za-z+%]*)/);
      if (!match) { setDisplay(stat.value); return; }
      const prefix  = match[1] ?? "";
      const target  = parseFloat(match[2]);
      const suffix  = match[3] ?? "";
      const isFloat = match[2].includes(".");
      const steps   = 40;
      let step      = 0;
      const iv = setInterval(() => {
        step++;
        const val = (target * step) / steps;
        setDisplay(
          prefix +
          (isFloat ? val.toFixed(1) : Math.round(val).toString()) +
          suffix
        );
        if (step >= steps) clearInterval(iv);
      }, 30);
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
        transition: "color 200ms",
      }}>
        {display || stat.value}
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

// ── Skill dependency graph (SVG) ─────────────────────────────────────────────
function SkillGraph({ visible }: { visible: boolean }) {
  const W = 760, H = 240;
  // Position each skill node on a timeline row
  const nodes = CHAPTERS.map((ch, i) => {
    const x = 40 + (i / (CHAPTERS.length - 1)) * (W - 80);
    const y = H / 2;
    return { id: ch.skill.name, x, y, color: ch.skill.color, label: ch.skill.name, org: ch.org, i };
  });

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  // Build edges from builtOn
  const edges: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  CHAPTERS.forEach((ch) => {
    const target = nodeMap[ch.skill.name];
    if (!target) return;
    ch.builtOn.forEach((dep) => {
      const src = nodeMap[dep];
      if (!src) return;
      edges.push({ x1: src.x, y1: src.y, x2: target.x, y2: target.y, color: target.color });
    });
  });

  return (
    <div style={{
      width: "100%",
      overflowX: "auto",
      opacity: visible ? 1 : 0,
      transition: "opacity 1s ease 0.8s",
    }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", minWidth: 480, height: "auto", display: "block" }}
        aria-label="Skill dependency tree showing how each skill built on previous ones"
      >
        {/* Edges */}
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={e.color}
            strokeOpacity={0.18}
            strokeWidth={1.5}
            strokeDasharray="3 4"
          />
        ))}

        {/* Timeline backbone */}
        <line x1={40} y1={H / 2} x2={W - 40} y2={H / 2}
          stroke="rgba(240,236,228,0.08)" strokeWidth={1} />

        {/* Nodes */}
        {nodes.map((n) => (
          <g key={n.id}>
            {/* Glow circle */}
            <circle cx={n.x} cy={n.y} r={18} fill={n.color} fillOpacity={0.07} />
            {/* Main dot */}
            <circle cx={n.x} cy={n.y} r={8} fill={n.color} fillOpacity={0.9} />
            <circle cx={n.x} cy={n.y} r={8} fill="none" stroke={n.color} strokeOpacity={0.5} strokeWidth={1.5} />
            {/* Index */}
            <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
              fill="#050310" fontSize={8} fontWeight={700}
              style={{ fontFamily: "monospace" }}>
              {n.i + 1}
            </text>
            {/* Skill name — alternating above/below for readability */}
            <text
              x={n.x} y={n.i % 2 === 0 ? n.y - 22 : n.y + 28}
              textAnchor="middle"
              fill={n.color} fontSize={8.5} fillOpacity={0.85}
              style={{ fontFamily: "monospace" }}>
              {n.label}
            </text>
            {/* Org name */}
            <text
              x={n.x} y={n.i % 2 === 0 ? n.y - 33 : n.y + 39}
              textAnchor="middle"
              fill="rgba(240,236,228,0.3)" fontSize={7}
              style={{ fontFamily: "monospace" }}>
              {n.org}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Company ticker marquee ────────────────────────────────────────────────────
function CompanyTicker() {
  // Double the list for seamless loop
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
      {/* Fade edges */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 80,
        background: "linear-gradient(90deg, #050310, transparent)",
        pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: 80,
        background: "linear-gradient(270deg, #050310, transparent)",
        pointerEvents: "none",
      }} />
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
