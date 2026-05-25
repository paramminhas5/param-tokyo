"use client";

import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { useProgress } from "@/game/progress";

/**
 * Center-screen Olly-Moss-poster splash that fires when the hero crosses into
 * a new world. Holds for ~1.4s then dissolves out. Coexists with the persistent
 * corner WorldCard — the splash is the cinematic moment, the card is reference.
 *
 * Sequence per chapter entry:
 *   t=0ms      enter — scale-in + fade-in (260ms)
 *   t=260ms    hold (1100ms)
 *   t=1360ms   exit — fade-out + slight upward drift (380ms)
 *   t=1740ms   unmount
 */
export function WorldTitleSplash() {
  const { worldIndex } = useProgress();
  const [phase, setPhase] = useState<"hidden" | "enter" | "hold" | "exit">("hidden");
  const [shown, setShown] = useState<number>(-1);
  const lastIdxRef = useRef<number>(-2);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (worldIndex < 0 || worldIndex >= CHAPTERS.length) {
      setPhase("hidden");
      lastIdxRef.current = worldIndex;
      return;
    }
    if (worldIndex === lastIdxRef.current) return;
    lastIdxRef.current = worldIndex;

    // Cancel any in-flight timers from a previous splash.
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    setShown(worldIndex);
    setPhase("enter");
    timersRef.current.push(window.setTimeout(() => setPhase("hold"), 260));
    timersRef.current.push(window.setTimeout(() => setPhase("exit"), 1360));
    timersRef.current.push(window.setTimeout(() => setPhase("hidden"), 1740));

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [worldIndex]);

  if (phase === "hidden" || shown < 0 || shown >= CHAPTERS.length) return null;
  const chapter = CHAPTERS[shown];
  const world = WORLDS[chapter.id];
  const accent = world?.accent ?? "#fbbf24";

  const visible = phase === "enter" || phase === "hold";
  const exiting = phase === "exit";

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 65,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(560px, 88vw)",
          padding: "32px 36px 36px",
          background: "rgba(5,3,16,0.92)",
          border: `2px solid ${accent}`,
          boxShadow: `0 0 0 4px rgba(5,3,16,0.92), 0 0 0 5px ${accent}55, 0 36px 80px rgba(0,0,0,0.7)`,
          backdropFilter: "blur(8px)",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : exiting
              ? "translateY(-10px) scale(1.02)"
              : "translateY(8px) scale(0.96)",
          transition:
            "opacity 260ms ease, transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          textAlign: "center",
        }}
      >
        {/* Top kicker */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: accent,
            fontWeight: 700,
          }}
        >
          ◤ World {String(chapter.index).padStart(2, "0")} of {CHAPTERS.length} ◥
        </div>

        {/* Poster art */}
        {world?.poster && (
          <div
            style={{
              margin: "18px auto 0",
              width: 160,
              aspectRatio: "3 / 4",
              border: `1px solid ${accent}66`,
              padding: 6,
              background: "rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={world.poster}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                imageRendering: "pixelated",
                display: "block",
              }}
            />
          </div>
        )}

        {/* Org name */}
        <h2
          style={{
            marginTop: 18,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            fontFamily: "var(--font-display)",
            color: "#f0ece4",
          }}
        >
          {chapter.org}
        </h2>

        {/* Year + role */}
        <div
          style={{
            marginTop: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.75)",
          }}
        >
          {chapter.year} · {chapter.role}
        </div>

        {/* Corner pixel notches */}
        {(["topL", "topR", "botL", "botR"] as const).map((c) => (
          <span
            key={c}
            aria-hidden
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              background: accent,
              ...(c.startsWith("top") ? { top: 4 } : { bottom: 4 }),
              ...(c.endsWith("L") ? { left: 4 } : { right: 4 }),
            }}
          />
        ))}
      </div>
    </div>
  );
}
