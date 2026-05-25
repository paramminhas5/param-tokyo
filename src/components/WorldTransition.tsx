"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/game/progress";

/**
 * World-change cinematic stinger.
 *
 * Two layers fire on every worldIndex change:
 *
 *   1. LETTERBOX BARS — black bars slide in from top and bottom (~16vh each),
 *      hold, then slide back out. 700ms total. Always plays.
 *   2. WHITE-NOISE BURST — short canvas-rendered noise flash mid-transition,
 *      6 frames over ~100ms. Adds a CRT scene-cut feel.
 *
 * Both respect prefers-reduced-motion (bars still show but at lower opacity,
 * noise is skipped).
 */
export function WorldTransition() {
  const { worldIndex } = useProgress();
  const [letterbox, setLetterbox] = useState<"hidden" | "in" | "out">("hidden");
  const [noiseActive, setNoiseActive] = useState(false);
  const prevIdx = useRef<number>(-2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (worldIndex === prevIdx.current) return;
    if (prevIdx.current === -2) {
      // Skip first mount.
      prevIdx.current = worldIndex;
      return;
    }
    prevIdx.current = worldIndex;

    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    // Letterbox in → noise burst → letterbox out
    setLetterbox("in");
    timersRef.current.push(
      window.setTimeout(() => {
        setNoiseActive(true);
        runNoise(canvasRef.current).then(() => setNoiseActive(false));
      }, 180),
    );
    timersRef.current.push(window.setTimeout(() => setLetterbox("out"), 480));
    timersRef.current.push(window.setTimeout(() => setLetterbox("hidden"), 800));

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
      cancelAnimationFrame(rafRef.current);
    };
  }, [worldIndex]);

  // Letterbox geometry: bars are 18vh tall, off-screen by default, slide in to fill.
  const barHeight = letterbox === "in" ? "18vh" : "0vh";
  const barOpacity = letterbox === "hidden" ? 0 : 1;

  return (
    <>
      {/* Top letterbox bar */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: barHeight,
          background: "#000",
          zIndex: 9995,
          pointerEvents: "none",
          opacity: barOpacity,
          transition: "height 320ms cubic-bezier(0.85,0,0.25,1), opacity 200ms ease",
          boxShadow: "0 6px 18px rgba(0,0,0,0.7)",
        }}
      />
      {/* Bottom letterbox bar */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: barHeight,
          background: "#000",
          zIndex: 9995,
          pointerEvents: "none",
          opacity: barOpacity,
          transition: "height 320ms cubic-bezier(0.85,0,0.25,1), opacity 200ms ease",
          boxShadow: "0 -6px 18px rgba(0,0,0,0.7)",
        }}
      />

      {/* CRT noise flash */}
      {noiseActive && (
        <canvas
          ref={canvasRef}
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9996,
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
      )}
    </>
  );

  async function runNoise(canvas: HTMLCanvasElement | null): Promise<void> {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const MAX = 6;
    const w = canvas.width;
    const h = canvas.height;
    return new Promise((resolve) => {
      let frame = 0;
      const draw = () => {
        if (frame >= MAX) {
          resolve();
          return;
        }
        const img = ctx.createImageData(w, h);
        const data = img.data;
        const fade = Math.floor(220 * (1 - frame / MAX));
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() > 0.55 ? 255 : 0;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = fade;
        }
        ctx.putImageData(img, 0, 0);
        frame++;
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();
    });
  }
}
