import type { SkillId } from "@/content/resume";

/**
 * Per-chapter world art + signature accent.
 *
 * Each world ships TWO art systems while we transition:
 *  - `bg` / `fg`        — legacy 2-layer (background JPG + single FG silhouette PNG).
 *                         Used by the current WorldStage renderer and WorldsPreview cards.
 *  - `sky/far/mid/near` — new 4-layer cinematic stack generated via FAL pixel-art pipeline
 *                         (see `scripts/manifest.mjs`). Picked up by the PR 4 renderer.
 *  - `poster`           — Olly-Moss-style chapter poster, used by the title splash and
 *                         the CV page in PR 5.
 *
 * Swap an image in place (or re-roll via `npm run art:gen -- --only={id}`) to update.
 */
export interface WorldArt {
  /** Legacy backdrop (full-bleed JPG). */
  bg: string;
  /** Legacy single foreground silhouette PNG. */
  fg: string;
  /** New: painted sky JPG. */
  sky: string;
  /** New: far-distance silhouette PNG (transparent). */
  far: string;
  /** New: mid-distance silhouette PNG (transparent). */
  mid: string;
  /** New: near-distance silhouette PNG (transparent). */
  near: string;
  /** New: chapter poster PNG (3:4 portrait). */
  poster: string;
  /** Signature accent for HUD, world card border, atmosphere glow. */
  accent: string;
  /** Ink color for color grading. */
  ink: string;
}

export const WORLDS: Record<string, WorldArt> = {
  origin: {
    bg: "/game/worlds/origin.jpg",
    fg: "/game/worlds/origin-fg.png",
    sky: "/game/worlds/origin-sky.jpg",
    far: "/game/worlds/origin-far.png",
    mid: "/game/worlds/origin-mid.png",
    near: "/game/worlds/origin-near.png",
    poster: "/game/posters/origin.png",
    accent: "#fbbf24",
    ink: "#1a1a2e",
  },
  grp: {
    bg: "/game/worlds/getrightprice.jpg",
    fg: "/game/worlds/grp-fg.png",
    sky: "/game/worlds/grp-sky.jpg",
    far: "/game/worlds/grp-far.png",
    mid: "/game/worlds/grp-mid.png",
    near: "/game/worlds/grp-near.png",
    poster: "/game/posters/grp.png",
    accent: "#22d3ee",
    ink: "#1a1a2e",
  },
  hab: {
    bg: "/game/worlds/hab.jpg",
    fg: "/game/worlds/hab-fg.png",
    sky: "/game/worlds/hab-sky.jpg",
    far: "/game/worlds/hab-far.png",
    mid: "/game/worlds/hab-mid.png",
    near: "/game/worlds/hab-near.png",
    poster: "/game/posters/hab.png",
    accent: "#e84393",
    ink: "#1a1a2e",
  },
  octo: {
    bg: "/game/worlds/earlyai.jpg",
    fg: "/game/worlds/octo-fg.png",
    sky: "/game/worlds/octo-sky.jpg",
    far: "/game/worlds/octo-far.png",
    mid: "/game/worlds/octo-mid.png",
    near: "/game/worlds/octo-near.png",
    poster: "/game/posters/octo.png",
    accent: "#22d3ee",
    ink: "#1a1a2e",
  },
  investopad: {
    bg: "/game/worlds/investopad.jpg",
    fg: "/game/worlds/investopad-fg.png",
    sky: "/game/worlds/investopad-sky.jpg",
    far: "/game/worlds/investopad-far.png",
    mid: "/game/worlds/investopad-mid.png",
    near: "/game/worlds/investopad-near.png",
    poster: "/game/posters/investopad.png",
    accent: "#fbbf24",
    ink: "#1a1a2e",
  },
  solesearch: {
    bg: "/game/worlds/solesearch.jpg",
    fg: "/game/worlds/solesearch-fg.png",
    sky: "/game/worlds/solesearch-sky.jpg",
    far: "/game/worlds/solesearch-far.png",
    mid: "/game/worlds/solesearch-mid.png",
    near: "/game/worlds/solesearch-near.png",
    poster: "/game/posters/solesearch.png",
    accent: "#ff6b35",
    ink: "#1a1a2e",
  },
  fere: {
    bg: "/game/worlds/fere.jpg",
    fg: "/game/worlds/fere-fg.png",
    sky: "/game/worlds/fere-sky.jpg",
    far: "/game/worlds/fere-far.png",
    mid: "/game/worlds/fere-mid.png",
    near: "/game/worlds/fere-near.png",
    poster: "/game/posters/fere.png",
    accent: "#22d3ee",
    ink: "#1a1a2e",
  },
  ccd: {
    bg: "/game/worlds/catscandance.jpg",
    fg: "/game/worlds/ccd-fg.png",
    sky: "/game/worlds/ccd-sky.jpg",
    far: "/game/worlds/ccd-far.png",
    mid: "/game/worlds/ccd-mid.png",
    near: "/game/worlds/ccd-near.png",
    poster: "/game/posters/ccd.png",
    accent: "#ec4899",
    ink: "#1a1a2e",
  },
  iterate: {
    bg: "/game/worlds/iterate.jpg",
    fg: "/game/worlds/iterate-fg.png",
    sky: "/game/worlds/iterate-sky.jpg",
    far: "/game/worlds/iterate-far.png",
    mid: "/game/worlds/iterate-mid.png",
    near: "/game/worlds/iterate-near.png",
    poster: "/game/posters/iterate.png",
    accent: "#f59e0b",
    ink: "#1a1a2e",
  },
};

/** Skill → cell index in skills-sheet (6 cols × 4 rows = 24 cells). */
export const SKILL_ICON_INDEX: Record<SkillId, number> = {
  "self-taught": 0,
  "crawl":       8,
  "negotiation": 10,
  "ai-conv":     18,
  "judgment":    17,
  "community":   11,
  "agents":      19,
  "music":       21,
  "synthesis":   22,
};

export const SKILL_SHEET_COLS = 6;
export const SKILL_SHEET_ROWS = 4;
export const SKILLS_SHEET_PATH = "/game/skills/skills-sheet.png";

/**
 * Hero sheet (FAL-generated pixel art, composed by scripts/generate-art.mjs).
 * Single horizontal strip, 6 frames of 320×512 each.
 *   - Cells 0,1: idle pose (two-frame breath)
 *   - Cells 2,3,4,5: walk pose with subtle horizontal stride offsets
 *
 * Spring physics in GlobalHero.tsx drives Y bob and walk frame cadence; the
 * sheet itself only needs to be visually correct per cell.
 */
export const HERO_FRAMES = {
  cols: 6,
  cellW: 1920 / 6,
  cellH: 512,
  idle: [0, 1] as const,
  walk: [2, 3, 4, 5] as const,
  src: "/game/hero/hero-pixel.png",
};

/** UI asset paths. The title-card now points at the FAL-generated poster. */
export const UI_ASSETS = {
  titleCard: "/game/posters/title.png",
  paperBg: "/game/ui/paper-bg.jpg",
  pickupOrb: "/game/ui/pickup-orb.png",
  speechBubble: "/game/ui/speech-bubble.png",
  dialogBox: "/game/ui/dialog-box.png",
};

// Legacy export kept while the old canvas sheet is still referenced anywhere.
export const HERO_POSES = { idle: 0, walk: 1, climb: 2, sit: 3, point: 4, jump: 5 } as const;
export const HERO_SHEET_COLS = 6;
