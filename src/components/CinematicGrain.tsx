"use client";

/**
 * Fixed-position film grain overlay using SVG turbulence.
 *
 * Cheaper than a tiled raster (no decode, no atlas), GPU-rendered, animates
 * via CSS keyframes shifting the seed. Stays under the SkillBelt and Hud
 * (z = 9990 — above world content, below all UI chrome).
 *
 * Respects `prefers-reduced-motion` by stopping the seed animation.
 */
export function CinematicGrain() {
  return (
    <>
      <div
        aria-hidden
        className="cinematic-grain"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9990,
          mixBlendMode: "overlay",
          opacity: 0.18,
        }}
      />
      <style>{`
        .cinematic-grain {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          background-size: 240px 240px;
          animation: pm-grain-shift 0.7s steps(4) infinite;
        }
        @keyframes pm-grain-shift {
          0%   { background-position: 0 0; }
          25%  { background-position: -120px 60px; }
          50%  { background-position: 80px -100px; }
          75%  { background-position: -50px 140px; }
          100% { background-position: 0 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cinematic-grain { animation: none !important; }
        }
      `}</style>
    </>
  );
}
