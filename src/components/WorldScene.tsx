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
 * A single world — cinematic full-viewport parallax scene.
 * Inspired by Sable, Journey, and Firewatch.
 *
 * Visual features:
 *   - Multi-layer parallax with depth-of-field feeling
 *   - Floating atmospheric particles
 *   - Elegant narration that breathes with scroll
 *   - Accent color atmosphere that bleeds from the ground
 *   - Smooth cross-fade between visibility states
 */
export function WorldScene({ chapter }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const ref = useRef<HTMLElement | null>(null);
  const { worldId, worldProgress, worldIndex } = useProgress();
  const isActive = worldId === chapter.id;

  useEffect(() => {
    registerWorldEl(chapter.id, ref.current);
    return () => registerWorldEl(chapter.id, null);
  }, [chapter.id]);

  useEffect(() => {
    if (isActive) playWorld(chapter.id);
  }, [isActive, chapter.id]);

  const p = isActive ? worldProgress : worldIndex > chapter.index - 1 ? 1 : 0;

  // Lazy mount for performance
  const distance = Math.abs((chapter.index - 1) - Math.max(0, worldIndex));
  const isNear = distance <= 1;

  // Parallax magnitudes — cinematic depth
  const skyShift = p * -1;
  const farShift = p * -3;
  const midShift = p * -7;
  const nearShift = p * -12;

  // Narration: appears in the center of the scroll, fades gently
  const narrationOpacity = isActive
    ? p < 0.12 ? p / 0.12
    : p > 0.88 ? (1 - p) / 0.12
    : 1
    : 0;

  // Vertical narration drift — text floats upward as you scroll
  const narrationY = isActive ? (0.5 - p) * 20 : 0;

  return (
    <section
      ref={ref}
      id={chapter.id}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: world.ink,
      }}
    >
      {!isNear && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${world.ink} 0%, ${world.accent}06 50%, ${world.ink} 100%)`,
          }}
        />
      )}

      {isNear && (
        <>
          {/* L1 — SKY with subtle gradient overlay */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${world.sky})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              transform: `translate3d(${skyShift}%, 0, 0)`,
              willChange: "transform",
            }}
          />

          {/* L2 — FAR (atmospheric, ghostly) */}
          <ParallaxLayer
            src={world.far}
            bottom="20vh"
            height="30vh"
            shift={farShift}
            opacity={0.25}
            blur={1}
          />

          {/* L3 — MID (structural, environmental) */}
          <ParallaxLayer
            src={world.mid}
            bottom="12vh"
            height="34vh"
            shift={midShift}
            opacity={0.55}
            blur={0}
          />

          {/* L4 — NEAR (focal, sharp) */}
          <ParallaxLayer
            src={world.near}
            bottom="4vh"
            height="30vh"
            shift={nearShift}
            opacity={0.8}
            blur={0}
          />

          {/* Ground atmosphere — accent colored mist rising */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "40%",
              background: `
                radial-gradient(ellipse 120% 60% at 50% 100%, ${world.accent}22 0%, transparent 70%),
                linear-gradient(180deg, transparent 0%, ${world.ink}cc 70%, ${world.ink} 100%)
              `,
              pointerEvents: "none",
              zIndex: 5,
            }}
          />

          {/* Top atmosphere — sky bleed */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "30%",
              background: `linear-gradient(180deg, ${world.ink}ee 0%, transparent 100%)`,
              pointerEvents: "none",
              zIndex: 5,
            }}
          />

          {/* Floating particles */}
          <Particles accent={world.accent} active={isActive} />

          {/* NARRATION OVERLAY — the soul of the experience */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 8vw",
              zIndex: 20,
              pointerEvents: "none",
              opacity: narrationOpacity,
              transform: `translate3d(0, ${narrationY}px, 0)`,
              transition: "opacity 300ms ease-out, transform 300ms ease-out",
            }}
          >
            {/* Chapter index + year — like a chapter card */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(9px, 1vw, 11px)",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: world.accent,
                marginBottom: 16,
                opacity: 0.9,
              }}
            >
              Chapter {String(chapter.index).padStart(2, "0")} — {chapter.year}
            </div>

            {/* Organization name — large, confident */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 6vw, 64px)",
                fontWeight: 700,
                color: "#f0ece4",
                textAlign: "center",
                lineHeight: 1.05,
                marginBottom: 8,
                textShadow: `0 4px 32px rgba(0,0,0,0.9), 0 0 80px ${world.accent}22`,
              }}
            >
              {chapter.org}
            </h2>

            {/* Role subtitle */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(10px, 1.2vw, 13px)",
                letterSpacing: "0.2em",
                color: "rgba(240, 236, 228, 0.5)",
                marginBottom: 28,
                textTransform: "uppercase",
              }}
            >
              {chapter.role}
            </div>

            {/* Divider line */}
            <div
              style={{
                width: 40,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${world.accent}88, transparent)`,
                marginBottom: 28,
              }}
            />

            {/* Cliff note — the story */}
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(15px, 2.2vw, 22px)",
                color: "rgba(240, 236, 228, 0.82)",
                textAlign: "center",
                maxWidth: 540,
                lineHeight: 1.65,
                fontWeight: 400,
                textShadow: "0 2px 16px rgba(0,0,0,0.8)",
              }}
            >
              {chapter.cliff}
            </p>

            {/* Outcomes — minimal tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "6px 12px",
                marginTop: 28,
              }}
            >
              {chapter.outcomes.slice(0, 4).map((o, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(8px, 0.9vw, 10px)",
                    letterSpacing: "0.1em",
                    color: world.accent,
                    padding: "4px 10px",
                    border: `1px solid ${world.accent}33`,
                    background: `${world.accent}0a`,
                    textTransform: "uppercase",
                  }}
                >
                  {o}
                </span>
              ))}
            </div>
          </div>

          {/* Scroll progress indicator — thin accent line at bottom */}
          {isActive && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 2,
                width: `${p * 100}%`,
                background: `linear-gradient(90deg, ${world.accent}00, ${world.accent}cc)`,
                zIndex: 30,
                transition: "width 100ms linear",
              }}
            />
          )}
        </>
      )}
    </section>
  );
}

/**
 * Parallax layer with optional blur for depth-of-field effect.
 */
function ParallaxLayer({
  src,
  bottom,
  height,
  shift,
  opacity,
  blur = 0,
}: {
  src: string;
  bottom: string;
  height: string;
  shift: number;
  opacity: number;
  blur?: number;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "-10%",
        right: "-10%",
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
          opacity,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
        }}
      />
    </div>
  );
}

/**
 * Floating particles — atmospheric dust/fireflies that give depth.
 * CSS-only animation, no JS overhead.
 */
function Particles({ accent, active }: { accent: string; active: boolean }) {
  // Generate 12 particles with varied positions/sizes/durations
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + (i * 7.5) % 85}%`,
    top: `${15 + (i * 13) % 70}%`,
    size: 2 + (i % 3),
    duration: 4 + (i % 5) * 1.5,
    delay: i * 0.4,
  }));

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 8,
        opacity: active ? 0.6 : 0,
        transition: "opacity 1s ease",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 ${p.size * 3}px ${accent}66`,
            animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes particle-float {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          25% { transform: translate(4px, -12px); opacity: 0.7; }
          50% { transform: translate(-2px, -20px); opacity: 0.5; }
          75% { transform: translate(6px, -8px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
