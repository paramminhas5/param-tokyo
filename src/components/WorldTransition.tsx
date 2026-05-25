"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/game/progress";

/**
 * CRT flash transition fires when worldIndex changes.
 * Renders a short white-noise canvas burst then fades.
 */
export function WorldTransition() {
  const { worldIndex } = useProgress();
  const [active, setActive] = useState(false);
  const prevIdx = useRef<number>(-2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (worldIndex === prevIdx.current) return;
    if (prevIdx.current === -2) { prevIdx.current = worldIndex; return; } // skip first mount
    prevIdx.current = worldIndex;

    setActive(true);

    // Draw white noise on canvas frames
    let frame = 0;
    const MAX_FRAMES = 6;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawNoise = () => {
      if (frame >= MAX_FRAMES) {
        setActive(false);
        return;
      }
      const w = canvas.width;
      const h = canvas.height;
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() > 0.55 ? 255 : 0;
        const alpha = Math.floor(200 * (1 - frame / MAX_FRAMES));
        data[i] = v; data[i+1] = v; data[i+2] = v; data[i+3] = alpha;
      }
      ctx.putImageData(imgData, 0, 0);
      frame++;
      rafRef.current = requestAnimationFrame(drawNoise);
    };

    cancelAnimationFrame(rafRef.current);
    drawNoise();
    return () => cancelAnimationFrame(rafRef.current);
  }, [worldIndex]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
}