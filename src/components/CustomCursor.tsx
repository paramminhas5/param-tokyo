"use client";

import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { useTotalProgress } from "@/game/scroller";

/**
 * CustomCursor — colour-synced dot + lagging ring.
 * Uses same WORLD_W = 4 constant as GlobalHud/GameExperience so it stays in sync.
 */
export function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const [visible,  setVisible]  = useState(false);
  const [hovering, setHovering] = useState(false);
  const totalP = useTotalProgress();

  // Match GlobalHud math exactly — 400vh per world
  const INTRO_W = 1, WORLD_W = 4;
  const total_W = INTRO_W + CHAPTERS.length * WORLD_W + 1;
  const currentIdx  = Math.min(
    CHAPTERS.length - 1,
    Math.max(0, Math.floor((totalP * total_W - INTRO_W) / WORLD_W))
  );
  const accentColor = WORLDS[CHAPTERS[currentIdx]?.id]?.accent ?? "#fbbf24";

  const ringPos = useRef({ x: -100, y: -100 });
  const dotPos  = useRef({ x: -100, y: -100 });
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => { dotPos.current = { x: e.clientX, y: e.clientY }; setVisible(true); };
    const onLeave  = () => setVisible(false);
    const onEnter  = () => setVisible(true);
    const onHoverIn = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === "A" || el.tagName === "BUTTON" || el.closest("a, button")) setHovering(true);
    };
    const onHoverOut = () => setHovering(false);

    window.addEventListener("mousemove",  onMove,     { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover",  onHoverIn,  { passive: true });
    document.addEventListener("mouseout",   onHoverOut, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, dotPos.current.x, 0.1);
      ringPos.current.y = lerp(ringPos.current.y, dotPos.current.y, 0.1);
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove",   onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover",  onHoverIn);
      document.removeEventListener("mouseout",   onHoverOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      <div ref={dotRef} aria-hidden style={{
        position: "fixed", top: 0, left: 0,
        width: hovering ? 12 : 6, height: hovering ? 12 : 6,
        marginLeft: hovering ? -6 : -3, marginTop: hovering ? -6 : -3,
        borderRadius: "50%", background: accentColor,
        pointerEvents: "none", zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms, background 500ms ease, width 200ms ease, height 200ms ease, margin 200ms ease",
        mixBlendMode: "screen",
      }} />
      <div ref={ringRef} aria-hidden style={{
        position: "fixed", top: 0, left: 0,
        width: hovering ? 36 : 28, height: hovering ? 36 : 28,
        marginLeft: hovering ? -18 : -14, marginTop: hovering ? -18 : -14,
        borderRadius: "50%", border: `1.5px solid ${accentColor}`,
        pointerEvents: "none", zIndex: 9998,
        opacity: visible ? 0.45 : 0,
        transition: "opacity 300ms, border-color 500ms ease, width 300ms ease, height 300ms ease, margin 300ms ease",
        mixBlendMode: "screen",
      }} />
      <style>{`
        @media (pointer: fine) { *, *::before, *::after { cursor: none !important; } }
      `}</style>
    </>
  );
}
