// Per-chapter scene data: backdrop kind, props (x,y,kind), waypoint path,
// narration-box positions, ambient particle type. Coordinates are in the
// logical 384x216 canvas space used by the drawer.

import type { SkillId } from "@/content/resume";

export const LW = 384;
export const LH = 216;
export const GROUND_Y = LH - 28; // ground line

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
  // generic
  | "tree" | "bush" | "rock" | "lamp" | "crate" | "sign" | "platform" | "ladder"
  // chapter-specific
  | "crt" | "cassette" | "poster" | "antenna-tall"
  | "shopfront" | "barcode" | "conveyor" | "pricebox"
  | "house" | "house2" | "rentSign" | "autorick"
  | "terminal" | "serverRack" | "neonGrid"
  | "vault" | "vaultStack" | "tickerPole"
  | "sneakerBox" | "stageRig" | "spotlight" | "crowd"
  | "agentRack" | "satellite"
  | "mic" | "speaker" | "cat" | "eqBars"
  | "moduleBlock" | "machineCore";

export type Action = "walk" | "climb" | "sit" | "jump" | "dance" | "type" | "plant" | "lift" | "wave";

export interface Waypoint { x: number; y: number; action: Action; facing?: 1 | -1; }

export interface NarrationBox {
  // anchor in % of canvas (0..1)
  ax: number; ay: number;
  // width in % of canvas
  w: number;
  // role styling
  kind: "title" | "hook" | "para" | "outcome";
  text: string;
}

export interface Scene {
  id: string;
  bg: BgKind;
  /** Primary palette overrides (optional — fall back to chapter.theme) */
  tint?: { sky?: string; ground?: string; accent?: string; silhouette?: string };
  props: Array<{ x: number; y?: number; kind: PropKind; variant?: number }>;
  /** Path the character takes from progress 0 -> 1 within the panel */
  path: Waypoint[];
  /** Mini-game prompt prop position (and where character plants flag) */
  playX: number;
  ambient?: "stars" | "papers" | "snow" | "embers" | "bits" | "notes" | "cats" | "leaves" | "rain";
  narration: NarrationBox[];
  skill: SkillId;
}

const G = GROUND_Y;

export const SCENES: Record<string, Scene> = {
  origin: {
    id: "origin",
    bg: "rooftop-night",
    skill: "self-taught",
    props: [
      { x: 28,  kind: "antenna-tall" },
      { x: 70,  kind: "crt" },
      { x: 108, kind: "cassette" },
      { x: 140, kind: "poster", variant: 0 },
      { x: 175, kind: "poster", variant: 1 },
      { x: 215, kind: "lamp" },
      { x: 250, kind: "crate" },
      { x: 290, kind: "ladder" },
      { x: 332, kind: "sign" },
    ],
    path: [
      { x: 30,  y: G - 16, action: "walk",  facing: 1 },
      { x: 80,  y: G - 16, action: "type",  facing: 1 },
      { x: 150, y: G - 16, action: "walk",  facing: 1 },
      { x: 220, y: G - 16, action: "wave",  facing: 1 },
      { x: 295, y: G - 32, action: "climb", facing: 1 },
      { x: 332, y: G - 16, action: "plant", facing: 1 },
    ],
    playX: 250,
    ambient: "stars",
    narration: [
      { ax: 0.04, ay: 0.06, w: 0.32, kind: "title", text: "01 · Pre-2010 · Bengaluru" },
      { ax: 0.04, ay: 0.18, w: 0.34, kind: "hook",  text: "Self-taught across code, design and music. Shipped before there was a scene." },
      { ax: 0.62, ay: 0.10, w: 0.34, kind: "para",  text: "No mentor, no internship pipeline. The internet was the teacher. Shipping was the homework." },
      { ax: 0.62, ay: 0.40, w: 0.34, kind: "para",  text: "It set the OS: bias to action, taste built by making, conviction that you can learn anything if you stay in the room." },
    ],
  },

  grp: {
    id: "grp",
    bg: "ecommerce-warehouse",
    skill: "crawl",
    props: [
      { x: 20,  kind: "shopfront", variant: 0 },
      { x: 70,  kind: "barcode" },
      { x: 100, kind: "shopfront", variant: 1 },
      { x: 150, kind: "conveyor" },
      { x: 210, kind: "pricebox" },
      { x: 250, kind: "crate" },
      { x: 280, kind: "shopfront", variant: 2 },
      { x: 335, kind: "sign" },
    ],
    path: [
      { x: 30,  y: G - 16, action: "walk", facing: 1 },
      { x: 110, y: G - 16, action: "walk", facing: 1 },
      { x: 170, y: G - 16, action: "lift", facing: 1 },
      { x: 235, y: G - 16, action: "walk", facing: 1 },
      { x: 335, y: G - 16, action: "plant",facing: 1 },
    ],
    playX: 250,
    ambient: "papers",
    narration: [
      { ax: 0.04, ay: 0.06, w: 0.34, kind: "title", text: "02 · 2010 · GetRightPrice" },
      { ax: 0.04, ay: 0.18, w: 0.34, kind: "hook",  text: "India's first price-comparison engine. Angel-backed. Built in college." },
      { ax: 0.62, ay: 0.10, w: 0.34, kind: "para",  text: "Joined the founding team. Built the catalog and the crawl pipeline that powered comparison across categories." },
      { ax: 0.62, ay: 0.40, w: 0.34, kind: "para",  text: "First taste of building at the edge of what was technically possible in India, against incumbents who didn't see e-commerce coming." },
    ],
  },

  hab: {
    id: "hab",
    bg: "rental-street",
    skill: "negotiation",
    props: [
      { x: 20,  kind: "house" },
      { x: 70,  kind: "rentSign" },
      { x: 100, kind: "house2" },
      { x: 155, kind: "lamp" },
      { x: 185, kind: "autorick" },
      { x: 235, kind: "house" },
      { x: 290, kind: "tree" },
      { x: 335, kind: "rentSign" },
    ],
    path: [
      { x: 30,  y: G - 16, action: "walk", facing: 1 },
      { x: 80,  y: G - 16, action: "wave", facing: 1 },
      { x: 165, y: G - 16, action: "walk", facing: 1 },
      { x: 245, y: G - 16, action: "lift", facing: 1 },
      { x: 335, y: G - 16, action: "plant", facing: 1 },
    ],
    playX: 250,
    ambient: "leaves",
    narration: [
      { ax: 0.04, ay: 0.06, w: 0.34, kind: "title", text: "03 · 2012-13 · Hab Housing" },
      { ax: 0.04, ay: 0.18, w: 0.34, kind: "hook",  text: "Bootstrapped rental housing across Bengaluru. ₹1Cr revenue. Sold ops." },
      { ax: 0.62, ay: 0.10, w: 0.34, kind: "para",  text: "Standardised budget rentals when the market was brokers and word-of-mouth. Built listings, ops and the trust layer at once." },
      { ax: 0.62, ay: 0.40, w: 0.34, kind: "para",  text: "Real lesson in unit economics and human ops. Zero external capital. Then sold operations and moved on." },
    ],
  },

  octo: {
    id: "octo",
    bg: "ai-lab",
    skill: "ai-conv",
    props: [
      { x: 20,  kind: "neonGrid" },
      { x: 60,  kind: "serverRack" },
      { x: 110, kind: "terminal" },
      { x: 160, kind: "serverRack" },
      { x: 215, kind: "terminal" },
      { x: 265, kind: "antenna-tall" },
      { x: 305, kind: "serverRack" },
      { x: 350, kind: "sign" },
    ],
    path: [
      { x: 30,  y: G - 16, action: "walk", facing: 1 },
      { x: 120, y: G - 16, action: "type", facing: 1 },
      { x: 220, y: G - 16, action: "type", facing: 1 },
      { x: 285, y: G - 16, action: "walk", facing: 1 },
      { x: 350, y: G - 16, action: "plant",facing: 1 },
    ],
    playX: 250,
    ambient: "bits",
    narration: [
      { ax: 0.04, ay: 0.06, w: 0.36, kind: "title", text: "04 · 2013-17 · Octo → Quartic.ai" },
      { ax: 0.04, ay: 0.18, w: 0.36, kind: "hook",  text: "Built one of India's first AI chatbots in 2013. Octo acquired by Quartic.ai." },
      { ax: 0.60, ay: 0.10, w: 0.36, kind: "para",  text: "Shipped conversational AI before the category had a name in India. Co-built Octo with Akshaya Aron." },
      { ax: 0.60, ay: 0.40, w: 0.36, kind: "para",  text: "The chapter that taught what enterprise AI actually looks like — distribution, integration, post-sale ownership. Director of Marketing after the acquisition." },
    ],
  },

  investopad: {
    id: "investopad",
    bg: "vault-tower",
    skill: "judgment",
    props: [
      { x: 20,  kind: "tickerPole" },
      { x: 60,  kind: "vault" },
      { x: 105, kind: "vaultStack" },
      { x: 160, kind: "ladder" },
      { x: 200, kind: "vault" },
      { x: 245, kind: "vaultStack" },
      { x: 300, kind: "vault" },
      { x: 345, kind: "sign" },
    ],
    path: [
      { x: 30,  y: G - 16, action: "walk",  facing: 1 },
      { x: 80,  y: G - 16, action: "lift",  facing: 1 },
      { x: 165, y: G - 50, action: "climb", facing: 1 },
      { x: 215, y: G - 16, action: "lift",  facing: 1 },
      { x: 305, y: G - 16, action: "walk",  facing: 1 },
      { x: 345, y: G - 16, action: "plant", facing: 1 },
    ],
    playX: 250,
    ambient: "papers",
    narration: [
      { ax: 0.04, ay: 0.06, w: 0.34, kind: "title", text: "05 · Post-Octo · Investopad" },
      { ax: 0.04, ay: 0.18, w: 0.34, kind: "hook",  text: "Partner — Growth & Tech. Built Fund 0. Both sides of the table." },
      { ax: 0.62, ay: 0.10, w: 0.34, kind: "para",  text: "Worked hands-on with portfolio founders on growth and tech. Operator and investor at the same time." },
      { ax: 0.62, ay: 0.40, w: 0.34, kind: "para",  text: "Pattern-matching across dozens of early-stage companies sharpens judgment in ways no single operating role can." },
    ],
  },

  solesearch: {
    id: "solesearch",
    bg: "sneaker-arena",
    skill: "community",
    props: [
      { x: 16,  kind: "crowd" },
      { x: 70,  kind: "sneakerBox" },
      { x: 110, kind: "sneakerBox", variant: 1 },
      { x: 145, kind: "platform" },
      { x: 200, kind: "stageRig" },
      { x: 260, kind: "sneakerBox", variant: 2 },
      { x: 300, kind: "spotlight" },
      { x: 340, kind: "sign" },
    ],
    path: [
      { x: 30,  y: G - 16, action: "walk", facing: 1 },
      { x: 115, y: G - 16, action: "jump", facing: 1 },
      { x: 170, y: G - 24, action: "walk", facing: 1 },
      { x: 215, y: G - 16, action: "wave", facing: 1 },
      { x: 285, y: G - 16, action: "walk", facing: 1 },
      { x: 340, y: G - 16, action: "plant", facing: 1 },
    ],
    playX: 250,
    ambient: "embers",
    narration: [
      { ax: 0.04, ay: 0.06, w: 0.34, kind: "title", text: "06 · 2018-23 · SoleSearch" },
      { ax: 0.04, ay: 0.18, w: 0.34, kind: "hook",  text: "Built India's sneaker culture. $795K raised. ₹26cr+ yearly sales." },
      { ax: 0.62, ay: 0.08, w: 0.34, kind: "para",  text: "Co-founded with Prabal Baghla; Rannvijay Singha as partner. 30+ live events. ₹1cr+ in sponsorships. 350K+ community." },
      { ax: 0.62, ay: 0.40, w: 0.34, kind: "para",  text: "First time anyone in India treated sneakers and street culture as a venture-scale category. Built the playbook everyone now copies." },
    ],
  },

  fere: {
    id: "fere",
    bg: "agent-farm",
    skill: "agents",
    props: [
      { x: 20,  kind: "neonGrid" },
      { x: 60,  kind: "agentRack" },
      { x: 110, kind: "agentRack", variant: 1 },
      { x: 160, kind: "satellite" },
      { x: 210, kind: "agentRack" },
      { x: 260, kind: "agentRack", variant: 2 },
      { x: 310, kind: "terminal" },
      { x: 350, kind: "sign" },
    ],
    path: [
      { x: 30,  y: G - 16, action: "walk", facing: 1 },
      { x: 120, y: G - 16, action: "type", facing: 1 },
      { x: 175, y: G - 16, action: "wave", facing: 1 },
      { x: 270, y: G - 16, action: "walk", facing: 1 },
      { x: 320, y: G - 16, action: "type", facing: 1 },
      { x: 350, y: G - 16, action: "plant", facing: 1 },
    ],
    playX: 250,
    ambient: "bits",
    narration: [
      { ax: 0.04, ay: 0.06, w: 0.34, kind: "title", text: "07 · 2024-25 · Fere.ai" },
      { ax: 0.04, ay: 0.18, w: 0.34, kind: "hook",  text: "Autonomous agents for crypto markets. $1.3M raised. 10M+ actions at launch." },
      { ax: 0.62, ay: 0.10, w: 0.34, kind: "para",  text: "Rejoined Akshaya Aron a decade after Octo. Built growth and marketing for genuinely novel agent infrastructure." },
      { ax: 0.62, ay: 0.40, w: 0.34, kind: "para",  text: "A year of AI-native GTM. Led by Ethereal Ventures. 10M+ autonomous actions processed on launch." },
    ],
  },

  ccd: {
    id: "ccd",
    bg: "stage-night",
    skill: "music",
    props: [
      { x: 20,  kind: "speaker" },
      { x: 60,  kind: "eqBars" },
      { x: 115, kind: "mic" },
      { x: 145, kind: "platform" },
      { x: 210, kind: "cat", variant: 0 },
      { x: 240, kind: "cat", variant: 1 },
      { x: 275, kind: "speaker" },
      { x: 320, kind: "spotlight" },
      { x: 355, kind: "sign" },
    ],
    path: [
      { x: 30,  y: G - 16, action: "walk", facing: 1 },
      { x: 120, y: G - 16, action: "dance", facing: 1 },
      { x: 170, y: G - 24, action: "dance", facing: 1 },
      { x: 240, y: G - 16, action: "wave", facing: 1 },
      { x: 320, y: G - 16, action: "walk", facing: 1 },
      { x: 355, y: G - 16, action: "plant", facing: 1 },
    ],
    playX: 250,
    ambient: "notes",
    narration: [
      { ax: 0.04, ay: 0.06, w: 0.34, kind: "title", text: "08 · Now · Cats Can Dance" },
      { ax: 0.04, ay: 0.18, w: 0.34, kind: "hook",  text: "Music label + pet culture brand. The work that exists because it has to." },
      { ax: 0.62, ay: 0.10, w: 0.34, kind: "para",  text: "Original releases, a pet-forward brand world, live events that double as creative IP." },
      { ax: 0.62, ay: 0.40, w: 0.34, kind: "para",  text: "The chapter that closes the loop between operator and artist. The skills compound across mediums." },
    ],
  },

  iterate: {
    id: "iterate",
    bg: "workshop",
    skill: "synthesis",
    props: [
      { x: 25,  kind: "moduleBlock", variant: 0 },
      { x: 65,  kind: "moduleBlock", variant: 1 },
      { x: 105, kind: "moduleBlock", variant: 2 },
      { x: 160, kind: "machineCore" },
      { x: 225, kind: "moduleBlock", variant: 1 },
      { x: 265, kind: "moduleBlock", variant: 0 },
      { x: 305, kind: "terminal" },
      { x: 350, kind: "sign" },
    ],
    path: [
      { x: 30,  y: G - 16, action: "walk", facing: 1 },
      { x: 110, y: G - 16, action: "lift", facing: 1 },
      { x: 170, y: G - 16, action: "type", facing: 1 },
      { x: 235, y: G - 16, action: "lift", facing: 1 },
      { x: 320, y: G - 16, action: "wave", facing: 1 },
      { x: 350, y: G - 16, action: "plant", facing: 1 },
    ],
    playX: 250,
    ambient: "bits",
    narration: [
      { ax: 0.04, ay: 0.06, w: 0.34, kind: "title", text: "09 · Now · Iterate" },
      { ax: 0.04, ay: 0.18, w: 0.34, kind: "hook",  text: "AI-native marketing agency. Speed × strategy × creativity." },
      { ax: 0.62, ay: 0.10, w: 0.34, kind: "para",  text: "AI workflows for brand and growth. Strategy, creative and tech in one room." },
      { ax: 0.62, ay: 0.40, w: 0.34, kind: "para",  text: "Every prior chapter feeds this one. Operator-led, AI-native, with the taste and depth to actually ship." },
    ],
  },
};
