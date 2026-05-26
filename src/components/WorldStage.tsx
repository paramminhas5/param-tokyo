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
 * WorldStage v3 — "The world is the story."
 *
 * 400vh per world. 4 acts. One narrative zone. No overlaps.
 *
 * Act 1 (p 0.00–0.15): Arrival — world blooms, FG rises, title appears center then drifts to watermark
 * Act 2 (p 0.15–0.66): Story — cliff note, then paragraphs, one at a time in same position
 * Act 3 (p 0.68–0.80): Proof — outcomes list + skill badge, same position
 * Act 4 (p 0.80–1.00): Departure — FG sinks, world dims, ink wipe
 */
export function WorldStage({ chapter }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const accent = world.accent;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.4 });

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKGROUND
  // ═══════════════════════════════════════════════════════════════════════════
  const bgY = useTransform(p, [0, 1], ["0%", "-6%"]);
  const bgScale = useTransform(p, [0, 1], [1.06, 1.0]);
  const bgBrightness = useTransform(p, [0, 0.03, 0.88, 0.98], [0, 1, 1, 0.1]);

  // ═══════════════════════════════════════════════════════════════════════════
  // FG CHARACTER — enter, present, exit
  // ═══════════════════════════════════════════════════════════════════════════
  const fgOpacity = useTransform(p, [0, 0.06, 0.75, 0.88], [0, 1, 1, 0]);
  const fgY = useTransform(p, [0, 0.06, 0.06, 0.75, 0.75, 0.88], ["80px", "0px", "0px", "0%", "0%", "50px"]);
  const fgScale = useTransform(p, [0, 0.06, 0.75, 0.88], [0.95, 1.0, 1.06, 0.98]);
  const fgParallax = useTransform(p, [0.06, 0.75], ["0%", "-10%"]);

  // ═══════════════════════════════════════════════════════════════════════════
  // TITLE CARD — center-screen entrance, then drifts to top-left watermark
  // ═══════════════════════════════════════════════════════════════════════════
  // Center position (Act 1 entrance)
  const titleCenterOpacity = useTransform(p, [0.04, 0.07, 0.10, 0.13], [0, 1, 1, 0]);
  const titleCenterY = useTransform(p, [0.04, 0.07], [30, 0]);
  const titleCenterScale = useTransform(p, [0.04, 0.07], [0.92, 1]);

  // Watermark (persistent after title drifts)
  const watermarkOpacity = useTransform(p, [0.12, 0.15, 0.88, 0.92], [0, 1, 1, 0]);

  // ═══════════════════════════════════════════════════════════════════════════
  // NARRATIVE ZONE — one thing at a time, same position
  // Each: 4% fade-in, hold, 4% fade-out, 2% gap before next
  // ═══════════════════════════════════════════════════════════════════════════
  const cliffO = useTransform(p, [0.15, 0.19, 0.26, 0.30], [0, 1, 1, 0]);
  const cliffY = useTransform(p, [0.15, 0.19], [20, 0]);

  const p1O = useTransform(p, [0.32, 0.36, 0.40, 0.44], [0, 1, 1, 0]);
  const p1Y = useTransform(p, [0.32, 0.36], [20, 0]);

  const p2O = useTransform(p, [0.46, 0.50, 0.54, 0.58], [0, 1, 1, 0]);
  const p2Y = useTransform(p, [0.46, 0.50], [20, 0]);

  const p3O = useTransform(p, [0.58, 0.62, 0.64, 0.66], [0, 1, 1, 0]);
  const p3Y = useTransform(p, [0.58, 0.62], [20, 0]);

  const proofO = useTransform(p, [0.68, 0.72, 0.78, 0.80], [0, 1, 1, 0]);
  const proofY = useTransform(p, [0.68, 0.72], [20, 0]);

  // ═══════════════════════════════════════════════════════════════════════════
  // INK WIPE EXIT
  // ═══════════════════════════════════════════════════════════════════════════
  const inkHeight = useTransform(p, [0.90, 1.0], ["0%", "100%"]);
  const scanBottom = useTransform(p, [0.90, 1.0], ["100%", "0%"]);
  const scanOpacity = useTransform(p, [0.90, 0.95, 1.0], [0, 1, 0]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESS BAR
  // ═══════════════════════════════════════════════════════════════════════════
  const progressW = useTransform(p, [0, 1], ["0%", "100%"]);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v > 0.03 && v < 0.88) playWorld(chapter.id);
    });
  }, [scrollYProgress, chapter.id]);

  // ═══════════════════════════════════════════════════════════════════════════
  // MOBILE
  // ═══════════════════════════════════════════════════════════════════════════
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // NARRATIVE PILL STYLE — reusable for all text elements
  // ═══════════════════════════════════════════════════════════════════════════
  const pillStyle: React.CSSProperties = {
    padding: isMobile ? "14px 18px" : "18px 24px",
    background: "rgba(5, 3, 16, 0.62)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderLeft: `3px solid ${accent}`,
    borderRadius: 2,
    boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 20px ${accent}0a`,
  };

  return (
    <section ref={sectionRef} id={chapter.id} style={{ position: "relative", height: "400vh" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        overflow: "hidden", background: world.ink,
      }}>

        {/* ═══ BACKGROUND PAINTING ═══════════════════════════════════════ */}
        <motion.div style={{
          position: "absolute", inset: "-6%",
          backgroundImage: `url(${world.bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: bgY,
          scale: bgScale,
          filter: useTransform(bgBrightness, (v) => `brightness(${v}) saturate(1.2)`),
          willChange: "transform",
        }} />

        {/* ═══ ATMOSPHERE OVERLAY ════════════════════════════════════════ */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: `
            radial-gradient(ellipse 130% 100% at 50% 50%, transparent 40%, ${world.ink}77 100%),
            linear-gradient(180deg, ${world.ink}22 0%, transparent 12%, transparent 70%, ${world.ink}bb 100%)
          `,
          pointerEvents: "none",
        }} />

        {/* ═══ FG CHARACTER ══════════════════════════════════════════════ */}
        <motion.div style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          x: "-50%",
          width: isMobile ? "clamp(180px, 55vw, 300px)" : "clamp(260px, 36vw, 500px)",
          transformOrigin: "bottom center",
          opacity: fgOpacity,
          y: fgY,
          scale: fgScale,
          zIndex: 3,
          willChange: "transform",
        }}>
          <motion.img
            src={world.fg}
            alt={chapter.org}
            style={{
              width: "100%",
              display: "block",
              objectFit: "contain",
              objectPosition: "bottom center",
              y: fgParallax,
              filter: `drop-shadow(0 -16px 50px rgba(0,0,0,0.7)) drop-shadow(0 0 24px ${accent}18)`,
            }}
          />
        </motion.div>

        {/* ═══ TITLE CARD — center screen (Act 1 arrival) ═══════════════ */}
        <motion.div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: titleCenterY,
          translateY: "-50%",
          opacity: titleCenterOpacity,
          scale: titleCenterScale,
          zIndex: 10,
          textAlign: "center",
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 48 : 72,
            fontWeight: 700,
            color: accent,
            lineHeight: 1,
            textShadow: `0 0 60px ${accent}66, 0 4px 30px rgba(0,0,0,0.9)`,
            marginBottom: 12,
          }}>
            {String(chapter.index).padStart(2, "0")}
          </div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? "clamp(28px, 8vw, 40px)" : "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
            color: "#f0ece4",
            lineHeight: 1.0,
            textShadow: "0 4px 30px rgba(0,0,0,0.9)",
            marginBottom: 8,
          }}>
            {chapter.org}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 10 : 12,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.55)",
          }}>
            {chapter.role} · {chapter.year}
          </div>
        </motion.div>

        {/* ═══ WATERMARK — top-left, persistent after title drifts ══════ */}
        <motion.div style={{
          position: "absolute",
          top: isMobile ? 14 : 22,
          left: isMobile ? 40 : 48,
          zIndex: 10,
          opacity: watermarkOpacity,
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 20 : 28,
            fontWeight: 700,
            color: accent,
            lineHeight: 1,
            textShadow: `0 0 24px ${accent}44, 0 2px 12px rgba(0,0,0,0.8)`,
          }}>
            {String(chapter.index).padStart(2, "0")}
          </span>
          <div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? 13 : 16,
              fontWeight: 600,
              color: "#f0ece4",
              lineHeight: 1.1,
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            }}>
              {chapter.org}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(240,236,228,0.35)",
              marginTop: 2,
            }}>
              {chapter.role} · {chapter.year}
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            NARRATIVE ZONE — bottom-left, one element at a time
        ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          position: "absolute",
          bottom: isMobile ? 48 : 72,
          left: isMobile ? 16 : 48,
          right: isMobile ? 16 : "auto",
          maxWidth: isMobile ? "none" : 440,
          zIndex: 10,
        }}>

          {/* ─── CLIFF NOTE ─────────────────────────────────────────── */}
          <motion.div style={{ opacity: cliffO, y: cliffY, position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <div style={pillStyle}>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile ? 16 : 18,
                fontWeight: 500,
                color: "rgba(240,236,228,0.95)",
                lineHeight: 1.55,
                margin: 0,
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              }}>
                {chapter.cliff}
              </p>
            </div>
          </motion.div>

          {/* ─── PARAGRAPH 1 ────────────────────────────────────────── */}
          <motion.div style={{ opacity: p1O, y: p1Y, position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <div style={pillStyle}>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile ? 14 : 15,
                color: "rgba(240,236,228,0.85)",
                lineHeight: 1.65,
                margin: 0,
                textShadow: "0 1px 8px rgba(0,0,0,0.7)",
              }}>
                {chapter.paragraphs[0]}
              </p>
            </div>
          </motion.div>

          {/* ─── PARAGRAPH 2 ────────────────────────────────────────── */}
          {chapter.paragraphs[1] && (
            <motion.div style={{ opacity: p2O, y: p2Y, position: "absolute", bottom: 0, left: 0, right: 0 }}>
              <div style={pillStyle}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: isMobile ? 14 : 15,
                  color: "rgba(240,236,228,0.75)",
                  lineHeight: 1.65,
                  margin: 0,
                  textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                }}>
                  {chapter.paragraphs[1]}
                </p>
              </div>
            </motion.div>
          )}

          {/* ─── PARAGRAPH 3 ────────────────────────────────────────── */}
          {chapter.paragraphs[2] && (
            <motion.div style={{ opacity: p3O, y: p3Y, position: "absolute", bottom: 0, left: 0, right: 0 }}>
              <div style={pillStyle}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: isMobile ? 14 : 15,
                  color: "rgba(240,236,228,0.65)",
                  lineHeight: 1.65,
                  margin: 0,
                  fontStyle: "italic",
                  textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                }}>
                  {chapter.paragraphs[2]}
                </p>
              </div>
            </motion.div>
          )}

          {/* ─── OUTCOMES + SKILL (compact list) ────────────────────── */}
          <motion.div style={{ opacity: proofO, y: proofY, position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <div style={pillStyle}>
              {/* Outcomes as compact list with orb dots */}
              <div style={{ marginBottom: 14 }}>
                {chapter.outcomes.map((outcome) => (
                  <div key={outcome} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: accent,
                      boxShadow: `0 0 8px ${accent}`,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: isMobile ? 10 : 11,
                      color: accent,
                      letterSpacing: "0.02em",
                      textShadow: `0 0 8px ${accent}44`,
                    }}>
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>

              {/* Skill badge */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingTop: 12,
                borderTop: `1px solid ${accent}33`,
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: chapter.skill.color,
                  boxShadow: `0 0 12px ${chapter.skill.color}`,
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 7, letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: chapter.skill.color,
                    marginBottom: 2,
                  }}>
                    Skill Unlocked
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: isMobile ? 14 : 16,
                    fontWeight: 600,
                    color: "#f0ece4",
                  }}>
                    {chapter.skill.name}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
        {/* END NARRATIVE ZONE */}

        {/* ═══ INK WIPE ═════════════════════════════════════════════════ */}
        <motion.div aria-hidden style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: inkHeight, background: world.ink,
          zIndex: 30, pointerEvents: "none",
        }} />
        <motion.div aria-hidden style={{
          position: "absolute", bottom: scanBottom, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 14px ${accent}, 0 0 40px ${accent}66`,
          opacity: scanOpacity,
          zIndex: 31, pointerEvents: "none",
        }} />

        {/* ═══ PROGRESS BAR ═════════════════════════════════════════════ */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: 0, height: 2,
          width: progressW,
          background: `linear-gradient(90deg, ${accent}44, ${accent})`,
          boxShadow: `0 0 8px ${accent}66`,
          zIndex: 40,
        }} />

        {/* ═══ WORLD ID — bottom right ═════════════════════════════════ */}
        <motion.div style={{
          position: "absolute", bottom: 10, right: isMobile ? 14 : 22,
          fontFamily: "var(--font-mono)", fontSize: 8,
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "rgba(240,236,228,0.12)", zIndex: 20,
          opacity: watermarkOpacity,
        }}>
          {chapter.id}
        </motion.div>

      </div>
    </section>
  );
}
