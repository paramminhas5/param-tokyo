export type SkillId =
  | "self-taught" | "crawl" | "negotiation" | "ai-conv" | "judgment"
  | "community" | "agents" | "music" | "synthesis";

export const SKILLS: Record<SkillId, { name: string; color: string }> = {
  "self-taught": { name: "Self-taught", color: "#fbbf24" },
  "crawl":       { name: "Data pipelines", color: "#22d3ee" },
  "negotiation": { name: "Negotiation", color: "#e84393" },
  "ai-conv":     { name: "Conversational AI", color: "#22d3ee" },
  "judgment":    { name: "Judgment", color: "#fbbf24" },
  "community":   { name: "Community + Ops", color: "#e84393" },
  "agents":      { name: "AI agents", color: "#22d3ee" },
  "music":       { name: "Music + Brand", color: "#fbbf24" },
  "synthesis":   { name: "Synthesis", color: "#e84393" },
};

export type MiniGameKind = "timing" | "tap" | "sort";

export interface Chapter {
  id: string;
  index: number;
  year: string;
  role: string;
  org: string;
  hook: string;
  paragraphs: string[];
  outcomes: string[];
  skill: SkillId;
  mini: { kind: MiniGameKind; prompt: string; success: string };
  theme: { sky: string; ground: string; accent: string; silhouette: string };
  props: Array<{ x: number; kind: PropKind }>;
}

export type PropKind =
  | "tree" | "house" | "antenna" | "building" | "rack" | "vault"
  | "shoe" | "mic" | "ladder" | "platform" | "sign" | "crate";

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
    hook: "Self-taught across code, design, and music. Shipped before there was a scene.",
    paragraphs: [
      "No formal mentor, no internship pipeline. The internet was the teacher and shipping was the homework.",
      "Why it mattered: it set the operating system — bias to action, taste built by making, and the conviction that you can learn anything if you stay in the room long enough.",
    ],
    outcomes: ["Code", "Design", "Music"],
    skill: "self-taught",
    mini: { kind: "tap", prompt: "Tap the moving target to ship your first build.", success: "First build shipped." },
    theme: { sky: "#2d1b4e", ground: "#1a0f33", accent: "#fbbf24", silhouette: "#0e0820" },
    props: [{ x: 30, kind: "tree" }, { x: 110, kind: "house" }, { x: 180, kind: "ladder" }, { x: 220, kind: "antenna" }],
  },
  {
    id: "grp", index: 2, year: "2010", role: "Founding member", org: "GetRightPrice",
    hook: "India's first price-comparison engine. Angel-backed, built in college.",
    paragraphs: [
      "Joined the founding team while still in college. Built the catalog and the crawl pipeline that powered the comparison index across categories.",
      "Why it mattered: first taste of building infrastructure at the edge of what was technically possible in India in 2010, on a shoestring, against incumbents who didn't see e-commerce coming.",
    ],
    outcomes: ["Angel-backed by Sidharth Rao (Webchutney)", "Built catalog + crawl pipeline", "First price-comparison engine in India"],
    skill: "crawl",
    mini: { kind: "sort", prompt: "Sort 3 falling price tags into the right product bucket.", success: "Catalog indexed." },
    theme: { sky: "#1e1144", ground: "#10082a", accent: "#22d3ee", silhouette: "#080418" },
    props: [{ x: 30, kind: "building" }, { x: 80, kind: "building" }, { x: 140, kind: "crate" }, { x: 200, kind: "building" }],
  },
  {
    id: "hab", index: 3, year: "2012–13", role: "Founder", org: "Hab Housing",
    hook: "Bootstrapped rental housing across Bengaluru. ₹1Cr revenue. Sold operations.",
    paragraphs: [
      "Standardised budget rentals at a time when the market was a fragmented mess of brokers and word-of-mouth. Built the listings, the ops, and the trust layer simultaneously.",
      "Why it mattered: a real lesson in unit economics, distribution, and how to scale a service business that depends on humans showing up. Hit ₹1 crore in revenue with zero external capital, then sold operations and moved on.",
    ],
    outcomes: ["₹1Cr revenue", "Zero external capital", "Operations sold"],
    skill: "negotiation",
    mini: { kind: "timing", prompt: "Stop the meter in the green zone. Twice.", success: "Deal closed." },
    theme: { sky: "#c2956b", ground: "#5a2f1f", accent: "#e84393", silhouette: "#2a1810" },
    props: [{ x: 30, kind: "house" }, { x: 90, kind: "sign" }, { x: 140, kind: "house" }, { x: 200, kind: "platform" }, { x: 240, kind: "house" }],
  },
  {
    id: "octo", index: 4, year: "2013–17", role: "Founding team, Director of Marketing", org: "Octo · Quartic.ai",
    hook: "Built one of India's first AI chatbots in 2013. Co-built Octo. Acquired by Quartic.ai.",
    paragraphs: [
      "Shipped a conversational AI product before the category had a name in India. Co-built Octo with Akshaya Aron — an AI marketing platform that put the technology in front of real customers.",
      "Why it mattered: this is the chapter that taught what enterprise-grade AI actually looks like — distribution, integration, post-sale ownership. Octo was acquired by Quartic.ai; led post-acquisition marketing as Director.",
    ],
    outcomes: ["First AI chatbot in India (2013)", "Octo acquired by Quartic.ai", "Director of Marketing post-acquisition"],
    skill: "ai-conv",
    mini: { kind: "sort", prompt: "Route 3 messages to the right intent.", success: "Bot trained." },
    theme: { sky: "#0a0a24", ground: "#06061a", accent: "#22d3ee", silhouette: "#020210" },
    props: [{ x: 30, kind: "rack" }, { x: 80, kind: "rack" }, { x: 140, kind: "antenna" }, { x: 200, kind: "rack" }, { x: 240, kind: "building" }],
  },
  {
    id: "investopad", index: 5, year: "Post-Octo", role: "Partner · Growth & Tech", org: "Investopad",
    hook: "Built Fund 0. Worked with founders across the stack.",
    paragraphs: [
      "Joined Investopad to help build Fund 0 and work hands-on with portfolio founders on growth and tech. Both sides of the table — operator and investor — at the same time.",
      "Why it mattered: pattern-matching across dozens of early-stage companies sharpens judgment in a way that no single operating role can. The bet-on-the-person rule comes from this chapter.",
    ],
    outcomes: ["Built Fund 0", "Hands-on with growth + tech", "Portfolio breadth: e-commerce, AI, fintech"],
    skill: "judgment",
    mini: { kind: "sort", prompt: "Sort 3 pitches: yes / no / maybe.", success: "Memo written." },
    theme: { sky: "#064e3b", ground: "#031f17", accent: "#fbbf24", silhouette: "#01100c" },
    props: [{ x: 30, kind: "vault" }, { x: 90, kind: "building" }, { x: 150, kind: "vault" }, { x: 220, kind: "building" }],
  },
  {
    id: "solesearch", index: 6, year: "2018–23", role: "Co-founder & CEO", org: "SoleSearch",
    hook: "Built India's sneaker culture from the ground up. $795K raised. ₹26cr+ yearly sales.",
    paragraphs: [
      "Co-founded with Prabal Baghla; Rannvijay Singha joined as partner. Raised $795K from Venture Catalysts, Anthill Ventures, Cornerstone. Ran 30+ live events. Drove ₹26cr+ in yearly sales and ₹1cr+ in sponsorships from Royal Enfield, boAt, Budweiser and 40+ homegrown labels.",
      "Built SoleSearch Street to give homegrown brands a real shelf. Grew the community to 350K+, opened retail in Mumbai and Hyderabad, ended up on CNBC-TV18.",
      "Why it mattered: first time anyone in India treated sneakers and street culture as a venture-scale category. Built the playbook everyone now copies.",
    ],
    outcomes: ["$795K raised", "₹26cr+ yearly sales", "30+ live events", "350K+ community", "Retail in 2 cities", "CNBC-TV18 feature"],
    skill: "community",
    mini: { kind: "tap", prompt: "Drop day. Tap sneakers as they appear — don't miss.", success: "Sold out in minutes." },
    theme: { sky: "#ff6b35", ground: "#3a0a1f", accent: "#fbbf24", silhouette: "#1a0510" },
    props: [{ x: 30, kind: "shoe" }, { x: 80, kind: "shoe" }, { x: 140, kind: "platform" }, { x: 190, kind: "shoe" }, { x: 240, kind: "shoe" }],
  },
  {
    id: "fere", index: 7, year: "2024–25", role: "Growth & Marketing Partner", org: "Fere.ai",
    hook: "Autonomous agents for crypto markets. $1.3M raised. 10M+ actions at launch.",
    paragraphs: [
      "Rejoined Akshaya Aron a decade after Octo / Quartic.ai. Built the growth and marketing strategy for Fere.ai — autonomous agents operating in live crypto markets.",
      "Why it mattered: a year of doing AI-native go-to-market for genuinely novel agent infrastructure. Fere.ai raised $1.3M led by Ethereal Ventures and processed 10M+ autonomous agent actions on launch.",
    ],
    outcomes: ["$1.3M raised (Ethereal Ventures)", "10M+ agent actions at launch", "AI-native GTM playbook"],
    skill: "agents",
    mini: { kind: "sort", prompt: "Chain 3 actions into a valid agent sequence.", success: "Agent deployed." },
    theme: { sky: "#1a1a3e", ground: "#0a0a20", accent: "#22d3ee", silhouette: "#04040f" },
    props: [{ x: 30, kind: "rack" }, { x: 90, kind: "antenna" }, { x: 150, kind: "rack" }, { x: 220, kind: "antenna" }],
  },
  {
    id: "ccd", index: 8, year: "Now", role: "Founder", org: "Cats Can Dance",
    hook: "Music label + pet culture brand. The work that exists because it has to.",
    paragraphs: [
      "Original music releases, a pet-forward brand world, and live events that double as creative IP.",
      "Why it mattered: the chapter that closes the loop between operator and artist — proof that the skills compound across mediums.",
    ],
    outcomes: ["Original music releases", "Live events + creative IP", "Pet-forward brand world"],
    skill: "music",
    mini: { kind: "timing", prompt: "Tap on every beat. 8 bars.", success: "Track dropped." },
    theme: { sky: "#1a1a2e", ground: "#0f0a1f", accent: "#22d3ee", silhouette: "#070512" },
    props: [{ x: 30, kind: "mic" }, { x: 90, kind: "platform" }, { x: 150, kind: "mic" }, { x: 210, kind: "rack" }],
  },
  {
    id: "iterate", index: 9, year: "Now", role: "Founder", org: "Iterate",
    hook: "AI-native marketing agency. Speed × strategy × creativity.",
    paragraphs: [
      "AI workflows for brand and growth. Strategy, creative, and tech in one room. Built on 15 years of operator instinct.",
      "Why it mattered — and why it's now: every prior chapter feeds this one. Operator-led, AI-native, with the taste and the technical depth to actually ship.",
    ],
    outcomes: ["AI workflows for brand + growth", "Strategy + creative + tech in one room", "15 years of operator instinct"],
    skill: "synthesis",
    mini: { kind: "sort", prompt: "Assemble a campaign: pick 3 of 6 modules.", success: "Campaign live." },
    theme: { sky: "#2d1b4e", ground: "#1a0f33", accent: "#e84393", silhouette: "#0e0820" },
    props: [{ x: 30, kind: "building" }, { x: 90, kind: "antenna" }, { x: 150, kind: "platform" }, { x: 210, kind: "building" }],
  },
];