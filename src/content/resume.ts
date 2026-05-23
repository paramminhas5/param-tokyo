export type SkillId =
  | "self-taught" | "crawl" | "negotiation" | "ai-conv" | "judgment"
  | "community" | "agents" | "music" | "synthesis";

export const SKILLS: Record<SkillId, {
  name: string;
  family: string;
  color: string;
  earnedInId: string;       // chapter id where it was earned
  earnedIn: string;         // pretty label
  year: string;
  howUsed: string;          // one-line "how I used it"
}> = {
  "self-taught": { name: "Self-taught",        family: "Foundations", color: "#fbbf24", earnedInId: "origin",     earnedIn: "Origin · Bengaluru",       year: "Pre-2010", howUsed: "Bias to action. Learned code, design, and music with no mentor — the OS for every chapter after." },
  "crawl":       { name: "Data pipelines",     family: "Engineering", color: "#22d3ee", earnedInId: "grp",        earnedIn: "GetRightPrice",            year: "2010",     howUsed: "Built the crawl + catalog index that powered India's first price-comparison engine." },
  "negotiation": { name: "Negotiation",        family: "Operations",  color: "#e84393", earnedInId: "hab",        earnedIn: "Hab Housing",              year: "2012–13",  howUsed: "Bootstrapped rentals to ₹1cr revenue — landlord-by-landlord, tenant-by-tenant." },
  "ai-conv":     { name: "Conversational AI",  family: "AI",          color: "#22d3ee", earnedInId: "octo",       earnedIn: "Octo · Quartic.ai",        year: "2013–17", howUsed: "Shipped one of India's first AI chatbots in 2013 — before the category had a name." },
  "judgment":    { name: "Judgment",           family: "Strategy",    color: "#fbbf24", earnedInId: "investopad", earnedIn: "Investopad",               year: "Post-Octo", howUsed: "Pattern-matched across dozens of early-stage founders. Bet-on-the-person rule lives here." },
  "community":   { name: "Community + Ops",    family: "Growth",      color: "#e84393", earnedInId: "solesearch", earnedIn: "SoleSearch",               year: "2018–23", howUsed: "Built India's sneaker community to 350K+, 30+ live events, ₹26cr+ yearly sales." },
  "agents":      { name: "AI agents",          family: "AI",          color: "#22d3ee", earnedInId: "fere",       earnedIn: "Fere.ai",                  year: "2024–25", howUsed: "AI-native GTM for autonomous agents in live crypto markets. 10M+ actions at launch." },
  "music":       { name: "Music + Brand",      family: "Creative",    color: "#fbbf24", earnedInId: "ccd",        earnedIn: "Cats Can Dance",           year: "Now",     howUsed: "Original releases + pet-forward brand world. Operator ↔ artist loop closed." },
  "synthesis":   { name: "Synthesis",          family: "Strategy",    color: "#e84393", earnedInId: "iterate",    earnedIn: "Iterate",                  year: "Now",     howUsed: "AI workflows for brand + growth. Strategy, creative, tech in one room." },
};

export type MiniGameKind = "timing" | "tap" | "sort";

export type PropKind =
  | "tree" | "house" | "antenna" | "building" | "rack" | "vault"
  | "shoe" | "mic" | "ladder" | "platform" | "sign" | "crate";

export type NpcKind = "founder" | "dev" | "dancer" | "trader" | "fan" | "investor" | "cat" | "dog" | "rider";

export interface Chapter {
  id: string;
  index: number;
  year: string;
  role: string;
  org: string;
  /** 2-line cliff note shown in the corner card. The only narration in-world. */
  cliff: string;
  /** Long-form (kept for /cv only) */
  hook: string;
  paragraphs: string[];
  outcomes: string[];
  builtOn: SkillId[];
  skill: SkillId;
  /** Skills the player can pick up while walking through this world (in path order). */
  pickups: SkillId[];
  /** NPCs sprinkled across the world. x in 0–100 (horizontal % of the playfield). */
  npcs: Array<{ x: number; kind: NpcKind; label?: string }>;
  /** Foreground props along the path. x in 0–100, scale 0.7–1.6 */
  props: Array<{ x: number; kind: PropKind; scale?: number }>;
  mini: { kind: MiniGameKind; prompt: string; success: string };
  theme: { sky: string; ground: string; accent: string; silhouette: string };
}

export const HERO = {
  name: "Param Minhas",
  tagline: "Founder. Operator. 15 years of building.",
  bio: "E-commerce → real estate → conversational AI → sneaker culture → AI-native marketing. Currently building Iterate and Cats Can Dance.",
  email: "param@catscandance.com",
  location: "Bengaluru · Open to remote / EU / US",
  links: {
    linkedin: "https://linkedin.com/in/paramminhas",
    twitter: "https://x.com/paramminhas",
    site: "https://catscandance.com",
  },
  stats: [
    { label: "SoleSearch yearly sales", value: "₹26cr+" },
    { label: "Raised (SoleSearch)", value: "$795K" },
    { label: "Sponsorships closed", value: "₹1cr+" },
    { label: "Live events produced", value: "30+" },
    { label: "Community followers", value: "350K+" },
    { label: "Founder + operator", value: "15 yrs" },
  ],
};

export const SKILL_GROUPS: { title: string; items: string[] }[] = [
  { title: "Strategy & Leadership", items: ["Founder ops", "Product strategy", "Fundraising", "Storytelling", "Vision", "First-principles", "Hiring", "Brand strategy"] },
  { title: "Design & Direction", items: ["Creative direction", "Brand identity", "Art direction", "UI / UX", "Visual systems", "Taste", "Typography"] },
  { title: "Engineering & AI", items: ["Full-stack", "Conversational AI", "LLM tooling", "AI prompting", "Data pipelines", "Web scraping", "Rapid prototyping"] },
  { title: "Music & Performance", items: ["Music production", "Mixing", "Live performance", "Sound design", "DJing"] },
  { title: "Growth & Marketing", items: ["Community building", "Content", "Distribution", "AI-powered marketing", "Growth storytelling", "Brand sponsorships", "Influencer marketing", "Partnerships"] },
  { title: "Tools", items: ["Figma", "Cursor", "Claude / GPT", "TypeScript", "React", "Node", "Postgres", "Ableton Live", "Logic Pro", "Notion"] },
];

export const PRESS = [
  { outlet: "CNBC-TV18", title: "SoleSearch: Building India's sneaker culture from the ground up" },
  { outlet: "YourStory", title: "From Bengaluru to boardroom: Param Minhas on 15 years of building" },
  { outlet: "Inc42", title: "SoleSearch raises $795K to scale India's first sneaker marketplace" },
  { outlet: "Economic Times", title: "Rannvijay Singha backs SoleSearch, India's streetwear-first platform" },
  { outlet: "Quartic.ai", title: "Octo acquired — founding team joins Quartic.ai" },
];

export const COMPANIES = [
  "Meesho", "Entri", "Simsim", "Amazon", "Forbes", "Royal Enfield", "boAt",
  "Budweiser", "CNBC-TV18", "YourStory", "Inc42", "Economic Times",
  "Quartic.ai", "Fere.ai", "Investopad", "SoleSearch",
];

export const CHAPTERS: Chapter[] = [
  {
    id: "origin", index: 1, year: "Pre-2010", role: "Beginning", org: "Bengaluru",
    cliff: "No mentor. No internship. The internet was the teacher, shipping was the homework.",
    hook: "Self-taught across code, design, and music. Shipped before there was a scene.",
    paragraphs: [
      "No formal mentor, no internship pipeline. The internet was the teacher and shipping was the homework.",
      "Why it mattered: it set the operating system — bias to action, taste built by making, and the conviction that you can learn anything if you stay in the room long enough.",
    ],
    outcomes: ["Code", "Design", "Music"],
    skill: "self-taught",
    builtOn: [],
    pickups: ["self-taught"],
    npcs: [{ x: 78, kind: "fan", label: "First listener" }],
    mini: { kind: "tap", prompt: "Tap the moving target to ship your first build.", success: "First build shipped." },
    theme: { sky: "#2d1b4e", ground: "#1a0f33", accent: "#fbbf24", silhouette: "#0e0820" },
    props: [{ x: 18, kind: "tree" }, { x: 38, kind: "house" }, { x: 58, kind: "ladder", scale: 1.2 }, { x: 82, kind: "antenna" }],
  },
  {
    id: "grp", index: 2, year: "2010", role: "Founding member", org: "GetRightPrice",
    cliff: "India's first price-comparison engine. Built in college. Angel-backed by Sidharth Rao.",
    hook: "India's first price-comparison engine. Angel-backed, built in college.",
    paragraphs: [
      "Joined the founding team while still in college. Built the catalog and the crawl pipeline.",
      "First taste of building infrastructure at the edge of what was technically possible in 2010.",
    ],
    outcomes: ["Angel-backed by Sidharth Rao (Webchutney)", "Built catalog + crawl pipeline", "First price-comparison engine in India"],
    skill: "crawl",
    builtOn: ["self-taught"],
    pickups: ["crawl"],
    npcs: [{ x: 28, kind: "dev", label: "Co-founder" }, { x: 72, kind: "investor", label: "Sidharth Rao" }],
    mini: { kind: "sort", prompt: "Sort 3 falling price tags into the right product bucket.", success: "Catalog indexed." },
    theme: { sky: "#1e1144", ground: "#10082a", accent: "#22d3ee", silhouette: "#080418" },
    props: [{ x: 18, kind: "building" }, { x: 40, kind: "building", scale: 1.3 }, { x: 60, kind: "crate" }, { x: 82, kind: "building" }],
  },
  {
    id: "hab", index: 3, year: "2012–13", role: "Founder", org: "Hab Housing",
    cliff: "Bootstrapped rental housing across Bengaluru. ₹1 crore revenue, zero external capital.",
    hook: "Bootstrapped rental housing across Bengaluru. ₹1Cr revenue. Sold operations.",
    paragraphs: [
      "Standardised budget rentals when the market was a fragmented mess of brokers.",
      "Lesson in unit economics, distribution, and humans-showing-up service ops.",
    ],
    outcomes: ["₹1Cr revenue", "Zero external capital", "Operations sold"],
    skill: "negotiation",
    builtOn: ["self-taught","crawl"],
    pickups: ["negotiation"],
    npcs: [{ x: 32, kind: "rider", label: "Tenant" }, { x: 68, kind: "founder", label: "Landlord" }],
    mini: { kind: "timing", prompt: "Stop the meter in the green zone. Twice.", success: "Deal closed." },
    theme: { sky: "#c2956b", ground: "#5a2f1f", accent: "#e84393", silhouette: "#2a1810" },
    props: [{ x: 14, kind: "house" }, { x: 38, kind: "sign" }, { x: 58, kind: "house", scale: 1.2 }, { x: 78, kind: "platform" }, { x: 90, kind: "house" }],
  },
  {
    id: "octo", index: 4, year: "2013–17", role: "Founding team · Director of Marketing", org: "Octo · Quartic.ai",
    cliff: "Co-built one of India's first AI chatbots in 2013. Acquired by Quartic.ai.",
    hook: "Built one of India's first AI chatbots in 2013. Co-built Octo. Acquired by Quartic.ai.",
    paragraphs: [
      "Shipped conversational AI before the category had a name in India. Co-built Octo with Akshaya Aron.",
      "Distribution, integration, post-sale ownership. Octo was acquired by Quartic.ai.",
    ],
    outcomes: ["First AI chatbot in India (2013)", "Octo acquired by Quartic.ai", "Director of Marketing post-acquisition"],
    skill: "ai-conv",
    builtOn: ["self-taught","crawl"],
    pickups: ["ai-conv"],
    npcs: [{ x: 22, kind: "dev", label: "Akshaya" }, { x: 58, kind: "dev", label: "Engineer" }, { x: 84, kind: "founder", label: "Enterprise buyer" }],
    mini: { kind: "sort", prompt: "Route 3 messages to the right intent.", success: "Bot trained." },
    theme: { sky: "#0a0a24", ground: "#06061a", accent: "#22d3ee", silhouette: "#020210" },
    props: [{ x: 14, kind: "rack" }, { x: 34, kind: "rack" }, { x: 56, kind: "antenna" }, { x: 76, kind: "rack" }, { x: 92, kind: "building" }],
  },
  {
    id: "investopad", index: 5, year: "Post-Octo", role: "Partner · Growth & Tech", org: "Investopad",
    cliff: "Built Fund 0. Both sides of the table — operator and investor at the same time.",
    hook: "Built Fund 0. Worked with founders across the stack.",
    paragraphs: [
      "Joined Investopad to help build Fund 0 and work hands-on with portfolio founders on growth and tech.",
      "Pattern-matching across dozens of early-stage companies. Bet-on-the-person rule lives here.",
    ],
    outcomes: ["Built Fund 0", "Hands-on with growth + tech", "Portfolio breadth: e-commerce, AI, fintech"],
    skill: "judgment",
    builtOn: ["self-taught","crawl","negotiation","ai-conv"],
    pickups: ["judgment"],
    npcs: [{ x: 24, kind: "founder", label: "Portfolio founder" }, { x: 56, kind: "investor" }, { x: 84, kind: "founder", label: "Another founder" }],
    mini: { kind: "sort", prompt: "Sort 3 pitches: yes / no / maybe.", success: "Memo written." },
    theme: { sky: "#064e3b", ground: "#031f17", accent: "#fbbf24", silhouette: "#01100c" },
    props: [{ x: 16, kind: "vault" }, { x: 40, kind: "building" }, { x: 62, kind: "vault" }, { x: 86, kind: "building" }],
  },
  {
    id: "solesearch", index: 6, year: "2018–23", role: "Co-founder & CEO", org: "SoleSearch",
    cliff: "Built India's sneaker culture from the ground up. $795K raised. ₹26cr+ yearly sales.",
    hook: "Built India's sneaker culture from the ground up. $795K raised. ₹26cr+ yearly sales.",
    paragraphs: [
      "Co-founded with Prabal Baghla; Rannvijay Singha joined as partner. Raised $795K. 30+ live events. 350K+ community.",
      "Royal Enfield, boAt, Budweiser sponsorships. Retail in Mumbai and Hyderabad. CNBC-TV18.",
    ],
    outcomes: ["$795K raised", "₹26cr+ yearly sales", "30+ live events", "350K+ community", "Retail in 2 cities", "CNBC-TV18 feature"],
    skill: "community",
    builtOn: ["self-taught","negotiation","judgment"],
    pickups: ["community"],
    npcs: [{ x: 18, kind: "fan", label: "Sneakerhead" }, { x: 38, kind: "fan" }, { x: 56, kind: "founder", label: "Rannvijay" }, { x: 80, kind: "dancer", label: "DJ" }],
    mini: { kind: "tap", prompt: "Drop day. Tap sneakers as they appear — don't miss.", success: "Sold out in minutes." },
    theme: { sky: "#ff6b35", ground: "#3a0a1f", accent: "#fbbf24", silhouette: "#1a0510" },
    props: [{ x: 14, kind: "shoe" }, { x: 30, kind: "shoe", scale: 1.3 }, { x: 50, kind: "platform" }, { x: 70, kind: "shoe" }, { x: 88, kind: "shoe" }],
  },
  {
    id: "fere", index: 7, year: "2024–25", role: "Growth & Marketing Partner", org: "Fere.ai",
    cliff: "Autonomous agents for crypto markets. $1.3M raised. 10M+ actions at launch.",
    hook: "Autonomous agents for crypto markets. $1.3M raised. 10M+ actions at launch.",
    paragraphs: [
      "Rejoined Akshaya Aron a decade after Octo. AI-native GTM for autonomous agents in live crypto markets.",
      "Raised $1.3M led by Ethereal Ventures. 10M+ agent actions at launch.",
    ],
    outcomes: ["$1.3M raised (Ethereal Ventures)", "10M+ agent actions at launch", "AI-native GTM playbook"],
    skill: "agents",
    builtOn: ["self-taught","ai-conv","judgment","community"],
    pickups: ["agents"],
    npcs: [{ x: 26, kind: "dev", label: "Agent engineer" }, { x: 64, kind: "trader", label: "Live market" }],
    mini: { kind: "sort", prompt: "Chain 3 actions into a valid agent sequence.", success: "Agent deployed." },
    theme: { sky: "#1a1a3e", ground: "#0a0a20", accent: "#22d3ee", silhouette: "#04040f" },
    props: [{ x: 16, kind: "rack" }, { x: 40, kind: "antenna" }, { x: 64, kind: "rack" }, { x: 86, kind: "antenna" }],
  },
  {
    id: "ccd", index: 8, year: "Now", role: "Founder", org: "Cats Can Dance",
    cliff: "Music label + pet culture brand. The chapter where operator and artist finally meet.",
    hook: "Music label + pet culture brand. The work that exists because it has to.",
    paragraphs: [
      "Original music releases, a pet-forward brand world, and live events that double as creative IP.",
      "Operator ↔ artist loop closed — the skills compound across mediums.",
    ],
    outcomes: ["Original music releases", "Live events + creative IP", "Pet-forward brand world"],
    skill: "music",
    builtOn: ["self-taught","community"],
    pickups: ["music"],
    npcs: [{ x: 22, kind: "dancer" }, { x: 44, kind: "cat" }, { x: 64, kind: "cat" }, { x: 84, kind: "dancer" }],
    mini: { kind: "timing", prompt: "Tap on every beat. 8 bars.", success: "Track dropped." },
    theme: { sky: "#1a1a2e", ground: "#0f0a1f", accent: "#22d3ee", silhouette: "#070512" },
    props: [{ x: 16, kind: "mic" }, { x: 38, kind: "platform", scale: 1.3 }, { x: 60, kind: "mic" }, { x: 84, kind: "rack" }],
  },
  {
    id: "iterate", index: 9, year: "Now", role: "Founder", org: "Iterate",
    cliff: "AI-native marketing agency. Every prior chapter feeds this one.",
    hook: "AI-native marketing agency. Speed × strategy × creativity.",
    paragraphs: [
      "AI workflows for brand and growth. Strategy, creative, and tech in one room.",
      "Built on 15 years of operator instinct. Operator-led, AI-native.",
    ],
    outcomes: ["AI workflows for brand + growth", "Strategy + creative + tech in one room", "15 years of operator instinct"],
    skill: "synthesis",
    builtOn: ["self-taught","crawl","negotiation","ai-conv","judgment","community","agents","music"],
    pickups: ["synthesis"],
    npcs: [{ x: 28, kind: "dev" }, { x: 52, kind: "founder", label: "Client" }, { x: 78, kind: "dancer", label: "Creative" }],
    mini: { kind: "sort", prompt: "Assemble a campaign: pick 3 of 6 modules.", success: "Campaign live." },
    theme: { sky: "#2d1b4e", ground: "#1a0f33", accent: "#e84393", silhouette: "#0e0820" },
    props: [{ x: 16, kind: "building" }, { x: 38, kind: "antenna" }, { x: 60, kind: "platform", scale: 1.3 }, { x: 84, kind: "building" }],
  },
];
