"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { playWorld } from "@/game/ambient";

interface Props {
  chapter: Chapter;
}

/**
 * WorldStage — beautiful scene, narrative lives inside it.
 *
 * Architecture:
 *   Full-screen painted BG (the -bg.jpg) with subtle parallax
 *   FG character (bottom-center, subtle scale)
 *   Floating narrative elements appear IN the world:
 *     Phase 1: cliff note — small frosted pill, positioned left
 *     Phase 2: paragraphs — individual floating notes at different positions
 *     Phase 3: outcome orbs scattered + skill badge center
 *   Ink wipe transition at exit
 *
 * NO giant card. NO box covering the scene. The world IS the experience.
 */
export function WorldStage({ chapter }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const accent = world.accent;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.5 });

  // ── Background parallax — subtle, the painting stays dominant ──────────────
  const bgY = useTransform(p, [0, 1], ["0%", "-8%"]);
  const bgScale = useTransform(p, [0, 1], [1.05, 1.0]); // slight zoom out as you scroll

  // ── FG character — subtle presence, not overbearing ────────────────────────
  const fgY = useTransform(p, [0, 1], ["0%", "-12%"]);
  const fgScale = useTransform(p, [0, 1], [1.0, 1.12]);
  const fgOpacity = useTransform(p, [0, 0.06, 0.80, 0.90], [0.3, 1, 1, 0.2]);

  // ── Ink wipe exit ─────────────────────────────────────────────────────────
  const inkHeight = useTransform(p, [0.90, 1.0], ["0%", "100%"]);
  const scanLineBottom = useTransform(p, [0.90, 1.0], ["100%", "0%"]);
  const scanLineOpacity = useTransform(p, [0.90, 0.95, 1.0], [0, 1, 0]);
  const worldBrightness = useTransform(p, [0.85, 0.98], [1, 0.12]);

  // ── Phase 1: Cliff note — floating pill, left-of-center ────────────────────
  const cliffOpacity = useTransform(p, [0.08, 0.16, 0.30, 0.38], [0, 1, 1, 0]);
  const cliffY = useTransform(p, [0.08, 0.16], [30, 0]);
  const cliffScale = useTransform(p, [0.08, 0.16], [0.95, 1]);

  // ── Phase 2: Paragraphs — floating at different positions ──────────────────
  const para1Opacity = useTransform(p, [0.34, 0.42, 0.54, 0.60], [0, 1, 1, 0]);
  const para1Y = useTransform(p, [0.34, 0.42], [24, 0]);
  const para2Opacity = useTransform(p, [0.42, 0.50, 0.58, 0.64], [0, 1, 1, 0]);
  const para2Y = useTransform(p, [0.42, 0.50], [24, 0]);
  const para3Opacity = useTransform(p, [0.50, 0.58, 0.62, 0.68], [0, 1, 1, 0]);
  const para3Y = useTransform(p, [0.50, 0.58], [24, 0]);

  // ── Phase 3: Outcomes + Skill — scattered orbs + center badge ──────────────
  const phase3Opacity = useTransform(p, [0.66, 0.74, 0.84, 0.90], [0, 1, 1, 0]);
  const phase3Scale = useTransform(p, [0.66, 0.74], [0.9, 1]);

  // ── Chapter title — top-left, always visible in world ──────────────────────
  const titleOpacity = useTransform(p, [0, 0.05, 0.86, 0.92], [0, 1, 1, 0]);
  const titleY = useTransform(p, [0, 0.06], [16, 0]);

  // ── Audio ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v > 0.04 && v < 0.90) playWorld(chapter.id);
    });
  }, [scrollYProgress, chapter.id]);

  // ── Mobile ────────────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section ref={sectionRef} id={chapter.id} style={{ position: "relative", height: "300vh" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        overflow: "hidden", background: world.ink,
      }}>

        {/* ── WORLD BRIGHTNESS WRAPPER ──────────────────────────────────── */}
        <motion.div style={{
          position: "absolute", inset: 0,
          filter: useTransform(worldBrightness, (v) => `brightness(${v})`),
        }}>

          {/* ── PAINTED BACKGROUND — the beautiful scene ────────────────── */}
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-5%",
              y: bgY,
              scale: bgScale,
              backgroundImage: `url(${world.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              willChange: "transform",
            }}
          />

          {/* ── FG CHARACTER — subtle, bottom-center ────────────────────── */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              x: "-50%",
              width: isMobile ? "clamp(200px, 65vw, 340px)" : "clamp(280px, 40vw, 560px)",
              transformOrigin: "bottom center",
              y: fgY,
              scale: fgScale,
              opacity: fgOpacity,
              zIndex: 3,
              willChange: "transform",
            }}
          >
            <img
              src={world.fg}
              alt={`${chapter.org}`}
              style={{
                width: "100%",
                display: "block",
                objectFit: "contain",
                objectPosition: "bottom center",
                filter: `drop-shadow(0 -20px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 30px ${accent}20)`,
              }}
            />
          </motion.div>
        </motion.div>

        {/* ── ATMOSPHERE — vignette + bottom ink ────────────────────────── */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 4,
          background: `
            radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, ${world.ink}88 100%),
            linear-gradient(180deg, ${world.ink}33 0%, transparent 15%, transparent 65%, ${world.ink}cc 100%)
          `,
          pointerEvents: "none",
        }} />

        {/* ── INK WIPE EXIT ─────────────────────────────────────────────── */}
        <motion.div aria-hidden style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: inkHeight, background: world.ink,
          zIndex: 30, pointerEvents: "none",
        }} />
        <motion.div aria-hidden style={{
          position: "absolute", bottom: scanLineBottom, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 14px ${accent}, 0 0 40px ${accent}66`,
          opacity: scanLineOpacity,
          zIndex: 31, pointerEvents: "none",
        }} />

        {/* ── CHAPTER TITLE — top-left watermark ───────────────────────── */}
        <motion.div style={{
          position: "absolute",
          top: isMobile ? 16 : 24,
          left: isMobile ? 42 : 52,
          zIndex: 10,
          opacity: titleOpacity,
          y: titleY,
          display: "flex", alignItems: "baseline", gap: 12,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 32 : 48,
            fontWeight: 700, color: accent, lineHeight: 1,
            textShadow: `0 0 40px ${accent}55, 0 4px 20px rgba(0,0,0,0.8)`,
          }}>
            {String(chapter.index).padStart(2, "0")}
          </span>
          <div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? 16 : 22,
              fontWeight: 600, color: "#f0ece4", lineHeight: 1.1,
              textShadow: "0 2px 16px rgba(0,0,0,0.9)",
            }}>
              {chapter.org}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(240,236,228,0.45)", marginTop: 3,
            }}>
              {chapter.role} · {chapter.year}
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════
            FLOATING NARRATIVE ELEMENTS — live IN the scene
        ════════════════════════════════════════════════════════════════════ */}

        {/* ── PHASE 1: CLIFF NOTE — small floating pill ────────────────── */}
        <motion.div style={{
          position: "absolute",
          bottom: isMobile ? "32%" : "28%",
          left: isMobile ? "5%" : "8%",
          zIndex: 12,
          opacity: cliffOpacity,
          y: cliffY,
          scale: cliffScale,
          maxWidth: isMobile ? "85vw" : 420,
        }}>
          <div style={{
            padding: isMobile ? "14px 18px" : "18px 24px",
            background: "rgba(5,3,16,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderLeft: `3px solid ${accent}`,
            borderRadius: 2,
            boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 20px ${accent}12`,
          }}>
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? 15 : 18,
              fontWeight: 500,
              color: "rgba(240,236,228,0.95)",
              lineHeight: 1.5,
              margin: 0,
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}>
              {chapter.cliff}
            </p>
          </div>
        </motion.div>

        {/* ── PHASE 2: PARAGRAPHS — floating notes at staggered positions ── */}
        {[
          { text: chapter.paragraphs[0], opacity: para1Opacity, y: para1Y, pos: { bottom: "22%", right: isMobile ? "5%" : "6%" }, align: "right" as const },
          { text: chapter.paragraphs[1], opacity: para2Opacity, y: para2Y, pos: { bottom: "18%", left: isMobile ? "5%" : "8%" }, align: "left" as const },
          { text: chapter.paragraphs[2], opacity: para3Opacity, y: para3Y, pos: { bottom: "24%", right: isMobile ? "4%" : "10%" }, align: "right" as const },
        ].map(({ text, opacity, y, pos, align }, i) =>
          text ? (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                ...pos,
                zIndex: 12,
                opacity,
                y,
                maxWidth: isMobile ? "82vw" : 380,
                textAlign: align,
              }}
            >
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile ? 13 : 14,
                color: i === 0
                  ? "rgba(240,236,228,0.82)"
                  : i === 1
                  ? "rgba(240,236,228,0.70)"
                  : "rgba(240,236,228,0.58)",
                lineHeight: 1.65,
                margin: 0,
                padding: isMobile ? "10px 14px" : "12px 18px",
                background: "rgba(5,3,16,0.45)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: 2,
                borderLeft: align === "left" ? `2px solid ${accent}44` : "none",
                borderRight: align === "right" ? `2px solid ${accent}44` : "none",
                boxShadow: "0 6px 30px rgba(0,0,0,0.4)",
                textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                ...(i === 2 ? { fontStyle: "italic" } : {}),
              }}>
                {text}
              </p>
            </motion.div>
          ) : null
        )}

        {/* ── PHASE 3: OUTCOME ORBS + SKILL BADGE ─────────────────────── */}
        <motion.div style={{
          position: "absolute",
          inset: 0,
          zIndex: 12,
          opacity: phase3Opacity,
          scale: phase3Scale,
          pointerEvents: "none",
        }}>
          {/* Scattered outcome orbs */}
          {chapter.outcomes.map((outcome, i) => {
            // Scatter positions around the viewport
            const positions = [
              { top: "18%", left: "12%" },
              { top: "14%", right: "15%" },
              { top: "28%", left: "6%" },
              { top: "22%", right: "8%" },
              { bottom: "38%", left: "14%" },
              { bottom: "34%", right: "12%" },
              { top: "35%", left: "22%" },
            ];
            const pos = positions[i % positions.length];
            return (
              <div
                key={outcome}
                style={{
                  position: "absolute",
                  ...pos,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  animation: `orb-float ${3 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
                }}
              >
                {/* Glowing orb */}
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: accent,
                  boxShadow: `0 0 12px ${accent}, 0 0 24px ${accent}66`,
                  flexShrink: 0,
                }} />
                {/* Label */}
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: isMobile ? 9 : 10,
                  letterSpacing: "0.04em",
                  color: accent,
                  textShadow: `0 0 12px ${accent}88, 0 2px 8px rgba(0,0,0,0.9)`,
                  whiteSpace: "nowrap",
                }}>
                  {outcome}
                </span>
              </div>
            );
          })}

          {/* Skill badge — center bottom */}
          <div style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 20px",
            background: "rgba(5,3,16,0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${chapter.skill.color}55`,
            boxShadow: `0 0 30px ${chapter.skill.color}22, 0 12px 40px rgba(0,0,0,0.5)`,
            borderRadius: 2,
          }}>
            <div style={{
              width: 12, height: 12, borderRadius: "50%",
              background: chapter.skill.color,
              boxShadow: `0 0 16px ${chapter.skill.color}`,
              flexShrink: 0,
            }} />
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 7, letterSpacing: "0.3em", textTransform: "uppercase",
                color: chapter.skill.color, marginBottom: 2,
              }}>
                Skill Unlocked
              </div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile ? 14 : 16, fontWeight: 600, color: "#f0ece4",
              }}>
                {chapter.skill.name}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── PROGRESS BAR — bottom edge ───────────────────────────────── */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: 0, height: 2,
          width: useTransform(p, [0, 1], ["0%", "100%"]),
          background: `linear-gradient(90deg, ${accent}44, ${accent})`,
          boxShadow: `0 0 8px ${accent}66`,
          zIndex: 40,
        }} />

        {/* ── World ID — bottom right ──────────────────────────────────── */}
        <motion.div style={{
          position: "absolute", bottom: 12, right: isMobile ? 14 : 22,
          fontFamily: "var(--font-mono)", fontSize: 8,
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "rgba(240,236,228,0.14)", zIndex: 20,
          opacity: titleOpacity,
        }}>
          {chapter.id}
        </motion.div>

      </div>

      {/* Orb float animation */}
      <style>{`
        @keyframes orb-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
