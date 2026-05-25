"use client";

import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { useProgress } from "@/game/progress";

/**
 * One global card pinned to the top-left of the viewport.
 * Appears when the hero ENTERS a new world (worldIndex changes), holds for ~6s,
 * then fades. Click to dismiss early.
 *
 * Never overlaps the play area — narrow, corner-pinned.
 */
export function WorldCard() {
  const { worldIndex } = useProgress();
  const [visible, setVisible] = useState(false);
  const [shownIdx, setShownIdx] = useState<number>(-1);
  const lastIdxRef = useRef<number>(-2);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (worldIndex < 0 || worldIndex >= CHAPTERS.length) {
      setVisible(false);
      lastIdxRef.current = worldIndex;
      return;
    }
    if (worldIndex === lastIdxRef.current) return;
    lastIdxRef.current = worldIndex;
    setShownIdx(worldIndex);
    setVisible(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setVisible(false), 6500);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [worldIndex]);

  if (shownIdx < 0 || shownIdx >= CHAPTERS.length) return null;
  const chapter = CHAPTERS[shownIdx];
  const accent = WORLDS[chapter.id]?.accent ?? "#fbbf24";

  return (
    <button
      type="button"
      onClick={() => setVisible(false)}
      aria-label="Dismiss world card"
      style={{
        position: "fixed",
        top: "5rem",
        left: "1rem",
        zIndex: 45,
        maxWidth: "min(340px, 88vw)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-12px)",
        transition: "opacity 350ms ease, transform 350ms ease",
        pointerEvents: visible ? "auto" : "none",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          background: "rgba(10,10,20,0.92)",
          border: `2px solid ${accent}`,
          padding: "12px 14px",
          boxShadow: `0 0 0 3px rgba(10,10,20,0.92), 0 18px 40px rgba(0,0,0,0.6)`,
          backdropFilter: "blur(6px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: accent }}>
            World {String(chapter.index).padStart(2, "0")} · {chapter.year}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,236,228,0.55)" }}>
            {chapter.role}
          </span>
        </div>
        <h2 style={{ marginTop: 4, fontSize: 20, lineHeight: 1.1, color: "#f0ece4", fontWeight: 600, fontFamily: "var(--font-display, inherit)" }}>
          {chapter.org}
        </h2>
        <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.4, color: "rgba(240,236,228,0.82)" }}>
          {chapter.cliff}
        </p>
        <div style={{ marginTop: 10, fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,236,228,0.45)" }}>
          tap card to dismiss · keep scrolling →
        </div>
      </div>
    </button>
  );
}