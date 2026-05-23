import { useEffect, useState } from "react";
import heroSheet from "@/assets/game/hero/hero-v2.png";
import { HERO_FRAMES } from "@/game/journey";
import { useProgress } from "@/game/progress";

/**
 * Single, persistent hero. Pinned to the viewport.
 * - X position: 12% → 88% across the current world's progress (0..1).
 * - Animation: cycles through walk frames while `moving`, idle frames when still.
 * - Hidden on intro (worldIndex < 0) and outro (worldIndex >= CHAPTERS.length).
 */
export function GlobalHero() {
  const { worldIndex, worldProgress, moving } = useProgress();
  const [frameTick, setFrameTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Animation clock — advances only while moving.
  useEffect(() => {
    if (!moving) return;
    const id = window.setInterval(() => setFrameTick((t) => t + 1), 110);
    return () => window.clearInterval(id);
  }, [moving]);

  if (!mounted) return null;
  // Hide on intro / outro — character is part of the worlds, not the chrome.
  if (worldIndex < 0) return null;

  const frames = moving ? HERO_FRAMES.walk : HERO_FRAMES.idle;
  const frameIdx = frames[frameTick % frames.length];

  const displayH = 180;
  const aspect = HERO_FRAMES.cellW / HERO_FRAMES.cellH;
  const displayW = displayH * aspect;
  const sheetW = displayW * HERO_FRAMES.cols;

  const xPct = 12 + Math.max(0, Math.min(1, worldProgress)) * 76;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: `${xPct}%`,
        bottom: "16vh",
        width: displayW,
        height: displayH,
        transform: "translateX(-50%)",
        pointerEvents: "none",
        zIndex: 35,
        transition: "left 160ms linear",
        filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.55))",
      }}
    >
      <div
        style={{
          width: displayW,
          height: displayH,
          backgroundImage: `url(${heroSheet})`,
          backgroundSize: `${sheetW}px ${displayH}px`,
          backgroundPosition: `-${frameIdx * displayW}px 0px`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />
      {/* Ground shadow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -10,
          width: displayW * 0.55,
          height: 12,
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
