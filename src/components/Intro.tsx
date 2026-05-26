"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HERO, CHAPTERS } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * Intro — full viewport opening screen.
 *
 * Features:
 * - Rotating BG crossfade from all 9 worlds
 * - Clickable chapter dots: click → scroll to that world
 * - Hover on desktop → poster preview tooltip
 * - Poster accordion strip behind the text (very low opacity)
 * - Stars, ambient glow, scroll indicator
 */
export function Intro() {
  const [bgIndex,       setBgIndex]       = useState(0);
  const [starsVisible,  setStarsVisible]  = useState(false);
  const [entered,       setEntered]       = useState(false);
  const [hoveredDot,    setHoveredDot]    = useState<number | null>(null);
  const [isMobile,      setIsMobile]      = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setEntered(true),  200);
    const t2 = setTimeout(() => setStarsVisible(true), 1800);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % CHAPTERS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const scrollToChapter = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section id="intro" style={{
      position: "relative", width: "100%", height: "100vh",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      background: "#050310", overflow: "hidden",
    }}>

      {/* ── ROTATING BG CROSSFADE ─────────────────────────────────────── */}
      {CHAPTERS.map((ch, i) => (
        <div key={ch.id} aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${WORLDS[ch.id].bg})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: i === bgIndex ? 0.22 : 0,
          transition: "opacity 2.4s ease",
          filter: "brightness(0.35) saturate(1.4) blur(1px)",
        }} />
      ))}

      {/* ── POSTER ACCORDION STRIP — very low opacity behind text ─────── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1,
        display: "flex", alignItems: "stretch",
        opacity: entered ? 0.035 : 0,
        transition: "opacity 2s ease 2s",
        overflow: "hidden",
      }}>
        {CHAPTERS.map((ch) => (
          <div key={ch.id} style={{
            flex: 1, minWidth: 0,
            backgroundImage: `url(${WORLDS[ch.id].poster})`,
            backgroundSize: "cover", backgroundPosition: "center top",
            filter: "saturate(0.6)",
          }} />
        ))}
      </div>

      {/* ── DARK OVERLAY ──────────────────────────────────────────────── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, #050310 80%)",
      }} />

      {/* ── AMBIENT GLOW ──────────────────────────────────────────────── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: `
          radial-gradient(ellipse 60% 40% at 50% 60%, rgba(251,191,36,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 25% 40%, rgba(34,211,238,0.04) 0%, transparent 50%),
          radial-gradient(ellipse 40% 30% at 75% 70%, rgba(236,72,153,0.04) 0%, transparent 50%)
        `,
      }} />

      {/* ── STAR FIELD ────────────────────────────────────────────────── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 3,
        opacity: starsVisible ? 1 : 0, transition: "opacity 3s ease",
      }}>
        {Array.from({ length: 64 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${3 + (i * 2.07) % 94}%`,
            top:  `${3 + (i * 3.71) % 93}%`,
            width:  i % 5 === 0 ? 2 : 1,
            height: i % 5 === 0 ? 2 : 1,
            borderRadius: "50%",
            background: "rgba(240,236,228,0.7)",
            animation: `twinkle ${2.2 + (i % 4) * 0.8}s ease-in-out ${(i * 0.17) % 3}s infinite`,
          }} />
        ))}
      </div>

      {/* ── TOP DECORATIVE LINE ───────────────────────────────────────── */}
      <div aria-hidden style={{
        position: "absolute", top: "10%", left: "50%",
        transform: "translateX(-50%)",
        width: 1, height: entered ? 60 : 0,
        background: "linear-gradient(180deg, transparent, rgba(251,191,36,0.5))",
        transition: "height 1.2s cubic-bezier(0.25,0.46,0.45,0.94) 0.4s",
        zIndex: 4,
      }} />

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 5, textAlign: "center",
        padding: "0 clamp(24px, 8vw, 80px)",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {/* Chapter count */}
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.45em",
          textTransform: "uppercase", color: "rgba(240,236,228,0.3)",
          marginBottom: 20,
          opacity: entered ? 1 : 0, transition: "opacity 1s ease 0.2s",
        }}>
          9 worlds · 15 years
        </div>

        {/* Name */}
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 10vw, 96px)",
          fontWeight: 700, color: "#f0ece4", lineHeight: 0.98,
          marginBottom: 16,
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 1.1s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s, transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s",
          textShadow: "0 4px 40px rgba(0,0,0,0.8)",
        }}>
          {HERO.name}
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(11px, 1.3vw, 14px)", letterSpacing: "0.28em",
          textTransform: "uppercase", color: "rgba(240,236,228,0.45)",
          marginBottom: 32,
          opacity: entered ? 1 : 0, transition: "opacity 1s ease 0.9s",
        }}>
          {HERO.tagline}
        </p>

        {/* Bio line */}
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(14px, 1.6vw, 17px)",
          color: "rgba(240,236,228,0.32)",
          maxWidth: 480, lineHeight: 1.68, marginBottom: 40,
          opacity: entered ? 1 : 0, transition: "opacity 1s ease 1.4s",
        }}>
          From a self-taught coder in Bengaluru to AI-native founder.
          Each chapter is a world. Each world unlocks a skill.
        </p>

        {/* ── CHAPTER DOTS — clickable + hover preview ─────────────────── */}
        <div style={{
          display: "flex", gap: isMobile ? 10 : 14, alignItems: "center",
          opacity: entered ? 1 : 0, transition: "opacity 1s ease 1.9s",
          position: "relative",
        }}>
          {CHAPTERS.map((ch, i) => {
            const accent   = WORLDS[ch.id]?.accent ?? "#fbbf24";
            const isHov    = hoveredDot === i;
            return (
              <div key={ch.id} style={{ position: "relative" }}>
                {/* Poster hover tooltip — desktop only */}
                {!isMobile && isHov && (
                  <div style={{
                    position: "absolute",
                    bottom: "calc(100% + 14px)",
                    left: "50%", transform: "translateX(-50%)",
                    width: 120, background: "rgba(5,3,16,0.92)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${accent}44`,
                    boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 20px ${accent}22`,
                    overflow: "hidden",
                    zIndex: 10,
                    animation: "tooltip-in 0.18s ease forwards",
                  }}>
                    <img
                      src={WORLDS[ch.id].poster}
                      alt={ch.org}
                      style={{ width: "100%", display: "block", aspectRatio: "3/4", objectFit: "cover" }}
                    />
                    <div style={{ padding: "8px 10px" }}>
                      <div style={{
                        fontFamily: "var(--font-mono)", fontSize: 9,
                        color: accent, letterSpacing: "0.1em",
                        textTransform: "uppercase", marginBottom: 2,
                      }}>
                        Ch. {ch.index}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-display)", fontSize: 11,
                        fontWeight: 600, color: "#f0ece4", lineHeight: 1.2,
                      }}>
                        {ch.org}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-mono)", fontSize: 8,
                        color: "rgba(240,236,228,0.4)", marginTop: 2,
                      }}>
                        {ch.year}
                      </div>
                    </div>
                    {/* Arrow */}
                    <div style={{
                      position: "absolute", bottom: -5, left: "50%",
                      transform: "translateX(-50%) rotate(45deg)",
                      width: 10, height: 10,
                      background: "rgba(5,3,16,0.92)",
                      border: `1px solid ${accent}44`,
                      borderTop: "none", borderLeft: "none",
                    }} />
                  </div>
                )}

                {/* The dot button */}
                <button
                  onClick={() => scrollToChapter(ch.id)}
                  onMouseEnter={() => setHoveredDot(i)}
                  onMouseLeave={() => setHoveredDot(null)}
                  aria-label={`Go to chapter ${ch.index}: ${ch.org}`}
                  title={`${ch.org} · ${ch.year}`}
                  style={{
                    width:  isHov ? 14 : i === 0 ? 10 : 7,
                    height: isHov ? 14 : i === 0 ? 10 : 7,
                    borderRadius: "50%",
                    background: accent,
                    opacity: isHov ? 1 : 0.4 + i * 0.055,
                    boxShadow: isHov
                      ? `0 0 16px ${accent}, 0 0 32px ${accent}66`
                      : `0 0 6px ${accent}44`,
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "all 250ms cubic-bezier(0.34,1.56,0.64,1)",
                    animation: isHov ? "none" : `dot-pulse ${2 + i * 0.2}s ease-in-out ${i * 0.15}s infinite`,
                    display: "block",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Chapter label when hovering */}
        <div style={{
          marginTop: 12, height: 20,
          fontFamily: "var(--font-mono)", fontSize: 9,
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: hoveredDot !== null
            ? WORLDS[CHAPTERS[hoveredDot].id]?.accent ?? "#fbbf24"
            : "transparent",
          transition: "color 200ms",
          opacity: entered ? 1 : 0,
        }}>
          {hoveredDot !== null
            ? `${CHAPTERS[hoveredDot].org} · ${CHAPTERS[hoveredDot].year}`
            : "hover to preview · click to jump"}
        </div>
      </div>

      {/* ── SCROLL INDICATOR ──────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: "clamp(28px, 5vh, 52px)", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        zIndex: 5,
        opacity: entered ? 1 : 0, transition: "opacity 1s ease 2.6s",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.35em",
          textTransform: "uppercase", color: "rgba(240,236,228,0.5)",
          animation: "hint-pulse 2s ease-in-out infinite",
        }}>
          Scroll to begin
        </div>
        <div style={{
          width: 1, height: 52,
          background: "linear-gradient(180deg, rgba(251,191,36,0.6), transparent)",
          animation: "scroll-drop 2.2s ease-in-out infinite",
        }} />
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "rgba(251,191,36,0.9)",
          boxShadow: "0 0 14px rgba(251,191,36,0.6)",
          animation: "scroll-drop 2.2s ease-in-out 0.4s infinite",
        }} />
      </div>

      {/* ── BOTTOM FADE ───────────────────────────────────────────────── */}
      <div aria-hidden style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
        background: "linear-gradient(180deg, transparent, #050310)", zIndex: 4,
      }} />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; } 50% { opacity: 0.9; }
        }
        @keyframes hint-pulse {
          0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; }
        }
        @keyframes scroll-drop {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(8px); }
        }
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        @keyframes tooltip-in {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </section>
  );
}
