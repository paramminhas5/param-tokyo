"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CHAPTERS } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { useTotalProgress } from "@/game/scroller";
import { setAmbientMuted } from "@/game/ambient";

/**
 * GlobalHud — minimal, non-competing fixed overlay.
 *
 * Layout (cleaned up):
 *   Top 3px: progress bar (accent-colour per world)
 *   Top-left: wordmark — "Param Tokyo"
 *   Top-right: 🔊 mute · CV link
 *   Left-centre: 9 chapter dots (click to jump, colour per world)
 *   Bottom: skill bar (appears after first skill, inset from screen edges)
 *   Toast: skill unlock notification (top-right, 2.8s)
 *
 * Keyboard: ArrowDown/PageDown → next chapter, ArrowUp/PageUp → prev
 */
export function GlobalHud() {
  const totalP = useTotalProgress();
  const [unlockedSkills, setUnlockedSkills] = useState<typeof CHAPTERS[0]["skill"][]>([]);
  const [lastUnlocked,   setLastUnlocked]   = useState<string | null>(null);
  const [muted,          setMuted]          = useState(false);

  // ── Skill unlock math ─────────────────────────────────────────────────────
  useEffect(() => {
    const INTRO_W = 1, WORLD_W = 4; // 400vh per world
    const total_W = INTRO_W + CHAPTERS.length * WORLD_W + 1;

    const next: typeof CHAPTERS[0]["skill"][] = [];
    CHAPTERS.forEach((ch, i) => {
      const ws = (INTRO_W + i * WORLD_W) / total_W;
      const we = (INTRO_W + (i + 1) * WORLD_W) / total_W;
      const wp = (totalP - ws) / (we - ws);
      if (wp >= 0.65) next.push(ch.skill);
    });

    if (next.length > unlockedSkills.length) {
      const newest = next[next.length - 1];
      setLastUnlocked(newest.name);
      setTimeout(() => setLastUnlocked(null), 2800);
    }
    setUnlockedSkills(next);
  }, [totalP]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Current world accent (300vh per world) ────────────────────────────────
  const INTRO_W = 1, WORLD_W = 4;
  const total_W = INTRO_W + CHAPTERS.length * WORLD_W + 1;
  const currentWorldIndex = Math.min(
    CHAPTERS.length - 1,
    Math.max(0, Math.floor((totalP * total_W - INTRO_W) / WORLD_W))
  );
  const currentWorld = CHAPTERS[currentWorldIndex];
  const accent = currentWorld ? WORLDS[currentWorld.id]?.accent ?? "#fbbf24" : "#fbbf24";

  // ── Per-world progress for dot fill ──────────────────────────────────────
  const dotProgresses = CHAPTERS.map((_, i) => {
    const ws = (INTRO_W + i * WORLD_W) / total_W;
    const we = (INTRO_W + (i + 1) * WORLD_W) / total_W;
    return Math.max(0, Math.min(1, (totalP - ws) / (we - ws)));
  });

  // ── Mute ─────────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    setAmbientMuted(next);
  }, [muted]);

  // ── Chapter navigation ────────────────────────────────────────────────────
  const scrollToChapter = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Arrow / Page keys — step through chapters
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const next = Math.min(currentWorldIndex + 1, CHAPTERS.length - 1);
        scrollToChapter(CHAPTERS[next].id);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const prev = Math.max(currentWorldIndex - 1, 0);
        scrollToChapter(CHAPTERS[prev].id);
      }
      // Home / End — jump to intro or outro
      else if (e.key === "Home") {
        e.preventDefault();
        document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "End") {
        e.preventDefault();
        document.getElementById("outro")?.scrollIntoView({ behavior: "smooth" });
      }
      // 1–9 — jump directly to chapter by number
      else if (/^[1-9]$/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const idx = parseInt(e.key) - 1;
        if (idx < CHAPTERS.length) {
          e.preventDefault();
          scrollToChapter(CHAPTERS[idx].id);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentWorldIndex, scrollToChapter]);

  return (
    <>
      {/* ── TOP PROGRESS BAR ──────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          height: 3, zIndex: 200,
          background: "rgba(240,236,228,0.04)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${totalP * 100}%`,
            background: accent,
            boxShadow: `0 0 10px ${accent}88`,
            transition: "width 80ms linear, background 700ms ease",
          }}
        />
      </div>

      {/* ── TOP LEFT — wordmark ───────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", top: 14, left: 20, zIndex: 200,
          fontFamily: "var(--font-mono)", fontSize: 10,
          letterSpacing: "0.32em", textTransform: "uppercase",
          color: "rgba(240,236,228,0.45)",
          pointerEvents: "none", userSelect: "none",
        }}
      >
        Param Tokyo
      </div>

      {/* ── TOP RIGHT — mute + CV ─────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", top: 10, right: 16, zIndex: 200,
          display: "flex", alignItems: "center", gap: 8,
        }}
      >
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          title={muted ? "Unmute ambient audio" : "Mute ambient audio"}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, lineHeight: 1, padding: "4px 6px",
            color: muted ? "rgba(240,236,228,0.2)" : "rgba(240,236,228,0.5)",
            transition: "color 200ms",
          }}
        >
          {muted ? "🔇" : "🔊"}
        </button>

        <Link
          href="/cv"
          style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            letterSpacing: "0.2em", textTransform: "uppercase",
            padding: "6px 14px",
            color: "rgba(240,236,228,0.75)",
            background: "rgba(240,236,228,0.05)",
            border: "1px solid rgba(240,236,228,0.10)",
            textDecoration: "none",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            transition: "background 200ms, border-color 200ms",
          }}
        >
          CV
        </Link>
      </div>

      {/* ── LEFT RAIL — chapter dots ──────────────────────────────────── */}
      <nav
        aria-label="Chapter navigation"
        style={{
          position: "fixed", left: 14, top: "50%",
          transform: "translateY(-50%)",
          zIndex: 200,
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 8,
        }}
      >
        {CHAPTERS.map((ch, i) => {
          const chAccent  = WORLDS[ch.id]?.accent ?? "#fbbf24";
          const isActive  = i === currentWorldIndex;
          const isVisited = dotProgresses[i] > 0.08;
          return (
            <button
              key={ch.id}
              onClick={() => scrollToChapter(ch.id)}
              title={`${ch.org} · ${ch.year}`}
              aria-label={`Chapter ${ch.index}: ${ch.org}`}
              style={{
                width:  isActive ? 9 : 5,
                height: isActive ? 9 : 5,
                borderRadius: "50%",
                padding: 0,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                alignSelf: "center",
                background: isActive
                  ? chAccent
                  : isVisited
                    ? `${chAccent}55`
                    : "rgba(240,236,228,0.12)",
                boxShadow: isActive
                  ? `0 0 8px ${chAccent}bb, 0 0 20px ${chAccent}44`
                  : "none",
                transition: "all 300ms ease",
              }}
            />
          );
        })}
      </nav>

      {/* ── SKILL UNLOCK TOAST ────────────────────────────────────────── */}
      {lastUnlocked && (
        <div
          style={{
            position: "fixed", top: 48, right: 18, zIndex: 200,
            padding: "9px 14px",
            background: "rgba(5,3,16,0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${accent}44`,
            boxShadow: `0 0 24px ${accent}1a`,
            animation: "toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
            display: "flex", alignItems: "center", gap: 10,
          }}
        >
          <div
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: accent, boxShadow: `0 0 8px ${accent}`,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)", fontSize: 7,
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: accent,
              }}
            >
              Skill Unlocked
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)", fontSize: 13,
                fontWeight: 600, color: "#f0ece4",
              }}
            >
              {lastUnlocked}
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM SKILL BAR ──────────────────────────────────────────── */}
      {unlockedSkills.length > 0 && (
        <div
          style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            zIndex: 200,
            padding: "6px clamp(36px, 4vw, 56px)",
            background: "rgba(5,3,16,0.80)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(240,236,228,0.05)",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)", fontSize: 7,
              letterSpacing: "0.32em", textTransform: "uppercase",
              color: "rgba(240,236,228,0.22)", flexShrink: 0,
            }}
          >
            Skills
          </span>
          <div
            style={{
              display: "flex", gap: 5, flexWrap: "wrap", flex: 1,
              minWidth: 0,
            }}
          >
            {unlockedSkills.map((s, i) => (
              <span
                key={s.name}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 9,
                  color: s.color, padding: "3px 8px",
                  background: `${s.color}0e`,
                  border: `1px solid ${s.color}2a`,
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
              fontFamily: "var(--font-mono)", fontSize: 8,
              color: "rgba(240,236,228,0.25)", flexShrink: 0,
            }}
          >
            {unlockedSkills.length}/{CHAPTERS.length}
          </span>
        </div>
      )}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-10px) scale(0.90); }
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
