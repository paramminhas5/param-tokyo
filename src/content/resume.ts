/**
 * Resume content — the single source of truth for all pages.
 * Rich narrative content for interactive scroll-driven experience.
 */

export interface Skill {
  name: string;
  family: string;
  color: string;
}

export interface Chapter {
  id: string;
  index: number;
  year: string;
  role: string;
  org: string;
  /** 2-line cliff note — primary narration in-world */
  cliff: string;
  /** One-line hook for cards/previews */
  hook: string;
  /** Full narrative paragraphs */
  paragraphs: string[];
  /** Key outcomes / achievements */
  outcomes: string[];
  /** Skill earned in this chapter */
  skill: Skill;
  /** Skills this chapter built on */
  builtOn: string[];
  /** Theme colors */
  theme: { accent: string; ink: string };
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
      "Learned to code from online forums. Learned design by making posters for local bands. Learned music by staying up until 4am in Ableton.",
      "Why it mattered: it set the operating system — bias to action, taste built by making, and the conviction that you can learn anything if you stay in the room long enough.",
    ],
    outcomes: ["Self-taught code", "Self-taught design", "Self-taught music production", "Bias to action established"],
    skill: { name: "Self-taught", family: "Foundations", color: "#fbbf24" },
    builtOn: [],
    theme: { accent: "#fbbf24", ink: "#1a1a2e" },
  },
  {
    id: "grp", index: 2, year: "2010", role: "Founding member", org: "GetRightPrice",
    cliff: "India's first price-comparison engine. Built in college. Angel-backed by Sidharth Rao.",
    hook: "India's first price-comparison engine. Angel-backed, built in college.",
    paragraphs: [
      "Joined the founding team while still in college. Built the catalog and the crawl pipeline from scratch.",
      "First taste of building infrastructure at the edge of what was technically possible in 2010 India.",
      "Sidharth Rao (Webchutney founder) angel-backed us. That signal mattered — it meant someone believed the internet could reshape Indian commerce.",
    ],
    outcomes: ["Angel-backed by Sidharth Rao (Webchutney)", "Built catalog + crawl pipeline", "First price-comparison engine in India", "Learned data at scale"],
    skill: { name: "Data Pipelines", family: "Engineering", color: "#22d3ee" },
    builtOn: ["Self-taught"],
    theme: { accent: "#22d3ee", ink: "#1a1a2e" },
  },
  {
    id: "hab", index: 3, year: "2012–13", role: "Founder", org: "Hab Housing",
    cliff: "Bootstrapped rental housing across Bengaluru. ₹1 crore revenue, zero external capital.",
    hook: "Bootstrapped rental housing across Bengaluru. ₹1Cr revenue. Sold operations.",
    paragraphs: [
      "Standardised budget rentals when the market was a fragmented mess of brokers and word-of-mouth.",
      "Went door-to-door signing up landlords. Built a listing system. Matched tenants. Handled deposits, repairs, disputes.",
      "Hit ₹1 crore revenue with zero external capital. Sold operations. The lesson: unit economics don't care about your vision — they care about your math.",
    ],
    outcomes: ["₹1Cr revenue", "Zero external capital", "Operations sold", "80+ properties managed", "Bootstrapping masterclass"],
    skill: { name: "Negotiation", family: "Operations", color: "#e84393" },
    builtOn: ["Self-taught", "Data Pipelines"],
    theme: { accent: "#e84393", ink: "#1a1a2e" },
  },
  {
    id: "octo", index: 4, year: "2013–17", role: "Founding team · Director of Marketing", org: "Octo · Quartic.ai",
    cliff: "Co-built one of India's first AI chatbots in 2013. Acquired by Quartic.ai.",
    hook: "Built one of India's first AI chatbots in 2013. Acquired by Quartic.ai.",
    paragraphs: [
      "Shipped conversational AI before the category had a name in India. 2013. No GPT, no LLMs — just NLP, intent classification, and a lot of belief.",
      "Co-built Octo with Akshaya Aron. Handled distribution, integration partnerships, post-sale ownership. Enterprise buyers didn't know they needed a chatbot until we showed them.",
      "Octo was acquired by Quartic.ai. Stayed on as Director of Marketing through the integration. First exit.",
    ],
    outcomes: ["First AI chatbot in India (2013)", "Octo acquired by Quartic.ai", "Director of Marketing post-acquisition", "Enterprise AI distribution", "First exit"],
    skill: { name: "Conversational AI", family: "AI", color: "#22d3ee" },
    builtOn: ["Self-taught", "Data Pipelines"],
    theme: { accent: "#22d3ee", ink: "#0a0a1e" },
  },
  {
    id: "investopad", index: 5, year: "Post-Octo", role: "Partner · Growth & Tech", org: "Investopad",
    cliff: "Built Fund 0. Both sides of the table — operator and investor at the same time.",
    hook: "Built Fund 0. Worked with founders across the stack.",
    paragraphs: [
      "Joined Investopad to help build Fund 0 and work hands-on with portfolio founders on growth and tech.",
      "Saw dozens of pitches, helped shape go-to-market for early-stage companies across e-commerce, AI, and fintech.",
      "The lesson: pattern-matching across companies teaches judgment faster than running one. But the operator itch never goes away.",
    ],
    outcomes: ["Built Fund 0", "Hands-on with growth + tech", "Portfolio breadth: e-commerce, AI, fintech", "Judgment muscle built", "Both sides of the table"],
    skill: { name: "Judgment", family: "Strategy", color: "#fbbf24" },
    builtOn: ["Self-taught", "Data Pipelines", "Negotiation", "Conversational AI"],
    theme: { accent: "#fbbf24", ink: "#0a1a14" },
  },
  {
    id: "solesearch", index: 6, year: "2018–23", role: "Co-founder & CEO", org: "SoleSearch",
    cliff: "Built India's sneaker culture from the ground up. $795K raised. ₹26cr+ yearly sales.",
    hook: "Built India's sneaker culture from the ground up. $795K raised. ₹26cr+ yearly sales.",
    paragraphs: [
      "Co-founded with Prabal Baghla. Rannvijay Singha joined as partner. Raised $795K.",
      "30+ live events. 350K+ community. Royal Enfield, boAt, Budweiser sponsorships. Retail in Mumbai and Hyderabad.",
      "Built the culture before the marketplace. CNBC-TV18, YourStory, Inc42 covered us. India's sneaker moment happened because someone decided to build it.",
    ],
    outcomes: ["$795K raised", "₹26cr+ yearly sales", "30+ live events", "350K+ community", "Retail in 2 cities", "CNBC-TV18 feature", "Rannvijay Singha partner"],
    skill: { name: "Community + Ops", family: "Growth", color: "#e84393" },
    builtOn: ["Self-taught", "Negotiation", "Judgment"],
    theme: { accent: "#ff6b35", ink: "#1a0a10" },
  },
  {
    id: "fere", index: 7, year: "2024–25", role: "Growth & Marketing Partner", org: "Fere.ai",
    cliff: "Autonomous agents for crypto markets. $1.3M raised. 10M+ actions at launch.",
    hook: "Autonomous agents for crypto markets. $1.3M raised. 10M+ actions at launch.",
    paragraphs: [
      "Rejoined Akshaya Aron a decade after Octo. The band got back together — this time for autonomous AI agents in live crypto markets.",
      "Raised $1.3M led by Ethereal Ventures. AI-native GTM playbook — no ads, no cold email. Let the agents show their work.",
      "10M+ agent actions at launch. The thesis: the next wave of SaaS isn't software you use — it's software that acts.",
    ],
    outcomes: ["$1.3M raised (Ethereal Ventures)", "10M+ agent actions at launch", "AI-native GTM playbook", "Reunion with Octo co-founder", "Crypto + AI intersection"],
    skill: { name: "AI Agents", family: "AI", color: "#22d3ee" },
    builtOn: ["Self-taught", "Conversational AI", "Judgment", "Community + Ops"],
    theme: { accent: "#22d3ee", ink: "#0a0a20" },
  },
  {
    id: "ccd", index: 8, year: "Now", role: "Founder", org: "Cats Can Dance",
    cliff: "Music label + pet culture brand. The chapter where operator and artist finally meet.",
    hook: "Music label + pet culture brand. The work that exists because it has to.",
    paragraphs: [
      "Original music releases. A pet-forward brand world. Live events that double as creative IP.",
      "This is where operator meets artist. 15 years of building companies taught the systems; the music is what the systems are for.",
      "Cats Can Dance is proof that the loop closes. Strategy, creative, distribution — all one muscle now.",
    ],
    outcomes: ["Original music releases", "Live events + creative IP", "Pet-forward brand world", "Operator ↔ artist loop closed", "Brand building from scratch"],
    skill: { name: "Music + Brand", family: "Creative", color: "#fbbf24" },
    builtOn: ["Self-taught", "Community + Ops"],
    theme: { accent: "#ec4899", ink: "#1a1a2e" },
  },
  {
    id: "iterate", index: 9, year: "Now", role: "Founder", org: "Iterate",
    cliff: "AI-native marketing agency. Every prior chapter feeds this one.",
    hook: "AI-native marketing agency. Speed × strategy × creativity.",
    paragraphs: [
      "AI workflows for brand and growth. Strategy, creative, and tech in one room. No department silos.",
      "Built on 15 years of operator instinct: what to build, how to distribute, when to pivot, who to bet on.",
      "Iterate is the synthesis — every skill from every chapter converges. This is what compound experience looks like in practice.",
    ],
    outcomes: ["AI workflows for brand + growth", "Strategy + creative + tech unified", "15 years of operator instinct", "Every prior skill compounds here", "AI-native from day one"],
    skill: { name: "Synthesis", family: "Strategy", color: "#e84393" },
    builtOn: ["Self-taught", "Data Pipelines", "Negotiation", "Conversational AI", "Judgment", "Community + Ops", "AI Agents", "Music + Brand"],
    theme: { accent: "#f59e0b", ink: "#1a1a2e" },
  },
];
