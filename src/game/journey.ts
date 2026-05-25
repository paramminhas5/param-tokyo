import type { SkillId } from "@/content/resume";

/**
 * Per-chapter world art + signature accent.
 * Asset paths point at /public/game/worlds. Swap PNG/JPG files in place to swap art.
 *
 * PR 3 will add per-world `sky/far/mid/near` silhouette layers; for now each world
 * still uses the existing 2-layer (bg + fg) system.
 */
export const WORLDS: Record<string, { bg: string; fg: string; accent: string; ink: string }> = {
  origin:     { bg: "/game/worlds/origin.jpg",        fg: "/game/worlds/origin-fg.png",     accent: "#fbbf24", ink: "#1a1a2e" },
  grp:        { bg: "/game/worlds/getrightprice.jpg", fg: "/game/worlds/grp-fg.png",        accent: "#22d3ee", ink: "#1a1a2e" },
  hab:        { bg: "/game/worlds/hab.jpg",           fg: "/game/worlds/hab-fg.png",        accent: "#e84393", ink: "#1a1a2e" },
  octo:       { bg: "/game/worlds/earlyai.jpg",       fg: "/game/worlds/octo-fg.png",       accent: "#22d3ee", ink: "#1a1a2e" },
  investopad: { bg: "/game/worlds/investopad.jpg",    fg: "/game/worlds/investopad-fg.png", accent: "#fbbf24", ink: "#1a1a2e" },
  solesearch: { bg: "/game/worlds/solesearch.jpg",    fg: "/game/worlds/solesearch-fg.png", accent: "#ff6b35", ink: "#1a1a2e" },
  fere:       { bg: "/game/worlds/fere.jpg",          fg: "/game/worlds/fere-fg.png",       accent: "#22d3ee", ink: "#1a1a2e" },
  ccd:        { bg: "/game/worlds/catscandance.jpg",  fg: "/game/worlds/ccd-fg.png",        accent: "#ec4899", ink: "#1a1a2e" },
  iterate:    { bg: "/game/worlds/iterate.jpg",       fg: "/game/worlds/iterate-fg.png",    accent: "#f59e0b", ink: "#1a1a2e" },
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
 * Hero sheet v2: single horizontal strip, 6 frames.
 * 0,1 = idle (two-frame breath). 2,3,4,5 = 4-frame walk cycle.
 */
export const HERO_FRAMES = {
  cols: 6,
  // Each cell is sheetWidth/cols × sheetHeight from the source PNG (1920×512).
  cellW: 1920 / 6,
  cellH: 512,
  idle: [0, 1] as const,
  walk: [2, 3, 4, 5] as const,
  src: "/game/hero/hero-v2.png",
};

// Legacy export for the old v1 sheet (kept for now to avoid orphan imports).
export const HERO_POSES = { idle: 0, walk: 1, climb: 2, sit: 3, point: 4, jump: 5 } as const;
export const HERO_SHEET_COLS = 6;

/** UI asset paths (formerly Vite-bundled imports). */
export const UI_ASSETS = {
  titleCard: "/game/ui/title-card.png",
  paperBg: "/game/ui/paper-bg.jpg",
  pickupOrb: "/game/ui/pickup-orb.png",
  speechBubble: "/game/ui/speech-bubble.png",
  dialogBox: "/game/ui/dialog-box.png",
};
