"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CHAPTERS, HERO } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { useTotalProgress } from "@/game/scroller";

/**
 * GlobalHud — fixed overlay for the entire experience.
 *
 * Top:    thin progress bar (total page scroll) + accent color tracks world
 * TL:     PARAM TOKYO wordmark
 * TR:     skill counter + CV link
 * Bottom: skill bar — pills grow as each world is passed
 *
 * Skills unlock when worldProgress >= ~0.65 (the section is ≥65% done).
 * We derive this from total page progress + world count.
 */
export function GlobalHud() {
  const totalP = useTotalProgress();
  const [unlockedSkills, setUnlockedSkills] = useState<typeof CHAPTERS[0]["skill"][]>([]);
  const [lastUnlocked, setLastUnlocked] = useState<string | null>(null);

  // Derive which world we are in from total scroll progress.
  // Layout: Intro (0vh) + 9 worlds (200vh each) + Outro (100vh) = 1900vh total
  // We approximate: intro ends at 1/19 of total, each world takes 2/19
  useEffect(() => {
    // Intro = 1 vh-unit, each world = 2, outro = 1 → total = 1 + 9*2 + 1 = 20
    const INTRO_W  = 1;
    const WORLD_W  = 2;
    const total_W  = INTRO_W + CHAPTERS.length * WORLD_W + 1;
    const introEnd = INTRO_W / total_W;

    const newSkills: typeof CHAPTERS[0]["skill"][] = [];
    CHAPTERS.forEach((ch, i) => {
      const worldStart = (INTRO_W + i * WORLD_W) / total_W;
      const worldEnd   = (INTRO_W + (i + 1) * WORLD_W) / total_W;
      const worldP     = (totalP - worldStart) / (worldEnd - worldStart);
      if (worldP >= 0.65) {
        newSkills.push(ch.skill);
      }
    });
    void introEnd; // used for reference

    const prev = unlockedSkills;
    if (newSkills.length > prev.length) {
      const newest = newSkills[newSkills.length - 1];
      setLastUnlocked(newest.name);
      setTimeout(() => setLastUnlocked(null), 2800);
    }
    setUnlockedSkills(newSkills);
  }, [totalP]); // eslint-disable-line react-hooks/exhaustive-deps

  // Determine current world for accent color
  const currentWorldIndex = Math.min(
    CHAPTERS.length - 1,
    Math.max(0, Math.floor((totalP * 20 - 1) / 2))
  );
  const currentWorld = CHAPTERS[currentWorldIndex];
  const accentColor = currentWorld
    ? WORLDS[currentWorld.id]?.accent ?? "#fbbf24"
    : "#fbbf24";

  return (
    <>
      {/* ── TOP PROGRESS BAR ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          zIndex: 200,
          background: "rgba(240,236,228,0.05)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${totalP * 100}%`,
            background: accentColor,
            boxShadow: `0 0 10px ${accentColor}88`,
            transition: "width 120ms linear, background 800ms ease",
          }}
        />
      </div>

      {/* ── TOP LEFT — Wordmark ── */}
      <div
        style={{
          position: "fixed",
          top: 14,
          left: 20,
          zIndex: 200,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(240,236,228,0.55)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        Param Tokyo
      </div>

      {/* ── TOP RIGHT — Skill counter + CV ── */}
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 16,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {unlockedSkills.length > 0 && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "rgba(240,236,228,0.38)",
            }}
          >
            {unlockedSkills.length}/{CHAPTERS.length} skills
          </span>
        )}
        <Link
          href="/cv"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "6px 13px",
            color: "rgba(240,236,228,0.8)",
            background: "rgba(240,236,228,0.06)",
            border: "1px solid rgba(240,236,228,0.12)",
            textDecoration: "none",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            transition: "background 200ms, border-color 200ms",
          }}
        >
          CV
        </Link>
      </div>

      {/* ── SKILL UNLOCK TOAST ── */}
      {lastUnlocked && (
        <div
          style={{
            position: "fixed",
            top: 48,
            right: 20,
            zIndex: 200,
            padding: "10px 16px",
            background: "rgba(5,3,16,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${accentColor}44`,
            boxShadow: `0 0 20px ${accentColor}22`,
            animation: "toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase", color: accentColor }}>
              Skill Unlocked
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "#f0ece4" }}>
              {lastUnlocked}
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM SKILL BAR ── */}
      {unlockedSkills.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            padding: "7px clamp(16px, 3vw, 40px)",
            background: "rgba(5,3,16,0.82)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(240,236,228,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(240,236,228,0.28)",
              flexShrink: 0,
            }}
          >
            Skills
          </span>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
            {unlockedSkills.map((s, i) => (
              <span
                key={s.name}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: s.color,
                  padding: "3px 9px",
                  background: `${s.color}10`,
                  border: `1px solid ${s.color}30`,
                  animation: i === unlockedSkills.length - 1
                    ? "skill-pop 500ms cubic-bezier(0.34,1.56,0.64,1) both"
                    : "none",
                }}
              >
                {s.name}
              </span>
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "rgba(240,236,228,0.3)",
              flexShrink: 0,
            }}
          >
            {unlockedSkills.length}/{CHAPTERS.length}
          </span>
        </div>
      )}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-10px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes skill-pop {
          0%   { transform: scale(0.4); opacity: 0; }
          60%  { transform: scale(1.18); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
