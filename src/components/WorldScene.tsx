"use client";

import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { registerWorldEl, useProgress } from "@/game/progress";
import { playWorld } from "@/game/ambient";

interface Props {
  chapter: Chapter;
  onSkillEarned?: (skill: { name: string; color: string; family: string }) => void;
}

/**
 * WorldScene v6 — Split-screen visual novel with scroll-scrubbed animations.
 *
 * Layout: LEFT (sticky art scene) | RIGHT (scrollable narrative panels)
 * 
 * Left panel:
 *   - Full BG painting (sticky, stays in view)
 *   - FG illustration that slowly zooms/reveals as you scroll deeper
 *   - Accent glow, particles, vignette
 *
 * Right panel:
 *   - Narrative content stacked vertically
 *   - Each panel uses CSS `animation: view()` concept via IntersectionObserver
 *   - Glass-morphism cards that slide in as they enter viewport
 *   - Title → Cliff → Story → Outcomes → Skill
 *
 * On mobile: stacks vertically (art on top, narrative below)
 */
export function WorldScene({ chapter, onSkillEarned }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const ref = useRef<HTMLElement | null>(null);
  const { worldId, worldProgress, worldIndex } = useProgress();
  const isActive = worldId === chapter.id;
  const [hasEntered, setHasEntered] = useState(false);
  const skillFiredRef = useRef(false);

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

  // Fire skill earned callback
  useEffect(() => {
    if (isActive && worldProgress > 0.7 && !skillFiredRef.current && onSkillEarned) {
      skillFiredRef.current = true;
      onSkillEarned(chapter.skill);
    }
  }, [isActive, worldProgress, chapter.skill, onSkillEarned]);

  const p = isActive ? worldProgress : worldIndex > chapter.index - 1 ? 1 : 0;

  // Lazy mount
  const distance = Math.abs((chapter.index - 1) - Math.max(0, worldIndex));
  const isNear = distance <= 1;

  // FG zoom — starts at scale 1, slowly zooms to 1.15 as you progress
  const fgScale = 1 + p * 0.15;
  const fgY = p * -5; // slight upward drift

  return (
    <section
      ref={ref}
      id={chapter.id}
      style={{
        position: "relative",
        width: "100%",
        background: world.ink,
      }}
    >
      {!isNear ? (
        <div style={{ minHeight: "100vh", background: world.ink }} />
      ) : (
        <div
          className="world-split"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "100vh",
          }}
        >
          {/* === LEFT: Art Scene (sticky) === */}
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              overflow: "hidden",
            }}
          >
            {/* BG */}
            <img
              src={world.bg}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                filter: "brightness(0.5) saturate(1.2)",
              }}
            />

            {/* FG — zooms as you scroll */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={world.fg}
                alt=""
                style={{
                  width: "90%",
                  maxHeight: "75%",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  transform: `scale(${fgScale}) translateY(${fgY}%)`,
                  transition: "transform 150ms linear",
                  filter: "drop-shadow(0 -12px 32px rgba(0,0,0,0.6))",
                }}
              />
            </div>

            {/* Vignette */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `
                  radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, ${world.ink}cc 100%),
                  linear-gradient(180deg, ${world.ink}66 0%, transparent 30%, transparent 60%, ${world.ink}99 100%)
                `,
                pointerEvents: "none",
              }}
            />

            {/* Accent atmosphere */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "35%",
                background: `radial-gradient(ellipse 100% 80% at 50% 100%, ${world.accent}20 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            {/* Particles */}
            <Particles accent={world.accent} active={isActive} />

            {/* Chapter number badge */}
            <div
              style={{
                position: "absolute",
                top: 24,
                left: 24,
                zIndex: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${world.accent}33`,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: world.accent,
                    lineHeight: 1,
                  }}
                >
                  {String(chapter.index).padStart(2, "0")}
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.3em", color: "rgba(240,236,228,0.4)", textTransform: "uppercase" }}>
                    Chapter
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(240,236,228,0.7)", letterSpacing: "0.1em" }}>
                    {chapter.year}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar on left edge */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 3,
                  height: `${p * 100}%`,
                  background: `linear-gradient(180deg, transparent, ${world.accent})`,
                  boxShadow: `0 0 8px ${world.accent}88`,
                  zIndex: 20,
                }}
              />
            )}
          </div>

          {/* === RIGHT: Narrative Panels (scrollable) === */}
          <div
            style={{
              padding: "15vh clamp(24px, 4vw, 60px) 20vh",
              display: "flex",
              flexDirection: "column",
              gap: 0,
              background: `linear-gradient(135deg, ${world.ink} 0%, #050310 100%)`,
              borderLeft: `1px solid ${world.accent}15`,
            }}
          >
            {/* Title block */}
            <ScrollReveal>
              <div style={{ marginBottom: 48 }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.5em",
                    textTransform: "uppercase",
                    color: world.accent,
                    marginBottom: 12,
                  }}
                >
                  {chapter.year}
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(32px, 5vw, 56px)",
                    fontWeight: 700,
                    color: "#f0ece4",
                    lineHeight: 1.0,
                    marginBottom: 10,
                  }}
                >
                  {chapter.org}
                </h2>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.15em",
                    color: "rgba(240, 236, 228, 0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  {chapter.role}
                </div>
              </div>
            </ScrollReveal>

            {/* Cliff note — hero text */}
            <ScrollReveal delay={100}>
              <div
                style={{
                  padding: "24px 28px",
                  background: "rgba(240, 236, 228, 0.03)",
                  borderLeft: `3px solid ${world.accent}`,
                  marginBottom: 40,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(18px, 2.5vw, 26px)",
                    color: "rgba(240, 236, 228, 0.92)",
                    lineHeight: 1.5,
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  {chapter.cliff}
                </p>
              </div>
            </ScrollReveal>

            {/* Full narrative paragraphs */}
            {chapter.paragraphs.map((para, i) => (
              <ScrollReveal key={i} delay={150 + i * 80}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(14px, 1.6vw, 16px)",
                    color: "rgba(240, 236, 228, 0.72)",
                    lineHeight: 1.75,
                    marginBottom: 20,
                  }}
                >
                  {para}
                </p>
              </ScrollReveal>
            ))}

            {/* Outcomes */}
            <ScrollReveal delay={300}>
              <div style={{ marginTop: 20, marginBottom: 32 }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(240, 236, 228, 0.35)",
                    marginBottom: 12,
                  }}
                >
                  Key Outcomes
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {chapter.outcomes.map((o, i) => (
                    <span
                      key={i}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.05em",
                        color: world.accent,
                        padding: "7px 14px",
                        background: `${world.accent}0c`,
                        border: `1px solid ${world.accent}33`,
                      }}
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Skill Earned */}
            <ScrollReveal delay={400}>
              <div
                style={{
                  marginTop: 12,
                  padding: "20px 24px",
                  background: `${chapter.skill.color}0a`,
                  border: `1px solid ${chapter.skill.color}44`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `${chapter.skill.color}22`,
                    border: `2px solid ${chapter.skill.color}`,
                    display: "grid",
                    placeItems: "center",
                    boxShadow: `0 0 20px ${chapter.skill.color}33`,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: chapter.skill.color,
                      boxShadow: `0 0 8px ${chapter.skill.color}`,
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: chapter.skill.color,
                      marginBottom: 4,
                    }}
                  >
                    Skill Unlocked
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#f0ece4",
                    }}
                  >
                    {chapter.skill.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "rgba(240, 236, 228, 0.4)",
                      marginTop: 4,
                    }}
                  >
                    {chapter.skill.family}
                    {chapter.builtOn.length > 0 && ` · Built on: ${chapter.builtOn.join(" → ")}`}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      )}

      {/* Mobile override: stack vertically */}
      <style>{`
        @media (max-width: 768px) {
          .world-split {
            grid-template-columns: 1fr !important;
          }
          .world-split > div:first-child {
            height: 50vh !important;
            position: relative !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * ScrollReveal — uses IntersectionObserver to animate elements as they
 * enter the viewport. This gives scroll-scrubbed feel without needing
 * CSS animation-timeline (which has limited browser support).
 */
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Atmospheric floating particles.
 */
function Particles({ accent, active }: { accent: string; active: boolean }) {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${5 + (i * 7) % 88}%`,
    top: `${10 + (i * 8.5) % 75}%`,
    size: 1.5 + (i % 3),
    duration: 4 + (i % 5) * 2,
    delay: i * 0.35,
  }));

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        opacity: active ? 0.7 : 0,
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
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          33% { transform: translateY(-12px) translateX(3px); opacity: 0.6; }
          66% { transform: translateY(-22px) translateX(-2px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
