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
 * WorldStage v5
 *
 * Key changes from v4:
 * - CARD 1 (Hook): drops FROM THE TOP instead of rising from bottom
 * - WATERMARK: persistent throughout entire world (p 0.13 → 0.96)
 * - All cards have explicit modal headers (CHAPTER XX, THE STORY, OUTCOMES / SKILL EARNED)
 * - Phase indicator (3 dots, one per card) in top-right of each card
 * - FG character larger (40vw desktop)
 * - Cards bottom-clearance increased to 84px to clear skill bar
 * - Story card wider (40vw), para dividers more visible
 * - builtOn lineage: bigger text, "BUILT ON" label, more readable
 * - Entry scan line brighter
 *
 * Scroll timing (400vh):
 *   p 0.00–0.04  Black → world blooms
 *   p 0.02–0.07  Entry scan line L→R
 *   p 0.04–0.10  FG rises
 *   p 0.06–0.13  Title card center-screen
 *   p 0.13+      Watermark appears top-left (PERSISTENT until p 0.96)
 *   p 0.15–0.33  CARD 1 — HOOK — drops from TOP, top-center
 *   p 0.35–0.65  CARD 2 — STORY — slides from LEFT, bottom-left
 *   p 0.68–0.84  CARD 3 — PROOF — slides from RIGHT, bottom-right
 *   p 0.84–0.90  FG departs
 *   p 0.90–1.00  Ink wipe
 */
export function WorldStage({ chapter }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const accent = world.accent;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });


  // ── BACKGROUND ──────────────────────────────────────────────────────────
  const bgY = useTransform(p, [0, 1], ["0%", "-6%"]);
  const bgScale = useTransform(p, [0, 1], [1.06, 1.0]);
  const bgBrightness = useTransform(p, [0, 0.04, 0.88, 0.98], [0, 1, 1, 0.08]);

  // ── ENTRY SCAN LINE ─────────────────────────────────────────────────────
  const scanEntryW = useTransform(p, [0.02, 0.07], ["0%", "100%"]);
  const scanEntryO = useTransform(p, [0.02, 0.04, 0.06, 0.09], [0, 1, 1, 0]);

  // ── FG CHARACTER ────────────────────────────────────────────────────────
  const fgOpacity = useTransform(p, [0, 0.07, 0.80, 0.90], [0, 1, 1, 0]);
  const fgEnterY  = useTransform(p, [0.04, 0.10], [80, 0]);
  const fgScale   = useTransform(p, [0.04, 0.10, 0.80, 0.90], [0.94, 1.0, 1.0, 0.96]);
  const fgParallax = useTransform(p, [0.10, 0.80], ["0%", "-8%"]);
  const fgDepartY  = useTransform(p, [0.80, 0.90], [0, 70]);
  // x-drift: hook→step-left, story→step-right, proof→step-left
  const fgX = useTransform(
    p,
    [0.10, 0.15, 0.33, 0.38, 0.65, 0.68, 0.84, 0.88],
    ["0%", "-4%", "-4%", "6%", "6%", "-6%", "-6%", "0%"]
  );

  // ── TITLE CARD — center screen arrival ──────────────────────────────────
  const titleO     = useTransform(p, [0.06, 0.10, 0.11, 0.13], [0, 1, 1, 0]);
  const titleY     = useTransform(p, [0.06, 0.10], [28, 0]);
  const titleScale = useTransform(p, [0.06, 0.10], [0.90, 1]);

  // ── WATERMARK — persistent from p=0.13 to p=0.96 ────────────────────────
  const wmarkO = useTransform(p, [0.13, 0.16, 0.92, 0.96], [0, 1, 1, 0]);

  // ── CARD 1: HOOK — drops from TOP, top-center ───────────────────────────
  const c1O = useTransform(p, [0.15, 0.21, 0.28, 0.33], [0, 1, 1, 0]);
  // Drops DOWN from above (negative y = above viewport)
  const c1Y = useTransform(p, [0.15, 0.21, 0.28, 0.33], [-56, 0, 0, -56]);

  // ── CARD 2: STORY — bottom-left, slides from LEFT ───────────────────────
  const c2O   = useTransform(p, [0.35, 0.41, 0.59, 0.65], [0, 1, 1, 0]);
  const c2X   = useTransform(p, [0.35, 0.41, 0.59, 0.65], [-56, 0, 0, -56]);
  const c2p2O = useTransform(p, [0.44, 0.50], [0, 1]);
  const c2p3O = useTransform(p, [0.54, 0.60], [0, 1]);

  // ── CARD 3: PROOF — bottom-right, slides from RIGHT ─────────────────────
  const c3O = useTransform(p, [0.68, 0.74, 0.80, 0.84], [0, 1, 1, 0]);
  const c3X = useTransform(p, [0.68, 0.74, 0.80, 0.84], [56, 0, 0, 56]);

  // ── INK WIPE ────────────────────────────────────────────────────────────
  const inkH      = useTransform(p, [0.90, 1.0], ["0%", "100%"]);
  const scanExitB = useTransform(p, [0.90, 1.0], ["100%", "0%"]);
  const scanExitO = useTransform(p, [0.90, 0.95, 1.0], [0, 1, 0]);

  // ── PROGRESS BAR ────────────────────────────────────────────────────────
  const progressW = useTransform(p, [0, 1], ["0%", "100%"]);

  // ── PARTICLES ───────────────────────────────────────────────────────────
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


  // ── SHARED STYLES ────────────────────────────────────────────────────────
  const glass: React.CSSProperties = {
    background: "rgba(5, 3, 16, 0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: `0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px ${accent}25`,
  };

  // Phase indicator dots (3 dots, one per card phase)
  const PhaseDots = ({ active }: { active: 1 | 2 | 3 }) => (
    <div style={{
      display: "flex", gap: 5, alignItems: "center",
    }}>
      {[1, 2, 3].map((n) => (
        <div key={n} style={{
          width: n === active ? 12 : 5,
          height: 4,
          borderRadius: 2,
          background: n === active ? accent : "rgba(240,236,228,0.18)",
          transition: "all 300ms ease",
        }} />
      ))}
    </div>
  );

  // Card section label
  const CardLabel = ({ text }: { text: string }) => (
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: 7,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: accent,
      opacity: 0.8,
      marginBottom: 8,
    }}>
      {text}
    </div>
  );

  return (
    <section ref={sectionRef} id={chapter.id} style={{ position: "relative", height: "400vh" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        overflow: "hidden", background: world.ink,
      }}>


        {/* ── BACKGROUND ───────────────────────────────────────────────── */}
        <motion.div aria-hidden style={{
          position: "absolute", inset: "-6%",
          backgroundImage: `url(${world.bg})`,
          backgroundSize: "cover", backgroundPosition: "center",
          y: bgY, scale: bgScale,
          filter: useTransform(bgBrightness, (v) =>
            `brightness(${v * world.brightness / 0.45}) saturate(1.15)`
          ),
          willChange: "transform",
        }} />

        {/* ── VIGNETTE ─────────────────────────────────────────────────── */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: world.vignette, pointerEvents: "none",
        }} />

        {/* ── PARTICLES ────────────────────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          <WorldParticles theme={world.particles} visible={ptVisible} />
        </div>

        {/* ── ENTRY SCAN LINE ──────────────────────────────────────────── */}
        <motion.div aria-hidden style={{
          position: "absolute", top: 0, left: 0, bottom: 0,
          width: scanEntryW,
          background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
          boxShadow: `2px 0 24px ${accent}99`,
          opacity: scanEntryO,
          zIndex: 22, pointerEvents: "none",
        }} />

        {/* ── FG CHARACTER ─────────────────────────────────────────────── */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: "50%",
          x: useTransform(fgX, (v) => `calc(-50% + ${v})`),
          width: isMobile
            ? "clamp(180px, 55vw, 320px)"
            : "clamp(280px, 40vw, 520px)",
          transformOrigin: "bottom center",
          opacity: fgOpacity,
          y: useTransform([fgEnterY, fgDepartY], ([ey, dy]) => (ey as number) + (dy as number)),
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
              filter: `drop-shadow(0 -14px 44px rgba(0,0,0,0.75)) drop-shadow(0 0 20px ${accent}1a)`,
            }}
          />
        </motion.div>

        {/* ── TITLE CARD — center screen on arrival ────────────────────── */}
        <motion.div style={{
          position: "absolute", top: "50%", left: "50%",
          x: "-50%", y: titleY, translateY: "-50%",
          opacity: titleO, scale: titleScale,
          zIndex: 12, textAlign: "center", pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 52 : 80,
            fontWeight: 700, color: accent, lineHeight: 1,
            textShadow: `0 0 80px ${accent}77, 0 4px 30px rgba(0,0,0,0.95)`,
            marginBottom: 10,
          }}>
            {String(chapter.index).padStart(2, "0")}
          </div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? "clamp(26px, 7vw, 38px)" : "clamp(34px, 5vw, 60px)",
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


        {/* ── WATERMARK — persistent top-left throughout world ─────────── */}
        <motion.div style={{
          position: "absolute",
          top: isMobile ? 14 : 22,
          left: isMobile ? 38 : 46,
          zIndex: 12, opacity: wmarkO,
          display: "flex", alignItems: "baseline", gap: 9,
          pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 20 : 28,
            fontWeight: 700, color: accent, lineHeight: 1,
            textShadow: `0 0 20px ${accent}55`,
          }}>
            {String(chapter.index).padStart(2, "0")}
          </span>
          <div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? 13 : 16,
              fontWeight: 600, color: "#f0ece4", lineHeight: 1.1,
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            }}>
              {chapter.org}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8, letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(240,236,228,0.40)", marginTop: 2,
            }}>
              {chapter.role} · {chapter.year}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            CARD 1 — HOOK (cliff note)
            Position: top-center, DROPS DOWN from above
        ══════════════════════════════════════════════════════════════ */}
        <motion.div style={{
          position: "absolute",
          top: isMobile ? 72 : 88,
          left: "50%", x: "-50%",
          width: isMobile ? "calc(100vw - 32px)" : "clamp(400px, 56vw, 680px)",
          zIndex: 12, opacity: c1O, y: c1Y,
        }}>
          <div style={{
            ...glass,
            padding: isMobile ? "16px 20px 18px" : "20px 32px 22px",
            borderBottom: `3px solid ${accent}`,
          }}>
            {/* Card header */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 7, letterSpacing: "0.32em",
                  textTransform: "uppercase", color: accent, opacity: 0.9,
                }}>
                  Chapter {String(chapter.index).padStart(2, "0")}
                </div>
                <div style={{
                  width: 1, height: 10,
                  background: `${accent}44`,
                }} />
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 7, letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(240,236,228,0.35)",
                }}>
                  {chapter.year}
                </div>
              </div>
              <PhaseDots active={1} />
            </div>
            {/* The hook */}
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? 16 : 20,
              fontWeight: 500,
              color: "rgba(240,236,228,0.96)",
              lineHeight: 1.5,
              margin: 0,
              textAlign: "center",
              textShadow: "0 2px 14px rgba(0,0,0,0.85)",
            }}>
              {chapter.cliff}
            </p>
          </div>
        </motion.div>


        {/* ══════════════════════════════════════════════════════════════
            CARD 2 — STORY (paragraphs)
            Position: bottom-left, slides from LEFT
        ══════════════════════════════════════════════════════════════ */}
        <motion.div style={{
          position: "absolute",
          bottom: isMobile ? 48 : 84,
          left: isMobile ? 16 : 48,
          right: isMobile ? 16 : "auto",
          width: isMobile ? "auto" : "clamp(340px, 40vw, 500px)",
          zIndex: 12, opacity: c2O, x: c2X,
        }}>
          <div style={{
            ...glass,
            padding: isMobile ? "14px 18px" : "18px 24px",
            borderLeft: `3px solid ${accent}`,
          }}>
            {/* Card header */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: 12,
            }}>
              <CardLabel text="The Story" />
              <PhaseDots active={2} />
            </div>

            {/* Para 1 */}
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? 13 : 14,
              color: "rgba(240,236,228,0.88)",
              lineHeight: 1.68, margin: 0,
              textShadow: "0 1px 8px rgba(0,0,0,0.7)",
            }}>
              {chapter.paragraphs[0]}
            </p>

            {/* Para 2 */}
            {chapter.paragraphs[1] && (
              <motion.div style={{ opacity: c2p2O }}>
                <div style={{ height: 1, background: `${accent}33`, margin: "11px 0" }} />
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: isMobile ? 13 : 14,
                  color: "rgba(240,236,228,0.78)",
                  lineHeight: 1.68, margin: 0,
                  textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                }}>
                  {chapter.paragraphs[1]}
                </p>
              </motion.div>
            )}

            {/* Para 3 */}
            {chapter.paragraphs[2] && (
              <motion.div style={{ opacity: c2p3O }}>
                <div style={{ height: 1, background: `${accent}33`, margin: "11px 0" }} />
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: isMobile ? 13 : 14,
                  color: "rgba(240,236,228,0.65)",
                  lineHeight: 1.68, margin: 0,
                  fontStyle: "italic",
                  textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                }}>
                  {chapter.paragraphs[2]}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>


        {/* ══════════════════════════════════════════════════════════════
            CARD 3 — PROOF (outcomes + skill)
            Position: bottom-right, slides from RIGHT
        ══════════════════════════════════════════════════════════════ */}
        <motion.div style={{
          position: "absolute",
          bottom: isMobile ? 48 : 84,
          right: isMobile ? 16 : 48,
          left: isMobile ? 16 : "auto",
          width: isMobile ? "auto" : "clamp(260px, 30vw, 360px)",
          zIndex: 12, opacity: c3O, x: c3X,
        }}>
          <div style={{
            ...glass,
            padding: isMobile ? "14px 18px" : "18px 24px",
            borderRight: `3px solid ${accent}`,
          }}>
            {/* Card header */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: 12,
            }}>
              <CardLabel text="Outcomes" />
              <PhaseDots active={3} />
            </div>

            {/* Outcomes */}
            <div style={{ marginBottom: 16 }}>
              {chapter.outcomes.map((outcome, i) => (
                <div key={outcome} style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  marginBottom: i < chapter.outcomes.length - 1 ? 7 : 0,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: accent,
                    boxShadow: `0 0 8px ${accent}cc`,
                    flexShrink: 0, marginTop: 3,
                  }} />
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: isMobile ? 10 : 11,
                    color: "rgba(240,236,228,0.82)",
                    letterSpacing: "0.02em",
                    lineHeight: 1.4,
                  }}>
                    {outcome}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: `${accent}33`, marginBottom: 12 }} />

            {/* Skill earned label */}
            <CardLabel text="Skill Earned" />

            {/* Skill */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: chapter.skill.color,
                boxShadow: `0 0 14px ${chapter.skill.color}`,
                flexShrink: 0,
                animation: "skill-pulse 2s ease-in-out infinite",
              }} />
              <div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: isMobile ? 15 : 17,
                  fontWeight: 600, color: "#f0ece4",
                  marginBottom: 2,
                }}>
                  {chapter.skill.name}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 8, letterSpacing: "0.12em",
                  color: chapter.skill.color, opacity: 0.7,
                  textTransform: "uppercase",
                }}>
                  {chapter.skill.family}
                </div>
              </div>
            </div>

            {/* Built on */}
            {chapter.builtOn.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 7, letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(240,236,228,0.35)",
                  marginBottom: 6,
                }}>
                  Built on
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9, letterSpacing: "0.04em",
                  color: "rgba(240,236,228,0.50)",
                  lineHeight: 1.6,
                }}>
                  {chapter.builtOn.slice(-4).join(" → ")}
                  {chapter.builtOn.length > 4 ? ` +${chapter.builtOn.length - 4}` : ""}
                </div>
              </div>
            )}
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
          boxShadow: `0 0 16px ${accent}, 0 0 40px ${accent}88`,
          opacity: scanExitO,
          zIndex: 31, pointerEvents: "none",
        }} />

        {/* ── PROGRESS BAR ─────────────────────────────────────────────── */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: 0, height: 2,
          width: progressW,
          background: `linear-gradient(90deg, ${accent}44, ${accent})`,
          boxShadow: `0 0 8px ${accent}66`,
          zIndex: 40,
        }} />

        {/* ── WORLD ID — bottom right ───────────────────────────────────── */}
        <motion.div style={{
          position: "absolute",
          bottom: 10, right: isMobile ? 14 : 22,
          fontFamily: "var(--font-mono)", fontSize: 8,
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "rgba(240,236,228,0.18)", zIndex: 20,
          opacity: wmarkO,
        }}>
          {chapter.id} · {chapter.year}
        </motion.div>

      </div>

      <style>{`
        @keyframes skill-pulse {
          0%, 100% { box-shadow: 0 0 8px ${chapter.skill.color}; }
          50%       { box-shadow: 0 0 22px ${chapter.skill.color}, 0 0 44px ${chapter.skill.color}55; }
        }
      `}</style>
    </section>
  );
}
