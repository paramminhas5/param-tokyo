import type { Platform, GameNpc, SkillOrb, ExitPortal } from "./engine";

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

export interface LevelDef {
  id: string;
  name: string;
  year: string;
  worldWidth: number;

  // Art
  bgUrl: string;
  fgUrl: string;
  accent: string;
  skyTop: string;
  skyBot: string;
  groundColor: string;
  groundLineColor: string;

  // Geometry
  platforms: Platform[];
  npcs: GameNpc[];
  skill: SkillOrb;
  exit: ExitPortal;
}

// ─── Level factory helpers ────────────────────────────────────────────────────
function p(x: number, y: number, w: number, h = 18, accent?: string): Platform {
  return { x, y, w, h, accent };
}
function npc(
  id: string, worldX: number, groundY: number,
  kind: GameNpc["kind"], name: string, title: string, line: string,
): GameNpc {
  return { id, worldX, groundY, kind, name, title, line, talked: false, talkRadius: 72 };
}
function orb(worldX: number, groundY: number, label: string, skillId: string, color: string): SkillOrb {
  return { worldX, groundY, label, skillId, color, collected: false, collectAnim: 0 };
}

// ─── WORLD 1 — ORIGIN · Pre-2010 ─────────────────────────────────────────────
// Tone: humble beginnings. Gently rolling terrain. Player learns to jump.
// Flow: flat start → first small rise → rooftop-hop → skill at peak → gentle descent → exit
export const LEVEL_ORIGIN: LevelDef = {
  id: "origin", name: "ORIGIN", year: "Pre-2010",
  worldWidth: 4200,
  bgUrl: originBg, fgUrl: originFg,
  accent: "#fbbf24",
  skyTop: "#0d0820", skyBot: "#2d1b4e",
  groundColor: "#100828", groundLineColor: "#fbbf24",
  platforms: [
    p(380, 90, 200),  p(640, 160, 160),  p(860, 90, 180),
    p(1120, 200, 140), p(1350, 120, 200), p(1640, 260, 160),
    p(1900, 160, 140), p(2100, 280, 200), p(2380, 360, 160),
    p(2620, 280, 200), p(2880, 200, 160), p(3100, 120, 180),
    p(3380, 200, 140), p(3600, 100, 160),
  ],
  npcs: [
    npc("o1", 500, 90, "fan", "First Listener", "The Internet",
      "No mentor, no map. Just a connection and a million open tabs."),
    npc("o2", 2180, 280, "founder", "Younger Self", "Origin · 2009",
      "Shipped before there was a scene. The internet was the classroom."),
    npc("o3", 3200, 120, "dev", "Ghost of Future", "foreshadowing",
      "You'll build things people couldn't even name yet. Stay curious."),
  ],
  skill: orb(2500, 360, "Self-taught", "self-taught", "#fbbf24"),
  exit: { worldX: 4000, triggered: false },
};

// ─── WORLD 2 — GRP · 2010 ────────────────────────────────────────────────────
// Tone: startup energy. Ascending platforms like a data pipeline. Peak = funded.
// Flow: street level → rapid climbing sequence → plateau → steep jump → skill high up → exit
export const LEVEL_GRP: LevelDef = {
  id: "grp", name: "GETRIGHT PRICE", year: "2010",
  worldWidth: 4200,
  bgUrl: grpBg, fgUrl: grpFg,
  accent: "#22d3ee",
  skyTop: "#050318", skyBot: "#0e1a44",
  groundColor: "#06091c", groundLineColor: "#22d3ee",
  platforms: [
    p(300, 80, 200),   p(560, 160, 140),  p(780, 80, 180),
    p(1020, 220, 120), p(1220, 160, 200), p(1500, 300, 140),
    p(1760, 220, 160), p(2000, 160, 200), p(2240, 80, 160),
    p(2460, 200, 180), p(2720, 320, 140), p(2960, 400, 200),
    p(3240, 320, 160), p(3480, 220, 200), p(3700, 120, 160),
  ],
  npcs: [
    npc("g1", 380, 80, "dev", "Co-Founder", "GetRightPrice",
      "First price comparison engine in India. Angel-backed, built in college."),
    npc("g2", 1600, 300, "investor", "Sidharth Rao", "Webchutney",
      "Backed the vision before there was traction. The first real bet."),
    npc("g3", 3050, 400, "dev", "The Crawler", "Data Pipelines",
      "The crawl never sleeps. Index everything. Catalog the internet."),
  ],
  skill: orb(2840, 320, "Data Pipelines", "crawl", "#22d3ee"),
  exit: { worldX: 4000, triggered: false },
};

// ─── WORLD 3 — HAB · 2012 ────────────────────────────────────────────────────
// Tone: boots on ground, hustling landlords. Terrain like city streets with rooftops.
// Flow: street level → climb buildings → cross gap → skill on rooftop → descend → exit
export const LEVEL_HAB: LevelDef = {
  id: "hab", name: "HAB HOUSING", year: "2012–13",
  worldWidth: 4200,
  bgUrl: habBg, fgUrl: habFg,
  accent: "#e84393",
  skyTop: "#1a0810", skyBot: "#3d1220",
  groundColor: "#1a0810", groundLineColor: "#e84393",
  platforms: [
    p(300, 100, 220),  p(600, 200, 140),
    p(820, 100, 160),  p(1060, 280, 180),
    p(1320, 180, 200), p(1600, 300, 140),
    p(1840, 200, 160), p(2060, 120, 200),
    p(2320, 260, 160), p(2580, 380, 140),
    p(2800, 280, 200), p(3060, 180, 160),
    p(3280, 280, 180), p(3540, 180, 160),
    p(3760, 100, 180),
  ],
  npcs: [
    npc("h1", 400, 100, "rider", "Tenant #1", "Early customer",
      "No broker, no nonsense. Just a clean room at a fair price."),
    npc("h2", 1700, 300, "founder", "Landlord", "Property owner",
      "The negotiation starts at 9pm and ends when everyone walks away satisfied."),
    npc("h3", 2900, 280, "fan", "Word-of-mouth", "Community",
      "₹1 crore. Zero external capital. Sold operations at the right moment."),
  ],
  skill: orb(2680, 380, "Negotiation", "negotiation", "#e84393"),
  exit: { worldX: 4000, triggered: false },
};

// ─── WORLD 4 — OCTO · 2013 ───────────────────────────────────────────────────
// Tone: AI lab. Futuristic, vertical. Platforms like server racks.
// Flow: low entrance → rapid vertical climb via server platforms → AI core at top → descent
export const LEVEL_OCTO: LevelDef = {
  id: "octo", name: "OCTO · QUARTIC.AI", year: "2013–17",
  worldWidth: 4200,
  bgUrl: earlyaiBg, fgUrl: octoFg,
  accent: "#22d3ee",
  skyTop: "#020210", skyBot: "#060620",
  groundColor: "#04041a", groundLineColor: "#22d3ee",
  platforms: [
    p(260, 80, 160),  p(480, 180, 120),
    p(680, 280, 120), p(880, 400, 100),
    p(1060, 280, 120),p(1240, 160, 120),
    p(1440, 80, 160), p(1700, 200, 140),
    p(1960, 320, 120),p(2200, 440, 120),
    p(2420, 320, 140),p(2640, 200, 160),
    p(2880, 320, 140),p(3120, 200, 180),
    p(3380, 100, 200),p(3640, 80, 160),
  ],
  npcs: [
    npc("oc1", 360, 80, "dev", "Akshaya Aron", "Co-founder",
      "Built India's first AI chatbot in 2013. Before the category had a name."),
    npc("oc2", 1160, 160, "dev", "Lead Engineer", "Octo",
      "The system learns. That was the whole bet — machines that understand intent."),
    npc("oc3", 2320, 440, "founder", "Enterprise buyer", "Post-acquisition",
      "Acquired by Quartic.ai. One chapter closes, another begins."),
  ],
  skill: orb(2300, 440, "Conversational AI", "ai-conv", "#22d3ee"),
  exit: { worldX: 4000, triggered: false },
};

// ─── WORLD 5 — INVESTOPAD ────────────────────────────────────────────────────
// Tone: vantage point. High platforms = deal visibility. Pattern matching.
// Flow: ground → ascending staircases of platforms → peak (judgment orb) → back down
export const LEVEL_INVESTOPAD: LevelDef = {
  id: "investopad", name: "INVESTOPAD", year: "Post-Octo",
  worldWidth: 4200,
  bgUrl: investopadBg, fgUrl: investopadFg,
  accent: "#fbbf24",
  skyTop: "#021008", skyBot: "#063820",
  groundColor: "#021008", groundLineColor: "#fbbf24",
  platforms: [
    // Ascending staircase west side
    p(280, 60, 200),   p(540, 130, 180),
    p(800, 200, 160),  p(1060, 280, 140),
    p(1300, 360, 120), p(1520, 440, 140),
    // Wide plateau at peak
    p(1740, 460, 400),
    // Descending east side
    p(2220, 380, 140), p(2440, 300, 160),
    p(2680, 220, 180), p(2920, 140, 200),
    p(3160, 200, 160), p(3400, 120, 180),
    p(3660, 80, 160),
  ],
  npcs: [
    npc("ip1", 380, 60, "founder", "Portfolio Founder A", "Early stage",
      "Pattern matching. The person matters more than the deck."),
    npc("ip2", 1620, 440, "investor", "Fund 0", "Investopad",
      "Both sides of the table. Operator and investor in the same room."),
    npc("ip3", 1840, 460, "founder", "Portfolio Founder B", "Series A",
      "Judgment is a muscle. You train it by seeing hundreds of stories."),
  ],
  skill: orb(1840, 460, "Judgment", "judgment", "#fbbf24"),
  exit: { worldX: 4000, triggered: false },
};

// ─── WORLD 6 — SOLESEARCH · 2018 ─────────────────────────────────────────────
// Tone: culture, energy, community. Dynamic traversal. Multiple routes.
// Flow: hype opening → split path (high/low) → converge at event platform → skill → exit
export const LEVEL_SOLESEARCH: LevelDef = {
  id: "solesearch", name: "SOLESEARCH", year: "2018–23",
  worldWidth: 4600,
  bgUrl: solesearchBg, fgUrl: solesearchFg,
  accent: "#ff6b35",
  skyTop: "#100804", skyBot: "#2d1408",
  groundColor: "#120905", groundLineColor: "#ff6b35",
  platforms: [
    // Opening energy burst
    p(240, 80, 160),   p(460, 180, 120),  p(660, 80, 180),
    // Low route (street level vibes)
    p(940, 100, 200),  p(1200, 60, 140),  p(1420, 140, 160),
    // High route (rooftop)
    p(940, 280, 180),  p(1160, 360, 140), p(1380, 280, 160),
    // Converge at event stage
    p(1660, 200, 300),
    // Event after-party section
    p(2040, 300, 140), p(2280, 400, 160), p(2520, 300, 180),
    p(2780, 200, 200), p(3060, 120, 160), p(3300, 220, 180),
    p(3560, 340, 140), p(3800, 240, 200), p(4060, 140, 180),
  ],
  npcs: [
    npc("ss1", 340, 80, "fan", "Sneakerhead", "The Community",
      "350,000+ strong. Built on shared obsession, not marketing budgets."),
    npc("ss2", 1480, 280, "dancer", "DJ", "Live Events",
      "30+ events. The culture needs a physical home to be real."),
    npc("ss3", 1760, 200, "founder", "Rannvijay Singha", "Partner",
      "$795K raised. ₹26cr+ yearly. India's sneaker culture got serious."),
    npc("ss4", 2600, 300, "trader", "Street Trader", "Drop Day",
      "Sold out in minutes. That's when you know the community is real."),
  ],
  skill: orb(2400, 400, "Community + Ops", "community", "#ff6b35"),
  exit: { worldX: 4400, triggered: false },
};

// ─── WORLD 7 — FERE · 2024 ───────────────────────────────────────────────────
// Tone: AI agents, live crypto markets. Chaotic, high-energy traversal.
// Flow: ground → chaotic scattered platforms → ascending to AI core → skill at top
export const LEVEL_FERE: LevelDef = {
  id: "fere", name: "FERE.AI", year: "2024–25",
  worldWidth: 4200,
  bgUrl: fereBg, fgUrl: fereFg,
  accent: "#22d3ee",
  skyTop: "#010818", skyBot: "#030d2e",
  groundColor: "#010818", groundLineColor: "#22d3ee",
  platforms: [
    // Scattered chaotic opening
    p(220, 120, 120),  p(400, 60, 80),   p(580, 200, 100),
    p(760, 100, 120),  p(940, 280, 80),  p(1100, 160, 100),
    p(1280, 360, 120), p(1460, 220, 80), p(1640, 100, 140),
    // Ascending sequence
    p(1880, 180, 160), p(2120, 280, 140),
    p(2360, 400, 120), p(2580, 480, 160),
    // Wide AI core
    p(2820, 400, 300),
    // Exit platforms
    p(3200, 300, 160), p(3440, 200, 180), p(3700, 100, 200),
  ],
  npcs: [
    npc("f1", 320, 120, "dev", "Agent #1", "Autonomous",
      "10 million actions at launch. The agents don't sleep."),
    npc("f2", 1740, 100, "founder", "CTO", "Fere.ai",
      "AI-native GTM for live crypto markets. Speed is the product."),
    npc("f3", 2920, 400, "investor", "Crypto Market", "Live data",
      "When the machines move faster than humans, you need to rethink everything."),
  ],
  skill: orb(2680, 480, "AI Agents", "agents", "#22d3ee"),
  exit: { worldX: 4000, triggered: false },
};

// ─── WORLD 8 — CCD · NOW ──────────────────────────────────────────────────────
// Tone: music, creativity, joy. Bouncy rhythmic platforms. Feel the beat.
// Flow: playful opening → rhythmic up/down like a melody → climax platform → skill
export const LEVEL_CCD: LevelDef = {
  id: "ccd", name: "CATS CAN DANCE", year: "Now",
  worldWidth: 4200,
  bgUrl: ccdBg, fgUrl: ccdFg,
  accent: "#ec4899",
  skyTop: "#0d0315", skyBot: "#260830",
  groundColor: "#0d0315", groundLineColor: "#ec4899",
  platforms: [
    // Rhythmic opening (like a melody going up and down)
    p(280, 100, 160),  p(500, 180, 120),
    p(720, 80, 140),   p(940, 220, 120),
    p(1160, 120, 160), p(1380, 300, 120),
    p(1600, 180, 140), p(1820, 360, 120),
    p(2040, 220, 160), p(2260, 400, 120),
    // Bridge section (sustained high)
    p(2480, 320, 280),
    // Melodic peak
    p(2840, 440, 120), p(3040, 360, 160),
    p(3260, 260, 180), p(3480, 160, 200),
    p(3720, 100, 180),
  ],
  npcs: [
    npc("c1", 380, 100, "cat", "Muse", "Cats Can Dance",
      "Original music + pet-forward brand world. The operator-artist loop, closed."),
    npc("c2", 1700, 180, "dancer", "Performer", "Live stage",
      "When the music hits right, everyone in the room becomes a dancer."),
    npc("c3", 2580, 320, "dog", "Lucky", "Mascot",
      "Every great brand has a character. Ours has four legs and no filter."),
  ],
  skill: orb(2940, 440, "Music + Brand", "music", "#ec4899"),
  exit: { worldX: 4000, triggered: false },
};

// ─── WORLD 9 — ITERATE · NOW ──────────────────────────────────────────────────
// Tone: synthesis, convergence. All skills visible. Complex but purposeful terrain.
// Flow: reflects all previous worlds — varied platforming referencing every chapter
export const LEVEL_ITERATE: LevelDef = {
  id: "iterate", name: "ITERATE", year: "Now",
  worldWidth: 4400,
  bgUrl: iterateBg, fgUrl: iterateFg,
  accent: "#f59e0b",
  skyTop: "#080510", skyBot: "#1a1030",
  groundColor: "#080510", groundLineColor: "#f59e0b",
  platforms: [
    // Echoes of every world's platforming style
    p(260, 80, 180),   // origin: gentle
    p(500, 200, 120),  // grp: startup step
    p(720, 120, 200),  // hab: building hop
    p(980, 300, 100),  // octo: vertical rack
    p(1160, 460, 140), // investopad: high vantage
    p(1380, 360, 120), // solesearch: energy drop
    p(1600, 200, 160), // fere: chaotic
    p(1860, 300, 120), // ccd: rhythmic
    // Synthesis corridor
    p(2100, 400, 240),
    // Final ascent
    p(2420, 320, 140), p(2640, 440, 120),
    p(2860, 360, 160), p(3080, 260, 180),
    p(3320, 380, 140), p(3560, 280, 200),
    p(3800, 180, 160),
  ],
  npcs: [
    npc("it1", 360, 80, "founder", "Param Minhas", "Iterate",
      "AI workflows for brand + growth. Strategy, creative, tech — one room."),
    npc("it2", 1260, 460, "dev", "The Stack", "Tools",
      "Every chapter added a layer. The synthesis is the product."),
    npc("it3", 2200, 400, "investor", "What's Next", "Open chapter",
      "The resume isn't a document. It's a direction."),
  ],
  skill: orb(2740, 440, "Synthesis", "synthesis", "#f59e0b"),
  exit: { worldX: 4200, triggered: false },
};

export const ALL_LEVELS: LevelDef[] = [
  LEVEL_ORIGIN,
  LEVEL_GRP,
  LEVEL_HAB,
  LEVEL_OCTO,
  LEVEL_INVESTOPAD,
  LEVEL_SOLESEARCH,
  LEVEL_FERE,
  LEVEL_CCD,
  LEVEL_ITERATE,
];
