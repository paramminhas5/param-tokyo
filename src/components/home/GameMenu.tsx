"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HERO, CHAPTERS } from "@/content/resume";
import { WORLDS } from "@/game/journey";

/**
 * Game Title Screen — single viewport, no scroll.
 * Inspired by Firewatch/Journey/Sable title screens.
 * Full-bleed rotating world art + centered title + game-menu options.
 */
export function GameMenu() {
  const [bgIndex, setBgIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Rotate through world backgrounds
  useEffect(() => {
    setVisible(true);
    const t1 = setTimeout(() => setMenuVisible(true), 600);
    const interval = setInterval(() => {
      setBgIndex((i) => (i + 1) % CHAPTERS.length);
    }, 6000);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);

  const currentChapter = CHAPTERS[bgIndex];
  const currentWorld = WORLDS[currentChapter.id];
  const nextWorld = WORLDS[CHAPTERS[(bgIndex + 1) % CHAPTERS.length].id];

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#050310",
      }}
    >
      {/* Rotating world backgrounds */}
      {CHAPTERS.map((ch, i) => {
        const w = WORLDS[ch.id];
        return (
          <div
            key={ch.id}
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${w.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === bgIndex ? 1 : 0,
              transition: "opacity 2s ease-in-out",
              filter: "brightness(0.4) saturate(1.2)",
            }}
          />
        );
      })}

      {/* Dark overlay for readability */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 70% at 50% 40%, rgba(5,3,16,0.3) 0%, rgba(5,3,16,0.85) 100%),
            linear-gradient(180deg, rgba(5,3,16,0.4) 0%, transparent 30%, transparent 60%, rgba(5,3,16,0.9) 100%)
          `,
          zIndex: 2,
        }}
      />

      {/* Small foreground accent from current world */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "35%",
          height: "40%",
          opacity: 0.3,
          transition: "opacity 2s ease",
          zIndex: 3,
        }}
      >
        <img
          src={currentWorld.fg}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom right",
            filter: "brightness(0.6)",
          }}
        />
      </div>

      {/* Floating particles */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${4 + (i * 4.1) % 92}%`,
              top: `${8 + (i * 7.3) % 82}%`,
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              borderRadius: "50%",
              background: currentWorld.accent,
              opacity: 0.3,
              boxShadow: `0 0 8px ${currentWorld.accent}44`,
              animation: `menu-particle ${3 + (i % 4) * 2}s ease-in-out ${i * 0.2}s infinite`,
              transition: "background 2s ease, box-shadow 2s ease",
            }}
          />
        ))}
      </div>

      {/* === CONTENT === */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 clamp(24px, 6vw, 80px)",
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 10vw, 100px)",
              fontWeight: 700,
              color: "#f0ece4",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              marginBottom: 12,
              textShadow: "0 4px 40px rgba(0,0,0,0.8)",
            }}
          >
            {HERO.name}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(11px, 1.4vw, 15px)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(240, 236, 228, 0.6)",
              marginBottom: 8,
            }}
          >
            {HERO.tagline}
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(13px, 1.5vw, 16px)",
              color: "rgba(240, 236, 228, 0.35)",
              maxWidth: 440,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            An interactive journey through 15 years of building.
          </p>
        </div>

        {/* Menu buttons — game-style */}
        <nav
          style={{
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            opacity: menuVisible ? 1 : 0,
            transform: menuVisible ? "translateY(0)" : "translateY(16px)",
            transition: "all 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 200ms",
          }}
        >
          <MenuButton href="/play" accent={currentWorld.accent} primary>
            Experience the Journey
          </MenuButton>
          <MenuButton href="/cv" accent={currentWorld.accent}>
            View Resume
          </MenuButton>
          <MenuButton href={`mailto:${HERO.email}`} accent={currentWorld.accent} external>
            Get in Touch
          </MenuButton>
        </nav>

        {/* Current world indicator */}
        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            opacity: menuVisible ? 0.6 : 0,
            transition: "opacity 1s ease 1s",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: currentWorld.accent,
              transition: "color 2s ease",
              marginBottom: 4,
            }}
          >
            World {String(bgIndex + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              color: "rgba(240, 236, 228, 0.5)",
            }}
          >
            {currentChapter.org} · {currentChapter.year}
          </div>
        </div>
      </div>

      {/* Bottom stats ticker */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          borderTop: "1px solid rgba(240, 236, 228, 0.06)",
          background: "rgba(5, 3, 16, 0.8)",
          backdropFilter: "blur(8px)",
          overflow: "hidden",
          height: 40,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 48,
            animation: "stats-scroll 25s linear infinite",
            whiteSpace: "nowrap",
          }}
        >
          {[...HERO.stats, ...HERO.stats].map((s, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                color: "rgba(240, 236, 228, 0.45)",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#f0ece4", fontWeight: 600 }}>{s.value}</span>
              {" "}{s.label}
            </span>
          ))}
        </div>
      </div>

      {/* World navigation dots */}
      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
          zIndex: 20,
        }}
      >
        {CHAPTERS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setBgIndex(i)}
            aria-label={`Show world ${i + 1}`}
            style={{
              width: i === bgIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              border: "none",
              background: i === bgIndex ? currentWorld.accent : "rgba(240, 236, 228, 0.2)",
              transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes menu-particle {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          33% { transform: translate(2px, -10px); opacity: 0.5; }
          66% { transform: translate(-3px, -18px); opacity: 0.3; }
        }
        @keyframes stats-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}

function MenuButton({
  href,
  accent,
  primary,
  external,
  children,
}: {
  href: string;
  accent: string;
  primary?: boolean;
  external?: boolean;
  children: React.ReactNode;
}) {
  const Tag = external ? "a" : Link;
  const extraProps = external ? { target: undefined } : {};

  return (
    <Tag
      href={href}
      {...extraProps}
      style={{
        display: "block",
        minWidth: 260,
        textAlign: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        padding: "16px 32px",
        color: primary ? "#050310" : "#f0ece4",
        background: primary ? accent : "rgba(240, 236, 228, 0.04)",
        border: primary ? "none" : `1px solid rgba(240, 236, 228, 0.12)`,
        textDecoration: "none",
        backdropFilter: primary ? "none" : "blur(4px)",
        transition: "all 200ms ease",
        boxShadow: primary ? `0 0 30px ${accent}44` : "none",
      }}
    >
      {children}
    </Tag>
  );
}
