import { useEffect, useRef, useState } from "react";
import heroSheet from "@/assets/game/hero/hero-sheet.png";
import { HERO_POSES, HERO_SHEET_COLS } from "@/game/journey";

/**
 * Fixed-position character that "travels" through every world as the user scrolls.
 * - Same sprite across every chapter (single sheet, position-shifted).
 * - Walk pose while scrolling, climb pose during inter-section transitions, idle when still.
 * - Horizontal drift gives the feeling of movement through worlds.
 */
export function Journey() {
  const [pose, setPose] = useState<keyof typeof HERO_POSES>("idle");
  const [drift, setDrift] = useState(0);
  const lastScroll = useRef(0);
  const lastMoved = useRef(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastScroll.current;
        lastScroll.current = y;
        lastMoved.current = performance.now();

        // Drift horizontally based on total scroll progress
        const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
        const p = Math.min(1, Math.max(0, y / max));
        // sinusoidal sway between -120 and +120px from center
        setDrift(Math.sin(p * Math.PI * 4) * 120);

        // Pose: climb when moving fast, walk when moving, idle when still
        const speed = Math.abs(dy);
        if (speed > 30) setPose("climb");
        else if (speed > 2) setPose("walk");
      });
    };

    const idleCheck = setInterval(() => {
      if (performance.now() - lastMoved.current > 240) {
        setPose((p) => (p === "idle" ? p : "idle"));
      }
    }, 200);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearInterval(idleCheck);
    };
  }, []);

  const SIZE = 180; // character height on screen
  const frameW = SIZE * 1.5 * HERO_SHEET_COLS; // sheet width when scaled so each frame is ~SIZE*1.5 wide
  // Actually simpler: cell aspect ≈ width 256 / height 512 from the sheet.
  // The generated sheet is 1920x512. 6 frames = each ~320×512. We want height SIZE.
  // Scale factor = SIZE / 512. Each cell width on screen = 320 * (SIZE/512) ≈ 112.
  const cellHeightOnScreen = SIZE;
  const cellAspect = 320 / 512;
  const cellWidthOnScreen = cellHeightOnScreen * cellAspect;
  const sheetWidthOnScreen = cellWidthOnScreen * HERO_SHEET_COLS;
  const col = HERO_POSES[pose];

  return (
    <div
      aria-hidden
      className="fixed left-1/2 bottom-[18vh] z-40 pointer-events-none"
      style={{
        width: cellWidthOnScreen,
        height: cellHeightOnScreen,
        transform: `translateX(calc(-50% + ${drift}px))`,
        transition: "transform 120ms linear",
        backgroundImage: `url(${heroSheet})`,
        backgroundSize: `${sheetWidthOnScreen}px ${cellHeightOnScreen}px`,
        backgroundPosition: `-${col * cellWidthOnScreen}px 0px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.55))",
      }}
    />
  );
}
