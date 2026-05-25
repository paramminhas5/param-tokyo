/**
 * Art generation manifest. Every visible asset on /play and / is listed here
 * with an explicit prompt, output path, and post-process recipe. Edit a
 * prompt and re-run `npm run art:gen` to re-roll just that asset.
 *
 * STYLE LOCK — every prompt MUST end with this clause for consistency:
 *
 *   "16-bit pixel art, retro game aesthetic, sharp pixel edges, no anti-aliasing,
 *    limited palette, screen-print poster style"
 *
 * Reference stack we're channeling: Sable + Katana Zero + Olly Moss posters + Fable.
 * The pixel post-process (nearest-neighbor downsample → upsample) is what
 * actually delivers the pixel-art look, regardless of how Flux renders.
 */

const STYLE_LOCK =
  "16-bit pixel art, retro game aesthetic, sharp pixel edges, no anti-aliasing, " +
  "limited palette, screen-print poster style";

const SILHOUETTE_LOCK =
  "single horizontal silhouette band, pure black on solid white background, " +
  "no detail interior, no gradient, no shading, sharp clean silhouette edge, " +
  "screen-print poster style, Olly Moss inspired";

// Layer dimensions. Wide layers stretch to viewport at runtime.
const SKY = { width: 1024, height: 768 };
const LAYER = { width: 1536, height: 512 };
const POSTER = { width: 768, height: 1024 };
const TITLE = { width: 1280, height: 768 };
const HERO_FRAME = { width: 768, height: 1024 };

/**
 * Per-world creative briefs. Each gets four parallax layers + one chapter poster.
 * Accent colors come from src/game/journey.ts → keep in sync if those change.
 */
const WORLD_BRIEFS = {
  origin: {
    accent: "#fbbf24",
    sky:
      "warm dawn sky over Bengaluru, gradient amber to deep purple, scattered stars fading, " +
      "soft cumulus clouds at horizon, painted moebius style",
    far: "distant low rolling hills with silhouettes of antenna towers and a single banyan tree on the horizon",
    mid: "silhouettes of small two-story houses, water tower, telegraph poles, scattered trees",
    near: "silhouettes of a wooden fence, a vintage CRT television, a cassette deck, a desk lamp, a stack of magazines",
    poster:
      "Olly Moss style movie poster, single character silhouette of a young coder at a CRT computer at dawn, " +
      "amber and deep purple palette, title text 'ORIGIN' at top, '2010' at bottom",
  },
  grp: {
    accent: "#22d3ee",
    sky:
      "dusk sky over a 2010 Indian tech park, deep purple gradient to teal, " +
      "scattered code-lights like distant stars, painted",
    far: "silhouette of dense city skyline with radio towers and one tall office building",
    mid: "silhouettes of office buildings with small windows, satellite dishes, electrical poles",
    near: "silhouettes of computer monitors, price tag stacks, server rack, shopping carts",
    poster:
      "Olly Moss style poster, silhouette of person at desk surrounded by floating price tags, " +
      "deep purple and cyan palette, title 'GETRIGHTPRICE' at top, '2010' at bottom",
  },
  hab: {
    accent: "#e84393",
    sky:
      "warm afternoon Bengaluru sky, peach to coral pink to amber gradient, " +
      "soft scattered cumulus clouds, painted moebius style",
    far: "silhouette of distant rolling hills, a single hilltop temple, electrical pylons",
    mid: "silhouettes of low-rise rental housing blocks, three TO LET billboards, a tall coconut tree",
    near: "silhouettes of an autorickshaw, a parked motorcycle, a street dog sitting, a wooden TO LET sign",
    poster:
      "Olly Moss style poster, silhouette of person handing keys, low-rise houses behind, " +
      "warm peach pink palette, title 'HAB' at top, '2012' at bottom",
  },
  octo: {
    accent: "#22d3ee",
    sky:
      "deep navy night sky, single full moon, scattered glowing data points like fireflies, " +
      "painted, atmospheric",
    far: "silhouette of tall datacenter towers and antenna farms on the horizon",
    mid: "silhouettes of server racks, glowing terminal screens, AC vents, hanging cables",
    near: "silhouettes of floating chat speech bubbles, a mechanical keyboard, holographic UI panels",
    poster:
      "Olly Moss style poster, silhouette of person speaking to a glowing chatbot face, " +
      "deep navy and electric cyan palette, title 'OCTO' at top, '2013-17' at bottom",
  },
  investopad: {
    accent: "#fbbf24",
    sky:
      "emerald and gold morning sky, soft painted cumulus clouds, painted moebius style",
    far: "silhouette of glass office towers with vault doors at base, distant skyline",
    mid: "silhouettes of pitch screens with charts, founder desks, large stock ticker board",
    near: "silhouettes of stacks of money, coffee cups, open laptops, leather-bound notebooks",
    poster:
      "Olly Moss style poster, silhouette of investor at desk reviewing pitches, " +
      "emerald and gold palette, title 'INVESTOPAD' at top, 'POST-OCTO' at bottom",
  },
  solesearch: {
    accent: "#ff6b35",
    sky:
      "vibrant festival evening sky, orange to pink gradient, lens flares, scattered confetti, painted",
    far: "silhouettes of stadium lights, stage trusses, distant crowd",
    mid: "silhouettes of LED walls, giant sneaker sculpture, dense crowd of fans",
    near: "silhouettes of stacked sneaker boxes, a microphone stand, DJ deck, hanging banners",
    poster:
      "Olly Moss style poster, silhouette of person holding sneaker high, crowd silhouettes below, " +
      "orange and hot pink palette, title 'SOLESEARCH' at top, '2018-23' at bottom",
  },
  fere: {
    accent: "#22d3ee",
    sky:
      "deep cyan and electric blue holographic sky, glowing grid lines fading to horizon, " +
      "scattered floating data dots, painted cyberpunk",
    far: "silhouettes of crypto towers, a holographic globe floating above the city",
    mid: "silhouettes of trading terminals, server-stack racks, walls of glowing candlestick charts",
    near: "silhouettes of cable bundles, holographic mini-charts, a cyborg cat statue",
    poster:
      "Olly Moss style poster, silhouette of autonomous AI agent figure manipulating glowing markets, " +
      "cyan and electric blue palette, title 'FERE.AI' at top, '2024-25' at bottom",
  },
  ccd: {
    accent: "#ec4899",
    sky:
      "deep magenta to violet to pink disco sky, scattered confetti, glowing disco-ball reflections, painted",
    far: "silhouettes of stage trusses, speaker stacks, distant crowd silhouettes raising hands",
    mid: "silhouettes of DJ booth, three dancing cats with raised paws, EQ visualization wall",
    near: "silhouettes of synth keyboard, microphone, a single dancing cat in close-up",
    poster:
      "Olly Moss style poster, silhouette of dancing cat under a disco ball with one DJ figure, " +
      "magenta and pink palette, title 'CATS CAN DANCE' at top, 'NOW' at bottom",
  },
  iterate: {
    accent: "#f59e0b",
    sky:
      "warm gold and amber dawn-of-new-thing sky, slow drifting particles, " +
      "soft painted clouds, optimistic",
    far: "silhouette of glass agency tower, modular building blocks, distant skyline",
    mid: "silhouettes of glowing core machine, conveyor belt, tall robotic crane arm",
    near: "silhouettes of computer modules, brand boards, floating prompt cards, coffee mugs",
    poster:
      "Olly Moss style poster, silhouette of person directing AI workflow with raised hand, " +
      "gold and amber palette, title 'ITERATE' at top, 'NOW' at bottom",
  },
};

/**
 * Build the full asset list. Each entry is one Flux call + one post-process.
 */
export function buildManifest() {
  const items = [];

  // ── Per-world layers (9 worlds × 4 layers = 36 images) ──
  for (const [id, brief] of Object.entries(WORLD_BRIEFS)) {
    items.push({
      key: `${id}-sky`,
      out: `public/game/worlds/${id}-sky.jpg`,
      prompt: `${brief.sky}, ${STYLE_LOCK}`,
      size: SKY,
      pixelScale: 5,
      kind: "sky",
    });
    for (const layer of ["far", "mid", "near"]) {
      items.push({
        key: `${id}-${layer}`,
        out: `public/game/worlds/${id}-${layer}.png`,
        prompt: `${SILHOUETTE_LOCK}, subject: ${brief[layer]}`,
        size: LAYER,
        pixelScale: 4,
        kind: "silhouette",
        tint: layer === "far" ? darken(brief.accent, 0.65) : "#080414",
      });
    }
    items.push({
      key: `${id}-poster`,
      out: `public/game/posters/${id}.png`,
      prompt: `${brief.poster}, ${STYLE_LOCK}`,
      size: POSTER,
      pixelScale: 4,
      kind: "poster",
    });
  }

  // ── Title poster ──
  items.push({
    key: "title-poster",
    out: "public/game/posters/title.png",
    prompt:
      "Olly Moss style movie poster for 'PARAM TOKYO — A RESUME IN 9 CHAPTERS', " +
      "single character silhouette of a hooded protagonist standing before nine glowing world icons, " +
      "amber gold sun behind, deep navy sky, screen-print bold flat shapes, " +
      `${STYLE_LOCK}`,
    size: TITLE,
    pixelScale: 4,
    kind: "poster",
  });

  // ── Hero sprite frames ──
  // Two distinct frames, composited into a 6-cell sheet at runtime.
  // Cells 0+1 = idle pose; cells 2..5 = walk pose with x-offsets for parallax illusion.
  const HERO_PROMPT_BASE =
    "full-body pixel art game character, " +
    "side-view 3/4 angle, hooded urban explorer, dark cargo jacket with cyan trim, " +
    "tactical pants, boots, slung satchel, neutral expression, " +
    "isolated on solid pure white background, no shadow, no ground, " +
    "consistent character design, ";
  items.push({
    key: "hero-idle",
    out: "public/game/hero/_hero-idle.png", // staging file; sheet is composed below
    prompt: `${HERO_PROMPT_BASE} standing relaxed idle pose, weight on right leg, ${STYLE_LOCK}`,
    size: HERO_FRAME,
    pixelScale: 4,
    kind: "character",
    seed: 7777, // lock seed so re-rolls stay consistent until manifest changes
  });
  items.push({
    key: "hero-walk",
    out: "public/game/hero/_hero-walk.png",
    prompt: `${HERO_PROMPT_BASE} mid-stride walking left-to-right, right leg forward, slight forward lean, satchel swinging, ${STYLE_LOCK}`,
    size: HERO_FRAME,
    pixelScale: 4,
    kind: "character",
    seed: 7777, // same seed for character consistency
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
