import originBg from "@/assets/game/worlds/origin.jpg";
import grpBg from "@/assets/game/worlds/getrightprice.jpg";
import habBg from "@/assets/game/worlds/hab.jpg";
import earlyaiBg from "@/assets/game/worlds/earlyai.jpg";
import investopadBg from "@/assets/game/worlds/investopad.jpg";
import solesearchBg from "@/assets/game/worlds/solesearch.jpg";
import fereBg from "@/assets/game/worlds/fere.jpg";
import ccdBg from "@/assets/game/worlds/catscandance.jpg";
import iterateBg from "@/assets/game/worlds/iterate.jpg";
import type { SkillId } from "@/content/resume";

/** Per-chapter world art + signature accent. Swap the imports to replace assets. */
export const WORLDS: Record<string, { bg: string; accent: string; ink: string }> = {
  origin:     { bg: originBg,     accent: "#ff6b5b", ink: "#1a1a2e" },
  grp:        { bg: grpBg,        accent: "#e0a830", ink: "#1a1a2e" },
  hab:        { bg: habBg,        accent: "#7ba87b", ink: "#1a1a2e" },
  octo:       { bg: earlyaiBg,    accent: "#2d7fb8", ink: "#1a1a2e" },
  investopad: { bg: investopadBg, accent: "#8a5a9e", ink: "#1a1a2e" },
  solesearch: { bg: solesearchBg, accent: "#ff5b4f", ink: "#1a1a2e" },
  fere:       { bg: fereBg,       accent: "#3aa0ff", ink: "#1a1a2e" },
  ccd:        { bg: ccdBg,        accent: "#d63384", ink: "#1a1a2e" },
  iterate:    { bg: iterateBg,    accent: "#f2a93b", ink: "#1a1a2e" },
};

/** Skill → cell index in skills-sheet (6 cols × 4 rows = 24 cells). */
export const SKILL_ICON_INDEX: Record<SkillId, number> = {
  "self-taught": 0,   // lightbulb
  "crawl":       8,   // magnifier
  "negotiation": 10,  // handshake
  "ai-conv":     18,  // chat
  "judgment":    17,  // brain
  "community":   11,  // crown
  "agents":      19,  // bolt
  "music":       21,  // turntable
  "synthesis":   22,  // sparkle
};

export const SKILL_SHEET_COLS = 6;
export const SKILL_SHEET_ROWS = 4;

/** Hero sheet poses by column index (6 frames in a horizontal strip). */
export const HERO_POSES = {
  idle:  0,
  walk:  1,
  climb: 2,
  sit:   3,
  point: 4,
  jump:  5,
} as const;
export const HERO_SHEET_COLS = 6;
