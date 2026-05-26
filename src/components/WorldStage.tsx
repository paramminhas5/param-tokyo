"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { WorldParticles } from "./WorldParticles";
import { playWorld } from "@/game/ambient";

interface Props {
  chapter: Chapter;
}

/**
 * WorldStage v4 — "The world is the story."
 *
 * Three cards, three zones, three entrance directions. No overlaps. Ever.
 * FG character choreographs with each card phase.
 * Entry revealed by a scan line sweeping left-to-right.
 * Per-world ambient particles.
 *
 * Scroll timing (400vh):
 *   p 0.00–0.04  Black → world blooms (bg brightens)
 *   p 0.02–0.06  Entry scan line sweeps L→R
 *   p 0.04–0.10  FG rises from below
 *   p 0.06–0.13  Title card center-screen (chapter # + org + role)
 *   p 0.13–0.15  Title fades → watermark appears top-left
 *
 *   p 0.14–0.32  CARD 1 — HOOK (cliff note) — slides UP, bottom-center
 *   p 0.34–0.64  CARD 2 — STORY (paragraphs) — slides from LEFT, bottom-left
 *                  p 0.44: para 2 fades in within card
 *                  p 0.54: para 3 fades in within card
 *   p 0.68–0.84  CARD 3 — PROOF (outcomes + skill) — slides from RIGHT, bottom-right
 *
 *   p 0.84–0.90  FG departs: sinks + fades
 *   p 0.88–0.98  BG dims
 *   p 0.90–1.00  Ink wipe rises from bottom + scan line at edge
 */
export function WorldStage({ chapter }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const world      = WORLDS[chapter.id] ?? WORLDS.origin;
  const accent     = world.accent;

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start start", "end end"],
  });

  // Spring — physical weight to all motion
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });

  // ── BACKGROUND ──────────────────────────────────────────────────────────
  const bgY          = useTransform(p, [0, 1], ["0%", "-6%"]);
  const bgScale      = useTransform(p, [0, 1], [1.06, 1.0]);
  const bgBrightness = useTransform(p,
    [0, 0.04, 0.88, 0.98],
    [0,    1,    1, 0.08]
  );

  // ── ENTRY SCAN LINE (sweeps L→R as world blooms) ────────────────────────
  const scanEntryW   = useTransform(p, [0.02, 0.07], ["0%", "100%"]);
  const scanEntryO   = useTransform(p, [0.02, 0.04, 0.06, 0.09], [0, 1, 1, 0]);

  // ── FG CHARACTER ────────────────────────────────────────────────────────
  // Enter (rise from below) → present → choreograph per card → depart (sink)
  const fgOpacity  = useTransform(p, [0, 0.07, 0.80, 0.90], [0, 1, 1, 0]);
  const fgEnterY   = useTransform(p, [0.04, 0.10], [80, 0]);
  const fgScale    = useTransform(p, [0.04, 0.10, 0.80, 0.90], [0.94, 1.0, 1.0, 0.96]);
  const fgParallax = useTransform(p, [0.10, 0.80], ["0%", "-8%"]);
  const fgDepartY  = useTransform(p, [0.80, 0.90], [0, 70]);

  // FG x-drift per card phase — character makes room
  // Neutral → hook: lean in (slight L) → story: step R → proof: step L → depart: center
  const fgX = useTransform(
    p,
    [0.10, 0.14, 0.32, 0.38, 0.64, 0.68, 0.84, 0.88],
    ["0%","-4%","-4%", "6%",  "6%","-6%","-6%",  "0%"]
  );

  // ── TITLE CARD — center screen arrival ──────────────────────────────────
  const titleO     = useTransform(p, [0.06, 0.10, 0.11, 0.14], [0, 1, 1, 0]);
  const titleY     = useTransform(p, [0.06, 0.10], [28, 0]);
  const titleScale = useTransform(p, [0.06, 0.10], [0.90, 1]);

  // ── WATERMARK — top-left after title drifts ──────────────────────────────
  const wmarkO = useTransform(p, [0.13, 0.16, 0.88, 0.92], [0, 1, 1, 0]);

  // ── CARD 1: HOOK — bottom-center, slides UP ─────────────────────────────
  const c1O = useTransform(p, [0.14, 0.20, 0.28, 0.32], [0, 1, 1, 0]);
  const c1Y = useTransform(p, [0.14, 0.20, 0.28, 0.32], [48, 0, 0, 48]);

  // ── CARD 2: STORY — bottom-left, slides from LEFT ───────────────────────
  const c2O = useTransform(p, [0.34, 0.40, 0.58, 0.64], [0, 1, 1, 0]);
  const c2X = useTransform(p, [0.34, 0.40, 0.58, 0.64], [-52, 0, 0, -52]);
  // Inner para stagger
  const c2p2O = useTransform(p, [0.44, 0.50], [0, 1]);
  const c2p3O = useTransform(p, [0.54, 0.60], [0, 1]);

  // ── CARD 3: PROOF — bottom-right, slides from RIGHT ─────────────────────
  const c3O = useTransform(p, [0.68, 0.74, 0.80, 0.84], [0, 1, 1, 0]);
  const c3X = useTransform(p, [0.68, 0.74, 0.80, 0.84], [52, 0, 0, 52]);

  // ── INK WIPE EXIT ───────────────────────────────────────────────────────
  const inkH      = useTransform(p, [0.90, 1.0], ["0%", "100%"]);
  const scanExitB = useTransform(p, [0.90, 1.0],  ["100%", "0%"]);
  const scanExitO = useTransform(p, [0.90, 0.95, 1.0], [0, 1, 0]);

  // ── PROGRESS BAR ────────────────────────────────────────────────────────
  const progressW = useTransform(p, [0, 1], ["0%", "100%"]);

  // ── PARTICLES VISIBILITY ────────────────────────────────────────────────
  const [ptVisible, setPtVisible] = useState(false);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setPtVisible(v > 0.05 && v < 0.90);
    });
  }, [scrollYProgress]);

  // ── AUDIO ────────────────────────────────────────────────────────────────
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v > 0.04 && v < 0.88) playWorld(chapter.id);
    });
  }, [scrollYProgress, chapter.id]);

  // ── MOBILE ──────────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Shared card glass style
  const glass: React.CSSProperties = {
    background:          "rgba(5, 3, 16, 0.68)",
    backdropFilter:      "blur(18px)",
    WebkitBackdropFilter:"blur(18px)",
    boxShadow:           `0 16px 60px rgba(0,0,0,0.6), 0 0 0 1px ${accent}22`,
  };

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      style={{ position: "relative", height: "400vh" }}
    >
      {/* ── STICKY VIEWPORT ─────────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        overflow: "hidden", background: world.ink,
      }}>

        {/* ── BACKGROUND ───────────────────────────────────────────────── */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute", inset: "-6%",
            backgroundImage:    `url(${world.bg})`,
            backgroundSize:     "cover",
            backgroundPosition: "center",
            y: bgY, scale: bgScale,
            filter: useTransform(bgBrightness, (v) =>
              `brightness(${v * world.brightness / 0.45}) saturate(1.15)`
            ),
            willChange: "transform",
          }}
        />

        {/* ── VIGNETTE ─────────────────────────────────────────────────── */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: world.vignette,
          pointerEvents: "none",
        }} />

        {/* ── PARTICLES ────────────────────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          <WorldParticles theme={world.particles} visible={ptVisible} />
        </div>

        {/* ── ENTRY SCAN LINE (L→R reveal) ─────────────────────────────── */}
        <motion.div aria-hidden style={{
          position: "absolute", top: 0, left: 0, bottom: 0,
          width: scanEntryW,
          background: `linear-gradient(90deg, transparent, ${accent}66, transparent)`,
          boxShadow: `2px 0 20px ${accent}88`,
          opacity: scanEntryO,
          zIndex: 22, pointerEvents: "none",
        }} />

        {/* ── FG CHARACTER ─────────────────────────────────────────────── */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: "50%",
          x: useTransform(fgX, (v) => `calc(-50% + ${v})`),
          width: isMobile
            ? "clamp(160px, 50vw, 280px)"
            : "clamp(240px, 34vw, 460px)",
          transformOrigin: "bottom center",
          opacity: fgOpacity,
          y:     useTransform([fgEnterY, fgDepartY], ([ey, dy]) => (ey as number) + (dy as number)),
          scale: fgScale,
          zIndex: 4, willChange: "transform",
        }}>
          <motion.img
            src={world.fg}
            alt={chapter.org}
            style={{
              width: "100%", display: "block",
              objectFit: "contain", objectPosition: "bottom center",
              y: fgParallax,
              filter: `drop-shadow(0 -14px 44px rgba(0,0,0,0.75))
                       drop-shadow(0 0 20px ${accent}1a)`,
            }}
          />
        </motion.div>

        {/* ── TITLE CARD — center screen on arrival ────────────────────── */}
        <motion.div
          style={{
            position: "absolute", top: "50%", left: "50%",
            x: "-50%", y: titleY, translateY: "-50%",
            opacity: titleO, scale: titleScale,
            zIndex: 12, textAlign: "center", pointerEvents: "none",
          }}
        >
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize:   isMobile ? 52 : 80,
            fontWeight: 700, color: accent, lineHeight: 1,
            textShadow: `0 0 80px ${accent}77, 0 4px 30px rgba(0,0,0,0.95)`,
            marginBottom: 10,
          }}>
            {String(chapter.index).padStart(2, "0")}
          </div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize:   isMobile ? "clamp(26px, 7vw, 38px)" : "clamp(34px, 5vw, 60px)",
            fontWeight: 700, color: "#f0ece4", lineHeight: 1.0,
            textShadow: "0 4px 32px rgba(0,0,0,0.95)", marginBottom: 8,
          }}>
            {chapter.org}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 9 : 11,
            letterSpacing: "0.24em", textTransform: "uppercase",
            color: "rgba(240,236,228,0.6)",
          }}>
            {chapter.role} · {chapter.year}
          </div>
        </motion.div>

        {/* ── WATERMARK — top-left after title ─────────────────────────── */}
        <motion.div style={{
          position: "absolute",
          top:  isMobile ? 14 : 22,
          left: isMobile ? 38 : 46,
          zIndex: 12, opacity: wmarkO,
          display: "flex", alignItems: "baseline", gap: 9,
          pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize:   isMobile ? 18 : 24,
            fontWeight: 700, color: accent, lineHeight: 1,
            textShadow: `0 0 20px ${accent}44`,
          }}>
            {String(chapter.index).padStart(2, "0")}
          </span>
          <div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize:   isMobile ? 12 : 15,
              fontWeight: 600, color: "#f0ece4", lineHeight: 1.1,
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            }}>
              {chapter.org}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 7, letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(240,236,228,0.32)", marginTop: 2,
            }}>
              {chapter.role} · {chapter.year}
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            CARD 1 — HOOK (cliff note)
            Position: bottom-center, slides UP
        ════════════════════════════════════════════════════════════════ */}
        <motion.div style={{
          position: "absolute",
          bottom:   isMobile ? 44 : 68,
          left:     "50%", x: "-50%",
          width:    isMobile ? "calc(100vw - 32px)" : "clamp(400px, 58vw, 680px)",
          zIndex:   12, opacity: c1O, y: c1Y,
        }}>
          <div style={{
            ...glass,
            padding:    isMobile ? "18px 20px" : "22px 32px",
            borderTop:  `3px solid ${accent}`,
          }}>
            <p style={{
              fontFamily:  "var(--font-display)",
              fontSize:    isMobile ? 17 : 21,
              fontWeight:  500,
              color:       "rgba(240,236,228,0.96)",
              lineHeight:  1.5,
              margin:      0,
              textAlign:   "center",
              textShadow:  "0 2px 14px rgba(0,0,0,0.85)",
            }}>
              {chapter.cliff}
            </p>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            CARD 2 — STORY (paragraphs, bottom-left, slides from LEFT)
        ════════════════════════════════════════════════════════════════ */}
        <motion.div style={{
          position: "absolute",
          bottom:   isMobile ? 44 : 68,
          left:     isMobile ? 16 : 48,
          right:    isMobile ? 16 : "auto",
          width:    isMobile ? "auto" : "clamp(320px, 38vw, 460px)",
          zIndex:   12, opacity: c2O, x: c2X,
        }}>
          <div style={{
            ...glass,
            padding:    isMobile ? "16px 18px" : "20px 26px",
            borderLeft: `3px solid ${accent}`,
          }}>
            {/* Para 1 — always visible when card is */}
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize:   isMobile ? 13 : 14,
              color:      "rgba(240,236,228,0.88)",
              lineHeight: 1.68, margin: 0,
              textShadow: "0 1px 8px rgba(0,0,0,0.7)",
            }}>
              {chapter.paragraphs[0]}
            </p>

            {/* Para 2 — fades in mid-way */}
            {chapter.paragraphs[1] && (
              <motion.div style={{ opacity: c2p2O }}>
                <div style={{
                  height: 1, background: `${accent}22`,
                  margin: "12px 0",
                }} />
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   isMobile ? 13 : 14,
                  color:      "rgba(240,236,228,0.74)",
                  lineHeight: 1.68, margin: 0,
                  textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                }}>
                  {chapter.paragraphs[1]}
                </p>
              </motion.div>
            )}

            {/* Para 3 — fades in near end (italic, the lesson) */}
            {chapter.paragraphs[2] && (
              <motion.div style={{ opacity: c2p3O }}>
                <div style={{
                  height: 1, background: `${accent}22`,
                  margin: "12px 0",
                }} />
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   isMobile ? 13 : 14,
                  color:      "rgba(240,236,228,0.60)",
                  lineHeight: 1.68, margin: 0,
                  fontStyle:  "italic",
                  textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                }}>
                  {chapter.paragraphs[2]}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            CARD 3 — PROOF (outcomes + skill, bottom-right, slides from RIGHT)
        ════════════════════════════════════════════════════════════════ */}
        <motion.div style={{
          position: "absolute",
          bottom:   isMobile ? 44 : 68,
          right:    isMobile ? 16 : 48,
          left:     isMobile ? 16 : "auto",
          width:    isMobile ? "auto" : "clamp(260px, 30vw, 360px)",
          zIndex:   12, opacity: c3O, x: c3X,
        }}>
          <div style={{
            ...glass,
            padding:     isMobile ? "16px 18px" : "20px 24px",
            borderRight: `3px solid ${accent}`,
          }}>
            {/* Outcomes list */}
            <div style={{ marginBottom: 14 }}>
              {chapter.outcomes.map((outcome, i) => (
                <div key={outcome} style={{
                  display:       "flex",
                  alignItems:    "center",
                  gap:           10,
                  marginBottom:  i < chapter.outcomes.length - 1 ? 8 : 0,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: accent,
                    boxShadow:  `0 0 8px ${accent}cc`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily:  "var(--font-mono)",
                    fontSize:    isMobile ? 10 : 11,
                    color:       accent,
                    letterSpacing: "0.02em",
                    textShadow:  `0 0 10px ${accent}66`,
                  }}>
                    {outcome}
                  </span>
                </div>
              ))}
            </div>

            {/* Skill badge */}
            <div style={{
              display:    "flex", alignItems: "center", gap: 10,
              paddingTop: 12,
              borderTop:  `1px solid ${accent}33`,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: chapter.skill.color,
                boxShadow:  `0 0 14px ${chapter.skill.color}`,
                flexShrink: 0,
                animation:  "skill-pulse 2s ease-in-out infinite",
              }} />
              <div>
                <div style={{
                  fontFamily:    "var(--font-mono)",
                  fontSize:      7, letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color:         chapter.skill.color,
                  marginBottom:  2,
                }}>
                  Skill Unlocked
                </div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   isMobile ? 14 : 16,
                  fontWeight: 600, color: "#f0ece4",
                }}>
                  {chapter.skill.name}
                </div>
                {chapter.builtOn.length > 0 && (
                  <div style={{
                    fontFamily:    "var(--font-mono)",
                    fontSize:      8,
                    color:         "rgba(240,236,228,0.30)",
                    marginTop:     3, letterSpacing: "0.05em",
                  }}>
                    Built on: {chapter.builtOn.slice(-3).join(" → ")}
                    {chapter.builtOn.length > 3 ? ` +${chapter.builtOn.length - 3}` : ""}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── EXIT INK WIPE ────────────────────────────────────────────── */}
        <motion.div aria-hidden style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: inkH, background: world.ink,
          zIndex: 30, pointerEvents: "none",
        }} />
        <motion.div aria-hidden style={{
          position: "absolute", bottom: scanExitB, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow:  `0 0 16px ${accent}, 0 0 40px ${accent}88`,
          opacity:    scanExitO,
          zIndex: 31, pointerEvents: "none",
        }} />

        {/* ── PROGRESS BAR ─────────────────────────────────────────────── */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: 0, height: 2,
          width: progressW,
          background: `linear-gradient(90deg, ${accent}44, ${accent})`,
          boxShadow:  `0 0 8px ${accent}66`,
          zIndex: 40,
        }} />

        {/* ── WORLD ID — bottom right ───────────────────────────────────── */}
        <motion.div style={{
          position: "absolute",
          bottom: 10, right: isMobile ? 14 : 22,
          fontFamily: "var(--font-mono)", fontSize: 8,
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "rgba(240,236,228,0.11)", zIndex: 20,
          opacity: wmarkO,
        }}>
          {chapter.id}
        </motion.div>

      </div>

      <style>{`
        @keyframes skill-pulse {
          0%, 100% { box-shadow: 0 0 8px ${chapter.skill.color}; }
          50%       { box-shadow: 0 0 20px ${chapter.skill.color}, 0 0 40px ${chapter.skill.color}66; }
        }
      `}</style>
    </section>
  );
}
