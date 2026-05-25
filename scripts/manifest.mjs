/**
 * Art generation manifest. Every visible asset on /play and / is listed here
 * with an explicit prompt, output path, and post-process recipe. Edit a
 * prompt and re-run `npm run art:gen` to re-roll just that asset.
 *
 * STYLE LOCK — Pokemon Gen 1-3 aesthetic (Game Boy Advance era):
 *
 *   "authentic Pokemon pixel art style, Game Boy Advance era, isometric perspective,
 *    56-color palette maximum, dithered gradients, sharp clean pixels, no blur,
 *    no anti-aliasing, tile-based environmental design, Nintendo GBA aesthetic"
 *
 * Reference stack: Pokemon Ruby/Sapphire/Emerald + FireRed/LeafGreen + Crystal.
 * Key characteristics:
 * - Isometric/top-down perspective with depth
 * - Limited but vibrant color palette (56 colors max per scene)
 * - Dithering for smooth transitions
 * - Clean tile-based architecture
 * - Environmental storytelling through objects
 */

const STYLE_LOCK =
  "authentic Pokemon pixel art style, Game Boy Advance era, isometric perspective, " +
  "56-color palette maximum, dithered gradients, sharp clean pixels, no blur, " +
  "no anti-aliasing, tile-based environmental design, Nintendo GBA aesthetic";

const SILHOUETTE_LOCK =
  "Pokemon-style environment layer, side-scrolling perspective like Pokemon ranger zones, " +
  "clean silhouette shapes with minimal interior detail, black foreground on white background, " +
  "environmental storytelling, sharp pixel edges, tile-based design";

// Layer dimensions. Wide layers stretch to viewport at runtime.
const SKY = { width: 1024, height: 768 };
const LAYER = { width: 1536, height: 512 };
const POSTER = { width: 768, height: 1024 };
const TITLE = { width: 1280, height: 768 };
const HERO_FRAME = { width: 768, height: 1024 };

/**
 * Per-world creative briefs. Each gets four parallax layers + one chapter poster.
 * Accent colors come from src/game/journey.ts → keep in sync if those change.
 * 
 * Pokemon aesthetic notes:
 * - Sky: dithered gradients like Pokemon Emerald route backgrounds
 * - Layers: environmental storytelling through recognizable objects
 * - Posters: Pokemon trainer card style with character + environment
 */
const WORLD_BRIEFS = {
  origin: {
    accent: "#fbbf24",
    sky:
      "Pokemon GBA style sky background, warm dawn gradient from amber yellow to deep purple, " +
      "dithered gradient transitions, scattered twinkling stars fading out, " +
      "soft pixelated clouds at horizon, clean 56-color palette",
    far: "distant rolling hills with antenna tower silhouettes and single large banyan tree, Pokemon route style, clean tile-based design",
    mid: "small two-story Indian houses, water tower structure, wooden telegraph poles, scattered trees, Pokemon town aesthetic",
    near: "wooden fence tiles, vintage CRT television sprite, cassette deck object, desk lamp, magazine stack, Pokemon room decoration style",
    poster:
      "Pokemon trainer card style, pixel art character sprite sitting at CRT computer during dawn, " +
      "amber and purple color palette, clean GBA aesthetic, title 'ORIGIN' at top, '2010' at bottom, " +
      "environmental storytelling like Pokemon FireRed/LeafGreen",
  },
  grp: {
    accent: "#22d3ee",
    sky:
      "Pokemon GBA style night sky, deep purple to teal dithered gradient, " +
      "scattered glowing pixel dots like code stars, clean palette transitions",
    far: "dense city skyline silhouettes with radio towers and tall office building, Pokemon city route backdrop style",
    mid: "office buildings with small glowing window pixels, satellite dishes, electrical poles, Pokemon urban zone aesthetic",
    near: "computer monitor sprites, floating price tag objects, server rack tile, shopping cart sprites, GBA object design",
    poster:
      "Pokemon trainer card style, pixel art character at desk surrounded by floating price tag objects, " +
      "deep purple and cyan palette, GBA aesthetic, title 'GETRIGHTPRICE' at top, '2010' at bottom",
  },
  hab: {
    accent: "#e84393",
    sky:
      "Pokemon GBA style afternoon sky, peach to coral pink to amber dithered gradient, " +
      "soft pixelated cumulus clouds, warm color palette like Pokemon Ruby/Sapphire desert routes",
    far: "distant rolling hills with small hilltop temple structure, electrical pylon towers, Pokemon route horizon style",
    mid: "low-rise rental housing block tiles, three TO LET billboard sprites, tall coconut palm tree, Pokemon town suburban area",
    near: "autorickshaw vehicle sprite, parked motorcycle object, sitting street dog sprite, wooden TO LET sign tile, GBA object style",
    poster:
      "Pokemon trainer card style, pixel art character handing key item sprite, low-rise houses in background, " +
      "warm peach pink palette, GBA aesthetic, title 'HAB' at top, '2012' at bottom",
  },
  octo: {
    accent: "#22d3ee",
    sky:
      "Pokemon GBA style deep navy night sky, single large pixelated full moon, " +
      "scattered glowing data point particles like Pokemon mystery zone, dithered dark gradient",
    far: "tall datacenter tower silhouettes and antenna farm structures on horizon, Pokemon tech facility aesthetic",
    mid: "server rack rows, glowing terminal screen tiles, AC vent sprites, hanging cable objects, Pokemon lab interior style",
    near: "floating chat bubble sprites, mechanical keyboard object, holographic UI panel tiles, GBA tech objects",
    poster:
      "Pokemon trainer card style, pixel art character speaking to glowing chatbot face sprite, " +
      "deep navy and electric cyan palette, GBA aesthetic, title 'OCTO' at top, '2013-17' at bottom",
  },
  investopad: {
    accent: "#fbbf24",
    sky:
      "Pokemon GBA style morning sky, emerald green to gold dithered gradient, " +
      "soft pixelated clouds, optimistic palette like Pokemon Emerald victory road",
    far: "glass office tower silhouettes with vault door structures at base, distant skyline, Pokemon corporate zone",
    mid: "pitch screen tiles with chart sprites, founder desk objects, large stock ticker board, Pokemon office aesthetic",
    near: "stacked money pile sprites, coffee cup objects, open laptop tiles, leather notebook items, GBA luxury objects",
    poster:
      "Pokemon trainer card style, pixel art investor character at desk reviewing pitch documents, " +
      "emerald and gold palette, GBA aesthetic, title 'INVESTOPAD' at top, 'POST-OCTO' at bottom",
  },
  solesearch: {
    accent: "#ff6b35",
    sky:
      "Pokemon GBA style festival evening sky, orange to hot pink dithered gradient, " +
      "lens flare pixels, scattered confetti particles, vibrant palette like Pokemon contest halls",
    far: "stadium light tower silhouettes, stage truss structures, distant crowd silhouette wave",
    mid: "LED wall tiles, giant sneaker sculpture object, dense crowd of fan sprites, Pokemon event venue aesthetic",
    near: "stacked sneaker box tiles, microphone stand sprite, DJ deck object, hanging banner items, GBA festival objects",
    poster:
      "Pokemon trainer card style, pixel art character holding sneaker item sprite high, crowd silhouettes below, " +
      "orange and hot pink palette, GBA aesthetic, title 'SOLESEARCH' at top, '2018-23' at bottom",
  },
  fere: {
    accent: "#22d3ee",
    sky:
      "Pokemon GBA style holographic sky, deep cyan to electric blue dithered gradient, " +
      "glowing pixel grid lines fading to horizon, floating data dot particles, Pokemon cyber zone aesthetic",
    far: "crypto tower silhouettes, holographic globe structure floating above city, Pokemon futuristic city backdrop",
    mid: "trading terminal tiles, server stack rack objects, glowing candlestick chart wall, Pokemon tech facility interior",
    near: "cable bundle sprites, holographic mini-chart tiles, cyborg cat statue object, GBA futuristic objects",
    poster:
      "Pokemon trainer card style, pixel art autonomous AI agent character manipulating glowing market sprites, " +
      "cyan and electric blue palette, GBA aesthetic, title 'FERE.AI' at top, '2024-25' at bottom",
  },
  ccd: {
    accent: "#ec4899",
    sky:
      "Pokemon GBA style disco sky, deep magenta to violet to pink dithered gradient, " +
      "scattered confetti pixels, glowing disco ball reflection particles, Pokemon contest hall celebration aesthetic",
    far: "stage truss silhouettes, speaker stack towers, distant crowd with raised hand sprites",
    mid: "DJ booth platform, three dancing cat character sprites with raised paws, EQ visualization wall tiles, Pokemon party zone",
    near: "synth keyboard object sprite, microphone stand, single close-up dancing cat character, GBA music objects",
    poster:
      "Pokemon trainer card style, pixel art dancing cat character under disco ball with DJ figure, " +
      "magenta and pink palette, GBA aesthetic, title 'CATS CAN DANCE' at top, 'NOW' at bottom",
  },
  iterate: {
    accent: "#f59e0b",
    sky:
      "Pokemon GBA style warm golden dawn sky, amber to gold dithered gradient, " +
      "slow drifting particle pixels, soft clouds, optimistic palette like Pokemon new journey start",
    far: "glass agency tower silhouette, modular building block structures, distant skyline, Pokemon future city aesthetic",
    mid: "glowing core machine tiles, conveyor belt objects, tall robotic crane arm sprite, Pokemon tech factory interior",
    near: "computer module tiles, brand board sprites, floating prompt card objects, coffee mug items, GBA workflow objects",
    poster:
      "Pokemon trainer card style, pixel art character directing AI workflow with raised hand, " +
      "gold and amber palette, GBA aesthetic, title 'ITERATE' at top, 'NOW' at bottom",
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
      "Pokemon game title screen style for 'PARAM TOKYO — A RESUME IN 9 CHAPTERS', " +
      "pixel art hooded protagonist character sprite standing before nine glowing world icon badges, " +
      "amber gold sun behind character, deep navy sky background, " +
      "clean GBA aesthetic like Pokemon FireRed/LeafGreen title screen, dithered gradients, " +
      `${STYLE_LOCK}`,
    size: TITLE,
    pixelScale: 4,
    kind: "poster",
  });

  // ── Hero sprite frames ──
  // Two distinct frames, composited into a 6-cell sheet at runtime.
  // Cells 0+1 = idle pose; cells 2..5 = walk pose with x-offsets for parallax illusion.
  const HERO_PROMPT_BASE =
    "Pokemon game character sprite, full-body pixel art, " +
    "side-view walking sprite like Pokemon trainer overworld sprite, " +
    "hooded urban explorer character, dark cargo jacket with cyan accent trim, " +
    "tactical pants, boots, slung messenger bag, clean sprite design, " +
    "isolated on pure white background #FFFFFF, no shadow, no ground tile, " +
    "consistent character proportions, Game Boy Advance sprite style, ";
  items.push({
    key: "hero-idle",
    out: "public/game/hero/_hero-idle.png", // staging file; sheet is composed below
    prompt: `${HERO_PROMPT_BASE} standing idle pose with slight weight shift, relaxed stance, ${STYLE_LOCK}`,
    size: HERO_FRAME,
    pixelScale: 4,
    kind: "character",
    seed: 7777, // lock seed so re-rolls stay consistent until manifest changes
  });
  items.push({
    key: "hero-walk",
    out: "public/game/hero/_hero-walk.png",
    prompt: `${HERO_PROMPT_BASE} mid-stride walking animation frame, right leg forward step, slight lean, bag swinging, ${STYLE_LOCK}`,
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
