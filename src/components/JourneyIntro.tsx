"use client";

import { useEffect, useState } from "react";
import { HERO } from "@/content/resume";

/**
 * Cinematic opening for /play.
 * Inspired by game title screens — fades in letter by letter,
 * atmospheric background, subtle movement.
 */
export function JourneyIntro() {
  const [visible, setVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 300);
    const t2 = setTimeout(() => setTitleVisible(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#050310",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 60%, rgba(251, 191, 36, 0.03) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 30% 40%, rgba(34, 211, 238, 0.02) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 70% 70%, rgba(236, 72, 153, 0.02) 0%, transparent 50%)
          `,
        }}
      />

      {/* Subtle star field */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: visible ? 0.4 : 0,
          transition: "opacity 3s ease",
        }}
      >
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${5 + (i * 3.2) % 90}%`,
              top: `${5 + (i * 7.3) % 90}%`,
              width: 1 + (i % 2),
              height: 1 + (i % 2),
              borderRadius: "50%",
              background: "rgba(240, 236, 228, 0.5)",
              animation: `star-twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 8vw",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {/* Decorative line above */}
        <div
          style={{
            width: 1,
            height: 60,
            background: "linear-gradient(180deg, transparent, rgba(251, 191, 36, 0.4))",
            margin: "0 auto 32px",
            opacity: titleVisible ? 1 : 0,
            transition: "opacity 1s ease 0.5s",
          }}
        />

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 9vw, 88px)",
            fontWeight: 700,
            color: "#f0ece4",
            lineHeight: 1.0,
            marginBottom: 20,
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(12px)",
            transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s",
          }}
        >
          {HERO.name}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(11px, 1.4vw, 14px)",
            letterSpacing: "0.2em",
            color: "rgba(240, 236, 228, 0.5)",
            marginBottom: 48,
            textTransform: "uppercase",
            opacity: titleVisible ? 1 : 0,
            transition: "opacity 1s ease 0.8s",
          }}
        >
          {HERO.tagline}
        </p>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(14px, 1.8vw, 18px)",
            color: "rgba(240, 236, 228, 0.35)",
            maxWidth: 440,
            margin: "0 auto",
            lineHeight: 1.7,
            opacity: titleVisible ? 1 : 0,
            transition: "opacity 1s ease 1.2s",
          }}
        >
          A journey through 9 worlds. 15 years of building.
          <br />
          Scroll to begin.
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(32px, 6vh, 60px)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: titleVisible ? 1 : 0,
          transition: "opacity 1s ease 2s",
        }}
      >
        <div
          style={{
            width: 1,
            height: 48,
            background: "linear-gradient(180deg, transparent, rgba(240, 236, 228, 0.3))",
            animation: "scroll-pulse 2s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(251, 191, 36, 0.6)",
            animation: "scroll-pulse 2s ease-in-out infinite",
            boxShadow: "0 0 12px rgba(251, 191, 36, 0.3)",
          }}
        />
      </div>

      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes scroll-pulse {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(4px); }
        }
      `}</style>
    </section>
  );
}
