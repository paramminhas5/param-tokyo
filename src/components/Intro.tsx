"use client";

import { useEffect, useState } from "react";
import { HERO } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { CHAPTERS } from "@/content/resume";

/**
 * Intro — full viewport opening screen.
 *
 * - Dark atmospheric base
 * - World BGs crossfade behind the title
 * - Name + tagline appear on mount (CSS animation, not scroll-driven — this is
 *   the FIRST thing you see, scroll hasn't started yet)
 * - "Scroll to begin" pulse
 * - After 2s: ambient star particles begin
 */
export function Intro() {
  const [bgIndex, setBgIndex] = useState(0);
  const [starsVisible, setStarsVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  // Rotate through world BGs
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    const t2 = setTimeout(() => setStarsVisible(true), 1800);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % CHAPTERS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const worldKeys = CHAPTERS.map((c) => c.id);

  return (
    <section
      id="intro"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#050310",
        overflow: "hidden",
      }}
    >
      {/* ── ROTATING BG CROSSFADE ── */}
      {worldKeys.map((id, i) => (
        <div
          key={id}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${WORLDS[id].bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === bgIndex ? 0.12 : 0,
            transition: "opacity 2s ease",
            filter: "brightness(0.4) saturate(1.2) blur(1px)",
          }}
        />
      ))}

      {/* ── DARK OVERLAY ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, #050310 80%)",
          zIndex: 1,
        }}
      />

      {/* ── AMBIENT GLOW ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 40% at 50% 60%, rgba(251,191,36,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 25% 40%, rgba(34,211,238,0.025) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 75% 70%, rgba(236,72,153,0.025) 0%, transparent 50%)
          `,
          zIndex: 1,
        }}
      />

      {/* ── STAR FIELD ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          opacity: starsVisible ? 1 : 0,
          transition: "opacity 3s ease",
        }}
      >
        {Array.from({ length: 48 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${3 + (i * 2.07) % 94}%`,
              top:  `${3 + (i * 3.71) % 93}%`,
              width:  (i % 5 === 0) ? 2 : 1,
              height: (i % 5 === 0) ? 2 : 1,
              borderRadius: "50%",
              background: "rgba(240,236,228,0.7)",
              animation: `twinkle ${2.2 + (i % 4) * 0.8}s ease-in-out ${(i * 0.17) % 3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── DECORATIVE VERTICAL LINE ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 1,
          height: entered ? 60 : 0,
          background: "linear-gradient(180deg, transparent, rgba(251,191,36,0.5))",
          transition: "height 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s",
          zIndex: 3,
        }}
      />

      {/* ── MAIN CONTENT ── */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          textAlign: "center",
          padding: "0 clamp(24px, 8vw, 80px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Name */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 10vw, 96px)",
            fontWeight: 700,
            color: "#f0ece4",
            lineHeight: 0.98,
            marginBottom: 18,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s, transform 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s",
            textShadow: "0 4px 40px rgba(0,0,0,0.8)",
          }}
        >
          {HERO.name}
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(11px, 1.3vw, 14px)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.45)",
            marginBottom: 40,
            opacity: entered ? 1 : 0,
            transition: "opacity 1s ease 0.9s",
          }}
        >
          {HERO.tagline}
        </p>

        {/* Bio line */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: "rgba(240,236,228,0.3)",
            maxWidth: 460,
            lineHeight: 1.68,
            marginBottom: 0,
            opacity: entered ? 1 : 0,
            transition: "opacity 1s ease 1.4s",
          }}
        >
          A journey through 9 worlds. 15 years of building.
        </p>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(28px, 5vh, 52px)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          zIndex: 4,
          opacity: entered ? 1 : 0,
          transition: "opacity 1s ease 2.2s",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.28)",
            marginBottom: 8,
            animation: "hint-pulse 2s ease-in-out infinite",
          }}
        >
          Scroll to begin
        </div>
        <div
          style={{
            width: 1,
            height: 44,
            background: "linear-gradient(180deg, transparent, rgba(251,191,36,0.4))",
            animation: "scroll-drop 2.2s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(251,191,36,0.7)",
            boxShadow: "0 0 10px rgba(251,191,36,0.4)",
            animation: "scroll-drop 2.2s ease-in-out 0.4s infinite",
          }}
        />
      </div>

      {/* ── BOTTOM FADE ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(180deg, transparent, #050310)",
          zIndex: 3,
        }}
      />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
        @keyframes hint-pulse {
          0%, 100% { opacity: 0.28; }
          50% { opacity: 0.55; }
        }
        @keyframes scroll-drop {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
}
