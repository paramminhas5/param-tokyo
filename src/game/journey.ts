/**
 * World art registry — full 5-layer parallax for every world.
 * Layers ordered back → front: sky, far, mid, near, fg
 */

export interface WorldArt {
  sky:    string;   // Slowest — most distant sky/atmosphere
  far:    string;   // Far background elements
  mid:    string;   // Mid-ground
  near:   string;   // Foreground elements, faster
  fg:     string;   // Character / main subject — fastest + most zoom
  poster: string;   // Chapter card thumbnail
  accent: string;   // Signature accent colour
  ink:    string;   // Deep dark for overlays / gradients
}

export const WORLDS: Record<string, WorldArt> = {
  origin: {
    sky:    "/game/worlds/origin-sky.jpg",
    far:    "/game/worlds/origin-far.png",
    mid:    "/game/worlds/origin-mid.png",
    near:   "/game/worlds/origin-near.png",
    fg:     "/game/worlds/origin-fg.png",
    poster: "/game/posters/origin.png",
    accent: "#fbbf24",
    ink:    "#1a1a2e",
  },
  grp: {
    sky:    "/game/worlds/grp-sky.jpg",
    far:    "/game/worlds/grp-far.png",
    mid:    "/game/worlds/grp-mid.png",
    near:   "/game/worlds/grp-near.png",
    fg:     "/game/worlds/grp-fg.png",
    poster: "/game/posters/grp.png",
    accent: "#22d3ee",
    ink:    "#081820",
  },
  hab: {
    sky:    "/game/worlds/hab-sky.jpg",
    far:    "/game/worlds/hab-far.png",
    mid:    "/game/worlds/hab-mid.png",
    near:   "/game/worlds/hab-near.png",
    fg:     "/game/worlds/hab-fg.png",
    poster: "/game/posters/hab.png",
    accent: "#f97316",
    ink:    "#1a1208",
  },
  octo: {
    sky:    "/game/worlds/octo-sky.jpg",
    far:    "/game/worlds/octo-far.png",
    mid:    "/game/worlds/octo-mid.png",
    near:   "/game/worlds/octo-near.png",
    fg:     "/game/worlds/octo-fg.png",
    poster: "/game/posters/octo.png",
    accent: "#a78bfa",
    ink:    "#0a0818",
  },
  investopad: {
    sky:    "/game/worlds/investopad-sky.jpg",
    far:    "/game/worlds/investopad-far.png",
    mid:    "/game/worlds/investopad-mid.png",
    near:   "/game/worlds/investopad-near.png",
    fg:     "/game/worlds/investopad-fg.png",
    poster: "/game/posters/investopad.png",
    accent: "#34d399",
    ink:    "#071a12",
  },
  solesearch: {
    sky:    "/game/worlds/solesearch-sky.jpg",
    far:    "/game/worlds/solesearch-far.png",
    mid:    "/game/worlds/solesearch-mid.png",
    near:   "/game/worlds/solesearch-near.png",
    fg:     "/game/worlds/solesearch-fg.png",
    poster: "/game/posters/solesearch.png",
    accent: "#ff6b35",
    ink:    "#1a0a00",
  },
  fere: {
    sky:    "/game/worlds/fere-sky.jpg",
    far:    "/game/worlds/fere-far.png",
    mid:    "/game/worlds/fere-mid.png",
    near:   "/game/worlds/fere-near.png",
    fg:     "/game/worlds/fere-fg.png",
    poster: "/game/posters/fere.png",
    accent: "#38bdf8",
    ink:    "#040d18",
  },
  ccd: {
    sky:    "/game/worlds/ccd-sky.jpg",
    far:    "/game/worlds/ccd-far.png",
    mid:    "/game/worlds/ccd-mid.png",
    near:   "/game/worlds/ccd-near.png",
    fg:     "/game/worlds/ccd-fg.png",
    poster: "/game/posters/ccd.png",
    accent: "#ec4899",
    ink:    "#180814",
  },
  iterate: {
    sky:    "/game/worlds/iterate-sky.jpg",
    far:    "/game/worlds/iterate-far.png",
    mid:    "/game/worlds/iterate-mid.png",
    near:   "/game/worlds/iterate-near.png",
    fg:     "/game/worlds/iterate-fg.png",
    poster: "/game/posters/iterate.png",
    accent: "#f59e0b",
    ink:    "#181005",
  },
};
