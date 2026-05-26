/**
 * Resume content — the single source of truth for all pages.
 * Stripped of Pokemon-era game mechanics (NPCs, props, mini-games).
 * Focused on narrative, career data, and visual theming.
 */

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
  paragraphs: string[];
  outcomes: string[];
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
      "Why it mattered: it set the operating system — bias to action, taste built by making, and the conviction that you can learn anything if you stay in the room long enough.",
    ],
    outcomes: ["Code", "Design", "Music"],
    theme: { accent: "#fbbf24", ink: "#1a1a2e" },
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
    theme: { accent: "#22d3ee", ink: "#1a1a2e" },
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
    theme: { accent: "#e84393", ink: "#1a1a2e" },
  },
  {
    id: "octo", index: 4, year: "2013–17", role: "Founding team · Director of Marketing", org: "Octo · Quartic.ai",
    cliff: "Co-built one of India's first AI chatbots in 2013. Acquired by Quartic.ai.",
    hook: "Built one of India's first AI chatbots in 2013. Acquired by Quartic.ai.",
    paragraphs: [
      "Shipped conversational AI before the category had a name in India. Co-built Octo with Akshaya Aron.",
      "Distribution, integration, post-sale ownership. Octo was acquired by Quartic.ai.",
    ],
    outcomes: ["First AI chatbot in India (2013)", "Octo acquired by Quartic.ai", "Director of Marketing post-acquisition"],
    theme: { accent: "#22d3ee", ink: "#0a0a1e" },
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
    theme: { accent: "#fbbf24", ink: "#0a1a14" },
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
    theme: { accent: "#ff6b35", ink: "#1a0a10" },
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
    theme: { accent: "#22d3ee", ink: "#0a0a20" },
  },
  {
    id: "ccd", index: 8, year: "Now", role: "Founder", org: "Cats Can Dance",
    cliff: "Music label + pet culture brand. The chapter where operator and artist finally meet.",
    hook: "Music label + pet culture brand. The work that exists because it has to.",
    paragraphs: [
      "Original music releases, a pet-forward brand world, and live events that double as creative IP.",
      "Operator to artist loop closed — the skills compound across mediums.",
    ],
    outcomes: ["Original music releases", "Live events + creative IP", "Pet-forward brand world"],
    theme: { accent: "#ec4899", ink: "#1a1a2e" },
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
    theme: { accent: "#f59e0b", ink: "#1a1a2e" },
  },
];
