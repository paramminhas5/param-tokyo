"use client";

import { useEffect, useState } from "react";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { useWorldProgress } from "@/game/scroller";
import { playWorld } from "@/game/ambient";

interface Props {
  chapter: Chapter;
}

/**
 * WorldStage — scroll-driven world with full narrative, mobile layout,
 * chapter transition flash, all 3 paragraphs, all outcomes, builtOn lineage.
 */
export function WorldStage({ chapter }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const p = useWorldProgress(chapter.id);
  const accent = world.accent;
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Play ambient audio when entering this world
  const isInView = p > 0.05 && p < 0.95;
  useEffect(() => {
    if (isInView) playWorld(chapter.id);
  }, [isInView, chapter.id]);

  // ── Scroll-driven opacity/transform thresholds ──────────────────────────────
  const chapterNumOpacity = Math.min(1, p * 12);
  const titleOpacity      = p > 0.04 ? Math.min(1, (p - 0.04) * 10) : 0;
  const roleOpacity       = p > 0.10 ? Math.min(1, (p - 0.10) * 10) : 0;
  const cliffOpacity      = p > 0.16 ? Math.min(1, (p - 0.16) * 8)  : 0;
  const para1Opacity      = p > 0.26 ? Math.min(1, (p - 0.26) * 8)  : 0;
  const para2Opacity      = p > 0.36 ? Math.min(1, (p - 0.36) * 8)  : 0;
  const para3Opacity      = p > 0.46 ? Math.min(1, (p - 0.46) * 8)  : 0;
  const outcomesOpacity   = p > 0.56 ? Math.min(1, (p - 0.56) * 7)  : 0;
  const skillOpacity      = p > 0.68 ? Math.min(1, (p - 0.68) * 8)  : 0;
  const builtOnOpacity    = p > 0.76 ? Math.min(1, (p - 0.76) * 8)  : 0;

  // Exit fade at 88%
  const exitMult    = p > 0.88 ? Math.max(0, 1 - (p - 0.88) * 8) : 1;
  const panelOpacity = exitMult;

  // Chapter transition flash: bright at 90-95%
  const flashOpacity = p > 0.90 && p < 0.97
    ? Math.sin(((p - 0.90) / 0.07) * Math.PI) * 0.35
    : 0;

  // ── Parallax ──────────────────────────────────────────────────────────────
  const bgTranslateY = p * -15;
  const fgTranslateY = p * -18;
  const fgScale      = 1 + p * 0.07;

  // Lift values
  const titleLift    = (1 - titleOpacity) * 22;
  const cliffLift    = (1 - cliffOpacity) * 18;
  const outcomesLift = (1 - outcomesOpacity) * 14;
  const skillLift    = (1 - skillOpacity) * 16;

  // ── Shared panel content ──────────────────────────────────────────────────
  const narrativePanel = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: isMobile ? "flex-start" : "center",
        gap: 0,
        opacity: panelOpacity,
        padding: isMobile ? "24px 20px 32px" : "0 clamp(24px, 4vw, 52px)",
        ...(isMobile ? { overflowY: "auto", flex: 1 } : {}),
      }}
    >
      {/* Chapter # + Year */}
      <div style={{
        opacity: chapterNumOpacity,
        transform: `translateY(${(1 - chapterNumOpacity) * 20}px)`,
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: isMobile ? "clamp(28px, 8vw, 40px)" : "clamp(32px, 5vw, 52px)",
          fontWeight: 700,
          color: accent,
          lineHeight: 1,
          textShadow: `0 0 30px ${accent}55`,
        }}>
          {String(chapter.index).padStart(2, "0")}
        </span>
        <div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.4)",
          }}>Chapter</div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.15em",
            color: accent,
            opacity: 0.8,
          }}>{chapter.year}</div>
        </div>
      </div>

      {/* Org Name */}
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: isMobile ? "clamp(24px, 7vw, 36px)" : "clamp(28px, 5vw, 60px)",
        fontWeight: 700,
        color: "#f0ece4",
        lineHeight: 0.98,
        marginBottom: 6,
        opacity: titleOpacity,
        transform: `translateY(${titleLift}px)`,
        textShadow: "0 3px 24px rgba(0,0,0,0.9)",
      }}>
        {chapter.org}
      </h2>

      {/* Role */}
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: isMobile ? 10 : "clamp(10px, 1.2vw, 13px)",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(240,236,228,0.5)",
        marginBottom: 20,
        opacity: roleOpacity,
        transform: `translateY(${(1 - roleOpacity) * 12}px)`,
      }}>
        {chapter.role}
      </div>

      {/* Cliff Note */}
      <div style={{
        opacity: cliffOpacity,
        transform: `translateY(${cliffLift}px)`,
        marginBottom: 16,
        padding: "14px 18px",
        background: "rgba(5, 3, 16, 0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderLeft: `3px solid ${accent}`,
        boxShadow: `inset 0 0 40px rgba(5,3,16,0.3), 0 4px 32px rgba(0,0,0,0.4)`,
      }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: isMobile ? "clamp(13px, 3.5vw, 16px)" : "clamp(14px, 1.8vw, 19px)",
          color: "rgba(240,236,228,0.92)",
          lineHeight: 1.55,
          margin: 0,
          textShadow: "0 2px 20px rgba(0,0,0,0.9)",
        }}>
          {chapter.cliff}
        </p>
      </div>

      {/* Paragraph 1 */}
      <p style={{
        fontFamily: "var(--font-display)",
        fontSize: isMobile ? "clamp(12px, 3vw, 14px)" : "clamp(13px, 1.4vw, 15px)",
        color: "rgba(240,236,228,0.65)",
        lineHeight: 1.72,
        marginBottom: 10,
        opacity: para1Opacity,
        transform: `translateY(${(1 - para1Opacity) * 12}px)`,
        textShadow: "0 2px 12px rgba(0,0,0,0.8)",
      }}>
        {chapter.paragraphs[0]}
      </p>

      {/* Paragraph 2 */}
      {chapter.paragraphs[1] && (
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: isMobile ? "clamp(12px, 3vw, 14px)" : "clamp(13px, 1.4vw, 15px)",
          color: "rgba(240,236,228,0.55)",
          lineHeight: 1.72,
          marginBottom: 10,
          opacity: para2Opacity,
          transform: `translateY(${(1 - para2Opacity) * 10}px)`,
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}>
          {chapter.paragraphs[1]}
        </p>
      )}

      {/* Paragraph 3 */}
      {chapter.paragraphs[2] && (
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: isMobile ? "clamp(12px, 3vw, 14px)" : "clamp(13px, 1.4vw, 15px)",
          color: "rgba(240,236,228,0.45)",
          lineHeight: 1.72,
          marginBottom: 16,
          opacity: para3Opacity,
          transform: `translateY(${(1 - para3Opacity) * 8}px)`,
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          fontStyle: "italic",
        }}>
          {chapter.paragraphs[2]}
        </p>
      )}

      {/* Outcome pills — all of them */}
      <div style={{
        opacity: outcomesOpacity,
        transform: `translateY(${outcomesLift}px)`,
        display: "flex",
        flexWrap: "wrap",
        gap: 5,
        marginBottom: 14,
      }}>
        {chapter.outcomes.map((o) => (
          <span key={o} style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 9 : "clamp(9px, 0.9vw, 11px)",
            letterSpacing: "0.05em",
            color: accent,
            padding: "4px 10px",
            background: `${accent}12`,
            border: `1px solid ${accent}33`,
            transition: "background 200ms, border-color 200ms",
          }}>
            {o}
          </span>
        ))}
      </div>

      {/* Skill Unlocked */}
      <div style={{
        opacity: skillOpacity,
        transform: `translateY(${skillLift}px) scale(${0.88 + skillOpacity * 0.12})`,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        background: `${chapter.skill.color}10`,
        border: `1px solid ${chapter.skill.color}44`,
        boxShadow: `0 0 24px ${chapter.skill.color}18`,
        width: "fit-content",
        marginBottom: chapter.builtOn.length > 0 ? 10 : 0,
      }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: chapter.skill.color,
          boxShadow: `0 0 10px ${chapter.skill.color}`,
          flexShrink: 0,
        }} />
        <div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: chapter.skill.color,
            marginBottom: 2,
          }}>
            Skill Unlocked
          </div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? 13 : "clamp(13px, 1.4vw, 16px)",
            fontWeight: 600,
            color: "#f0ece4",
          }}>
            {chapter.skill.name}
          </div>
        </div>
      </div>

      {/* Built on lineage */}
      {chapter.builtOn.length > 0 && (
        <div style={{
          opacity: builtOnOpacity,
          transform: `translateY(${(1 - builtOnOpacity) * 8}px)`,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.25)",
            marginRight: 4,
          }}>Built on</span>
          {chapter.builtOn.map((s, i) => (
            <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(240,236,228,0.4)",
                padding: "2px 7px",
                border: "1px solid rgba(240,236,228,0.1)",
              }}>
                {s}
              </span>
              {i < chapter.builtOn.length - 1 && (
                <span style={{ color: "rgba(240,236,228,0.18)", fontSize: 9 }}>→</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // MOBILE LAYOUT: art fills top half, narrative scrolls below
  // ─────────────────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section id={chapter.id} style={{ position: "relative", minHeight: "300vh" }}>
        <div style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: world.ink,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Art — top 45vh */}
          <div style={{ position: "relative", height: "45vh", overflow: "hidden", flexShrink: 0 }}>
            <img src={world.bg} alt="" aria-hidden style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
              transform: `translateY(${bgTranslateY}px)`,
              filter: "brightness(0.45) saturate(1.3)",
              willChange: "transform",
            }} />
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse 100% 80% at 50% 50%, transparent 20%, ${world.ink}cc 100%)`,
              zIndex: 2,
            }} />
            <img src={world.fg} alt={`${chapter.org} world scene`} style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: `translateX(-50%) translateY(${fgTranslateY * 0.5}px) scale(${fgScale})`,
              transformOrigin: "bottom center",
              width: "clamp(220px, 70vw, 380px)",
              height: "100%",
              objectFit: "contain",
              objectPosition: "bottom center",
              zIndex: 3,
              filter: `drop-shadow(0 -10px 30px rgba(0,0,0,0.7)) drop-shadow(0 0 20px ${accent}22)`,
            }} />
            {/* Chapter flash overlay on transition */}
            <div aria-hidden style={{
              position: "absolute", inset: 0, zIndex: 10,
              background: accent,
              opacity: flashOpacity,
              pointerEvents: "none",
            }} />
          </div>

          {/* Progress bar */}
          <div style={{
            height: 2, background: `rgba(240,236,228,0.05)`, flexShrink: 0, position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0,
              height: "100%", width: `${p * 100}%`,
              background: `linear-gradient(90deg, ${accent}44, ${accent})`,
              boxShadow: `0 0 8px ${accent}66`,
              transition: "width 80ms linear",
            }} />
          </div>

          {/* Narrative — bottom 55vh, scrollable */}
          <div style={{
            flex: 1,
            background: `linear-gradient(180deg, ${world.ink}ee 0%, rgba(5,3,16,0.96) 100%)`,
            backdropFilter: "blur(8px)",
            overflowY: "auto",
          }}>
            {narrativePanel}
          </div>

          {/* World watermark */}
          <div style={{
            position: "absolute", bottom: 8, right: 14,
            fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(240,236,228,0.14)", zIndex: 20,
          }}>
            {chapter.id} · {chapter.year}
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DESKTOP LAYOUT: full 200vh sticky parallax scene
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <section id={chapter.id} style={{ position: "relative", minHeight: "200vh" }}>
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        background: world.ink,
      }}>
        {/* BG */}
        <img src={world.bg} alt="" aria-hidden style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center top",
          transform: `translateY(${bgTranslateY}px)`,
          filter: "brightness(0.42) saturate(1.3)",
          willChange: "transform",
        }} />

        {/* Vignette */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, ${world.ink}bb 100%),
            linear-gradient(180deg, ${world.ink}55 0%, transparent 25%, transparent 60%, ${world.ink}cc 100%),
            linear-gradient(90deg, ${world.ink}99 0%, transparent 45%)
          `,
          pointerEvents: "none", zIndex: 2,
        }} />

        {/* Accent glow */}
        <div aria-hidden style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${accent}20 0%, transparent 70%)`,
          pointerEvents: "none", zIndex: 2,
        }} />

        {/* FG illustration */}
        <div aria-hidden style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: `translateX(-50%) translateY(${fgTranslateY}px) scale(${fgScale})`,
          transformOrigin: "bottom center",
          width: "clamp(320px, 62vw, 860px)",
          height: "72%",
          zIndex: 3,
          willChange: "transform",
        }}>
          <img src={world.fg} alt={`${chapter.org} world scene`} style={{
            width: "100%", height: "100%",
            objectFit: "contain", objectPosition: "bottom center",
            filter: `drop-shadow(0 -20px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 30px ${accent}22)`,
          }} />
        </div>

        {/* Particles */}
        <Particles accent={accent} p={p} />

        {/* Chapter transition flash */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 15,
          background: accent,
          opacity: flashOpacity,
          pointerEvents: "none",
        }} />

        {/* Narrative panel — left */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: "clamp(300px, 46vw, 580px)",
          padding: "0 clamp(24px, 4vw, 52px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 10,
        }}>
          {narrativePanel}
        </div>

        {/* Progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          height: 2, width: `${p * 100}%`,
          background: `linear-gradient(90deg, ${accent}44, ${accent})`,
          boxShadow: `0 0 8px ${accent}66`,
          zIndex: 20,
          transition: "width 80ms linear",
        }} />

        {/* World watermark */}
        <div style={{
          position: "absolute", bottom: 18, right: 20,
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.25em",
          textTransform: "uppercase", color: "rgba(240,236,228,0.18)", zIndex: 20,
          opacity: chapterNumOpacity,
        }}>
          {chapter.id} · {chapter.year}
        </div>
      </div>
    </section>
  );
}

function Particles({ accent, p }: { accent: string; p: number }) {
  const visible = p > 0.05 && p < 0.95;
  const pts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${6 + (i * 5.3) % 86}%`,
    top: `${8 + (i * 7.1) % 78}%`,
    size: 1.2 + (i % 3) * 0.6,
    dur: 3 + (i % 4) * 1.5,
    del: i * 0.28,
  }));
  return (
    <div aria-hidden style={{
      position: "absolute", inset: 0,
      pointerEvents: "none", zIndex: 4,
      opacity: visible ? 0.55 : 0,
      transition: "opacity 1.5s ease",
    }}>
      {pts.map((pt) => (
        <div key={pt.id} style={{
          position: "absolute",
          left: pt.left, top: pt.top,
          width: pt.size, height: pt.size,
          borderRadius: "50%",
          background: accent,
          boxShadow: `0 0 ${pt.size * 5}px ${accent}44`,
          animation: `pt-float ${pt.dur}s ease-in-out ${pt.del}s infinite`,
        }} />
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
