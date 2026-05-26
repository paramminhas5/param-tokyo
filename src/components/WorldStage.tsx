"use client";

import { useEffect } from "react";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { useWorldProgress } from "@/game/scroller";
import { playWorld } from "@/game/ambient";

interface Props {
  chapter: Chapter;
}

/**
 * WorldStage — The heart of the experience.
 *
 * Architecture:
 *   <section id={id} style={{ minHeight: "200vh" }}>       ← tall scroll canvas
 *     <div style={{ position: sticky, height: 100vh }}>    ← scene stays put
 *       BG image (parallax slow)
 *       FG image (parallax fast, bottom-anchored, LARGE)
 *       Narrative panel (left glass panel, scroll-driven opacity)
 *       Progress bar (bottom)
 *     </div>
 *   </section>
 *
 * ALL visual states are computed from p (0→1 worldProgress).
 * NO timers. NO IntersectionObserver. Pure scroll math.
 */
export function WorldStage({ chapter }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const p = useWorldProgress(chapter.id);
  const accent = world.accent;

  // Play ambient audio when entering this world (only trigger on entry/exit transitions)
  const isInView = p > 0.05 && p < 0.95;
  useEffect(() => {
    if (isInView) {
      playWorld(chapter.id);
    }
  }, [isInView, chapter.id]);

  // ── Scroll-driven opacity/transform math ────────────────────────────────────
  // Everything fades in sequentially as you scroll through the section.
  // p=0 = just entered, p=1 = about to leave

  const chapterNumOpacity  = Math.min(1, p * 12);                        // 0→8%
  const titleOpacity       = p > 0.04 ? Math.min(1, (p - 0.04) * 10) : 0;  // 4%
  const roleOpacity        = p > 0.10 ? Math.min(1, (p - 0.10) * 10) : 0;  // 10%
  const cliffOpacity       = p > 0.18 ? Math.min(1, (p - 0.18) * 8)  : 0;  // 18%
  const paraOpacity        = p > 0.30 ? Math.min(1, (p - 0.30) * 8)  : 0;  // 30%
  const outcomesOpacity    = p > 0.44 ? Math.min(1, (p - 0.44) * 7)  : 0;  // 44%
  const skillOpacity       = p > 0.60 ? Math.min(1, (p - 0.60) * 8)  : 0;  // 60%

  // Exit fade — everything fades at 88%
  const exitMult = p > 0.88 ? Math.max(0, 1 - (p - 0.88) * 8) : 1;

  // Apply exit to panel elements
  const panelOpacity = exitMult;

  // ── Parallax math ────────────────────────────────────────────────────────────
  const bgTranslateY  = p * -15;              // BG drifts up slowly
  const fgTranslateY  = p * -18;             // FG drifts up faster
  const fgScale       = 1 + p * 0.07;        // subtle zoom

  // Title lift
  const titleLift = (1 - titleOpacity) * 22;
  const cliffLift = (1 - cliffOpacity) * 18;
  const outcomesLift = (1 - outcomesOpacity) * 14;
  const skillLift = (1 - skillOpacity) * 16;

  return (
    <section
      id={chapter.id}
      style={{
        position: "relative",
        minHeight: "200vh",
        // NO overflow: hidden here — that kills sticky!
      }}
    >
      {/* ── STICKY SCENE — stays in viewport while you scroll ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: world.ink,
        }}
      >

        {/* ── BACKGROUND IMAGE ── */}
        <img
          src={world.bg}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            transform: `translateY(${bgTranslateY}px)`,
            filter: "brightness(0.42) saturate(1.3)",
            willChange: "transform",
          }}
        />

        {/* ── VIGNETTE / ATMOSPHERE ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, ${world.ink}bb 100%),
              linear-gradient(180deg, ${world.ink}55 0%, transparent 25%, transparent 60%, ${world.ink}cc 100%),
              linear-gradient(90deg, ${world.ink}99 0%, transparent 45%)
            `,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* ── ACCENT GLOW — bottom ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${accent}20 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* ── FOREGROUND IMAGE — THE WORLD ── */}
        {/* This is the primary visual. Large, centered, bottom-anchored. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: `translateX(-50%) translateY(${fgTranslateY}px) scale(${fgScale})`,
            transformOrigin: "bottom center",
            width: "clamp(320px, 62vw, 860px)",
            height: "72%",
            zIndex: 3,
            willChange: "transform",
          }}
        >
          <img
            src={world.fg}
            alt={`${chapter.org} world scene`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "bottom center",
              filter: `drop-shadow(0 -20px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 30px ${accent}22)`,
            }}
          />
        </div>

        {/* ── FLOATING PARTICLES ── */}
        <Particles accent={accent} p={p} />

        {/* ── NARRATIVE PANEL — left side glass ── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "clamp(300px, 46vw, 580px)",
            padding: "0 clamp(24px, 4vw, 52px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0,
            zIndex: 10,
            opacity: panelOpacity,
          }}
        >

          {/* Chapter # + Year */}
          <div
            style={{
              opacity: chapterNumOpacity,
              transform: `translateY(${(1 - chapterNumOpacity) * 20}px)`,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 700,
                color: accent,
                lineHeight: 1,
                textShadow: `0 0 30px ${accent}55`,
              }}
            >
              {String(chapter.index).padStart(2, "0")}
            </span>
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(240,236,228,0.4)",
              }}>
                Chapter
              </div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.15em",
                color: accent,
                opacity: 0.8,
              }}>
                {chapter.year}
              </div>
            </div>
          </div>

          {/* Org Name */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 60px)",
              fontWeight: 700,
              color: "#f0ece4",
              lineHeight: 0.98,
              marginBottom: 6,
              opacity: titleOpacity,
              transform: `translateY(${titleLift}px)`,
              textShadow: "0 3px 24px rgba(0,0,0,0.9)",
            }}
          >
            {chapter.org}
          </h2>

          {/* Role */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(10px, 1.2vw, 13px)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(240,236,228,0.5)",
              marginBottom: 24,
              opacity: roleOpacity,
              transform: `translateY(${(1 - roleOpacity) * 12}px)`,
            }}
          >
            {chapter.role}
          </div>

          {/* Cliff Note — Glass Panel */}
          <div
            style={{
              opacity: cliffOpacity,
              transform: `translateY(${cliffLift}px)`,
              marginBottom: 18,
              padding: "16px 20px",
              background: "rgba(5, 3, 16, 0.72)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderLeft: `3px solid ${accent}`,
              boxShadow: `inset 0 0 40px rgba(5,3,16,0.3), 0 4px 32px rgba(0,0,0,0.4)`,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(14px, 1.8vw, 19px)",
                color: "rgba(240,236,228,0.92)",
                lineHeight: 1.55,
                margin: 0,
                textShadow: "0 2px 20px rgba(0,0,0,0.9)",
              }}
            >
              {chapter.cliff}
            </p>
          </div>

          {/* Story paragraph */}
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(13px, 1.4vw, 15px)",
              color: "rgba(240,236,228,0.62)",
              lineHeight: 1.72,
              marginBottom: 18,
              opacity: paraOpacity,
              transform: `translateY(${(1 - paraOpacity) * 12}px)`,
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            {chapter.paragraphs[0]}
          </p>

          {/* Outcome pills */}
          <div
            style={{
              opacity: outcomesOpacity,
              transform: `translateY(${outcomesLift}px)`,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 16,
            }}
          >
            {chapter.outcomes.slice(0, 4).map((o) => (
              <span
                key={o}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(9px, 0.9vw, 11px)",
                  letterSpacing: "0.05em",
                  color: accent,
                  padding: "5px 11px",
                  background: `${accent}12`,
                  border: `1px solid ${accent}33`,
                }}
              >
                {o}
              </span>
            ))}
          </div>

          {/* Skill Unlocked */}
          <div
            style={{
              opacity: skillOpacity,
              transform: `translateY(${skillLift}px) scale(${0.88 + skillOpacity * 0.12})`,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 18px",
              background: `${chapter.skill.color}10`,
              border: `1px solid ${chapter.skill.color}44`,
              boxShadow: `0 0 24px ${chapter.skill.color}18`,
              width: "fit-content",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: chapter.skill.color,
                boxShadow: `0 0 10px ${chapter.skill.color}`,
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: chapter.skill.color,
                  marginBottom: 2,
                }}
              >
                Skill Unlocked
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(13px, 1.4vw, 16px)",
                  fontWeight: 600,
                  color: "#f0ece4",
                }}
              >
                {chapter.skill.name}
              </div>
            </div>
          </div>

        </div>

        {/* ── PROGRESS BAR — bottom edge ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 2,
            width: `${p * 100}%`,
            background: `linear-gradient(90deg, ${accent}44, ${accent})`,
            boxShadow: `0 0 8px ${accent}66`,
            zIndex: 20,
            transition: "width 80ms linear",
          }}
        />

        {/* ── WORLD ID watermark — bottom right ── */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            right: 20,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.18)",
            zIndex: 20,
            opacity: chapterNumOpacity,
          }}
        >
          {chapter.id} · {chapter.year}
        </div>

      </div>
      {/* END STICKY SCENE */}
    </section>
  );
}

/**
 * Atmospheric floating particles — driven by scroll progress p.
 */
function Particles({ accent, p }: { accent: string; p: number }) {
  const visible = p > 0.05 && p < 0.95;

  const pts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${6 + (i * 5.3) % 86}%`,
    top:  `${8 + (i * 7.1) % 78}%`,
    size: 1.2 + (i % 3) * 0.6,
    dur:  3 + (i % 4) * 1.5,
    del:  i * 0.28,
  }));

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 4,
        opacity: visible ? 0.55 : 0,
        transition: "opacity 1.5s ease",
      }}
    >
      {pts.map((pt) => (
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
            animation: `pt-float ${pt.dur}s ease-in-out ${pt.del}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pt-float {
          0%, 100% { transform: translate(0, 0); opacity: 0.15; }
          33% { transform: translate(3px, -14px); opacity: 0.5; }
          66% { transform: translate(-2px, -24px); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
