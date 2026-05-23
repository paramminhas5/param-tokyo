
# Plan — Production-grade sprite game, no CSS art

Goal: replace every CSS-drawn element with real PNG sprites, lock the hero's motion to a single global scroll/click/touch progress, and fix narration + skill-acquisition timing. No character on the home screen. Output must look like a Steam-quality 2D side-scroller.

## 1. Kill the CSS art

Delete every component that draws shapes with divs/SVG:
- `src/components/NPC.tsx` (SVG silhouettes)
- `src/components/Prop.tsx` (SVG shapes)
- `src/components/SkillPickup.tsx` (CSS radial glow)
- The "cliff-card" corner notches, the orb gradient, the press-down sign, the world progress bar styled bars, the intro/outro chrome — all replaced with sprite PNGs or removed.

Replace with a single generic `<Sprite />` component that renders a PNG with `image-rendering: pixelated`, optional 2-frame idle bob via background-position swap (no CSS shapes).

## 2. Real sprite generation (all PNG, transparent, riso neo-tokyo)

Generate via the image tool, saved under `src/assets/game/` with stable filenames so the user can swap:

**Hero** (`hero/hero-sheet.png`): one horizontal strip, 8 frames walk, 2 idle, 4 climb, 2 interact. Front/side-view, consistent silhouette. Single character used across all 9 worlds.

**Per-world prop packs** (`props/<world>/*.png`, ~4–6 each, transparent):
- origin: CRT, cassette deck, desk lamp, window-skyline
- getrightprice: laptop, price tag stack, dorm bunk, coffee
- hab: autorickshaw, "TO LET" sign, street dog, power pole
- earlyai: server rack, whiteboard, AC vent, chat bubble cluster
- investopad: founder desk, ticker board, pitch screen, coffee machine
- solesearch: sneaker box pyramid, LED wall, stage truss, crowd silhouette
- fere: holo-globe, candlestick wall, agent terminal, cable tray
- catscandance: DJ booth, dancing-cat (2-frame), speaker stack, EQ wall
- iterate: modular blocks, glowing core, crane arm, conveyor

**NPCs** (`npc/<world>-{a,b}.png`, 1–2 per world, transparent, 2-frame idle): co-founder, dancer, trader, dorm-mate, engineer, cat crew, etc.

**Pickups** (`pickups/<skill>.png`): one PNG per unique skill in the game (~24), pre-rendered with glow baked in.

**Transitions** (`transitions/<world-to-next>.png`, 64×280 transparent): rope, ladder, fire escape, cable, vault chain, stage truss, cable tray, conveyor, tour-bus stairs.

**Parallax background layers** per world (`worlds/<id>-{far,mid,near}.png`): split each existing world bg into 3 PNG layers for depth scrolling. Far moves slow, mid medium, near fast.

**UI sprites** (`ui/*.png`): cliff-note card frame, skill belt frame, bag frame, HUD frame, hire button. Pre-rendered pixel chrome — no CSS borders/shadows for game UI.

## 3. One global scroll-driven hero

The "hero moves all fucked" bug is because every world owns its own hero with its own progress. Fix: ONE hero, ONE global progress.

- New `src/game/progress.ts`: a store that exposes `progress` (0..1 across the entire journey) and `worldIndex` (0..8) + `worldProgress` (0..1 within current world). Driven by a unified input layer:
  - **Scroll**: window scrollY mapped to total scrollable height.
  - **Click/tap**: clicking right half advances ~5% of a world, left half rewinds. Smooth-scrolls the page in sync.
  - **Touch swipe**: vertical swipe → same as scroll. Horizontal swipe ignored.
  - **Keyboard**: ←/→ and space.
- New `src/components/GlobalHero.tsx`: fixed-position hero pinned to viewport. Its on-screen X is `worldProgress` (8% → 92%). Pose: walk while progress is changing, idle after 200ms of stillness, climb during the last 6% of a world and first 6% of next. Frame advance tied to delta-progress, not wall clock (so scroll = walk speed, stop = stop).
- Hero stays on screen the whole journey; worlds scroll past him.

## 4. Parallax worlds, sprite props, no CSS shapes

`WorldStage.tsx` becomes:
- 3 stacked `<img>` layers (far/mid/near) with `transform: translateX(...)` driven by `worldProgress` for parallax depth.
- A foreground prop layer that places each prop as an `<img>` at authored `(x%, baseline%)`.
- NPCs as `<img>` with a 2-frame idle (swap src every 600ms).
- Skill pickups as `<img>` of the actual skill PNG, floating with a tiny translateY bob (the only allowed CSS animation).
- No vignette gradients on top — bake any darkening into the background PNG.

## 5. Skill acquisition + narration timing (the real fix)

Current bug: skills appear in the belt before the hero reaches them, and the outcome card pops mid-world.

- Each pickup has an authored `x%` along the world. Skill is added to state ONLY when `worldProgress * 100 >= pickup.x` AND the hero sprite has visually passed it. A small sprite "burst" PNG plays for 400ms, then the skill icon flies down to the belt.
- The belt only renders skills present in `useSkills()` — so unacquired skills are invisible until collected (not silhouetted).
- **Outcome / cliff-note card**: shows when the user transitions INTO a new world (worldIndex change). Slides in from the side as a pixel-framed PNG card with: World name, year, role, 2-line cliff note, list of skills earned in THAT world. Auto-dismisses after 5s or on click/scroll. Never overlaps the play area — pinned top-left, narrow.
- World transitions also trigger a brief "WORLD 03 — HAB" title splash (PNG banner), then the outcome card for the world just completed.

## 6. Home + footer

- **Intro**: no character. Just a pixel-framed title PNG ("PARAM MINHAS — A Playable Portfolio"), tagline, "PRESS ↓ / TAP / SCROLL TO START" pixel sign, stat HUD (years/companies/skills). Background = riso paper PNG. Clicking starts the journey by smooth-scrolling into world 1.
- **Outro**: pixel "END OF DEMO" card PNG, contact links styled as pixel buttons, Hire button opens existing `HirePanel` as a game dialog. Same paper background. No character.

## 7. HUD

Slim, sprite-based: a small PNG frame top-right with world counter "03/09", mute toggle, Hire button. World progress bar is a 3-slice PNG (left cap, fill, right cap), not a CSS div.

## 8. Files

**New**
- `src/game/progress.ts` — global progress store + input bindings (scroll/click/touch/key).
- `src/components/GlobalHero.tsx` — single fixed sprite hero.
- `src/components/Sprite.tsx` — generic PNG sprite renderer (single frame or sheet-cell).
- `src/components/WorldCard.tsx` — outcome / cliff-note card using PNG frame.
- `src/components/WorldTitleSplash.tsx` — transient world-name banner.

**Edited**
- `src/components/WorldStage.tsx` — 3-layer parallax PNGs, prop/NPC/pickup as `<img>`, no SVG, no CliffNoteCard inside (lifted to global). Reads `worldProgress` from global store.
- `src/routes/index.tsx` — mounts GlobalHero + WorldCard + WorldTitleSplash once, then 9 WorldStages.
- `src/components/Intro.tsx`, `src/components/Outro.tsx` — sprite chrome, no character.
- `src/components/SkillBelt.tsx` — render only acquired skills, real PNG icons, click opens popover (kept).
- `src/components/Hud.tsx` — sprite-framed HUD.

**Deleted**
- `src/components/NPC.tsx`, `src/components/Prop.tsx`, `src/components/SkillPickup.tsx` (replaced by Sprite + img).
- `src/components/WorldHero.tsx` (replaced by GlobalHero).
- `src/components/CliffNoteCard.tsx` (replaced by WorldCard, triggered on world change).
- Any per-component `<style>` blocks drawing decorative shapes.

## 9. Assets to generate this round

All under `src/assets/game/`, transparent PNG, riso neo-tokyo, stable filenames:
1. `hero/hero-sheet.png` — final 16-frame strip.
2. `worlds/<id>-{far,mid,near}.png` × 9 worlds = 27 PNGs.
3. `props/<world>/*.png` — ~5 per world = ~45 PNGs.
4. `npc/<world>-{a,b}.png` — ~15 PNGs.
5. `pickups/<skill>.png` — one per unique skill (~24).
6. `transitions/<id>.png` × 9.
7. `ui/` — cliff-card, hud, belt, bag, hire-button, title-splash, press-start, paper-bg, world-progress-3slice.

## 10. Out of scope

Audio rework, /cv page, true mobile-touch game tuning beyond swipe = scroll, theme switching.

Approve and I'll generate the sprite packs first (hero + 1 world end-to-end as a reference quality bar), then wire the global progress engine, then roll the remaining 8 worlds. Hero and skill timing fixed before any new art beyond world 1.
