/**
 * World art registry — single painted BG + FG character per world.
 * Each world has per-world tuning: brightness, vignette style, particle theme.
 */

export interface ParticleTheme {
  color: string;
  count: number;
  /** "drift" = lazy float, "data" = quick horizontal, "confetti" = bounce, "spiral" = converge */
  style: "drift" | "data" | "confetti" | "spiral" | "grid" | "dust" | "notes";
  speed: "slow" | "medium" | "fast";
}

export interface WorldArt {
  bg: string;
  fg: string;
  poster: string;
  accent: string;
  ink: string;
  /** 0–1 brightness multiplier for the background painting */
  brightness: number;
  /** CSS gradient string for the vignette overlay */
  vignette: string;
  /** Ambient particle theme for this world */
  particles: ParticleTheme;
}

export const WORLDS: Record<string, WorldArt> = {
  origin: {
    bg:     "/game/worlds/origin-bg.jpg",
    fg:     "/game/worlds/origin-fg.png",
    poster: "/game/posters/origin.png",
    accent: "#fbbf24",
    ink:    "#1a1a2e",
    brightness: 0.52,
    vignette: `radial-gradient(ellipse 100% 90% at 50% 60%, transparent 30%, #1a1a2ebb 100%),
               linear-gradient(180deg, #1a1a2e55 0%, transparent 18%, transparent 62%, #1a1a2ecc 100%)`,
    particles: { color: "#fbbf24", count: 14, style: "drift", speed: "slow" },
  },
  grp: {
    bg:     "/game/worlds/getrightprice-bg.jpg",
    fg:     "/game/worlds/grp-fg.png",
    poster: "/game/posters/grp.png",
    accent: "#22d3ee",
    ink:    "#081820",
    brightness: 0.38,
    vignette: `radial-gradient(ellipse 120% 100% at 50% 50%, transparent 35%, #08182099 100%),
               linear-gradient(90deg, #081820cc 0%, transparent 40%, transparent 60%, #081820cc 100%),
               linear-gradient(180deg, #08182033 0%, transparent 20%, transparent 70%, #081820cc 100%)`,
    particles: { color: "#22d3ee", count: 20, style: "data", speed: "fast" },
  },
  hab: {
    bg:     "/game/worlds/hab-bg.jpg",
    fg:     "/game/worlds/hab-fg.png",
    poster: "/game/posters/hab.png",
    accent: "#f97316",
    ink:    "#1a1208",
    brightness: 0.55,
    vignette: `radial-gradient(ellipse 110% 90% at 50% 55%, transparent 35%, #1a120899 100%),
               linear-gradient(180deg, #1a120833 0%, transparent 15%, transparent 65%, #1a1208cc 100%)`,
    particles: { color: "#f97316", count: 12, style: "dust", speed: "slow" },
  },
  octo: {
    bg:     "/game/worlds/earlyai-bg.jpg",
    fg:     "/game/worlds/octo-fg.png",
    poster: "/game/posters/octo.png",
    accent: "#a78bfa",
    ink:    "#0a0818",
    brightness: 0.35,
    vignette: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, #0a0818dd 100%),
               linear-gradient(180deg, #0a081844 0%, transparent 15%, transparent 60%, #0a0818dd 100%)`,
    particles: { color: "#a78bfa", count: 16, style: "grid", speed: "medium" },
  },
  investopad: {
    bg:     "/game/worlds/investopad-bg.jpg",
    fg:     "/game/worlds/investopad-fg.png",
    poster: "/game/posters/investopad.png",
    accent: "#34d399",
    ink:    "#071a12",
    brightness: 0.48,
    vignette: `radial-gradient(ellipse 115% 95% at 50% 55%, transparent 30%, #071a1299 100%),
               linear-gradient(180deg, #071a1244 0%, transparent 18%, transparent 65%, #071a12cc 100%)`,
    particles: { color: "#34d399", count: 10, style: "drift", speed: "slow" },
  },
  solesearch: {
    bg:     "/game/worlds/solesearch-bg.jpg",
    fg:     "/game/worlds/solesearch-fg.png",
    poster: "/game/posters/solesearch.png",
    accent: "#ff6b35",
    ink:    "#1a0a00",
    brightness: 0.50,
    vignette: `radial-gradient(ellipse 130% 100% at 50% 60%, transparent 45%, #1a0a0088 100%),
               linear-gradient(180deg, #1a0a0022 0%, transparent 10%, transparent 72%, #1a0a00bb 100%)`,
    particles: { color: "#ff6b35", count: 22, style: "confetti", speed: "fast" },
  },
  fere: {
    bg:     "/game/worlds/fere-bg.jpg",
    fg:     "/game/worlds/fere-fg.png",
    poster: "/game/posters/fere.png",
    accent: "#38bdf8",
    ink:    "#040d18",
    brightness: 0.38,
    vignette: `radial-gradient(ellipse 110% 100% at 50% 50%, transparent 30%, #040d18bb 100%),
               linear-gradient(180deg, #040d1855 0%, transparent 12%, transparent 60%, #040d18dd 100%)`,
    particles: { color: "#38bdf8", count: 18, style: "grid", speed: "medium" },
  },
  ccd: {
    bg:     "/game/worlds/catscandance-bg.jpg",
    fg:     "/game/worlds/ccd-fg.png",
    poster: "/game/posters/ccd.png",
    accent: "#ec4899",
    ink:    "#180814",
    brightness: 0.45,
    vignette: `radial-gradient(ellipse 105% 90% at 50% 55%, transparent 35%, #18081499 100%),
               linear-gradient(180deg, #18081433 0%, transparent 15%, transparent 65%, #180814cc 100%)`,
    particles: { color: "#ec4899", count: 16, style: "notes", speed: "medium" },
  },
  iterate: {
    bg:     "/game/worlds/iterate-bg.jpg",
    fg:     "/game/worlds/iterate-fg.png",
    poster: "/game/posters/iterate.png",
    accent: "#f59e0b",
    ink:    "#181005",
    brightness: 0.50,
    vignette: `radial-gradient(ellipse 120% 100% at 50% 55%, transparent 38%, #18100599 100%),
               linear-gradient(180deg, #18100533 0%, transparent 15%, transparent 65%, #181005cc 100%)`,
    particles: { color: "#f59e0b", count: 14, style: "spiral", speed: "medium" },
  },
};
