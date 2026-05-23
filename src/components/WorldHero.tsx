import { useEffect, useRef, useState } from "react";
import heroSheet from "@/assets/game/hero/hero-sheet.png";
import { HERO_POSES, HERO_SHEET_COLS } from "@/game/journey";

interface Props {
  /** 0..1 progress through the world section */
  progress: number;
  /** Whether to use the climb pose at the very bottom (transition out) */
  exiting?: boolean;
  /** Whether to use the climb pose at the very top (entering from above) */
  entering?: boolean;
  /** Display height in px */
  size?: number;
  /** Tint color (used for shadow / rim) */
  accent?: string;
}

/**
 * Walking hero pinned inside a World section.
 * - Walks left → right across the scene as scroll progress increases.
 * - Climb pose for the first and last 8% (transitioning in/out of worlds).
 * - Animation frames cycle when the user is actively scrolling.
 */
export function WorldHero({ progress, exiting, entering, size = 160, accent = "#ff6b5b" }: Props) {
  const [walkFrame, setWalkFrame] = useState<0 | 1>(0);
  const lastProgress = useRef(progress);
  const lastMove = useRef(0);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const moved = Math.abs(progress - lastProgress.current) > 0.0005;
    lastProgress.current = progress;
    if (moved) {
      lastMove.current = performance.now();
      setMoving(true);
    }
  }, [progress]);

  useEffect(() => {
    const id = setInterval(() => {
      const stillMoving = performance.now() - lastMove.current < 160;
      if (stillMoving) {
        setWalkFrame((f) => (f === 0 ? 1 : 0));
        setMoving(true);
      } else if (moving) {
        setMoving(false);
      }
    }, 110);
    return () => clearInterval(id);
  }, [moving]);

  // Decide pose
  const climbing = entering || exiting;
  let pose: keyof typeof HERO_POSES;
  if (climbing) pose = "climb";
  else if (moving) pose = walkFrame === 0 ? "walk" : "jump"; // alternate columns to fake a 2-frame walk
  else pose = "idle";

  // Position across the playfield (left 8% → right 92%)
  const left = 8 + Math.max(0, Math.min(1, progress)) * 84;
  // Slight vertical bob while walking
  const bob = moving && !climbing ? (walkFrame === 0 ? 0 : -4) : 0;
  // Climb adjusts vertical position so they appear to grab the prop
  const climbY = climbing ? (entering ? -20 : 20) : 0;

  const cellAspect = 320 / 512; // from sheet
  const cellH = size;
  const cellW = cellH * cellAspect;
  const sheetW = cellW * HERO_SHEET_COLS;
  const col = HERO_POSES[pose];

  return (
    <div
      aria-hidden
      className="absolute pointer-events-none z-30"
      style={{
        left: `${left}%`,
        bottom: "18%",
        width: cellW,
        height: cellH,
        transform: `translate(-50%, ${bob + climbY}px)`,
        transition: "left 220ms linear",
        filter: `drop-shadow(0 14px 18px rgba(0,0,0,0.55)) drop-shadow(0 0 12px ${accent}55)`,
      }}
    >
      <div
        style={{
          width: cellW,
          height: cellH,
          backgroundImage: `url(${heroSheet})`,
          backgroundSize: `${sheetW}px ${cellH}px`,
          backgroundPosition: `-${col * cellW}px 0px`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />
      {/* Soft ground shadow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -8,
          width: cellW * 0.7,
          height: 10,
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
