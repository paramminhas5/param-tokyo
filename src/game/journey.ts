import originBg from "@/assets/game/worlds/origin.jpg";
import grpBg from "@/assets/game/worlds/getrightprice.jpg";
import habBg from "@/assets/game/worlds/hab.jpg";
import earlyaiBg from "@/assets/game/worlds/earlyai.jpg";
import investopadBg from "@/assets/game/worlds/investopad.jpg";
import solesearchBg from "@/assets/game/worlds/solesearch.jpg";
import fereBg from "@/assets/game/worlds/fere.jpg";
import ccdBg from "@/assets/game/worlds/catscandance.jpg";
import iterateBg from "@/assets/game/worlds/iterate.jpg";

import originFg from "@/assets/game/worlds/origin-fg.png";
import grpFg from "@/assets/game/worlds/grp-fg.png";
import habFg from "@/assets/game/worlds/hab-fg.png";
import octoFg from "@/assets/game/worlds/octo-fg.png";
import investopadFg from "@/assets/game/worlds/investopad-fg.png";
import solesearchFg from "@/assets/game/worlds/solesearch-fg.png";
import fereFg from "@/assets/game/worlds/fere-fg.png";
import ccdFg from "@/assets/game/worlds/ccd-fg.png";
import iterateFg from "@/assets/game/worlds/iterate-fg.png";

import type { SkillId } from "@/content/resume";

/** Per-chapter world art + signature accent. Swap the imports to replace assets. */
export const WORLDS: Record<string, { bg: string; fg: string; accent: string; ink: string }> = {
  origin:     { bg: originBg,     fg: originFg,     accent: "#fbbf24", ink: "#1a1a2e" },
  grp:        { bg: grpBg,        fg: grpFg,        accent: "#22d3ee", ink: "#1a1a2e" },
  hab:        { bg: habBg,        fg: habFg,        accent: "#e84393", ink: "#1a1a2e" },
  octo:       { bg: earlyaiBg,    fg: octoFg,       accent: "#22d3ee", ink: "#1a1a2e" },
  investopad: { bg: investopadBg, fg: investopadFg, accent: "#fbbf24", ink: "#1a1a2e" },
  solesearch: { bg: solesearchBg, fg: solesearchFg, accent: "#ff6b35", ink: "#1a1a2e" },
  fere:       { bg: fereBg,       fg: fereFg,       accent: "#22d3ee", ink: "#1a1a2e" },
  ccd:        { bg: ccdBg,        fg: ccdFg,        accent: "#ec4899", ink: "#1a1a2e" },
  iterate:    { bg: iterateBg,    fg: iterateFg,    accent: "#f59e0b", ink: "#1a1a2e" },
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

/**
 * Hero sheet v2: single horizontal strip, 6 frames.
 * 0,1 = idle (two-frame breath). 2,3,4,5 = 4-frame walk cycle.
 */
export const HERO_FRAMES = {
  cols: 6,
  // Each cell is sheetWidth/cols × sheetHeight from the generated PNG (1920×512).
  cellW: 1920 / 6,
  cellH: 512,
  idle: [0, 1] as const,
  walk: [2, 3, 4, 5] as const,
};

// Legacy export for the old v1 sheet (kept for now to avoid orphan imports).
export const HERO_POSES = { idle: 0, walk: 1, climb: 2, sit: 3, point: 4, jump: 5 } as const;
export const HERO_SHEET_COLS = 6;
