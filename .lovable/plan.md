## Goal

Kill the "stacked sections + box on the side" layout. Turn the whole resume into **one continuous pixel world** that the player-character walks through as you scroll. Text shrinks down to short, punchy callouts that appear in-world (signs, speech bubbles, item pickups) so the game does the storytelling.

## The new shape

```text
┌─────────────────────────────────────────────────────────┐
│  HUD (sticky top): name · skills earned · sound toggle  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         FULL-VIEWPORT PIXEL WORLD (sticky)              │
│   sky · parallax · ground · props · character           │
│                                                         │
│   ▲ tiny overlay callouts fade in/out per "zone"        │
│   ▲ press-to-play prompt when near a boss flag          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Tall invisible scroll track drives world position      │
│  (no visible section boxes, no side-by-side text)       │
└─────────────────────────────────────────────────────────┘
```

One sticky full-bleed canvas. A tall invisible scroll spacer underneath maps scroll progress (0 → 1) to a horizontal+vertical camera path through a single long level. Every chapter is a **zone** on that level, not a DOM section.

## Character behavior, contextual to scroll + zone

- **Horizontal scroll progress** → walks right (or left when scrolling up). Walk-cycle frame ticks with velocity; idle pose when scroll stops.
- **Vertical moments** baked into the level path:
  - Climbs a ladder at the *Iterate* tower
  - Drops down into the *real-estate* vault
  - Jumps onto crates at the *SoleSearch* shop
  - Grabs the mic at the *Cats Can Dance* stage
- **Facing** flips to face the prop being approached (sign, NPC, item).
- **Reactions**: tiny emote above head per zone — `!` near a boss flag, `♪` near the mic, `$` near the vault, `★` on skill pickup.

## Text → game elements (kill the wall of paragraphs)

For each chapter, keep only:
- **1 sign post** with org + year (rendered in-canvas, pixel font)
- **1 one-line hook** (~8 words) shown as an overlay caption that fades in when the camera enters the zone, fades out when it leaves
- **2–3 outcome chips** as collectible pixel items (coins / floppies / trophies) the character visibly picks up
- **1 skill pickup** (existing system) — touching it triggers the mini-game boss

Everything else (long paragraphs, press list, full skill grid) moves to `/cv` so the home page is purely the playable world. A small "📜 READ THE FULL CV" sign at the end of the level links there.

## Zones along the level (left → right)

1. Hero spawn — name + tagline as a billboard, "▶ PLAY" prompt
2. E-commerce shop — shelves, coin pickups
3. Real-estate tower — climb ladder, vault
4. Conversational AI lab — server rack, antenna
5. SoleSearch street — sneakers, crates
6. Fere.ai trading floor — charts on monitors
7. Cats Can Dance stage — mic, speakers
8. End screen — contact mailbox, CV sign, social flags

## Technical approach

- New `WorldScene.tsx`: single sticky canvas, full viewport height, drives a virtual camera over a wide logical world (e.g. `2400×144` logical px).
- New `useScrollProgress` hook on a tall outer container (`~800vh`) → maps to `cameraX` and triggers per-zone events.
- Character physics: simple state machine (`walk` / `idle` / `climb` / `jump` / `interact`) driven by zone metadata, not by user input.
- Overlay layer (DOM, absolutely positioned over canvas) for fading captions + the existing `MiniGame` modal trigger. Captions use the existing pixel font, max ~80 chars.
- Reuse existing `PixelStage` drawing primitives (`drawProp`, `drawCharacter`, `fillSky`) — extend with `climb` frames, `jump` frames, emote sprites, and pickup sprites.
- Reuse `game/state.ts` skills + `game/audio.ts` sfx.
- Delete the per-chapter `ChapterSection` layout from `routes/index.tsx`; replace with `<WorldScene />` + minimal HUD + footer.
- Move the long-form paragraphs, press list, companies, and skill groups onto `/cv` (already exists) so nothing is lost.

## Out of scope for this pass

- New mini-games (existing ones stay; only the trigger flow changes)
- Mobile gesture controls beyond scroll (touch-scroll already drives the camera)
- Audio music bed (keep current sfx only)

## Acceptance

- Home page is one continuous pixel level, no stacked text/canvas sections.
- Scrolling moves the character through the world; vertical scroll progress maps to in-world horizontal + vertical motion.
- Character visibly reacts (faces, climbs, jumps, emotes, picks up items) at each zone.
- No paragraph of body copy on the home route — only short in-world captions, signs, and chips.
- Full long-form resume content still reachable via `/cv`.
