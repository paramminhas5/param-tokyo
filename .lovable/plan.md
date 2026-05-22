
# Graphic-novel playable resume

Bring back the vertical scroll + readable content, but fuse the character, the world art, and the paragraphs into one continuous illustrated comic where the character lives *inside* the panels with the text.

## The shape

- Restore vertical scroll. One long page, ~9 chapters stacked.
- Each chapter is a full-bleed "panel" (≈ 100–140vh) with:
  - A rich pixel-art world filling the panel as the backdrop (not a tiny 16:9 box on the side).
  - Paragraphs of text laid *into* the panel — on signs, in caption boxes pinned to props, in speech bubbles, in negative-space areas of the art.
  - The character physically present in the scene, traversing it as you scroll.
- Panels connect: the ground line, sky gradient, and parallax layers flow continuously between chapters so it reads as one world, not 9 separate cards.
- Kill the side-by-side "text column + stage column" layout. Text and art share the same canvas.

## Character behavior (scroll-driven, per panel)

- The character is rendered into the panel's canvas at a position computed from scroll progress within that panel.
- Each panel defines a **path** through its world — a sequence of waypoints with `(x, y, action, facing)` — and scroll progress interpolates along it.
  - Origin: walks across a rooftop, climbs an antenna, sits to type.
  - GetRightPrice: walks past server racks, stops to grab a falling price tag.
  - Hab Housing: walks between houses, hands over a key at a sign.
  - Octo: walks into a lab, sits at a terminal, speech bubble pops.
  - Investopad: climbs a vault tower, pulls a lever.
  - SoleSearch: jumps between sneaker platforms, crowd silhouettes cheer.
  - Fere.ai: walks past agent racks, agents boot up behind him.
  - Cats Can Dance: walks onstage, dances on the beat, cats appear.
  - Iterate: assembles modules into a working machine.
- Facing flips based on the next waypoint. Emotes (`!`, `♪`, `$`, `★`) trigger contextually at waypoints, not on a timer.

## Richer worlds (this is the big lift)

Each panel gets a real illustrated scene, not 4 props on a flat ground:

- **3 parallax layers**: far sky/silhouette, mid buildings/landscape, near foreground props + ground.
- **Per-chapter set dressing** drawn with the existing pixel primitives, expanded:
  - Origin → bedroom-on-rooftop: CRT monitor, cassette deck, posters, antenna, stars, moon.
  - GetRightPrice → server room / shopfronts: price tags falling, barcode signs, conveyor.
  - Hab Housing → street of houses: for-rent signs, autorickshaw silhouette, broker booths.
  - Octo → AI lab: terminals, blinking lights, chat bubbles floating up from racks.
  - Investopad → vault tower: stacked vaults, ladder, ticker tape, pitch-deck papers blowing.
  - SoleSearch → sneaker arena: stacked sneaker boxes as platforms, stage rig, crowd silhouettes, spotlights.
  - Fere.ai → agent farm: server racks with glowing terminals, network lines pulsing.
  - Cats Can Dance → stage at night: mic stand, speakers, cats dancing, equalizer bars.
  - Iterate → workshop: modular blocks snapping together into a glowing machine.
- **Animated ambient details**: blinking screens, falling leaves/snow/papers, drifting clouds, flickering signs, pulsing lights — all on the canvas loop.
- **Lighting per chapter** via tinted overlays + accent glow on the character.

## Text inside the panel (graphic-novel layout)

Reduce text density vs current `resume.ts`, but keep it readable:

- **1 large title block** per panel (year + org + role), styled as a comic chapter title plate, positioned in dead space in the art.
- **1 hook line** in a bold caption box (the "narration box" in comics).
- **2 short paragraphs max** in narration boxes pinned to fixed spots in the art (top-left + bottom-right typical), max ~280 chars each. Trim current paragraphs.
- **Outcome chips** as in-world signs/banners standing on the ground.
- **Skill earned** as a flag the character plants at the end of the panel.
- All text uses semantic tokens, sits in pixel-bordered boxes, never overlaps the character's path.
- Long-form text stays on `/cv`.

## Mini-game

Same trigger as before: a "PLAY" prompt appears as an in-world arcade cabinet / sign when the character reaches the skill flag. Click → existing `MiniGame` modal → on win, flag plants and panel marks complete.

## Files to touch

- New `src/components/ChapterPanel.tsx` — full-bleed panel with its own canvas, path, parallax, narration boxes, in-world title plate, outcome banners, skill flag, play prompt.
- New `src/game/scenes.ts` — per-chapter scene definition: parallax layer descriptors, prop list with `(x, y, kind, variant)`, waypoint path, narration-box positions, animated ambient effects. Extends `resume.ts` data rather than replacing it.
- Extend `src/components/PixelStage.tsx` drawing helpers (or split into `src/game/draw.ts`) with the new prop variants (CRT, cassette, sneaker box, mic, vault, cat, terminal, crowd silhouette, spotlight, ticker tape, etc.) and parallax layer renderer.
- Rewrite `src/routes/index.tsx` back to stacked vertical: `<Hud />` + intro plate + `CHAPTERS.map(c => <ChapterPanel chapter={c} />)` + end/contact panel.
- Trim `src/content/resume.ts` paragraph lengths to fit narration boxes (keep facts; tighten prose). Add optional `title` plate copy if needed.
- Delete or stop using `src/components/WorldScene.tsx` and the old `src/components/ChapterSection.tsx`.

## Out of scope

- New mini-games (reuse existing 3 kinds).
- Audio bed / music.
- Mobile gesture controls beyond scroll.
- Changes to `/cv`.

## Open question

Panel height target: ~120vh per chapter (snappy, ~10 screens total) or ~180vh per chapter (more time inside each world, slower read)? I'll default to ~140vh unless you say otherwise.
