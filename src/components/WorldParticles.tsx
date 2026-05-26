"use client";

import type { ParticleTheme } from "@/game/journey";

interface Props {
  theme: ParticleTheme;
  visible: boolean;
}

/**
 * WorldParticles — each world gets contextually appropriate ambient particles.
 * All motion is pure CSS to stay off the JS thread.
 */
export function WorldParticles({ theme, visible }: Props) {
  const pts = Array.from({ length: theme.count }, (_, i) => ({
    i,
    left: `${4 + (i * 9.3 + i * i * 1.7) % 90}%`,
    top:  `${5 + (i * 7.1 + i * 3.3) % 85}%`,
    size: 1.5 + (i % 4) * 0.8,
    dur:  (theme.speed === "slow" ? 5 : theme.speed === "fast" ? 2 : 3.5) + (i % 4) * 1.2,
    del:  (i * 0.22) % 4,
    opacity: 0.15 + (i % 5) * 0.07,
  }));

  const animName = `pts-${theme.style}`;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 2s ease",
      }}
    >
      {pts.map((pt) => (
        <div
          key={pt.i}
          style={{
            position: "absolute",
            left: pt.left,
            top: pt.top,
            width: pt.size,
            height: theme.style === "data" ? pt.size * 3 : pt.size,
            borderRadius: theme.style === "data" ? 1 : "50%",
            background: theme.color,
            boxShadow: `0 0 ${pt.size * 4}px ${theme.color}88`,
            opacity: pt.opacity,
            animation: `${animName} ${pt.dur}s ease-in-out ${pt.del}s infinite`,
          }}
        />
      ))}

      <style>{`
        /* drift — slow upward lazy float (origin, investopad) */
        @keyframes pts-drift {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.15; }
          33%  { transform: translate(4px, -18px) scale(1.1); opacity: 0.4; }
          66%  { transform: translate(-3px, -32px) scale(0.9); opacity: 0.25; }
          100% { transform: translate(0, -46px) scale(1); opacity: 0; }
        }
        /* data — quick horizontal streaks (grp) */
        @keyframes pts-data {
          0%   { transform: translate(-8px, 0) scaleX(0.5); opacity: 0; }
          20%  { transform: translate(0, 0) scaleX(1); opacity: 0.6; }
          80%  { transform: translate(24px, 0) scaleX(1.2); opacity: 0.4; }
          100% { transform: translate(36px, 0) scaleX(0.3); opacity: 0; }
        }
        /* dust — lazy horizontal scatter (hab) */
        @keyframes pts-dust {
          0%   { transform: translate(0, 0); opacity: 0.1; }
          25%  { transform: translate(6px, -4px); opacity: 0.35; }
          75%  { transform: translate(-4px, -8px); opacity: 0.2; }
          100% { transform: translate(2px, -14px); opacity: 0; }
        }
        /* grid — sharp geometric nodes (octo, fere) */
        @keyframes pts-grid {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.1; }
          30%  { transform: translate(0, 0) scale(1.6); opacity: 0.5; }
          60%  { transform: translate(0, 0) scale(1); opacity: 0.1; }
          100% { transform: translate(0, 0) scale(0.6); opacity: 0; }
        }
        /* confetti — energetic multi-direction bounce (solesearch) */
        @keyframes pts-confetti {
          0%   { transform: translate(0, 0) rotate(0deg); opacity: 0.2; }
          25%  { transform: translate(8px, -12px) rotate(90deg); opacity: 0.5; }
          50%  { transform: translate(-4px, -22px) rotate(180deg); opacity: 0.3; }
          75%  { transform: translate(6px, -30px) rotate(270deg); opacity: 0.2; }
          100% { transform: translate(0, -40px) rotate(360deg); opacity: 0; }
        }
        /* notes — rhythmic pulse (ccd) */
        @keyframes pts-notes {
          0%   { transform: translateY(0) scale(1); opacity: 0.15; }
          25%  { transform: translateY(-10px) scale(1.4); opacity: 0.5; }
          50%  { transform: translateY(-18px) scale(1); opacity: 0.3; }
          75%  { transform: translateY(-24px) scale(0.8); opacity: 0.2; }
          100% { transform: translateY(-32px) scale(0.6); opacity: 0; }
        }
        /* spiral — converging toward center (iterate) */
        @keyframes pts-spiral {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50%  { transform: translate(-4px, -8px) scale(1.2); opacity: 0.5; }
          100% { transform: translate(-10px, -16px) scale(0.7); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
