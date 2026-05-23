import type { PropKind } from "@/content/resume";

interface PropProps {
  kind: PropKind;
  scale?: number;
  accent: string;
}

type PixelGrid = (string | null)[][];
const INK = "#1a0f2e";
const STONE = "#4a4060";
const STONE_LIGHT = "#7a7090";

function buildSvg(grid: PixelGrid, accent: string, cellSize = 4): string {
  const rects: string[] = [];
  grid.forEach((row, y) => {
    row.forEach((color, x) => {
      if (!color) return;
      const fill =
        color === "A" ? accent :
        color === "I" ? INK :
        color === "S" ? STONE :
        color === "L" ? STONE_LIGHT :
        color;
      rects.push(`<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${fill}"/>`);
    });
  });
  const w = (grid[0]?.length ?? 8) * cellSize;
  const h = grid.length * cellSize;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
}

const GRIDS: Record<PropKind, PixelGrid> = {
  tree: [
    [null,null,"A","A","A","A",null,null],
    [null,"A","A","A","A","A","A",null],
    ["A","A","A","A","A","A","A","A"],
    [null,"A","A","A","A","A","A",null],
    [null,null,"A","A","A","A",null,null],
    [null,null,null,"I","I",null,null,null],
    [null,null,null,"I","I",null,null,null],
    [null,null,null,"I","I",null,null,null],
    [null,null,"I","I","I","I",null,null],
  ],

  house: [
    [null,null,null,"A","A",null,null,null],
    [null,null,"A","A","A","A",null,null],
    [null,"A","A","A","A","A","A",null],
    ["A","A","A","A","A","A","A","A"],
    ["I","I","I","I","I","I","I","I"],
    ["S","S","S","I","I","S","S","S"],
    ["S","S","S","I","I","S","S","S"],
    ["S","L","S","I","I","S","L","S"],
    ["I","I","I","I","I","I","I","I"],
  ],

  building: [
    ["I","S","S","I","I","S","S","I"],
    ["I","L","S","I","I","S","L","I"],
    ["I","S","S","I","I","S","S","I"],
    ["I","I","I","I","I","I","I","I"],
    ["I","S","S","I","I","S","S","I"],
    ["I","L","S","I","I","S","L","I"],
    ["I","S","S","I","I","S","S","I"],
    ["I","I","I","I","I","I","I","I"],
    ["I","S","S","I","I","S","S","I"],
    ["I","L","S","I","I","S","L","I"],
    ["I","S","S","I","I","S","S","I"],
    ["I","I","I","I","I","I","I","I"],
  ],

  antenna: [
    [null,null,null,"A",null,null,null,null],
    [null,null,"A","A","A",null,null,null],
    [null,null,null,"I",null,null,null,null],
    [null,null,null,"I",null,null,null,null],
    [null,"A",null,"I",null,"A",null,null],
    [null,null,null,"I",null,null,null,null],
    [null,null,null,"I",null,null,null,null],
    [null,null,"I","I","I",null,null,null],
    [null,"I","I","I","I","I",null,null],
  ],

  rack: [
    ["I","I","I","I","I","I","I","I"],
    ["I","A","A","A","A","A","A","I"],
    ["I","I","I","I","I","I","I","I"],
    ["I","A","A","A","A","A","A","I"],
    ["I","I","I","I","I","I","I","I"],
    ["I","A","A","A","A","A","A","I"],
    ["I","I","I","I","I","I","I","I"],
    ["I","S","S","I","I","S","S","I"],
    ["I","S","S","I","I","S","S","I"],
  ],

  vault: [
    [null,"I","I","I","I","I","I",null],
    ["I","S","S","S","S","S","S","I"],
    ["I","S","A","A","A","A","S","I"],
    ["I","S","A","S","S","A","S","I"],
    ["I","S","A","S","A","A","S","I"],
    ["I","S","A","A","A","A","S","I"],
    ["I","S","S","S","S","S","S","I"],
    ["I","I","I","I","I","I","I","I"],
    [null,"I","S","S","S","S","I",null],
  ],

  shoe: [
    [null,null,null,"A","A","A","A",null],
    [null,null,"A","A","A","A","A","A"],
    [null,"A","A","A","A","A","A","A"],
    ["A","A","A","A","A","A","A","A"],
    ["I","I","I","I","I","I","I","I"],
    [null,null,null,null,null,null,null,null],
  ],

  mic: [
    [null,null,"A","A","A",null,null,null],
    [null,"A","A","A","A","A",null,null],
    [null,"A","A","A","A","A",null,null],
    [null,"A","A","A","A","A",null,null],
    [null,null,"I","A","I",null,null,null],
    [null,null,null,"I",null,null,null,null],
    [null,null,null,"I",null,null,null,null],
    [null,"I","I","I","I","I",null,null],
  ],

  ladder: [
    [null,"I",null,"I",null,null,null,null],
    ["I","I","I","I",null,null,null,null],
    [null,"I",null,"I",null,null,null,null],
    ["I","I","I","I",null,null,null,null],
    [null,"I",null,"I",null,null,null,null],
    ["I","I","I","I",null,null,null,null],
    [null,"I",null,"I",null,null,null,null],
    ["I","I","I","I",null,null,null,null],
    [null,"I",null,"I",null,null,null,null],
  ],

  platform: [
    [null,"A","A","A","A","A","A",null],
    ["A","A","A","A","A","A","A","A"],
    ["A","A","A","A","A","A","A","A"],
    ["I","I","I","I","I","I","I","I"],
  ],

  sign: [
    ["I","I","I","I","I","I","I","I"],
    ["I","A","A","A","A","A","A","I"],
    ["I","A","S","S","S","S","A","I"],
    ["I","A","A","A","A","A","A","I"],
    ["I","I","I","I","I","I","I","I"],
    [null,null,null,"I","I",null,null,null],
    [null,null,null,"I","I",null,null,null],
  ],

  crate: [
    ["I","I","I","I","I","I","I","I"],
    ["I","S","I","S","S","I","S","I"],
    ["I","S","I","S","S","I","S","I"],
    ["I","I","I","I","I","I","I","I"],
    ["I","S","S","I","I","S","S","I"],
    ["I","S","S","I","I","S","S","I"],
    ["I","I","I","I","I","I","I","I"],
  ],
};

export function PropSprite({ kind, scale = 1, accent }: PropProps) {
  const grid = GRIDS[kind] ?? GRIDS.crate;
  const svgStr = buildSvg(grid, accent, 4);
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;

  const baseH = grid.length * 4;
  const baseW = (grid[0]?.length ?? 8) * 4;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: "bottom center",
        imageRendering: "pixelated",
      }}
    >
      <img
        src={dataUri}
        alt=""
        width={baseW}
        height={baseH}
        draggable={false}
        style={{
          display: "block",
          imageRendering: "pixelated",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
        }}
      />
    </div>
  );
}
