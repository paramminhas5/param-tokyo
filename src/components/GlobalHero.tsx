"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_FRAMES } from "@/game/journey";

const heroSheet = HERO_FRAMES.src;
import { useProgress } from "@/game/progress";
import { Spring } from "@/game/spring";
import { sfx } from "@/game/audio";

/**
 * Spring-physics hero. Target X comes from worldProgress; a spring lerps toward
 * it every RAF frame so movement feels weighted and natural, not locked to scroll.
 * Walk animation speed scales with spring velocity. Direction flips sprite.
 */
export function GlobalHero() {
  const { worldIndex, worldProgress, moving } = useProgress();
  const [frameTick, setFrameTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [displayX, setDisplayX] = useState(12);
  const [displayY, setDisplayY] = useState(0); // vertical bob for landing feel
  const [facingLeft, setFacingLeft] = useState(false);

  const spring = useRef(new Spring(12, 180, 22));
  const ySpring = useRef(new Spring(0, 260, 28));
  const rafRef = useRef(0);
  const lastTime = useRef(0);
  const prevWorldIdx = useRef(-1);
  const stepFrameRef = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  // Target X from worldProgress
  const targetX = 12 + Math.max(0, Math.min(1, worldProgress)) * 76;

  // Detect direction from spring velocity
  useEffect(() => {
    // No-op here; direction comes from spring velocity in RAF
  }, [worldProgress]);

  // World change → small jump (Y spring up then back)
  useEffect(() => {
    if (worldIndex === prevWorldIdx.current) return;
    if (prevWorldIdx.current === -2) { prevWorldIdx.current = worldIndex; return; }
    prevWorldIdx.current = worldIndex;
    ySpring.current.vel = -60; // kick upward
    sfx.warp();
  }, [worldIndex]);

  // Spring RAF loop
  useEffect(() => {
    if (!mounted) return;
    lastTime.current = performance.now();

    const tick = (t: number) => {
      const dt = Math.min((t - lastTime.current) / 1000, 0.04);
      lastTime.current = t;

      const prevPos = spring.current.pos;
      const newPos = spring.current.step(targetX, dt);
      const vel = spring.current.vel;

      // Direction tracking
      if (Math.abs(vel) > 2) setFacingLeft(vel < 0);

      setDisplayX(newPos);

      // Y spring (landing bounce)
      ySpring.current.step(0, dt);
      setDisplayY(ySpring.current.pos);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted, targetX]);

  // Walk animation — interval speed proportional to spring velocity
  useEffect(() => {
    if (!moving) return;
    const speed = Math.max(65, 130 - Math.abs(spring.current.vel) * 0.8);
    const id = window.setInterval(() => {
      setFrameTick((t) => {
        const next = t + 1;
        // Footstep SFX on frames 1 and 3 of walk cycle
        const walkFrames = HERO_FRAMES.walk;
        const fi = next % walkFrames.length;
        if (fi === 1 || fi === 3) sfx.step();
        return next;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [moving]);

  if (!mounted || worldIndex < 0) return null;

  const frames = moving && Math.abs(spring.current.vel) > 1.5
    ? HERO_FRAMES.walk
    : HERO_FRAMES.idle;
  const frameIdx = frames[frameTick % frames.length];

  const displayH = 180;
  const aspect = HERO_FRAMES.cellW / HERO_FRAMES.cellH;
  const displayW = displayH * aspect;
  const sheetW = displayW * HERO_FRAMES.cols;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: `${displayX}%`,
        bottom: `calc(16vh + ${-displayY}px)`,
        width: displayW,
        height: displayH,
        transform: `translateX(-50%) scaleX(${facingLeft ? -1 : 1})`,
        pointerEvents: "none",
        zIndex: 35,
        willChange: "left, transform",
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
          bottom: -12,
          width: displayW * 0.5,
          height: 10,
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.6), transparent 70%)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
