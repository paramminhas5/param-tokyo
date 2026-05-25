"use client";

import { useState } from "react";
import type { NpcKind } from "@/content/resume";

interface NpcProps {
  kind: NpcKind;
  label?: string;
  accent: string;
  bobDelay?: number; // ms offset for bob animation stagger
}

/**
 * Pixel art NPC rendered as inline SVG.
 * All figures are 16×28 source pixels, scaled to 40×70px.
 * Colors: accent = world color, skin = #e8c9a0, ink = #1a0f2e, shadow = #0a0a14.
 */

type PixelGrid = (string | null)[][];

const INK = "#1a0f2e";
const SKIN = "#e8c9a0";
const HAIR = "#3d1a00";
const WHITE = "#f0ece4";

function buildSvg(grid: PixelGrid, accent: string, scale = 3): string {
  const rects: string[] = [];
  grid.forEach((row, y) => {
    row.forEach((color, x) => {
      if (!color) return;
      const fill = color === "A" ? accent : color === "S" ? SKIN : color === "I" ? INK : color === "H" ? HAIR : color === "W" ? WHITE : color;
      rects.push(`<rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" fill="${fill}"/>`);
    });
  });
  const w = (grid[0]?.length ?? 12) * scale;
  const h = grid.length * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
}

// ── NPC Grids (12 wide × 22 tall) ───────────────────────────────────────────
// I = ink/dark outline, S = skin, A = accent color, H = hair, W = white/light
// null = transparent

const GRIDS: Record<NpcKind, PixelGrid> = {
  founder: [
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","S","S","H","H","S","S","I",null,null,null],
    [null,"I","S","H","H","H","H","S","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,"I","A","A","I","I","A","A","I",null,null,null],
    [null,"I","A","A","I","I","A","A","I",null,null,null],
    [null,"I","I","I","I","I","I","I","I",null,null,null],
    [null,"I","I",null,null,null,null,"I","I",null,null,null],
    [null,"I","I",null,null,null,null,"I","I",null,null,null],
    [null,"I","I",null,null,null,null,"I","I",null,null,null],
    [null,"I","I",null,null,null,null,"I","I",null,null,null],
    ["I","A","I",null,null,null,null,"I","A","I",null,null],
    ["I","A","I",null,null,null,null,"I","A","I",null,null],
    ["I","I","I",null,null,null,null,"I","I","I",null,null],
  ],

  dev: [
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","S","W","S","S","W","S","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    ["I","A","S","A","A","A","A","S","A","I",null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    ["I","A","I","I","I","I","I","I","A","I",null,null],
    ["I","A","I","A","A","A","A","I","A","I",null,null],
    [null,"I","A","I","A","A","I","A","I",null,null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,"I","A","A","I","I","A","A","I",null,null,null],
    [null,"I","I","I","I","I","I","I","I",null,null,null],
    [null,null,"I","I",null,null,"I","I",null,null,null,null],
    [null,null,"I","I",null,null,"I","I",null,null,null,null],
    [null,null,"I","I",null,null,"I","I",null,null,null,null],
    [null,null,"I","A",null,null,"A","I",null,null,null,null],
    [null,null,"I","A",null,null,"A","I",null,null,null,null],
    [null,"I","A","A",null,null,"A","A","I",null,null,null],
    [null,"I","I","I",null,null,"I","I","I",null,null,null],
  ],

  dancer: [
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","S","S","H","H","S","S","I",null,null,null],
    [null,"I","H","S","S","S","S","H","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    ["I","A",null,"A","A","A","A",null,"A","I",null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,null,"I","A","A","A","A","I",null,null,null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    ["I","A",null,"A","A","A","A",null,"A","I",null,null],
    [null,null,"I","A","A","A","A","I",null,null,null,null],
    [null,null,"I","A","I","I","A","I",null,null,null,null],
    [null,null,"I","A","I","I","A","I",null,null,null,null],
    [null,"I","I","I","I","I","I","I","I",null,null,null],
    ["I","A","I",null,null,null,"I","I","A",null,null,null],
    ["I","A","I",null,null,null,null,"I","A","I",null,null],
    [null,"I","I",null,null,null,null,null,"I","I",null,null],
    [null,"I","A",null,null,null,null,null,"A","I",null,null],
    [null,"I","A",null,null,null,null,null,"A","I",null,null],
    ["I","A","A",null,null,null,null,null,"A","A","I",null],
    ["I","I","I",null,null,null,null,null,"I","I","I",null],
  ],

  fan: [
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","S","W","S","S","W","S","I",null,null,null],
    [null,"I","S","S","I","S","I","S","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    ["I","A",null,"A","A","A","A",null,"A","I",null,null],
    ["I","A","I","A","A","A","A","I","A","I",null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,"I","A","A","I","I","A","A","I",null,null,null],
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,null,"I","I",null,null,"I","I",null,null,null,null],
    [null,null,"I","I",null,null,"I","I",null,null,null,null],
    [null,null,"I","A",null,null,"A","I",null,null,null,null],
    [null,null,"I","A",null,null,"A","I",null,null,null,null],
    [null,null,"I","A",null,null,"A","I",null,null,null,null],
    [null,"I","A","A",null,null,"A","A","I",null,null,null],
    [null,"I","A","A",null,null,"A","A","I",null,null,null],
    [null,"I","I","I",null,null,"I","I","I",null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
  ],

  investor: [
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","W","S","S","S","S","W","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,null,"I","I","W","W","I","I",null,null,null,null],
    [null,"I","I","A","A","A","A","I","I",null,null,null],
    ["I","I","A","A","A","A","A","A","I","I",null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    ["I","A","A","I","A","A","I","A","A","I",null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,"I","A","A","I","I","A","A","I",null,null,null],
    [null,"I","A","A","I","I","A","A","I",null,null,null],
    [null,"I","I","I","I","I","I","I","I",null,null,null],
    [null,"I","I",null,null,null,null,"I","I",null,null,null],
    [null,"I","A",null,null,null,null,"A","I",null,null,null],
    [null,"I","A",null,null,null,null,"A","I",null,null,null],
    [null,"I","A",null,null,null,null,"A","I",null,null,null],
    ["I","A","A",null,null,null,null,"A","A","I",null,null],
    ["I","A","A",null,null,null,null,"A","A","I",null,null],
    ["I","I","I",null,null,null,null,"I","I","I",null,null],
  ],

  cat: [
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    ["A",null,null,null,"A","A",null,null,null,"A",null,null],
    ["A","A","I","I","A","A","I","I","A","A",null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,"I","A","W","A","A","W","A","I",null,null,null],
    [null,"I","A","A","I","A","I","A","I",null,null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,"I","A","A","A","A","A","A","I","A",null,null],
    ["I","A","A","A","A","A","A","A","A","I","A","I"],
    ["I","A","A","A","A","A","A","A","A","I","A","I"],
    ["I","A","A","A","A","A","A","A","A","I","A","I"],
    [null,"I","I","A","A","A","A","I","I",null,null,null],
    [null,null,"I","A","A","A","A","I",null,null,null,null],
    [null,null,"I","A",null,null,"A","I",null,null,null,null],
    [null,null,"I","I",null,null,"I","I",null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
  ],

  dog: [
    [null,null,null,null,null,null,null,null,null,null,null,null],
    ["A","A",null,null,null,null,null,null,null,null,null,null],
    ["A","A",null,"I","I","I","I",null,null,null,null,null],
    [null,"I","I","A","A","A","A","I","I",null,null,null],
    [null,"I","A","A","W","A","W","A","I",null,null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,"I","A","A","I","A","I","A","I",null,null,null],
    [null,"I","A","A","A","A","A","A","I","I",null,null],
    ["I","A","A","A","A","A","A","A","A","A","I",null],
    ["I","A","A","A","A","A","A","A","A","A","I",null],
    ["I","A","A","A","A","A","A","A","A","A","I",null],
    [null,"I","I","A","A","I","A","A","I","I",null,null],
    [null,null,"I","A",null,"I","A",null,"I",null,null,null],
    [null,null,"I","A",null,"I","A",null,"I",null,null,null],
    [null,null,"I","I",null,"I","I",null,"I",null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
  ],

  trader: [
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","S","H","H","H","H","S","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","A","W","A","A","W","A","I",null,null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    ["I","A","A","A","A","A","A","A","A","I","I",null],
    ["I","A","A","A","A","A","A","A","A","I","A","I"],
    ["I","A","A","I","A","A","I","A","A","I","A","I"],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    [null,"I","A","A","I","I","A","A","I",null,null,null],
    [null,"I","I","I","I","I","I","I","I",null,null,null],
    [null,null,"I","I",null,null,"I","I",null,null,null,null],
    [null,null,"I","A",null,null,"A","I",null,null,null,null],
    [null,null,"I","A",null,null,"A","I",null,null,null,null],
    [null,null,"I","A",null,null,"A","I",null,null,null,null],
    [null,null,"I","A",null,null,"A","I",null,null,null,null],
    ["I","A","A","A",null,null,"A","A","A","I",null,null],
    ["I","A","A","A",null,null,"A","A","A","I",null,null],
    ["I","I","I","I",null,null,"I","I","I","I",null,null],
  ],

  rider: [
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","A","S","S","S","S","A","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,"I","S","S","S","S","S","S","I",null,null,null],
    [null,null,"I","I","I","I","I","I",null,null,null,null],
    [null,"I","A","A","A","A","A","A","I",null,null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    ["I","A","A","I","A","A","I","A","A","I",null,null],
    ["I","I","I","I","I","I","I","I","I","I",null,null],
    [null,"I","A","A","I","I","A","A","I",null,null,null],
    ["I","A","A","A","A","A","A","A","A","I",null,null],
    ["I","I","I","I","I","I","I","I","I","I",null,null],
    ["I","A","I",null,null,null,null,"I","A","I",null,null],
    ["I","A","I",null,null,null,null,"I","A","I",null,null],
    ["I","I","A","I",null,null,"I","A","I","I",null,null],
    [null,"I","A","A","I","I","A","A","I",null,null,null],
    [null,null,"I","A","A","A","A","I",null,null,null,null],
    [null,null,null,"I","A","A","I",null,null,null,null,null],
    [null,null,null,null,"I","I",null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null],
  ],
};

export function NpcSprite({ kind, label, accent, bobDelay = 0 }: NpcProps) {
  const [hovered, setHovered] = useState(false);
  const grid = GRIDS[kind] ?? GRIDS.fan;
  const svgStr = buildSvg(grid, accent, 3);
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Speech bubble */}
      {label && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: `translateX(-50%) translateY(${hovered ? 0 : 4}px)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 200ms ease, transform 200ms ease",
            background: "rgba(10,10,20,0.95)",
            border: `1.5px solid ${accent}`,
            padding: "4px 8px",
            whiteSpace: "nowrap",
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            color: "#f0ece4",
            pointerEvents: "none",
            boxShadow: `0 0 12px ${accent}66`,
          }}
        >
          {label}
          {/* Little triangle */}
          <span style={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: `5px solid ${accent}`,
          }} />
        </div>
      )}

      {/* Sprite */}
      <div
        style={{
          animation: `npc-bob 2.2s ${bobDelay}ms ease-in-out infinite`,
          imageRendering: "pixelated",
        }}
      >
        <img
          src={dataUri}
          alt={kind}
          draggable={false}
          style={{
            display: "block",
            imageRendering: "pixelated",
            filter: `drop-shadow(0 6px 10px rgba(0,0,0,0.6)) drop-shadow(0 0 8px ${accent}44)`,
          }}
        />
      </div>

      {/* Ground shadow dot */}
      <div style={{
        width: 20, height: 5,
        background: "radial-gradient(ellipse, rgba(0,0,0,0.45), transparent 70%)",
        borderRadius: "50%",
        marginTop: -2,
      }} />

      <style>{`
        @keyframes npc-bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}