// Per-chapter scene data: backdrop, props, waypoint path, narration boxes,
// outcome pickups, arcade cabinet, ambient. Coordinates in the 384x216 canvas.

import type { SkillId } from "@/content/resume";

export const LW = 384;
export const LH = 216;
export const GROUND_Y = LH - 28;

// Shared x/y where the entry rope hangs from the top of every panel.
// The previous panel's exit rope sits at the same x at its bottom so the
// eye reads it as one continuous descent.
export const ROPE_X = 38;
export const EXIT_X = 346;

export type BgKind =
  | "rooftop-night"
  | "ecommerce-warehouse"
  | "rental-street"
  | "ai-lab"
  | "vault-tower"
  | "sneaker-arena"
  | "agent-farm"
  | "stage-night"
  | "workshop";

export type PropKind =
  | "tree" | "bush" | "rock" | "lamp" | "crate" | "sign" | "platform" | "ladder"
  | "crt" | "cassette" | "poster" | "antenna-tall"
  | "shopfront" | "barcode" | "conveyor" | "pricebox"
  | "house" | "house2" | "rentSign" | "autorick"
  | "terminal" | "serverRack" | "neonGrid"
  | "vault" | "vaultStack" | "tickerPole"
  | "sneakerBox" | "stageRig" | "spotlight" | "crowd"
  | "agentRack" | "satellite"
  | "mic" | "speaker" | "cat" | "eqBars"
  | "moduleBlock" | "machineCore"
  | "rope" | "arcadeCabinet" | "exitRope" | "powerLine" | "dog" | "djDeck" | "drumKit" | "holoGlobe" | "chatBubble";

export type Action = "walk" | "climb" | "sit" | "jump" | "dance" | "type" | "plant" | "lift" | "wave" | "idle";

export interface Waypoint { x: number; y: number; action: Action; facing?: 1 | -1; }

export interface NarrationBox {
  ax: number; ay: number; w: number;
  kind: "title" | "hook" | "para" | "outcome";
  text: string;
}

export interface Pickup {
  x: number; y: number; label: string;
}

export interface Scene {
  id: string;
  bg: BgKind;
  props: Array<{ x: number; y?: number; kind: PropKind; variant?: number }>;
  path: Waypoint[];
  /** Outcome chips collected by the character as they walk past. */
  pickups: Pickup[];
  /** Arcade cabinet x position (in-world play prompt). */
  arcadeX: number;
  ambient?: "stars" | "papers" | "snow" | "embers" | "bits" | "notes" | "cats" | "leaves" | "rain";
  narration: NarrationBox[];
  skill: SkillId;
}

const G = GROUND_Y;

// Helper to build a 4-pickup row above the path.
function pickupRow(labels: string[]): Pickup[] {
  const start = 90, end = 300;
  const step = labels.length > 1 ? (end - start) / (labels.length - 1) : 0;
  return labels.map((label, i) => ({
    x: Math.round(start + i * step),
    y: G - 40 - (i % 2) * 12,
    label,
  }));
}

// Path template: character climbs in via rope at top-left → traverses
// scene → reaches arcade cabinet → walks to exit rope → climbs down.
function makePath(midAction: Action = "walk"): Waypoint[] {
  return [
    { x: ROPE_X, y: 18,       action: "climb", facing: 1 },
    { x: ROPE_X, y: G - 16,   action: "walk",  facing: 1 },
    { x: 140,    y: G - 16,   action: midAction, facing: 1 },
    { x: 215,    y: G - 16,   action: "wave",  facing: 1 },
    { x: 270,    y: G - 16,   action: midAction, facing: 1 },
    { x: EXIT_X, y: G - 16,   action: "walk",  facing: 1 },
    { x: EXIT_X, y: G + 6,    action: "climb", facing: 1 },
  ];
}

export const SCENES: Record<string, Scene> = {
  origin: {
    id: "origin", bg: "rooftop-night", skill: "self-taught",
    props: [
      { x: 70,  kind: "crt" },
      { x: 108, kind: "cassette" },
      { x: 140, kind: "poster", variant: 0 },
      { x: 175, kind: "poster", variant: 1 },
      { x: 215, kind: "lamp" },
      { x: 252, kind: "crate" },
      { x: 300, kind: "antenna-tall" },
    ],
    path: makePath("type"),
    arcadeX: 240,
    pickups: pickupRow(["Code", "Design", "Music"]),
    ambient: "stars",
    narration: [],
    skill: "self-taught",
  },

  grp: {
    id: "grp", bg: "ecommerce-warehouse", skill: "crawl",
    props: [
      { x: 70,  kind: "shopfront", variant: 0 },
      { x: 110, kind: "barcode" },
      { x: 150, kind: "conveyor" },
      { x: 210, kind: "pricebox" },
      { x: 252, kind: "crate" },
      { x: 285, kind: "shopfront", variant: 2 },
    ],
    path: makePath("lift"),
    arcadeX: 240,
    pickups: pickupRow(["Angel-backed", "Crawl pipeline", "First in India"]),
    ambient: "papers",
    narration: [],
  },

  hab: {
    id: "hab", bg: "rental-street", skill: "negotiation",
    props: [
      { x: 70,  kind: "house" },
      { x: 108, kind: "rentSign" },
      { x: 130, kind: "house2" },
      { x: 175, kind: "lamp" },
      { x: 195, kind: "autorick" },
      { x: 252, kind: "house" },
      { x: 295, kind: "tree" },
    ],
    path: makePath("wave"),
    arcadeX: 240,
    pickups: pickupRow(["₹1Cr revenue", "Zero capital", "Ops sold"]),
    ambient: "leaves",
    narration: [],
  },

  octo: {
    id: "octo", bg: "ai-lab", skill: "ai-conv",
    props: [
      { x: 70,  kind: "serverRack" },
      { x: 108, kind: "terminal" },
      { x: 150, kind: "serverRack" },
      { x: 195, kind: "terminal" },
      { x: 252, kind: "antenna-tall" },
      { x: 295, kind: "serverRack" },
    ],
    path: makePath("type"),
    arcadeX: 240,
    pickups: pickupRow(["First AI bot 2013", "Octo → Quartic", "Director, Marketing"]),
    ambient: "bits",
    narration: [],
  },

  investopad: {
    id: "investopad", bg: "vault-tower", skill: "judgment",
    props: [
      { x: 70,  kind: "vault" },
      { x: 108, kind: "vaultStack" },
      { x: 160, kind: "ladder" },
      { x: 195, kind: "vault" },
      { x: 252, kind: "vaultStack" },
      { x: 300, kind: "vault" },
      { x: 75,  kind: "tickerPole" },
    ],
    path: [
      { x: ROPE_X, y: 18,     action: "climb", facing: 1 },
      { x: ROPE_X, y: G - 16, action: "walk",  facing: 1 },
      { x: 100,    y: G - 16, action: "lift",  facing: 1 },
      { x: 170,    y: G - 50, action: "climb", facing: 1 },
      { x: 215,    y: G - 16, action: "wave",  facing: 1 },
      { x: 270,    y: G - 16, action: "lift",  facing: 1 },
      { x: EXIT_X, y: G - 16, action: "walk",  facing: 1 },
      { x: EXIT_X, y: G + 6,  action: "climb", facing: 1 },
    ],
    arcadeX: 240,
    pickups: pickupRow(["Fund 0", "Growth+Tech", "Bet-on-person"]),
    ambient: "papers",
    narration: [],
  },

  solesearch: {
    id: "solesearch", bg: "sneaker-arena", skill: "community",
    props: [
      { x: 60,  kind: "sneakerBox" },
      { x: 100, kind: "sneakerBox", variant: 1 },
      { x: 140, kind: "platform" },
      { x: 195, kind: "stageRig" },
      { x: 260, kind: "sneakerBox", variant: 2 },
      { x: 310, kind: "spotlight" },
      { x: 16,  kind: "crowd" },
    ],
    path: [
      { x: ROPE_X, y: 18,     action: "climb", facing: 1 },
      { x: ROPE_X, y: G - 16, action: "walk",  facing: 1 },
      { x: 115,    y: G - 16, action: "jump",  facing: 1 },
      { x: 170,    y: G - 24, action: "walk",  facing: 1 },
      { x: 215,    y: G - 16, action: "wave",  facing: 1 },
      { x: 280,    y: G - 16, action: "walk",  facing: 1 },
      { x: EXIT_X, y: G - 16, action: "walk",  facing: 1 },
      { x: EXIT_X, y: G + 6,  action: "climb", facing: 1 },
    ],
    arcadeX: 240,
    pickups: pickupRow(["$795K raised", "₹26Cr/yr", "30+ events", "350K+ community"]),
    ambient: "embers",
    narration: [],
  },

  fere: {
    id: "fere", bg: "agent-farm", skill: "agents",
    props: [
      { x: 70,  kind: "agentRack" },
      { x: 110, kind: "agentRack", variant: 1 },
      { x: 160, kind: "satellite" },
      { x: 210, kind: "agentRack" },
      { x: 260, kind: "agentRack", variant: 2 },
      { x: 310, kind: "terminal" },
    ],
    path: makePath("type"),
    arcadeX: 240,
    pickups: pickupRow(["$1.3M raised", "10M+ actions", "AI-native GTM"]),
    ambient: "bits",
    narration: [],
  },

  ccd: {
    id: "ccd", bg: "stage-night", skill: "music",
    props: [
      { x: 60,  kind: "speaker" },
      { x: 90,  kind: "eqBars" },
      { x: 130, kind: "mic" },
      { x: 160, kind: "platform" },
      { x: 215, kind: "cat", variant: 0 },
      { x: 240, kind: "cat", variant: 1 },
      { x: 280, kind: "speaker" },
      { x: 320, kind: "spotlight" },
    ],
    path: [
      { x: ROPE_X, y: 18,     action: "climb", facing: 1 },
      { x: ROPE_X, y: G - 16, action: "walk",  facing: 1 },
      { x: 130,    y: G - 16, action: "dance", facing: 1 },
      { x: 170,    y: G - 24, action: "dance", facing: 1 },
      { x: 240,    y: G - 16, action: "wave",  facing: 1 },
      { x: 300,    y: G - 16, action: "walk",  facing: 1 },
      { x: EXIT_X, y: G - 16, action: "walk",  facing: 1 },
      { x: EXIT_X, y: G + 6,  action: "climb", facing: 1 },
    ],
    arcadeX: 240,
    pickups: pickupRow(["Original releases", "Live events", "Pet brand"]),
    ambient: "notes",
    narration: [],
  },

  iterate: {
    id: "iterate", bg: "workshop", skill: "synthesis",
    props: [
      { x: 70,  kind: "moduleBlock", variant: 0 },
      { x: 105, kind: "moduleBlock", variant: 1 },
      { x: 140, kind: "moduleBlock", variant: 2 },
      { x: 175, kind: "machineCore" },
      { x: 230, kind: "moduleBlock", variant: 1 },
      { x: 270, kind: "moduleBlock", variant: 0 },
      { x: 310, kind: "terminal" },
    ],
    path: makePath("lift"),
    arcadeX: 240,
    pickups: pickupRow(["AI workflows", "Strategy+creative+tech", "15yr instinct"]),
    ambient: "bits",
    narration: [],
  },
};
