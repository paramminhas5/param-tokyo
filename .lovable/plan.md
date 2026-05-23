# Plan — Make it feel like a real game

Goal: kill the "stuck character + floating card" feeling. The hero walks through every world, interacts with props, collects skills as he passes them, and each world is summarised by ONE cliff-note card (the world name + 2-line summary) — nothing else covering the art. Home and footer match the game. Skill bag is clickable.

## 1. Character that actually moves

- Replace the fixed-position `Journey.tsx` with a per-world walking hero.
- Each `WorldStage` owns its own hero layer:
  - Hero enters from the left when the world scrolls into view, walks rightward across the scene along a hand-authored path (curve with `y(x)` per world so he climbs stairs, jumps boxes, ducks under cables).
  - Walk progress is driven by the world's scroll progress (0 → 1 as the section passes through the viewport), so scrolling = walking. Stop scrolling = idle.
  - At the bottom of the world, the hero grabs the transition prop (rope/ladder/stairs/cable) and **climbs down** into the next world - the same hero enters from the top using the climb pose. Visually one continuous character.
- Generate the missing animation frames as a proper sprite sheet:
  - `hero-walk` 8 frames, `hero-climb` 4 frames, `hero-jump` 3 frames, `hero-idle` 2-frame breath, `hero-interact` 2 frames (reach/pickup), `hero-wave` 2 frames.
  - Re-style the hero to read at game scale (cleaner silhouette, stronger rim light, riso ink line). Save as `hero-sheet-v2.png` (kept alongside v1 so user can swap).

## 2. Worlds become explorable, not wallpaper

- Add a foreground prop layer per world (transparent PNGs) on top of the existing background, plus interactive hotspots along the hero's path.
- Generate per-world prop packs (sprites, riso style, transparent):
  - **Origin**: CRT, cassette deck, skyline window, desk lamp, posters.
  - **GetRightPrice**: laptop, price-tag stack, coffee, dorm bunk.
  - **Hab**: autorickshaw, "TO LET" board, street dog, power-line pole.
  - **Early AI (Octo)**: server rack, chat-bubble swarm, whiteboard, AC vent.
  - **Investopad**: founder desks, ticker board, coffee machine, pitch screen.
  - **SoleSearch**: sneaker box pyramid, crowd silhouettes, stage truss, LED wall, DJ.
  - **Fere.ai**: holo-globe, candlestick wall, cable tray, agent terminal.
  - **Cats Can Dance**: DJ booth, 4-frame dancing-cat loop, EQ wall, speakers.
  - **Iterate**: modular blocks, glowing core machine, crane arm.
- Generate **NPC sprites** (1–2 per world: co-founder, dancer, trader, dorm-mate, engineer, cat crew) so the world is populated. Hero waves/points at them as he passes.
- Each world gets 3–5 **skill pickups** placed along the path. Walking past one auto-collects (with a small pop + sparkle) and adds it to the skill bag. The currently-active world's accent color tints the pickup glow.

## 3. Narration: one cliff-note card per world, that's it

- Delete the speech bubble, the "Built on" strip, and the bottom dialog box.
- Replace with a single **CliffNoteCard** pinned to a corner (top-left on desktop, top on mobile) — does NOT cover the scene:
  - World name + year + role (one line).
  - 2-line cliff note (what this chapter was about, in-character).
  - Tiny row of skill icons earned here (lights up as the hero collects them).
- Card slides in when the world enters the viewport, slides out when it leaves. Never centered, never blocking the art.
- Pixel-style frame consistent with the game (reuse `title-card.png` art, smaller).

## 4. Skill bag — clickable

- Keep `SkillBelt` at the bottom but make every icon a real button:
  - Click → opens a small popover with: skill name, family, where earned (chapter name + year), and one-line "how I used it".
  - Earned skills are full color; unearned are silhouette.
  - Add a "Bag" button on the far right that opens a full sheet listing all skills grouped by family, with the same detail per row.
- Add hover tooltip with name for quick scanning.

## 5. Home (intro) + footer cohesive with the game

- **Intro (above first world)**: riso paper background, hero standing idle next to a "PRESS ↓ TO PLAY" pixel sign, name + tagline in the game's display font, tiny stat strip (years, companies, skills) styled as a HUD readout. No generic landing-page hero.
- **Footer (after last world)**: same paper + ink palette, pixel-framed "End of Demo" card with contact (email, LinkedIn, Cats Can Dance, X), a "Hire" pixel button that opens the existing `HirePanel` as a game dialog, and a small credits crawl ("Art, code & life by Param Minhas"). No tailwind defaults.
- Remove `InventoryRail.tsx` (superseded by SkillBelt).
- HUD stays slim: world progress bar (X of 9), mute, Hire — all in pixel chrome.

## 6. Files

**New**

- `src/components/WorldHero.tsx` — per-world walking hero with path + frame animation.
- `src/components/CliffNoteCard.tsx` — corner-pinned summary card.
- `src/components/SkillPickup.tsx` — collectible along the path.
- `src/components/NPC.tsx` — generic NPC sprite renderer.
- `src/components/SkillPopover.tsx` + `src/components/SkillBag.tsx` — click-to-inspect UI.
- `src/components/Intro.tsx`, `src/components/Outro.tsx` — game-styled home + footer.
- `src/game/paths.ts` — per-world hero path (`y(x)` + waypoints + interaction triggers).
- `src/game/props.ts` — per-world prop + NPC + pickup placements.

**Edited**

- `src/components/WorldStage.tsx` — drop dialog/bubble/built-on; add prop layer, NPCs, pickups, CliffNoteCard, WorldHero. Make section taller (160vh hero / 120vh vignette) so there's room to walk.
- `src/components/SkillBelt.tsx` — clickable icons + Bag button.
- `src/components/Hud.tsx` — pixel chrome, world progress.
- `src/routes/index.tsx` — Intro + 9 WorldStages + Outro, remove top-level `Journey`.
- `src/content/resume.ts` — add 2-line `cliffNote` + `howUsed` per skill.

**Deleted**

- `src/components/Journey.tsx` (replaced by per-world hero).
- `src/components/InventoryRail.tsx`.
- `src/components/CliffNotesCard.tsx` (old version, replaced by new `CliffNoteCard.tsx`).

## 7. Assets to generate (all riso neo-tokyo, saved under `src/assets/game/`)

- `hero/hero-sheet-v2.png` — full animation strip (idle 2, walk 8, climb 4, jump 3, interact 2, wave 2).
- `props/<world>/*.png` — ~6 per world, transparent.
- `npc/<world>-npc1.png`, `npc/<world>-npc2.png` — 1–2 per world, transparent, 2-frame idle.
- `pickups/skill-orb.png` — generic glowing pickup frame (tinted per accent at runtime).
- `transitions/{rope,ladder,fire-escape,cable,vault-chain,stage-truss,cable-tray,conveyor,tour-bus-stairs}.png` — 64×280 transparent.
- `ui/cliff-card.png`, `ui/hud-frame.png`, `ui/bag-frame.png` — pixel UI chrome.
- `ui/press-down.png` — intro signpost.

All filenames stable so the user can drop replacements anytime.

## 8. Out of scope (will not touch this round)

- MiniGame rework, audio bed, `/cv` page redesign, mobile-touch gameplay tuning (will still be playable, just not optimised), theme switch (already removed).

Approve and I'll generate the new sprite packs first, then wire WorldHero + path system, then swap UI and home/footer.