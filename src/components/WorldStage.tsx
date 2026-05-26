"use client";

import { useRef, useEffect, useState } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  motion,
  AnimatePresence,
} from "framer-motion";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { playWorld } from "@/game/ambient";

interface Props {
  chapter: Chapter;
}

/**
 * WorldStage — the heart of the experience.
 *
 * Architecture:
 *   <section id={id} style={{ height: "300vh" }}>
 *     <div sticky 100vh>
 *       Layer 0: sky       (parallax -3%)
 *       Layer 1: far       (parallax -8%)
 *       Layer 2: mid       (parallax -14%)
 *       Layer 3: near      (parallax -22%)
 *       Layer 4: fg        (parallax -32%, scale 1→1.28)
 *       Vignette + ink overlays
 *       Ink-wipe transition (p > 0.88)
 *       Chapter card — center-bottom, frosted glass
 *       Phase narrative (cliff → paragraphs → outcomes+skill)
 *     </div>
 *   </section>
 *
 * Scroll phases (p = 0 → 1):
 *   0.00 – 0.12  Entry: world rises, chapter # / title appear
 *   0.12 – 0.38  Phase 1: CLIFF NOTE fills card
 *   0.38 – 0.65  Phase 2: paragraphs scroll in one by one
 *   0.65 – 0.85  Phase 3: outcome pills + skill card
 *   0.85 – 1.00  Exit: ink wipe down, world dims
 */
export function WorldStage({ chapter }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const accent = world.accent;

  // ── Framer scroll tracking ──────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spring-smooth the raw scroll value so everything feels physical
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.6 });

  // ── Parallax transforms — each layer at its own depth speed ──────────────
  // Sky: barely moves (most distant)
  const skyY = useTransform(p, [0, 1], ["0%", "-6%"]);
  // Far: gentle drift
  const farY = useTransform(p, [0, 1], ["0%", "-14%"]);
  // Mid: moderate
  const midY = useTransform(p, [0, 1], ["0%", "-22%"]);
  // Near: faster
  const nearY = useTransform(p, [0, 1], ["0%", "-34%"]);
  // FG: fastest + zooms toward viewer
  const fgY     = useTransform(p, [0, 1], ["0%", "-44%"]);
  const fgScale = useTransform(p, [0, 1], [1.0, 1.28]);

  // ── Ink wipe exit ─────────────────────────────────────────────────────────
  // At p=0.86 ink starts rising from bottom; at p=1.0 screen is fully black
  const inkHeight = useTransform(p, [0.86, 1.0], ["0%", "100%"]);
  // Scan line: accent-coloured 2px line at the leading edge of the ink wipe
  const scanLineBottom = useTransform(p, [0.86, 1.0], ["100%", "0%"]);
  const scanLineOpacity = useTransform(p, [0.86, 0.93, 1.0], [0, 1, 0]);

  // ── World brightness dimming into exit ────────────────────────────────────
  const worldBrightness = useTransform(p, [0.80, 0.96], [1, 0.15]);

  // ── Narrative phases ──────────────────────────────────────────────────────
  // Phase 0 (entry): chapter number + title
  const entryOpacity  = useTransform(p, [0, 0.08, 0.14, 0.20], [0, 1, 1, 0]);
  // Phase 1: cliff note
  const cliffOpacity  = useTransform(p, [0.12, 0.22, 0.32, 0.40], [0, 1, 1, 0]);
  const cliffY        = useTransform(p, [0.12, 0.22], [24, 0]);
  // Phase 2: paragraphs (each staggers in)
  const p1Opacity     = useTransform(p, [0.38, 0.46, 0.60, 0.66], [0, 1, 1, 0]);
  const p1Y           = useTransform(p, [0.38, 0.46], [20, 0]);
  const p2Opacity     = useTransform(p, [0.44, 0.52, 0.60, 0.66], [0, 1, 1, 0]);
  const p2Y           = useTransform(p, [0.44, 0.52], [20, 0]);
  const p3Opacity     = useTransform(p, [0.50, 0.58, 0.60, 0.66], [0, 1, 1, 0]);
  const p3Y           = useTransform(p, [0.50, 0.58], [20, 0]);
  // Phase 3: outcomes + skill
  const phase3Opacity = useTransform(p, [0.65, 0.74, 0.82, 0.88], [0, 1, 1, 0]);
  const phase3Y       = useTransform(p, [0.65, 0.74], [18, 0]);

  // Card overall — fades out during exit
  const cardOpacity   = useTransform(p, [0.84, 0.92], [1, 0]);

  // Chapter number (top right corner) — always visible while in world
  const numOpacity    = useTransform(p, [0, 0.06, 0.84, 0.92], [0, 1, 1, 0]);

  // ── Audio ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v > 0.05 && v < 0.92) playWorld(chapter.id);
    });
  }, [scrollYProgress, chapter.id]);

  // ── Mobile detection ──────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      style={{ position: "relative", height: "300vh" }}
    >
      {/* ── STICKY VIEWPORT ────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: world.ink,
        }}
      >
        {/* ── WORLD BRIGHTNESS WRAPPER ──────────────────────────────────── */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            filter: useTransform(worldBrightness, (v) => `brightness(${v})`),
          }}
        >
          {/* ── LAYER 0: SKY ────────────────────────────────────────────── */}
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              y: skyY,
              backgroundImage: `url(${world.sky})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              willChange: "transform",
            }}
          />

          {/* ── LAYER 1: FAR ────────────────────────────────────────────── */}
          <motion.img
            src={world.far}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              y: farY,
              objectFit: "cover",
              objectPosition: "bottom center",
              willChange: "transform",
              opacity: 0.7,
            }}
          />

          {/* ── LAYER 2: MID ────────────────────────────────────────────── */}
          <motion.img
            src={world.mid}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              y: midY,
              objectFit: "cover",
              objectPosition: "bottom center",
              willChange: "transform",
            }}
          />

          {/* ── LAYER 3: NEAR ───────────────────────────────────────────── */}
          <motion.img
            src={world.near}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              y: nearY,
              objectFit: "cover",
              objectPosition: "bottom center",
              willChange: "transform",
            }}
          />

          {/* ── LAYER 4: FG CHARACTER ───────────────────────────────────── */}
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              x: "-50%",
              width: isMobile ? "clamp(240px, 80vw, 420px)" : "clamp(360px, 55vw, 780px)",
              originY: "bottom",
              y: fgY,
              scale: fgScale,
              willChange: "transform",
              zIndex: 4,
            }}
          >
            <img
              src={world.fg}
              alt={`${chapter.org} world`}
              style={{
                width: "100%",
                display: "block",
                objectFit: "contain",
                objectPosition: "bottom center",
                filter: `drop-shadow(0 -30px 80px rgba(0,0,0,0.8)) drop-shadow(0 0 40px ${accent}30)`,
              }}
            />
          </motion.div>
        </motion.div>

        {/* ── ATMOSPHERE OVERLAYS ───────────────────────────────────────── */}
        {/* Ink vignette — edges + bottom fade to world ink colour */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            background: `
              radial-gradient(ellipse 110% 90% at 50% 60%, transparent 30%, ${world.ink}99 100%),
              linear-gradient(180deg, ${world.ink}44 0%, transparent 20%, transparent 55%, ${world.ink}ee 100%)
            `,
            pointerEvents: "none",
          }}
        />
        {/* Accent ground glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "45%",
            zIndex: 6,
            background: `radial-gradient(ellipse 90% 100% at 50% 100%, ${accent}1a 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />

        {/* ── INK WIPE EXIT ─────────────────────────────────────────────── */}
        {/* Rising ink curtain from bottom */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: inkHeight,
            background: world.ink,
            zIndex: 30,
            pointerEvents: "none",
          }}
        />
        {/* Scan line at the ink leading edge */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            bottom: scanLineBottom,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${accent} 20%, ${accent} 80%, transparent 100%)`,
            boxShadow: `0 0 12px ${accent}, 0 0 30px ${accent}88`,
            opacity: scanLineOpacity,
            zIndex: 31,
            pointerEvents: "none",
          }}
        />

        {/* ── CHAPTER NUMBER — top-right watermark ──────────────────────── */}
        <motion.div
          style={{
            position: "absolute",
            top: 20,
            right: isMobile ? 16 : 24,
            zIndex: 20,
            opacity: numOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: isMobile ? 28 : 44,
              fontWeight: 700,
              color: accent,
              lineHeight: 1,
              textShadow: `0 0 40px ${accent}66`,
            }}
          >
            {String(chapter.index).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(240,236,228,0.35)",
            }}
          >
            {chapter.year}
          </span>
        </motion.div>

        {/* ── WORLD PROGRESS BAR — bottom edge ──────────────────────────── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 2,
            width: useTransform(p, [0, 1], ["0%", "100%"]),
            background: `linear-gradient(90deg, ${accent}44, ${accent})`,
            boxShadow: `0 0 8px ${accent}66`,
            zIndex: 40,
          }}
        />

        {/* ── CHAPTER CARD — center bottom, frosted glass ───────────────── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: isMobile ? 56 : 72,
            left: "50%",
            x: "-50%",
            width: isMobile ? "calc(100vw - 32px)" : "clamp(400px, 52vw, 640px)",
            zIndex: 20,
            opacity: cardOpacity,
          }}
        >
          {/* Glass card */}
          <div
            style={{
              background: "rgba(5, 3, 16, 0.68)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${accent}28`,
              borderTop: `2px solid ${accent}55`,
              boxShadow: `
                0 -4px 40px ${accent}18,
                0 24px 60px rgba(0,0,0,0.7),
                inset 0 1px 0 ${accent}22
              `,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Subtle top accent strip */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
              }}
            />

            {/* Card inner padding */}
            <div style={{ padding: isMobile ? "20px 18px 18px" : "28px 32px 24px" }}>

              {/* ── ENTRY PHASE: org title + role ──────────────────────── */}
              <motion.div
                style={{ opacity: entryOpacity, position: "relative" }}
              >
                <div style={{ marginBottom: 6 }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: isMobile ? "clamp(22px, 6vw, 30px)" : "clamp(26px, 3.5vw, 44px)",
                      fontWeight: 700,
                      color: "#f0ece4",
                      lineHeight: 1.0,
                      margin: 0,
                      textShadow: "0 2px 20px rgba(0,0,0,0.9)",
                    }}
                  >
                    {chapter.org}
                  </h2>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: isMobile ? 9 : 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: accent,
                      opacity: 0.8,
                      marginTop: 6,
                    }}
                  >
                    {chapter.role}
                  </div>
                </div>
              </motion.div>

              {/* ── PHASE 1: CLIFF NOTE ────────────────────────────────── */}
              <motion.div
                style={{
                  opacity: cliffOpacity,
                  y: cliffY,
                  position: "relative",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: isMobile ? "clamp(15px, 4vw, 19px)" : "clamp(17px, 2vw, 24px)",
                    color: "rgba(240,236,228,0.95)",
                    lineHeight: 1.5,
                    margin: 0,
                    fontWeight: 500,
                    textShadow: "0 2px 16px rgba(0,0,0,0.8)",
                  }}
                >
                  {chapter.cliff}
                </p>
              </motion.div>

              {/* ── PHASE 2: PARAGRAPHS ────────────────────────────────── */}
              <div style={{ position: "relative" }}>
                {[
                  { text: chapter.paragraphs[0], o: p1Opacity, y: p1Y },
                  { text: chapter.paragraphs[1], o: p2Opacity, y: p2Y },
                  { text: chapter.paragraphs[2], o: p3Opacity, y: p3Y },
                ].map(({ text, o, y }, i) =>
                  text ? (
                    <motion.p
                      key={i}
                      style={{
                        opacity: o,
                        y,
                        fontFamily: "var(--font-display)",
                        fontSize: isMobile ? 13 : "clamp(13px, 1.3vw, 15px)",
                        color:
                          i === 0
                            ? "rgba(240,236,228,0.75)"
                            : i === 1
                            ? "rgba(240,236,228,0.60)"
                            : "rgba(240,236,228,0.50)",
                        lineHeight: 1.68,
                        margin: "0 0 8px",
                        position: "relative",
                        textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                        ...(i === 2 ? { fontStyle: "italic" } : {}),
                      }}
                    >
                      {text}
                    </motion.p>
                  ) : null
                )}
              </div>

              {/* ── PHASE 3: OUTCOMES + SKILL ──────────────────────────── */}
              <motion.div
                style={{
                  opacity: phase3Opacity,
                  y: phase3Y,
                  position: "relative",
                }}
              >
                {/* Outcome pills */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 5,
                    marginBottom: 14,
                  }}
                >
                  {chapter.outcomes.map((o) => (
                    <span
                      key={o}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: isMobile ? 9 : 10,
                        letterSpacing: "0.04em",
                        color: accent,
                        padding: "4px 10px",
                        background: `${accent}14`,
                        border: `1px solid ${accent}38`,
                      }}
                    >
                      {o}
                    </span>
                  ))}
                </div>

                {/* Skill card + built-on */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 10,
                    paddingTop: 12,
                    borderTop: `1px solid ${accent}22`,
                  }}
                >
                  {/* Skill unlocked */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: chapter.skill.color,
                        boxShadow: `0 0 12px ${chapter.skill.color}`,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 7,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: chapter.skill.color,
                          marginBottom: 2,
                        }}
                      >
                        Skill Unlocked
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: isMobile ? 13 : 15,
                          fontWeight: 600,
                          color: "#f0ece4",
                        }}
                      >
                        {chapter.skill.name}
                      </div>
                    </div>
                  </div>

                  {/* Built-on lineage — compact */}
                  {chapter.builtOn.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 7,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "rgba(240,236,228,0.22)",
                          marginRight: 2,
                        }}
                      >
                        Built on
                      </span>
                      {chapter.builtOn.slice(-3).map((s, i, arr) => (
                        <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 8,
                              color: "rgba(240,236,228,0.38)",
                              padding: "2px 6px",
                              border: "1px solid rgba(240,236,228,0.1)",
                            }}
                          >
                            {s}
                          </span>
                          {i < arr.length - 1 && (
                            <span style={{ color: "rgba(240,236,228,0.15)", fontSize: 8 }}>→</span>
                          )}
                        </span>
                      ))}
                      {chapter.builtOn.length > 3 && (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 8,
                            color: "rgba(240,236,228,0.25)",
                          }}
                        >
                          +{chapter.builtOn.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* ── WORLD ID watermark — bottom left ──────────────────────────── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 14,
            left: isMobile ? 16 : 24,
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.14)",
            zIndex: 20,
            opacity: numOpacity,
          }}
        >
          {chapter.id}
        </motion.div>

      </div>
      {/* END STICKY */}
    </section>
  );
}
