"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { WorldParticles } from "./WorldParticles";
import { playWorld } from "@/game/ambient";

interface Props { chapter: Chapter; }

/**
 * WorldStage v6
 *
 * KEY CHANGES:
 * 1. Hook card is PERSISTENT — stays at top throughout phases 2 & 3
 * 2. Hook card shows both cliff + hook text (double info density)
 * 3. BG starts zoomed IN (1.20) and pulls back to reveal world
 * 4. NO solid black transition — world dims+blurs, next cross-fades
 * 5. Cards 2 & 3 exit TOGETHER at p=0.84 (slide left/right simultaneously)
 * 6. Mobile: NO FG character, pure painting + sequential vertical cards
 * 7. Mobile: compact chapter strip pinned below watermark
 *
 * DESKTOP scroll timing (400vh):
 *   0.00–0.04  World blooms (BG brightens, un-blurs)
 *   0.02–0.07  Entry scan line L→R
 *   0.04–0.10  FG rises from below
 *   0.06–0.13  Title card center-screen
 *   0.13–0.15  Title fades → watermark
 *   0.15–0.84  HOOK persists at top (drops in at 0.15, stays until 0.84)
 *   0.35–0.86  STORY slides in from left (bottom-left)
 *   0.68–0.86  OUTCOMES slides in from right (bottom-right)
 *   0.84–0.88  FG departs + all cards exit together
 *   0.86–0.98  World dims + blurs (no black fill)
 *   0.90–1.00  Scan line sweeps up marking chapter end
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

  // ── BACKGROUND — starts zoomed-in, pulls back to reveal world ──────────
  const bgScale = useTransform(p, [0, 1], [1.20, 1.0]);
  const bgY     = useTransform(p, [0, 1], ["0%", "-5%"]);
  // Brightness: 0 → full at 0.04, stays full, dims at 0.86 (never full black)
  const bgBrightness = useTransform(p, [0, 0.04, 0.86, 0.98], [0, 1, 1, 0.12]);
  // Blur: starts slightly blurry, sharpens, re-blurs on exit
  const bgBlur = useTransform(p, [0, 0.05, 0.85, 0.98], [3, 0, 0, 5]);
  // Pre-computed filter string
  const bgFilter = useTransform(
    [bgBrightness, bgBlur],
    ([br, bl]) => `brightness(${(br as number) * world.brightness / 0.45}) saturate(1.15) blur(${bl}px)`
  );

  // ── ENTRY SCAN LINE ────────────────────────────────────────────────────
  const scanEntryW = useTransform(p, [0.02, 0.07], ["0%", "100%"]);
  const scanEntryO = useTransform(p, [0.02, 0.04, 0.06, 0.09], [0, 1, 1, 0]);

  // ── FG CHARACTER (desktop only) ────────────────────────────────────────
  const fgOpacity = useTransform(p, [0, 0.07, 0.80, 0.88], [0, 1, 1, 0]);
  const fgEnterY  = useTransform(p, [0.04, 0.10], [80, 0]);
  const fgDepartY = useTransform(p, [0.80, 0.88], [0, 80]);
  const fgScale   = useTransform(p, [0.04, 0.10, 0.80, 0.88], [0.94, 1.0, 1.0, 0.94]);
  const fgParallax = useTransform(p, [0.10, 0.80], ["0%", "-8%"]);
  // Subtle x-drift choreography per card phase
  const fgX = useTransform(
    p,
    [0.10, 0.35, 0.35, 0.68, 0.68, 0.84],
    ["0%", "-4%", "-4%", "5%", "5%", "0%"]
  );
  const fgXOffset = useTransform(fgX, v => `calc(-50% + ${v})`);
  const fgCombinedY = useTransform([fgEnterY, fgDepartY], ([ey, dy]) => (ey as number) + (dy as number));

  // ── TITLE CARD (arrival) ────────────────────────────────────────────────
  const titleO     = useTransform(p, [0.06, 0.10, 0.11, 0.13], [0, 1, 1, 0]);
  const titleY     = useTransform(p, [0.06, 0.10], [28, 0]);
  const titleScale = useTransform(p, [0.06, 0.10], [0.90, 1]);

  // ── WATERMARK (persistent) ──────────────────────────────────────────────
  const wmarkO = useTransform(p, [0.13, 0.16, 0.90, 0.95], [0, 1, 1, 0]);

  // ── CARD 1: HOOK — drops from top, STAYS until p=0.84 ──────────────────
  const c1O = useTransform(p, [0.15, 0.21, 0.82, 0.86], [0, 1, 1, 0]);
  const c1Y = useTransform(p, [0.15, 0.21, 0.82, 0.86], [-56, 0, 0, -56]);

  // ── CARD 2: STORY — slides in from LEFT, exits LEFT at 0.86 ───────────
  const c2O = useTransform(p, [0.35, 0.41, 0.82, 0.86], [0, 1, 1, 0]);
  const c2X = useTransform(p, [0.35, 0.41, 0.82, 0.86], [-60, 0, 0, -60]);
  const c2p2O = useTransform(p, [0.44, 0.50], [0, 1]);
  const c2p3O = useTransform(p, [0.54, 0.60], [0, 1]);

  // ── CARD 3: OUTCOMES — slides in from RIGHT, exits RIGHT at 0.86 ───────
  const c3O = useTransform(p, [0.68, 0.74, 0.82, 0.86], [0, 1, 1, 0]);
  const c3X = useTransform(p, [0.68, 0.74, 0.82, 0.86], [60, 0, 0, 60]);

  // ── EXIT: scan line up (no solid ink fill) ─────────────────────────────
  const scanExitB = useTransform(p, [0.90, 1.0], ["100%", "0%"]);
  const scanExitO = useTransform(p, [0.90, 0.95, 1.0], [0, 1, 0]);

  // ── PROGRESS BAR ────────────────────────────────────────────────────────
  const progressW = useTransform(p, [0, 1], ["0%", "100%"]);

  // ── MOBILE: card sequencing ─────────────────────────────────────────────
  // Hook → fades, Story slides UP from below, Outcomes slides UP from below
  const mHookO = useTransform(p, [0.12, 0.18, 0.30, 0.36], [0, 1, 1, 0]);
  const mHookY = useTransform(p, [0.12, 0.18, 0.30, 0.36], [-40, 0, 0, -40]);
  const mStoryO = useTransform(p, [0.35, 0.42, 0.62, 0.68], [0, 1, 1, 0]);
  const mStoryY = useTransform(p, [0.35, 0.42, 0.62, 0.68], [40, 0, 0, 40]);
  const mProofO = useTransform(p, [0.68, 0.75, 0.84, 0.88], [0, 1, 1, 0]);
  const mProofY = useTransform(p, [0.68, 0.75, 0.84, 0.88], [40, 0, 0, 40]);
  const mWmarkO = useTransform(p, [0.10, 0.14, 0.90, 0.95], [0, 1, 1, 0]);

  // ── PARTICLES ───────────────────────────────────────────────────────────
  const [ptVisible, setPtVisible] = useState(false);
  useEffect(() => scrollYProgress.on("change", v => setPtVisible(v > 0.05 && v < 0.88)), [scrollYProgress]);

  // ── AUDIO ────────────────────────────────────────────────────────────────
  useEffect(() => scrollYProgress.on("change", v => { if (v > 0.04 && v < 0.88) playWorld(chapter.id); }), [scrollYProgress, chapter.id]);

  // ── MOBILE DETECT ────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);



  // ── SHARED STYLES ────────────────────────────────────────────────────────
  const glass: React.CSSProperties = {
    background: "rgba(5,3,16,0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: `0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px ${accent}25`,
  };

  const PhaseDots = ({ active }: { active: 1|2|3 }) => (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {[1,2,3].map(n => (
        <div key={n} style={{
          width: n === active ? 12 : 5, height: 4, borderRadius: 2,
          background: n === active ? accent : "rgba(240,236,228,0.18)",
          transition: "all 300ms ease",
        }} />
      ))}
    </div>
  );

  const CardLabel = ({ text }: { text: string }) => (
    <div style={{
      fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: "0.3em",
      textTransform: "uppercase", color: accent, opacity: 0.8, marginBottom: 8,
    }}>{text}</div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} id={chapter.id} style={{ position: "relative", height: "400vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: world.ink }}>

        {/* ── BACKGROUND ─────────────────────────────────────────────── */}
        <motion.div aria-hidden style={{
          position: "absolute", inset: "-8%",
          backgroundImage: `url(${world.bg})`,
          backgroundSize: "cover", backgroundPosition: "center",
          scale: bgScale, y: bgY,
          filter: bgFilter,
          willChange: "transform",
        }} />

        {/* ── VIGNETTE ───────────────────────────────────────────────── */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: world.vignette, pointerEvents: "none",
        }} />

        {/* ── PARTICLES ──────────────────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          <WorldParticles theme={world.particles} visible={ptVisible} />
        </div>

        {/* ── ENTRY SCAN LINE L→R ────────────────────────────────────── */}
        <motion.div aria-hidden style={{
          position: "absolute", top: 0, left: 0, bottom: 0,
          width: scanEntryW,
          background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
          boxShadow: `2px 0 24px ${accent}99`,
          opacity: scanEntryO,
          zIndex: 22, pointerEvents: "none",
        }} />



        {/* ── FG CHARACTER — desktop only ─────────────────────────────── */}
        {!isMobile && (
          <motion.div style={{
            position: "absolute", bottom: 0, left: "50%",
            x: fgXOffset,
            width: "clamp(280px, 40vw, 520px)",
            transformOrigin: "bottom center",
            opacity: fgOpacity,
            y: fgCombinedY,
            scale: fgScale,
            zIndex: 4, willChange: "transform",
          }}>
            <motion.img
              src={world.fg} alt={chapter.org}
              style={{
                width: "100%", display: "block",
                objectFit: "contain", objectPosition: "bottom center",
                y: fgParallax,
                filter: `drop-shadow(0 -14px 44px rgba(0,0,0,0.75)) drop-shadow(0 0 20px ${accent}1a)`,
              }}
            />
          </motion.div>
        )}

        {/* ── TITLE CARD — center screen on arrival ──────────────────── */}
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
            fontSize: isMobile ? "clamp(26px,7vw,38px)" : "clamp(34px,5vw,60px)",
            fontWeight: 700, color: "#f0ece4", lineHeight: 1.0,
            textShadow: "0 4px 32px rgba(0,0,0,0.95)", marginBottom: 8,
          }}>
            {chapter.org}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: isMobile ? 9 : 11,
            letterSpacing: "0.24em", textTransform: "uppercase",
            color: "rgba(240,236,228,0.6)",
          }}>
            {chapter.role} · {chapter.year}
          </div>
        </motion.div>

        {/* ── WATERMARK — persistent top-left ────────────────────────── */}
        <motion.div style={{
          position: "absolute",
          top: isMobile ? 14 : 22, left: isMobile ? 38 : 46,
          zIndex: 12, opacity: wmarkO,
          display: "flex", alignItems: "baseline", gap: 9, pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: isMobile ? 20 : 28,
            fontWeight: 700, color: accent, lineHeight: 1,
            textShadow: `0 0 20px ${accent}55`,
          }}>
            {String(chapter.index).padStart(2, "0")}
          </span>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: isMobile ? 13 : 16,
              fontWeight: 600, color: "#f0ece4", lineHeight: 1.1,
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            }}>{chapter.org}</div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(240,236,228,0.40)", marginTop: 2,
            }}>{chapter.role} · {chapter.year}</div>
          </div>
        </motion.div>



        {/* ══════════════════════════════════════════════════════════════
            DESKTOP LAYOUT
        ══════════════════════════════════════════════════════════════ */}
        {!isMobile && (
          <>
            {/* CARD 1 — HOOK — drops from top, STAYS through phases 2+3 */}
            <motion.div style={{
              position: "absolute", top: 88,
              left: "50%", x: "-50%",
              width: "clamp(400px, 56vw, 720px)",
              zIndex: 12, opacity: c1O, y: c1Y,
            }}>
              <div style={{
                ...glass,
                padding: "18px 32px 20px",
                borderBottom: `3px solid ${accent}`,
              }}>
                {/* Header row */}
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: 10,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: 7,
                      letterSpacing: "0.32em", textTransform: "uppercase",
                      color: accent, opacity: 0.9,
                    }}>Chapter {String(chapter.index).padStart(2, "0")}</div>
                    <div style={{ width: 1, height: 10, background: `${accent}44` }} />
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: 7,
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: "rgba(240,236,228,0.35)",
                    }}>{chapter.year}</div>
                    <div style={{ width: 1, height: 10, background: `${accent}33` }} />
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: 7,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "rgba(240,236,228,0.28)",
                    }}>{chapter.role}</div>
                  </div>
                  <PhaseDots active={1} />
                </div>
                {/* Main cliff statement */}
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: 20,
                  fontWeight: 500, color: "rgba(240,236,228,0.96)",
                  lineHeight: 1.5, margin: "0 0 6px",
                  textAlign: "center", textShadow: "0 2px 14px rgba(0,0,0,0.85)",
                }}>{chapter.cliff}</p>
                {/* Supporting hook line */}
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: 13,
                  fontWeight: 400, color: "rgba(240,236,228,0.50)",
                  lineHeight: 1.4, margin: 0,
                  textAlign: "center", textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                  fontStyle: "italic",
                }}>{chapter.hook}</p>
              </div>
            </motion.div>



            {/* CARD 2 — STORY — slides from LEFT, stays through proof phase */}
            <motion.div style={{
              position: "absolute", bottom: 84, left: 48,
              width: "clamp(340px, 40vw, 500px)",
              zIndex: 12, opacity: c2O, x: c2X,
            }}>
              <div style={{ ...glass, padding: "18px 24px", borderLeft: `3px solid ${accent}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <CardLabel text="The Story" />
                  <PhaseDots active={2} />
                </div>
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: 14,
                  color: "rgba(240,236,228,0.88)", lineHeight: 1.68, margin: 0,
                  textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                }}>{chapter.paragraphs[0]}</p>
                {chapter.paragraphs[1] && (
                  <motion.div style={{ opacity: c2p2O }}>
                    <div style={{ height: 1, background: `${accent}33`, margin: "11px 0" }} />
                    <p style={{
                      fontFamily: "var(--font-display)", fontSize: 14,
                      color: "rgba(240,236,228,0.78)", lineHeight: 1.68, margin: 0,
                      textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                    }}>{chapter.paragraphs[1]}</p>
                  </motion.div>
                )}
                {chapter.paragraphs[2] && (
                  <motion.div style={{ opacity: c2p3O }}>
                    <div style={{ height: 1, background: `${accent}33`, margin: "11px 0" }} />
                    <p style={{
                      fontFamily: "var(--font-display)", fontSize: 14,
                      color: "rgba(240,236,228,0.65)", lineHeight: 1.68, margin: 0,
                      fontStyle: "italic", textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                    }}>{chapter.paragraphs[2]}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>



            {/* CARD 3 — OUTCOMES + SKILL — slides from RIGHT */}
            <motion.div style={{
              position: "absolute", bottom: 84, right: 48,
              width: "clamp(260px, 30vw, 360px)",
              zIndex: 12, opacity: c3O, x: c3X,
            }}>
              <div style={{ ...glass, padding: "18px 24px", borderRight: `3px solid ${accent}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <CardLabel text="Outcomes" />
                  <PhaseDots active={3} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  {chapter.outcomes.map((outcome, i) => (
                    <div key={outcome} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      marginBottom: i < chapter.outcomes.length - 1 ? 7 : 0,
                    }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: accent, boxShadow: `0 0 8px ${accent}cc`,
                        flexShrink: 0, marginTop: 3,
                      }} />
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 11,
                        color: "rgba(240,236,228,0.82)", letterSpacing: "0.02em", lineHeight: 1.4,
                      }}>{outcome}</span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: `${accent}33`, marginBottom: 12 }} />
                <CardLabel text="Skill Earned" />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: chapter.skill.color, boxShadow: `0 0 14px ${chapter.skill.color}`,
                    flexShrink: 0, animation: "skill-pulse 2s ease-in-out infinite",
                  }} />
                  <div>
                    <div style={{
                      fontFamily: "var(--font-display)", fontSize: 17,
                      fontWeight: 600, color: "#f0ece4", marginBottom: 2,
                    }}>{chapter.skill.name}</div>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.12em",
                      color: chapter.skill.color, opacity: 0.7, textTransform: "uppercase",
                    }}>{chapter.skill.family}</div>
                  </div>
                </div>
                {chapter.builtOn.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: "0.28em",
                      textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: 6,
                    }}>Built on</div>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: 9,
                      color: "rgba(240,236,228,0.50)", lineHeight: 1.6,
                    }}>
                      {chapter.builtOn.slice(-4).join(" → ")}
                      {chapter.builtOn.length > 4 ? ` +${chapter.builtOn.length - 4}` : ""}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}



        {/* ══════════════════════════════════════════════════════════════
            MOBILE LAYOUT — no FG, sequential vertical cards
        ══════════════════════════════════════════════════════════════ */}
        {isMobile && (
          <>
            {/* Chapter context strip — pinned below watermark */}
            <motion.div style={{
              position: "absolute", top: 56, left: 0, right: 0,
              zIndex: 11, opacity: mWmarkO,
              display: "flex", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 9,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: accent, opacity: 0.7,
              }}>
                {chapter.org} · {chapter.year}
              </div>
            </motion.div>

            {/* HOOK card — full width, drops from top */}
            <motion.div style={{
              position: "absolute", top: 80,
              left: 16, right: 16,
              zIndex: 12, opacity: mHookO, y: mHookY,
            }}>
              <div style={{ ...glass, padding: "14px 18px", borderBottom: `3px solid ${accent}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 7,
                    letterSpacing: "0.28em", textTransform: "uppercase",
                    color: accent, opacity: 0.85,
                  }}>Chapter {String(chapter.index).padStart(2, "0")} · {chapter.year}</div>
                  <PhaseDots active={1} />
                </div>
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: 16,
                  fontWeight: 500, color: "rgba(240,236,228,0.96)",
                  lineHeight: 1.5, margin: "0 0 5px", textAlign: "center",
                }}>{chapter.cliff}</p>
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: 12,
                  color: "rgba(240,236,228,0.48)", lineHeight: 1.4,
                  margin: 0, textAlign: "center", fontStyle: "italic",
                }}>{chapter.hook}</p>
              </div>
            </motion.div>

            {/* STORY card — full width, slides up from bottom */}
            <motion.div style={{
              position: "absolute", bottom: 48,
              left: 16, right: 16,
              zIndex: 12, opacity: mStoryO, y: mStoryY,
            }}>
              <div style={{ ...glass, padding: "14px 18px", borderLeft: `3px solid ${accent}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <CardLabel text="The Story" />
                  <PhaseDots active={2} />
                </div>
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: 13,
                  color: "rgba(240,236,228,0.88)", lineHeight: 1.65, margin: "0 0 8px",
                }}>{chapter.paragraphs[0]}</p>
                {chapter.paragraphs[1] && (
                  <p style={{
                    fontFamily: "var(--font-display)", fontSize: 13,
                    color: "rgba(240,236,228,0.70)", lineHeight: 1.65, margin: 0,
                  }}>{chapter.paragraphs[1]}</p>
                )}
              </div>
            </motion.div>

            {/* PROOF card — full width, slides up from bottom */}
            <motion.div style={{
              position: "absolute", bottom: 48,
              left: 16, right: 16,
              zIndex: 12, opacity: mProofO, y: mProofY,
            }}>
              <div style={{ ...glass, padding: "14px 18px", borderRight: `3px solid ${accent}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <CardLabel text="Outcomes" />
                  <PhaseDots active={3} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  {chapter.outcomes.slice(0, 5).map((outcome, i) => (
                    <div key={outcome} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      marginBottom: i < 4 ? 5 : 0,
                    }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: accent, flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 10,
                        color: "rgba(240,236,228,0.80)",
                      }}>{outcome}</span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: `${accent}33`, marginBottom: 10 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: chapter.skill.color,
                    boxShadow: `0 0 10px ${chapter.skill.color}`,
                    flexShrink: 0, animation: "skill-pulse 2s ease-in-out infinite",
                  }} />
                  <div>
                    <div style={{
                      fontFamily: "var(--font-display)", fontSize: 14,
                      fontWeight: 600, color: "#f0ece4",
                    }}>{chapter.skill.name}</div>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: 8,
                      color: chapter.skill.color, opacity: 0.7, textTransform: "uppercase",
                    }}>{chapter.skill.family}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}



        {/* ── EXIT SCAN LINE — no solid ink fill ─────────────────────── */}
        <motion.div aria-hidden style={{
          position: "absolute", bottom: scanExitB, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 16px ${accent}, 0 0 40px ${accent}88`,
          opacity: scanExitO,
          zIndex: 31, pointerEvents: "none",
        }} />

        {/* ── PROGRESS BAR ───────────────────────────────────────────── */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: 0, height: 2,
          width: progressW,
          background: `linear-gradient(90deg, ${accent}44, ${accent})`,
          boxShadow: `0 0 8px ${accent}66`,
          zIndex: 40,
        }} />

        {/* ── WORLD ID — bottom right ─────────────────────────────────── */}
        <motion.div style={{
          position: "absolute", bottom: 10, right: isMobile ? 14 : 22,
          fontFamily: "var(--font-mono)", fontSize: 8,
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "rgba(240,236,228,0.18)", zIndex: 20, opacity: wmarkO,
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
