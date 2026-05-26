"use client";

import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { registerWorldEl, useProgress } from "@/game/progress";
import { playWorld } from "@/game/ambient";

interface Props {
  chapter: Chapter;
}

/**
 * WorldScene v4 — A real interactive experience, not a passive scroller.
 *
 * Uses the beautiful full-color foreground illustrations (from dea16f5) 
 * and painted backgrounds (from 4e9983a). No more broken black silhouettes.
 *
 * Architecture:
 * - Full-viewport scene with painted BG + illustrated FG
 * - Content auto-reveals in timed stages as you scroll through
 * - Parallax between BG and FG layers
 * - Narrative appears automatically — no clicking required
 * - Visual drama: entry flash, accent glow, floating particles
 * - 200vh height for proper scroll pacing
 */
export function WorldScene({ chapter }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const ref = useRef<HTMLElement | null>(null);
  const { worldId, worldProgress, worldIndex } = useProgress();
  const isActive = worldId === chapter.id;
  const [hasEntered, setHasEntered] = useState(false);
  const prevWorldRef = useRef<string | null>(null);

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

  // World entry flash
  const [showFlash, setShowFlash] = useState(false);
  useEffect(() => {
    if (isActive && prevWorldRef.current !== chapter.id) {
      setShowFlash(true);
      const t = setTimeout(() => setShowFlash(false), 700);
      prevWorldRef.current = chapter.id;
      return () => clearTimeout(t);
    }
  }, [isActive, chapter.id]);

  const p = isActive ? worldProgress : worldIndex > chapter.index - 1 ? 1 : 0;

  // Lazy mount
  const distance = Math.abs((chapter.index - 1) - Math.max(0, worldIndex));
  const isNear = distance <= 1;

  // Parallax — BG drifts slow, FG drifts faster
  const bgShift = p * -3;
  const fgShift = p * -8;

  // Progressive content reveal — auto, no clicking:
  // 0-10%: Title + year fly in
  // 10-25%: Role + cliff note
  // 25-45%: Full paragraphs appear one by one  
  // 45-65%: Outcomes animate in staggered
  // 65-80%: Skill earned with glow
  // 80-100%: Fade out for transition

  const phase1 = clamp01((p - 0) / 0.1);      // title
  const phase2 = clamp01((p - 0.1) / 0.12);   // cliff
  const phase3 = clamp01((p - 0.25) / 0.2);   // paragraphs
  const phase4 = clamp01((p - 0.45) / 0.18);  // outcomes
  const phase5 = clamp01((p - 0.65) / 0.1);   // skill badge
  const fadeOut = p > 0.82 ? 1 - clamp01((p - 0.82) / 0.18) : 1;
  const masterOpacity = isActive ? fadeOut : (hasEntered ? 0.15 : 0);

  return (
    <section
      ref={ref}
      id={chapter.id}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "200vh",
        overflow: "hidden",
        background: world.ink,
      }}
    >
      {/* World entry flash */}
      {showFlash && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${world.accent}66, transparent 70%)`,
            animation: "world-entry-flash 700ms ease-out forwards",
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
      )}

      {!isNear ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${world.ink} 0%, ${world.accent}08 50%, ${world.ink} 100%)`,
          }}
        />
      ) : (
        <>
          {/* BACKGROUND — full painted scene */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-5%",
              backgroundImage: `url(${world.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `translate3d(${bgShift}%, 0, 0) scale(1.1)`,
              willChange: "transform",
              filter: "brightness(0.7) saturate(1.1)",
            }}
          />

          {/* Top gradient — helps text readability */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, ${world.ink}cc 0%, ${world.ink}44 15%, transparent 40%, ${world.ink}66 75%, ${world.ink}ee 100%)`,
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          {/* FOREGROUND — beautiful illustrated layer */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "-10%",
              right: "-10%",
              bottom: 0,
              height: "55%",
              transform: `translate3d(${fgShift}%, 0, 0)`,
              willChange: "transform",
              zIndex: 3,
            }}
          >
            <img
              src={world.fg}
              alt=""
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center bottom",
                filter: "drop-shadow(0 -20px 40px rgba(0,0,0,0.5))",
              }}
            />
          </div>

          {/* Ground accent glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "10%",
              height: "30%",
              background: `radial-gradient(ellipse 100% 80% at 50% 100%, ${world.accent}22 0%, transparent 60%)`,
              zIndex: 4,
              pointerEvents: "none",
            }}
          />

          {/* Floating particles */}
          <Particles accent={world.accent} active={isActive} />

          {/* === NARRATIVE CONTENT — auto-reveals as you scroll === */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: "12vh",
              padding: "12vh 6vw 0",
              zIndex: 20,
              opacity: masterOpacity,
              transition: "opacity 300ms ease",
              pointerEvents: "none",
            }}
          >
            {/* PHASE 1: Chapter + Title */}
            <div
              style={{
                opacity: phase1,
                transform: `translateY(${(1 - phase1) * 30}px)`,
                transition: "transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                textAlign: "center",
                marginBottom: 16,
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
                fontSize: "clamp(40px, 8vw, 80px)",
                fontWeight: 700,
                color: "#f0ece4",
                lineHeight: 0.95,
                textShadow: `0 4px 40px rgba(0,0,0,0.95), 0 0 80px ${world.accent}20`,
              }}>
                {chapter.org}
              </h2>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(10px, 1.2vw, 13px)",
                letterSpacing: "0.2em",
                color: "rgba(240, 236, 228, 0.55)",
                textTransform: "uppercase",
                marginTop: 8,
              }}>
                {chapter.role}
              </div>
            </div>

            {/* PHASE 2: Cliff note */}
            <div
              style={{
                opacity: phase2,
                transform: `translateY(${(1 - phase2) * 20}px)`,
                transition: "transform 500ms ease",
                textAlign: "center",
                maxWidth: 580,
                marginBottom: 28,
              }}
            >
              <div style={{
                width: 40,
                height: 2,
                background: world.accent,
                margin: "0 auto 20px",
                opacity: 0.6,
              }} />
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(16px, 2.5vw, 26px)",
                color: "rgba(240, 236, 228, 0.9)",
                lineHeight: 1.55,
                fontWeight: 400,
                textShadow: "0 3px 20px rgba(0,0,0,0.9)",
              }}>
                {chapter.cliff}
              </p>
            </div>

            {/* PHASE 3: Full paragraphs — auto reveal */}
            <div
              style={{
                maxWidth: 560,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              {chapter.paragraphs.map((para, i) => {
                const paraProgress = clamp01((phase3 * chapter.paragraphs.length) - i);
                return (
                  <p
                    key={i}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(13px, 1.6vw, 16px)",
                      color: "rgba(240, 236, 228, 0.7)",
                      lineHeight: 1.7,
                      marginBottom: 14,
                      opacity: paraProgress,
                      transform: `translateY(${(1 - paraProgress) * 12}px)`,
                      transition: "opacity 400ms ease, transform 400ms ease",
                      textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                    }}
                  >
                    {para}
                  </p>
                );
              })}
            </div>

            {/* PHASE 4: Outcomes — staggered fly-in */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "8px 10px",
                marginBottom: 28,
                maxWidth: 640,
              }}
            >
              {chapter.outcomes.map((o, i) => {
                const itemP = clamp01((phase4 * chapter.outcomes.length) - i);
                return (
                  <span
                    key={i}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(9px, 1vw, 11px)",
                      letterSpacing: "0.08em",
                      color: world.accent,
                      padding: "6px 14px",
                      border: `1px solid ${world.accent}55`,
                      background: `${world.accent}12`,
                      textTransform: "uppercase",
                      opacity: itemP,
                      transform: `translateY(${(1 - itemP) * 16}px) scale(${0.85 + itemP * 0.15})`,
                      transition: "all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow: itemP > 0.8 ? `0 0 12px ${world.accent}22` : "none",
                    }}
                  >
                    {o}
                  </span>
                );
              })}
            </div>

            {/* PHASE 5: Skill Earned badge */}
            <div
              style={{
                opacity: phase5,
                transform: `scale(${0.7 + phase5 * 0.3}) translateY(${(1 - phase5) * 14}px)`,
                transition: "all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                textAlign: "center",
              }}
            >
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 24px",
                background: `${chapter.skill.color}18`,
                border: `1px solid ${chapter.skill.color}66`,
                boxShadow: phase5 > 0.8 ? `0 0 30px ${chapter.skill.color}33, 0 0 60px ${chapter.skill.color}11` : "none",
                transition: "box-shadow 500ms ease",
              }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: chapter.skill.color,
                  boxShadow: `0 0 10px ${chapter.skill.color}`,
                  animation: phase5 > 0.9 ? "skill-pulse 2s ease-in-out infinite" : "none",
                }} />
                <div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: chapter.skill.color,
                  }}>
                    Skill Unlocked
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
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
                  marginTop: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  color: "rgba(240, 236, 228, 0.35)",
                }}>
                  Built on: {chapter.builtOn.join(" → ")}
                </div>
              )}
            </div>
          </div>

          {/* Scroll progress */}
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
                boxShadow: `0 0 16px ${world.accent}88`,
                zIndex: 30,
              }}
            />
          )}
        </>
      )}

      <style>{`
        @keyframes world-entry-flash {
          0% { opacity: 0.6; transform: scale(0.95); }
          100% { opacity: 0; transform: scale(1.1); }
        }
        @keyframes skill-pulse {
          0%, 100% { box-shadow: 0 0 10px currentColor; }
          50% { box-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
        }
      `}</style>
    </section>
  );
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/**
 * Atmospheric floating particles.
 */
function Particles({ accent, active }: { accent: string; active: boolean }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${3 + (i * 5.1) % 94}%`,
    top: `${5 + (i * 9.7) % 85}%`,
    size: 1.5 + (i % 4) * 1,
    duration: 4 + (i % 6) * 2,
    delay: i * 0.25,
  }));

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        opacity: active ? 0.8 : 0,
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
            boxShadow: `0 0 ${pt.size * 5}px ${accent}44`,
            animation: `particle-rise ${pt.duration}s ease-in-out ${pt.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes particle-rise {
          0%, 100% { transform: translate(0, 0); opacity: 0.15; }
          25% { transform: translate(3px, -15px); opacity: 0.5; }
          50% { transform: translate(-3px, -30px); opacity: 0.7; }
          75% { transform: translate(4px, -20px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
