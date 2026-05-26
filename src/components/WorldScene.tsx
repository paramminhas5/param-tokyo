"use client";

import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { registerWorldEl, useProgress, BEATS_PER_WORLD } from "@/game/progress";
import { playWorld } from "@/game/ambient";

interface Props {
  chapter: Chapter;
}

/**
 * WorldScene v5 — Panel-based visual novel experience.
 *
 * Each world is a full-viewport scene with 4 "beats" that auto-reveal as you scroll:
 *   Beat 0: Chapter title + year + role (cinematic entry)
 *   Beat 1: Cliff note in glass panel
 *   Beat 2: Full story paragraphs in glass panel
 *   Beat 3: Outcomes grid + Skill Unlocked badge
 *
 * Visual architecture:
 *   - BG: `object-fit: contain` — shows full painting, letterboxed if needed
 *   - FG: small accent (25% height, bottom-right) — not dominant
 *   - All text in glass panels (backdrop-filter: blur) — always readable
 *   - Parallax between BG (slow) and content (faster)
 */
export function WorldScene({ chapter }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const ref = useRef<HTMLElement | null>(null);
  const { worldId, worldProgress, worldIndex, beat, beatProgress } = useProgress();
  const isActive = worldId === chapter.id;
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    registerWorldEl(chapter.id, ref.current);
    return () => registerWorldEl(chapter.id, null);
  }, [chapter.id]);

  useEffect(() => {
    if (isActive) {
      playWorld(chapter.id);
      if (!hasEntered) setHasEntered(true);
    }
  }, [isActive, chapter.id, hasEntered]);

  const p = isActive ? worldProgress : worldIndex > chapter.index - 1 ? 1 : 0;
  const currentBeat = isActive ? beat : (hasEntered ? BEATS_PER_WORLD - 1 : -1);
  const currentBeatProgress = isActive ? beatProgress : (hasEntered ? 1 : 0);

  // Lazy mount
  const distance = Math.abs((chapter.index - 1) - Math.max(0, worldIndex));
  const isNear = distance <= 1;

  // Subtle parallax on BG
  const bgY = p * -4;

  // Beat visibility helpers
  const beatVisible = (b: number) => {
    if (!isActive && !hasEntered) return 0;
    if (!isActive && hasEntered) return b <= 2 ? 0.3 : 0; // faded memory
    if (currentBeat > b) return 1; // already passed
    if (currentBeat === b) return currentBeatProgress; // currently revealing
    return 0; // not yet
  };

  return (
    <section
      ref={ref}
      id={chapter.id}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "280vh", // tall enough for 4 beats
        overflow: "hidden",
        background: world.ink,
      }}
    >
      {!isNear ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: world.ink,
          }}
        />
      ) : (
        <>
          {/* === BACKGROUND — full painting, properly fit === */}
          <div
            aria-hidden
            style={{
              position: "sticky",
              top: 0,
              width: "100%",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            {/* BG image — contain so you see the full scene */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translateY(${bgY}%)`,
                transition: "transform 100ms linear",
              }}
            >
              <img
                src={world.bg}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  filter: "brightness(0.55) saturate(1.15)",
                }}
              />
            </div>

            {/* Foreground accent — small, bottom-right, atmospheric */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "clamp(200px, 30%, 400px)",
                height: "35%",
                opacity: isActive ? 0.5 : 0.2,
                transition: "opacity 1s ease",
                pointerEvents: "none",
              }}
            >
              <img
                src={world.fg}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom right",
                  filter: "drop-shadow(0 -8px 24px rgba(0,0,0,0.6))",
                }}
              />
            </div>

            {/* Vignette overlay */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `
                  radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(5,3,16,0.7) 100%),
                  linear-gradient(180deg, ${world.ink}88 0%, transparent 20%, transparent 70%, ${world.ink}cc 100%)
                `,
                pointerEvents: "none",
              }}
            />

            {/* Accent atmosphere glow */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "25%",
                background: `radial-gradient(ellipse 100% 100% at 50% 100%, ${world.accent}15 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            {/* Floating particles */}
            <Particles accent={world.accent} active={isActive} />

            {/* === CONTENT PANELS — glass cards, always readable === */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "clamp(16px, 4vw, 40px)",
                zIndex: 10,
              }}
            >
              {/* BEAT 0: Title */}
              <div
                style={{
                  opacity: beatVisible(0),
                  transform: `translateY(${(1 - beatVisible(0)) * 24}px)`,
                  transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(9px, 1vw, 11px)",
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  color: world.accent,
                  marginBottom: 14,
                }}>
                  Chapter {String(chapter.index).padStart(2, "0")} — {chapter.year}
                </div>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 8vw, 80px)",
                  fontWeight: 700,
                  color: "#f0ece4",
                  lineHeight: 0.95,
                  textShadow: `0 4px 40px rgba(0,0,0,0.95)`,
                }}>
                  {chapter.org}
                </h2>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(10px, 1.2vw, 13px)",
                  letterSpacing: "0.2em",
                  color: "rgba(240, 236, 228, 0.55)",
                  textTransform: "uppercase",
                  marginTop: 10,
                }}>
                  {chapter.role}
                </div>
              </div>

              {/* BEAT 1: Cliff note — glass panel */}
              <GlassPanel
                visible={beatVisible(1)}
                accent={world.accent}
                maxWidth={560}
              >
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(16px, 2.4vw, 24px)",
                  color: "rgba(240, 236, 228, 0.92)",
                  lineHeight: 1.55,
                  textAlign: "center",
                  margin: 0,
                }}>
                  {chapter.cliff}
                </p>
              </GlassPanel>

              {/* BEAT 2: Full story — glass panel */}
              <GlassPanel
                visible={beatVisible(2)}
                accent={world.accent}
                maxWidth={580}
              >
                {chapter.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(13px, 1.5vw, 15px)",
                      color: "rgba(240, 236, 228, 0.78)",
                      lineHeight: 1.7,
                      marginBottom: i < chapter.paragraphs.length - 1 ? 14 : 0,
                      margin: 0,
                      marginTop: i > 0 ? 14 : 0,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </GlassPanel>

              {/* BEAT 3: Outcomes + Skill */}
              <div
                style={{
                  opacity: beatVisible(3),
                  transform: `translateY(${(1 - beatVisible(3)) * 16}px)`,
                  transition: "opacity 500ms ease, transform 500ms ease",
                  textAlign: "center",
                  maxWidth: 640,
                }}
              >
                {/* Outcomes grid */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "8px 10px",
                  marginBottom: 24,
                }}>
                  {chapter.outcomes.map((o, i) => (
                    <span
                      key={i}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(9px, 1vw, 11px)",
                        letterSpacing: "0.08em",
                        color: world.accent,
                        padding: "6px 14px",
                        background: `rgba(0,0,0,0.5)`,
                        backdropFilter: "blur(8px)",
                        border: `1px solid ${world.accent}44`,
                        textTransform: "uppercase",
                      }}
                    >
                      {o}
                    </span>
                  ))}
                </div>

                {/* Skill Earned */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 28px",
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${chapter.skill.color}55`,
                  boxShadow: `0 0 40px ${chapter.skill.color}22`,
                }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: chapter.skill.color,
                    boxShadow: `0 0 12px ${chapter.skill.color}`,
                    animation: beatVisible(3) > 0.9 ? "skill-glow 2s ease-in-out infinite" : "none",
                  }} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: chapter.skill.color,
                    }}>
                      Skill Unlocked
                    </div>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#f0ece4",
                      marginTop: 2,
                    }}>
                      {chapter.skill.name}
                    </div>
                  </div>
                </div>

                {chapter.builtOn.length > 0 && (
                  <div style={{
                    marginTop: 10,
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "rgba(240, 236, 228, 0.3)",
                    letterSpacing: "0.1em",
                  }}>
                    Built on: {chapter.builtOn.join(" → ")}
                  </div>
                )}
              </div>
            </div>

            {/* Beat indicator dots */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  left: "clamp(12px, 2vw, 24px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  zIndex: 30,
                }}
              >
                {Array.from({ length: BEATS_PER_WORLD }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === currentBeat ? 3 : 3,
                      height: i === currentBeat ? 20 : 8,
                      borderRadius: 2,
                      background: i <= currentBeat ? world.accent : "rgba(240, 236, 228, 0.2)",
                      transition: "all 300ms ease",
                      boxShadow: i === currentBeat ? `0 0 8px ${world.accent}66` : "none",
                    }}
                  />
                ))}
              </div>
            )}

            {/* World progress bar */}
            {isActive && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: 3,
                  width: `${p * 100}%`,
                  background: `linear-gradient(90deg, transparent, ${world.accent})`,
                  boxShadow: `0 0 12px ${world.accent}66`,
                  zIndex: 30,
                }}
              />
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes skill-glow {
          0%, 100% { box-shadow: 0 0 12px currentColor; transform: scale(1); }
          50% { box-shadow: 0 0 24px currentColor, 0 0 48px currentColor; transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
}

/**
 * Glass Panel — backdrop-blur card for readable text over busy art.
 */
function GlassPanel({
  visible,
  accent,
  maxWidth,
  children,
}: {
  visible: number;
  accent: string;
  maxWidth: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        opacity: visible,
        transform: `translateY(${(1 - visible) * 16}px) scale(${0.97 + visible * 0.03})`,
        transition: "opacity 500ms ease, transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        width: "100%",
        maxWidth,
        marginBottom: 20,
        pointerEvents: visible > 0.5 ? "auto" : "none",
      }}
    >
      <div
        style={{
          padding: "clamp(16px, 3vw, 28px)",
          background: "rgba(5, 3, 16, 0.65)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${accent}22`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 ${accent}11`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Atmospheric floating particles.
 */
function Particles({ accent, active }: { accent: string; active: boolean }) {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${4 + (i * 6) % 92}%`,
    top: `${8 + (i * 9) % 80}%`,
    size: 1.5 + (i % 3),
    duration: 4 + (i % 5) * 2,
    delay: i * 0.3,
  }));

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        opacity: active ? 0.6 : 0,
        transition: "opacity 2s ease",
      }}
    >
      {particles.map((pt) => (
        <div
          key={pt.id}
          style={{
            position: "absolute",
            left: pt.left,
            top: pt.top,
            width: pt.size,
            height: pt.size,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 ${pt.size * 4}px ${accent}55`,
            animation: `particle-up ${pt.duration}s ease-in-out ${pt.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes particle-up {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
