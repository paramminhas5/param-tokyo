/**
 * Art generation manifest — Sable/Firewatch/Journey aesthetic.
 *
 * STYLE LOCK — Atmospheric ink/watercolor with monolinear line work:
 *
 *   "atmospheric landscape illustration, hand-drawn ink linework style,
 *    muted earth tones with one signature accent color, vast open spaces,
 *    minimal detail in distance, environmental storytelling, Sable game
 *    aesthetic, Moebius influence, clean silhouettes against painted sky"
 *
 * Key characteristics:
 * - Vast landscapes with atmospheric perspective
 * - Muted palette with one vibrant accent per world
 * - Clean silhouette foregrounds against painted skies
 * - Watercolor-bleed sky gradients
 * - Minimal but evocative environmental detail
 */

const STYLE_LOCK =
  "atmospheric landscape illustration, hand-drawn ink linework style, " +
  "muted earth tones with one signature accent color, vast open spaces, " +
  "minimal detail in distance, environmental storytelling, Sable game aesthetic, " +
  "Moebius influence, clean silhouettes against painted sky, digital painting";

const SILHOUETTE_LOCK =
  "ink silhouette environmental layer, side-scrolling perspective, " +
  "clean dark shapes against transparent background, architectural and natural forms, " +
  "atmospheric depth, minimal interior detail, environmental storytelling, " +
  "sharp edges, hand-drawn quality";

// Layer dimensions
const SKY = { width: 1920, height: 1080 };
const LAYER = { width: 2048, height: 512 };
const POSTER = { width: 768, height: 1024 };
const TITLE = { width: 1920, height: 1080 };

/**
 * Per-world creative briefs.
 * Each world has a distinct color palette and environmental character.
 */
const WORLD_BRIEFS = {
  origin: {
    accent: "#fbbf24",
    sky:
      "vast dawn sky watercolor painting, warm amber and gold bleeding into deep indigo, " +
      "scattered clouds catching first light, atmospheric perspective, serene and hopeful, " +
      "painted quality with visible brushstrokes",
    far: "distant rolling hills and scattered trees at dawn, a single antenna tower on the horizon, subtle power lines",
    mid: "mid-distance Indian rooftops and water tanks, a banyan tree, morning mist rolling through, residential neighborhood",
    near: "wooden desk with CRT monitor silhouette, stacked books, window frame with dawn light, indoor-to-outdoor transition",
    poster:
      "atmospheric portrait of a young person at a desk with computer at dawn, amber light from window, " +
      "room full of books and music equipment, 'ORIGIN' text overlay, contemplative mood, warm palette",
  },
  grp: {
    accent: "#22d3ee",
    sky:
      "deep twilight sky painting, indigo to teal gradient, first stars appearing, " +
      "glowing city lights reflected in clouds below, digital age feeling, cool palette",
    far: "distant city skyline with office towers at dusk, radio towers blinking, urban horizon",
    mid: "office buildings mid-distance with lit windows like pixels, satellite dishes, parking structures",
    near: "computer screens and server equipment silhouettes, floating data visualizations, modern tech workspace",
    poster:
      "person surrounded by floating screens and data in a dark room, teal glow from monitors, " +
      "early internet age atmosphere, 'GETRIGHTPRICE' text overlay, focused energy",
  },
  hab: {
    accent: "#e84393",
    sky:
      "warm afternoon sky painting, peach and coral sunset, scattered cumulus clouds, " +
      "golden hour warmth, painted brushstroke texture, Indian summer feeling",
    far: "distant residential skyline with temple domes and construction cranes, distant hills",
    mid: "low-rise apartment blocks with 'TO LET' signs, palm trees, water tanks on rooftops, lived-in neighborhood",
    near: "autorickshaw and motorcycle silhouettes, a gate with keys hanging, domestic objects, street-level view",
    poster:
      "person handing keys with apartment buildings in background, warm golden hour light, " +
      "Indian residential neighborhood, 'HAB' text overlay, entrepreneurial energy, pink accent",
  },
  octo: {
    accent: "#22d3ee",
    sky:
      "deep midnight sky painting, almost black with cyan data streams like aurora, " +
      "full moon casting silver light, neural network patterns faintly visible, mysterious",
    far: "distant server farm silhouettes and satellite dishes, technology infrastructure on horizon",
    mid: "lab-like interior with glowing terminals, chat bubbles floating, cable bundles, equipment racks",
    near: "close-up of chat interface silhouettes, keyboard, glowing conversational AI flowing from screen",
    poster:
      "person face-to-face with a glowing AI entity, conversation flowing between them, " +
      "dark room lit by screen glow, 'OCTO' text overlay, pioneering spirit, cyan highlights",
  },
  investopad: {
    accent: "#fbbf24",
    sky:
      "morning sky painting, fresh greens and golds, optimistic palette, " +
      "sun breaking through scattered clouds, new day energy, prosperity feeling",
    far: "glass office towers on horizon, financial district skyline, morning sun glinting",
    mid: "boardroom interior with pitch screens, whiteboards with diagrams, modern office mid-distance",
    near: "stacked documents and coffee, laptop open to spreadsheets, handshake silhouettes",
    poster:
      "person studying multiple pitch decks at a desk, morning light streaming in, " +
      "city view from window, gold accents, 'INVESTOPAD' text overlay, strategic clarity",
  },
  solesearch: {
    accent: "#ff6b35",
    sky:
      "festival evening sky painting, vivid orange to hot pink sunset, " +
      "lens flare effects, confetti particles catching light, electric energy, celebration",
    far: "stadium lights and stage trusses on horizon, crowd silhouettes in distance, festival atmosphere",
    mid: "event venue with LED walls, giant sneaker displays, dense crowd with phones raised",
    near: "stacked sneaker boxes, microphone stand, DJ equipment, event signage silhouettes",
    poster:
      "person on stage addressing massive crowd, sneaker culture event, orange and pink lighting, " +
      "energy and movement, 'SOLESEARCH' text overlay, community building",
  },
  fere: {
    accent: "#22d3ee",
    sky:
      "digital void sky, deep navy to electric blue, holographic data streams, " +
      "blockchain pattern overlay very subtle, futuristic and clean, minimal",
    far: "abstract crypto towers and orbital structures on horizon, futuristic city glimpse",
    mid: "trading terminal walls with candlestick charts, server infrastructure, holographic displays",
    near: "autonomous agent interface, flowing data streams, robotic arm silhouettes, AI workspace",
    poster:
      "person directing fleet of autonomous AI agents, screens showing live market data, " +
      "futuristic control room, cyan glow, 'FERE.AI' text overlay, cutting edge",
  },
  ccd: {
    accent: "#ec4899",
    sky:
      "disco/performance sky, deep magenta to violet, stage lighting bleeding into atmosphere, " +
      "confetti and light particles, performance energy, creative expression",
    far: "concert venue silhouette with stage trusses, speaker stacks, crowd in distance",
    mid: "music studio and stage hybrid, synthesizers, mixing desk, dancing figures, cats",
    near: "close-up music production gear, vinyl records, dancing cat characters, microphones",
    poster:
      "person performing music with cats around them, disco/concert lighting, " +
      "creative energy, pink and purple palette, 'CATS CAN DANCE' text overlay, joy",
  },
  iterate: {
    accent: "#f59e0b",
    sky:
      "new dawn sky painting, amber and gold sunrise, vast and open, " +
      "possibility and synthesis, all colors of prior worlds subtly blending, culmination",
    far: "modern glass agency building on horizon, surrounded by nature, bridge connecting worlds",
    mid: "creative workspace with AI interfaces, brand boards, strategy diagrams, workflow automation",
    near: "workstation with multiple screens, brand materials, coffee, the tools of synthesis",
    poster:
      "person at the center of converging paths from all prior worlds, synthesizing everything, " +
      "golden light, all skills converging, 'ITERATE' text overlay, culmination",
  },
};

/**
 * Build the full asset list. Each entry is one Flux call + one post-process.
 */
export function buildManifest() {
  const items = [];

  for (const [id, brief] of Object.entries(WORLD_BRIEFS)) {
    items.push({
      key: `${id}-sky`,
      out: `public/game/worlds/${id}-sky.jpg`,
      prompt: `${brief.sky}, ${STYLE_LOCK}`,
      size: SKY,
      pixelScale: 1, // No pixelization for Sable aesthetic — keep painterly
      kind: "sky",
    });
    for (const layer of ["far", "mid", "near"]) {
      items.push({
        key: `${id}-${layer}`,
        out: `public/game/worlds/${id}-${layer}.png`,
        prompt: `${SILHOUETTE_LOCK}, subject: ${brief[layer]}`,
        size: LAYER,
        pixelScale: 1,
        kind: "silhouette",
        tint: layer === "far" ? darken(brief.accent, 0.5) : "#080414",
      });
    }
    items.push({
      key: `${id}-poster`,
      out: `public/game/posters/${id}.png`,
      prompt: `${brief.poster}, ${STYLE_LOCK}`,
      size: POSTER,
      pixelScale: 1,
      kind: "poster",
    });
  }

  // Title poster
  items.push({
    key: "title-poster",
    out: "public/game/posters/title.png",
    prompt:
      "cinematic title card illustration, silhouette of a person standing at the edge of a vast landscape, " +
      "nine glowing worlds behind them like distant stars, amber gold sky fading to deep navy, " +
      "text 'PARAM TOKYO' in elegant minimal typeface, atmospheric and aspirational, " +
      `${STYLE_LOCK}`,
    size: TITLE,
    pixelScale: 1,
    kind: "poster",
  });

  return items;
}

function darken(hex, factor) {
  const m = hex.replace("#", "");
  const r = Math.round(parseInt(m.slice(0, 2), 16) * factor);
  const g = Math.round(parseInt(m.slice(2, 4), 16) * factor);
  const b = Math.round(parseInt(m.slice(4, 6), 16) * factor);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
