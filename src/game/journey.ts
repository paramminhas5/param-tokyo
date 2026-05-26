/**
 * World art registry — uses the beautiful full-color foreground images
 * from the original build + original background paintings.
 */

export interface WorldArt {
  /** Full painted background (JPG ~400KB) */
  bg: string;
  /** Full-color foreground illustration (PNG ~2MB) */
  fg: string;
  /** Chapter poster for cards */
  poster: string;
  /** Signature accent color */
  accent: string;
  /** Dark ink for overlays/gradients */
  ink: string;
}

export const WORLDS: Record<string, WorldArt> = {
  origin: {
    bg: "/game/worlds/origin-bg.jpg",
    fg: "/game/worlds/origin-fg.png",
    poster: "/game/posters/origin.png",
    accent: "#fbbf24",
    ink: "#1a1a2e",
  },
  grp: {
    bg: "/game/worlds/getrightprice-bg.jpg",
    fg: "/game/worlds/grp-fg.png",
    poster: "/game/posters/grp.png",
    accent: "#22d3ee",
    ink: "#1a1a2e",
  },
  hab: {
    bg: "/game/worlds/hab-bg.jpg",
    fg: "/game/worlds/hab-fg.png",
    poster: "/game/posters/hab.png",
    accent: "#e84393",
    ink: "#1a1a2e",
  },
  octo: {
    bg: "/game/worlds/earlyai-bg.jpg",
    fg: "/game/worlds/octo-fg.png",
    poster: "/game/posters/octo.png",
    accent: "#22d3ee",
    ink: "#0a0a1e",
  },
  investopad: {
    bg: "/game/worlds/investopad-bg.jpg",
    fg: "/game/worlds/investopad-fg.png",
    poster: "/game/posters/investopad.png",
    accent: "#fbbf24",
    ink: "#0a1a14",
  },
  solesearch: {
    bg: "/game/worlds/solesearch-bg.jpg",
    fg: "/game/worlds/solesearch-fg.png",
    poster: "/game/posters/solesearch.png",
    accent: "#ff6b35",
    ink: "#1a0a10",
  },
  fere: {
    bg: "/game/worlds/fere-bg.jpg",
    fg: "/game/worlds/fere-fg.png",
    poster: "/game/posters/fere.png",
    accent: "#22d3ee",
    ink: "#0a0a20",
  },
  ccd: {
    bg: "/game/worlds/catscandance-bg.jpg",
    fg: "/game/worlds/ccd-fg.png",
    poster: "/game/posters/ccd.png",
    accent: "#ec4899",
    ink: "#1a1a2e",
  },
  iterate: {
    bg: "/game/worlds/iterate-bg.jpg",
    fg: "/game/worlds/iterate-fg.png",
    poster: "/game/posters/iterate.png",
    accent: "#f59e0b",
    ink: "#1a1a2e",
  },
};
