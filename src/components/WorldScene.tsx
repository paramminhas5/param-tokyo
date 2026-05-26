"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { registerWorldEl, useProgress } from "@/game/progress";
import { playWorld } from "@/game/ambient";

interface Props {
  chapter: Chapter;
}

/**
 * WorldScene v3 — Interactive, scroll-driven, rich narrative experience.
 *
 * Features:
 *  - 4-layer parallax with proper pixelated rendering
 *  - Scroll-triggered progressive reveal of content
 *  - Interactive expandable narrative cards
 *  - Skill badge animation on entry
 *  - World-entry flash transition
 *  - Scroll-velocity responsive particles
 *  - Staggered outcome badges that fly in
 *  - Full story expandable on click
 *  - Typing narration effect
 *  - Height is 250vh so there's room to tell the story
 */
export function WorldScene({ chapter }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const ref = useRef<HTMLElement | null>(null);
  const { worldId, worldProgress, worldIndex } = useProgress();
  const isActive = worldId === chapter.id;
  const [hasEntered, setHasEntered] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
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

  // Track world entry for flash
  const [showFlash, setShowFlash] = useState(false);
  useEffect(() => {
    if (isActive && prevWorldRef.current !== chapter.id) {
      setShowFlash(true);
      const t = setTimeout(() => setShowFlash(false), 600);
      prevWorldRef.current = chapter.id;
      return () => clearTimeout(t);
    }
  }, [isActive, chapter.id]);

  const p = isActive ? worldProgress : worldIndex > chapter.index - 1 ? 1 : 0;

  // Lazy mount
  const distance = Math.abs((chapter.index - 1) - Math.max(0, worldIndex));
  const isNear = distance <= 1;

  // Parallax magnitudes
  const skyShift = p * -2;
  const farShift = p * -5;
  const midShift = p * -10;
  const nearShift = p * -18;

  // Content reveal phases (progressive disclosure tied to scroll):
  // Phase 1: 0-15% — world entry, title + role appear
  // Phase 2: 15-35% — cliff note types in
  // Phase 3: 35-55% — outcomes fly in one by one
  // Phase 4: 55-75% — full story card appears (clickable)
  // Phase 5: 75-90% — skill earned badge appears
  // Phase 6: 90-100% — transition out

  const titleOpacity = isActive ? Math.min(1, p / 0.12) : (hasEntered ? 0.3 : 0);
  const cliffOpacity = isActive ? (p > 0.15 ? Math.min(1, (p - 0.15) / 0.1) : 0) : 0;
  const outcomesProgress = isActive ? Math.max(0, (p - 0.35) / 0.2) : 0;
  const storyCardOpacity = isActive ? (p > 0.5 ? Math.min(1, (p - 0.5) / 0.08) : 0) : 0;
  const skillBadgeOpacity = isActive ? (p > 0.7 ? Math.min(1, (p - 0.7) / 0.08) : 0) : 0;
  const fadeOut = isActive ? (p > 0.88 ? 1 - (p - 0.88) / 0.12 : 1) : (hasEntered ? 0.2 : 0);

  return (
    <section
      ref={ref}
      id={chapter.id}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "250vh",
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
            background: world.accent,
            opacity: 0,
            animation: "world-flash 600ms ease-out forwards",
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
      )}

      {!isNear && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${world.ink} 0%, ${world.accent}08 50%, ${world.ink} 100%)`,
          }}
        />
      )}

      {isNear && (
        <>
          {/* L1 — SKY */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${world.sky})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              imageRendering: "auto",
              transform: `translate3d(${skyShift}%, 0, 0)`,
              willChange: "transform",
            }}
          />

          {/* L2 — FAR silhouettes */}
          <ParallaxLayer
            src={world.far}
            bottom="22vh"
            height="26vh"
            shift={farShift}
            opacity={0.3}
          />

          {/* L3 — MID silhouettes */}
          <ParallaxLayer
            src={world.mid}
            bottom="12vh"
            height="30vh"
            shift={midShift}
            opacity={0.6}
          />

          {/* L4 — NEAR silhouettes */}
          <ParallaxLayer
            src={world.near}
            bottom="4vh"
            height="26vh"
            shift={nearShift}
            opacity={0.85}
          />

          {/* Ground line */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "16vh",
              height: 2,
              background: `linear-gradient(90deg, transparent, ${world.accent}88 20%, ${world.accent}88 80%, transparent)`,
              boxShadow: `0 0 20px ${world.accent}44`,
              zIndex: 6,
            }}
          />

          {/* Bottom atmosphere */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "35%",
              background: `
                radial-gradient(ellipse 100% 50% at 50% 100%, ${world.accent}18 0%, transparent 60%),
                linear-gradient(180deg, transparent 0%, ${world.ink}dd 60%, ${world.ink} 100%)
              `,
              pointerEvents: "none",
              zIndex: 5,
            }}
          />

          {/* Top vignette */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "25%",
              background: `linear-gradient(180deg, ${world.ink} 0%, transparent 100%)`,
              pointerEvents: "none",
              zIndex: 5,
            }}
          />

          {/* Floating particles */}
          <Particles accent={world.accent} active={isActive} />

          {/* === CONTENT OVERLAY === */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 6vw",
              zIndex: 20,
              opacity: fadeOut,
              transition: "opacity 200ms ease",
            }}
          >
            {/* Chapter header — appears immediately */}
            <div
              style={{
                opacity: titleOpacity,
                transform: `translateY(${(1 - titleOpacity) * 20}px)`,
                transition: "opacity 400ms ease, transform 400ms ease",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(9px, 1vw, 11px)",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: world.accent,
                  marginBottom: 12,
                }}
              >
                Chapter {String(chapter.index).padStart(2, "0")} — {chapter.year}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 7vw, 72px)",
                  fontWeight: 700,
                  color: "#f0ece4",
                  lineHeight: 1.0,
                  marginBottom: 6,
                  textShadow: `0 4px 40px rgba(0,0,0,0.9), 0 0 60px ${world.accent}15`,
                }}
              >
                {chapter.org}
              </h2>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(10px, 1.2vw, 13px)",
                  letterSpacing: "0.2em",
                  color: "rgba(240, 236, 228, 0.5)",
                  textTransform: "uppercase",
                }}
              >
                {chapter.role}
              </div>
            </div>

            {/* Cliff note — types in */}
            <div
              style={{
                opacity: cliffOpacity,
                transform: `translateY(${(1 - cliffOpacity) * 12}px)`,
                transition: "opacity 500ms ease, transform 500ms ease",
                textAlign: "center",
                maxWidth: 580,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 1,
                  background: `${world.accent}66`,
                  margin: "0 auto 20px",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(16px, 2.4vw, 24px)",
                  color: "rgba(240, 236, 228, 0.88)",
                  lineHeight: 1.6,
                  textShadow: "0 2px 20px rgba(0,0,0,0.8)",
                }}
              >
                {chapter.cliff}
              </p>
            </div>

            {/* Outcomes — fly in staggered */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "8px 10px",
                marginBottom: 24,
                maxWidth: 600,
              }}
            >
              {chapter.outcomes.map((o, i) => {
                const itemProgress = Math.max(0, Math.min(1, (outcomesProgress * chapter.outcomes.length) - i));
                return (
                  <span
                    key={i}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(9px, 1vw, 11px)",
                      letterSpacing: "0.08em",
                      color: world.accent,
                      padding: "5px 12px",
                      border: `1px solid ${world.accent}44`,
                      background: `${world.accent}0d`,
                      textTransform: "uppercase",
                      opacity: itemProgress,
                      transform: `translateY(${(1 - itemProgress) * 16}px) scale(${0.85 + itemProgress * 0.15})`,
                      transition: "opacity 300ms ease, transform 300ms ease",
                    }}
                  >
                    {o}
                  </span>
                );
              })}
            </div>

            {/* Expandable story card */}
            <div
              style={{
                opacity: storyCardOpacity,
                transform: `translateY(${(1 - storyCardOpacity) * 20}px)`,
                transition: "opacity 400ms ease, transform 400ms ease",
                width: "100%",
                maxWidth: 560,
                pointerEvents: storyCardOpacity > 0.5 ? "auto" : "none",
              }}
            >
              <button
                type="button"
                onClick={() => setStoryOpen(!storyOpen)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: `rgba(0, 0, 0, 0.5)`,
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${world.accent}33`,
                  borderRadius: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 200ms, background 200ms",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: world.accent,
                    }}
                  >
                    {storyOpen ? "Close story" : "Read the full story"}
                  </span>
                  <span
                    style={{
                      color: world.accent,
                      fontSize: 16,
                      transform: storyOpen ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 300ms ease",
                    }}
                  >
                    ▾
                  </span>
                </div>

                {/* Expanded content */}
                <div
                  style={{
                    maxHeight: storyOpen ? 400 : 0,
                    overflow: "hidden",
                    transition: "max-height 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div style={{ paddingTop: 16 }}>
                    {chapter.paragraphs.map((para, i) => (
                      <p
                        key={i}
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 14,
                          color: "rgba(240, 236, 228, 0.75)",
                          lineHeight: 1.7,
                          marginBottom: 12,
                        }}
                      >
                        {para}
                      </p>
                    ))}
                    {chapter.builtOn.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            letterSpacing: "0.15em",
                            color: "rgba(240, 236, 228, 0.4)",
                            textTransform: "uppercase",
                          }}
                        >
                          Built on: {chapter.builtOn.join(" → ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Skill earned badge */}
            <div
              style={{
                marginTop: 24,
                opacity: skillBadgeOpacity,
                transform: `scale(${0.8 + skillBadgeOpacity * 0.2}) translateY(${(1 - skillBadgeOpacity) * 10}px)`,
                transition: "opacity 500ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 20px",
                  background: `${chapter.skill.color}15`,
                  border: `1px solid ${chapter.skill.color}55`,
                  boxShadow: `0 0 24px ${chapter.skill.color}22`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: chapter.skill.color,
                    boxShadow: `0 0 8px ${chapter.skill.color}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: chapter.skill.color,
                  }}
                >
                  Skill unlocked: {chapter.skill.name}
                </span>
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: "rgba(240, 236, 228, 0.35)",
                }}
              >
                {chapter.skill.family}
              </div>
            </div>
          </div>

          {/* Scroll progress bar */}
          {isActive && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 3,
                width: `${p * 100}%`,
                background: `linear-gradient(90deg, ${world.accent}00, ${world.accent})`,
                boxShadow: `0 0 12px ${world.accent}66`,
                zIndex: 30,
              }}
            />
          )}
        </>
      )}

      <style>{`
        @keyframes world-flash {
          0% { opacity: 0.4; }
          100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/**
 * Parallax layer — fixed rendering for silhouettes.
 * Uses imageRendering: pixelated for the pixel art assets.
 */
function ParallaxLayer({
  src,
  bottom,
  height,
  shift,
  opacity,
}: {
  src: string;
  bottom: string;
  height: string;
  shift: number;
  opacity: number;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "-15%",
        right: "-15%",
        bottom,
        height,
        transform: `translate3d(${shift}%, 0, 0)`,
        willChange: "transform",
        pointerEvents: "none",
      }}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center bottom",
          imageRendering: "pixelated",
          opacity,
          filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.4))`,
        }}
      />
    </div>
  );
}

/**
 * Atmospheric floating particles.
 */
function Particles({ accent, active }: { accent: string; active: boolean }) {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${5 + (i * 6.2) % 90}%`,
    top: `${10 + (i * 11.3) % 75}%`,
    size: 1.5 + (i % 3) * 1.2,
    duration: 3.5 + (i % 5) * 1.8,
    delay: i * 0.3,
  }));

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 8,
        opacity: active ? 0.7 : 0,
        transition: "opacity 1.5s ease",
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
            animation: `particle-drift ${pt.duration}s ease-in-out ${pt.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes particle-drift {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          20% { transform: translate(3px, -8px); opacity: 0.6; }
          40% { transform: translate(-4px, -18px); opacity: 0.8; }
          60% { transform: translate(5px, -25px); opacity: 0.5; }
          80% { transform: translate(-2px, -15px); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
