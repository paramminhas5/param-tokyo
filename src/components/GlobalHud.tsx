"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CHAPTERS, HERO } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { useTotalProgress } from "@/game/scroller";
import { setAmbientMuted } from "@/game/ambient";

/**
 * GlobalHud — fixed overlay for the entire experience.
 *
 * - Top progress bar (accent color per world)
 * - Top left: PARAM TOKYO wordmark
 * - Top right: mute toggle + skill counter + CV link
 * - Left side: chapter dot navigation (9 dots, click to jump)
 * - Skill unlock toast (bottom right, 2.8s)
 * - Bottom skill bar (accumulates as worlds are passed)
 * - Keyboard: ArrowDown/ArrowUp/PageDown/PageUp jump chapters
 */
export function GlobalHud() {
  const totalP = useTotalProgress();
  const [unlockedSkills, setUnlockedSkills] = useState<typeof CHAPTERS[0]["skill"][]>([]);
  const [lastUnlocked, setLastUnlocked]     = useState<string | null>(null);
  const [muted, setMuted]                   = useState(false);
  const [audioStarted, setAudioStarted]     = useState(false);

  // ── Skill unlock logic ────────────────────────────────────────────────────
  useEffect(() => {
    const INTRO_W = 1, WORLD_W = 2;
    const total_W = INTRO_W + CHAPTERS.length * WORLD_W + 1;

    const newSkills: typeof CHAPTERS[0]["skill"][] = [];
    CHAPTERS.forEach((ch, i) => {
      const worldStart = (INTRO_W + i * WORLD_W) / total_W;
      const worldEnd   = (INTRO_W + (i + 1) * WORLD_W) / total_W;
      const worldP     = (totalP - worldStart) / (worldEnd - worldStart);
      if (worldP >= 0.65) newSkills.push(ch.skill);
    });

    if (newSkills.length > unlockedSkills.length) {
      const newest = newSkills[newSkills.length - 1];
      setLastUnlocked(newest.name);
      setTimeout(() => setLastUnlocked(null), 2800);
    }
    setUnlockedSkills(newSkills);
  }, [totalP]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Current world accent ──────────────────────────────────────────────────
  const currentWorldIndex = Math.min(
    CHAPTERS.length - 1,
    Math.max(0, Math.floor((totalP * 20 - 1) / 2))
  );
  const currentWorld  = CHAPTERS[currentWorldIndex];
  const accentColor   = currentWorld ? WORLDS[currentWorld.id]?.accent ?? "#fbbf24" : "#fbbf24";

  // ── Per-world progress for dot nav ───────────────────────────────────────
  const INTRO_W = 1, WORLD_W = 2;
  const total_W = INTRO_W + CHAPTERS.length * WORLD_W + 1;
  const dotProgresses = CHAPTERS.map((_, i) => {
    const worldStart = (INTRO_W + i * WORLD_W) / total_W;
    const worldEnd   = (INTRO_W + (i + 1) * WORLD_W) / total_W;
    return Math.max(0, Math.min(1, (totalP - worldStart) / (worldEnd - worldStart)));
  });

  // ── Mute toggle ───────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    setAmbientMuted(next);
    setAudioStarted(true);
  }, [muted]);

  // Mark audio as started on first scroll
  useEffect(() => {
    if (totalP > 0.01 && !audioStarted) setAudioStarted(true);
  }, [totalP, audioStarted]);

  // ── Scroll to chapter ─────────────────────────────────────────────────────
  const scrollToChapter = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ── Keyboard chapter navigation ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const next = Math.min(currentWorldIndex + 1, CHAPTERS.length - 1);
        scrollToChapter(CHAPTERS[next].id);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const prev = Math.max(currentWorldIndex - 1, 0);
        scrollToChapter(CHAPTERS[prev].id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentWorldIndex, scrollToChapter]);

  return (
    <>
      {/* ── TOP PROGRESS BAR ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: 3, zIndex: 200,
        background: "rgba(240,236,228,0.05)",
      }}>
        <div style={{
          height: "100%",
          width: `${totalP * 100}%`,
          background: accentColor,
          boxShadow: `0 0 10px ${accentColor}88`,
          transition: "width 120ms linear, background 800ms ease",
        }} />
      </div>

      {/* ── TOP LEFT — Wordmark ── */}
      <div style={{
        position: "fixed", top: 14, left: 20, zIndex: 200,
        fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.3em",
        textTransform: "uppercase", color: "rgba(240,236,228,0.55)",
        pointerEvents: "none", userSelect: "none",
      }}>
        {HERO.name.split(" ")[0]} Tokyo
      </div>

      {/* ── TOP RIGHT — Mute + Skill counter + CV ── */}
      <div style={{
        position: "fixed", top: 10, right: 16, zIndex: 200,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        {/* Mute button */}
        <button
          onClick={toggleMute}
          title={muted ? "Unmute ambient audio" : "Mute ambient audio"}
          aria-label={muted ? "Unmute" : "Mute"}
          style={{
            fontFamily: "var(--font-mono)", fontSize: 14,
            padding: "4px 8px", lineHeight: 1,
            color: muted ? "rgba(240,236,228,0.25)" : "rgba(240,236,228,0.55)",
            background: "transparent", border: "none", cursor: "pointer",
            transition: "color 200ms",
          }}
        >
          {muted ? "🔇" : "🔊"}
        </button>

        {unlockedSkills.length > 0 && (
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em",
            color: "rgba(240,236,228,0.38)",
          }}>
            {unlockedSkills.length}/{CHAPTERS.length} skills
          </span>
        )}

        <Link href="/cv" style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em",
          textTransform: "uppercase", padding: "6px 13px",
          color: "rgba(240,236,228,0.8)",
          background: "rgba(240,236,228,0.06)",
          border: "1px solid rgba(240,236,228,0.12)",
          textDecoration: "none",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition: "background 200ms, border-color 200ms",
        }}>
          CV
        </Link>
      </div>

      {/* ── LEFT SIDE — Chapter dot navigation ── */}
      <nav
        aria-label="Chapter navigation"
        style={{
          position: "fixed",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {CHAPTERS.map((ch, i) => {
          const chAccent = WORLDS[ch.id]?.accent ?? "#fbbf24";
          const dotP = dotProgresses[i];
          const isActive = i === currentWorldIndex;
          const isVisited = dotP > 0.1;
          return (
            <button
              key={ch.id}
              onClick={() => scrollToChapter(ch.id)}
              title={`${ch.org} — ${ch.year}`}
              aria-label={`Go to chapter ${ch.index}: ${ch.org}`}
              style={{
                width: isActive ? 10 : 6,
                height: isActive ? 10 : 6,
                borderRadius: "50%",
                background: isActive
                  ? chAccent
                  : isVisited
                    ? `${chAccent}66`
                    : "rgba(240,236,228,0.15)",
                border: isActive ? `1px solid ${chAccent}88` : "none",
                boxShadow: isActive ? `0 0 10px ${chAccent}99, 0 0 20px ${chAccent}44` : "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 300ms ease",
                flexShrink: 0,
                alignSelf: "center",
              }}
            />
          );
        })}
      </nav>

      {/* ── SKILL UNLOCK TOAST ── */}
      {lastUnlocked && (
        <div style={{
          position: "fixed", top: 48, right: 20, zIndex: 200,
          padding: "10px 16px",
          background: "rgba(5,3,16,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${accentColor}44`,
          boxShadow: `0 0 20px ${accentColor}22`,
          animation: "toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
          }} />
          <div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.25em",
              textTransform: "uppercase", color: accentColor,
            }}>
              Skill Unlocked
            </div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "#f0ece4",
            }}>
              {lastUnlocked}
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM SKILL BAR ── */}
      {unlockedSkills.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
          padding: "7px clamp(48px, 5vw, 64px)",
          background: "rgba(5,3,16,0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(240,236,228,0.06)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.3em",
            textTransform: "uppercase", color: "rgba(240,236,228,0.28)", flexShrink: 0,
          }}>
            Skills
          </span>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
            {unlockedSkills.map((s, i) => (
              <span key={s.name} style={{
                fontFamily: "var(--font-mono)", fontSize: 9,
                color: s.color, padding: "3px 9px",
                background: `${s.color}10`,
                border: `1px solid ${s.color}30`,
                animation: i === unlockedSkills.length - 1
                  ? "skill-pop 500ms cubic-bezier(0.34,1.56,0.64,1) both"
                  : "none",
              }}>
                {s.name}
              </span>
            ))}
          </div>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            color: "rgba(240,236,228,0.3)", flexShrink: 0,
          }}>
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
