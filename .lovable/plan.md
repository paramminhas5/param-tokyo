
# Build plan — Generate Risograph neo-tokyo asset pack + wire the journey

Approve this and I'll start generating. All assets saved to `src/assets/game/` so you can swap any file later without touching code.

## Art bible (locked across every asset)

- Risograph neo-tokyo, AAA indie game quality (think *Sable* + *Katana Zero* + Olly Moss posters).
- Paper base `#f0ece4`, ink `#1a1a2e`, one accent per world. Visible riso grain, soft misregistration, halftone shadows. No gradients, no glow, no AI smoothness.
- Character is the same person across every frame and every world — same proportions, same silhouette, same palette.
- Side-scroller perspective, parallax-ready (sky / mid / ground layers separable).

## Asset list (all generated in build mode)

### Folder layout
```
src/assets/game/
  hero/            character sprite frames
  worlds/          9 backgrounds (parallax layers per world)
  props/           per-world interactive props
  transitions/    inter-world climb/ride sprites
  skills/          35 skill icons
  ui/              title-card, speech-bubble, dialog-box, avatar
```

### 1. Hero (1 cohesive character)
Single character sheet generated first, then every other pose edited *from* that sheet so the person stays identical.
- `hero-idle.png`, `hero-walk.png` (6-frame strip), `hero-climb.png` (4-frame strip), `hero-sit.png`, `hero-point.png`, `hero-jump.png`

### 2. Worlds — 9 backgrounds, parallax-separated
Each world = 3 PNGs (`-sky.png`, `-mid.png`, `-ground.png`), 1920×1400 each, transparent where needed.

| World | Accent | Scene |
|---|---|---|
| Origin (hero-tier polish) | coral | bedroom at night, CRT, cassette wall, skyline window |
| GetRightPrice | mustard | dorm desk, early web catalog screens |
| Hab Housing | sage | Bengaluru street, autorickshaw, "TO LET" boards, power lines |
| Early AI Era (HERO) | ocean | AI lab, server wall, chat-bubble swarm, AC vents |
| Investopad | plum | co-working tower, founder desks, ticker board |
| SoleSearch (HERO) | coral | sneaker arena, crowd, stage truss, LED wall, boxes deep |
| Fere.ai | electric blue | agent farm, holo-globe, cable trays, candlestick wall |
| Cats Can Dance (HERO) | magenta | studio + stage, DJ booth, dancing cats, EQ wall |
| Iterate (HERO) | amber | modular workshop, glowing core machine, crane |

### 3. Props (per world, transparent PNGs)
~6 props per world (CRT, cassette deck, cat, sneaker boxes, DJ deck, dancing-cat 4-frame, holo-globe, terminal, ticker, rickshaw, dog, modular blocks, core machine, etc. — full list in code).

### 4. Transitions (between worlds)
9 props, 64×280: rope, fire-escape, cable, vault-chain, stage-truss, cable-tray, conveyor, tour-bus-stairs, ladder.

### 5. Skill icons (35)
One per skill from your dump, grouped by family (Strategy, Design, Engineering, Music, Growth). 32×32 transparent.

### 6. UI frames
- `title-card-frame.png` (9-slice, recolored per world via CSS)
- `speech-bubble.png` (9-slice)
- `dialog-box.png` (9-slice)
- `avatar-riso.png` (your photo, riso-treated — I'll use the one in current `HirePanel` if present, otherwise placeholder)

## Generation method

- Use `imagegen` `premium` tier for all hero-tier worlds + character + UI frames (best text + detail).
- Use `standard` for vignette worlds, props, skill icons (faster, still high quality).
- Character consistency: generate the master sheet first, then `edit_image` from it for every other pose and for the avatar.
- World consistency: generate one "style master" tile first; every subsequent world references it in the prompt so palette/grain/line weight match.
- All sprites: `transparent_background: true` where appropriate, on a clean white background prompt.

## Code wiring (after assets land)

- Delete: `CliffNotesCard.tsx`, NES theme tokens, `draw.ts` character/cabinet code, theme switch in `Hud.tsx`.
- New components: `Journey.tsx` (single continuous character driven by scrollY), `WorldStage.tsx` (3-layer parallax bg + props), `TitleCard.tsx`, `SpeechBubble.tsx`, `DialogBox.tsx`, `SkillBelt.tsx`, `Transition.tsx`.
- Rewrite: `scenes.ts` (sprite refs, path, props, transition, 2 bullets), `resume.ts` (skill catalog + per-chapter awards), `styles.css` (riso tokens), `routes/index.tsx`, `Hud.tsx` (slim).
- Keep: `MiniGame` shell (riso re-skin), `pickups.ts` (repurposed as skill collection), `state.ts`, `audio.ts`.

## Order of operations in build mode

1. Generate hero sprite master + all pose variants (~7 files).
2. Generate style-master tile, then 9 worlds × 3 layers (~27 files).
3. Generate props (~50 files), transitions (9), skill icons (35), UI frames (4).
4. Wire `Journey` + `WorldStage` with the new sprites.
5. Replace `index.tsx` to use the single continuous journey.
6. QA: scroll the full page, verify character continuity, verify every world reads cleanly, verify skill collection.

## What you can swap later

Every asset lives at a stable filename in `src/assets/game/`. Drop a replacement PNG with the same name → it just works. I'll print the full filename manifest at the end so you have a checklist.

Approve to start generating.
