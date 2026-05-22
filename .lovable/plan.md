
# Continuous character + richer worlds + modern polish

Big lift across world art, character continuity, content density, modals, HUD, and a theme switch.

## 1. Character travels continuously between worlds

Today: each panel has its own canvas; character disappears at panel end and respawns. Change to one shared character that climbs/descends between panels so it reads as one journey.

- **Inter-panel transitions**: between every chapter add a thin "bridge" strip (~30vh) drawn as part of the next panel's top: a rope, ladder, vine, scaffold, or chute that visually connects the previous ground line to the next sky.
- Each `Scene` gets `entry` and `exit` waypoints + an `entryProp` (rope / ladder / chute / pipe / cable car) drawn at the top of the panel.
- The character's path now runs: `entry (top, climbing down) → through the scene → exit (bottom-right, dangling off the edge)`. The previous panel's exit prop and the next panel's entry prop are the *same prop kind* and aligned at the same x so the eye reads it as continuous.
- The character is always on-canvas in whichever panel is currently in viewport, no fade.

## 2. Worlds are richer and the "play" affordance is unmistakable

- Expand each scene from ~8 props to ~16-20 with 3 parallax layers (far / mid / near). Add per-chapter dressing: rooftop bedroom (CRT + bed + cassette wall + posters + cat); warehouse (shelves stacked deep + forklift silhouette + barcode wall); rental street (autorickshaw + 3 houses + power lines + dog); AI lab (server wall + terminal cluster + chat bubbles + AC vents); vault tower (5 stacked vaults + pulley + ticker board + papers); sneaker arena (crowd rows + stage truss + DJ booth + LED wall); agent farm (rack rows + holo-globe + cable trays); stage (drum kit + DJ deck + cats dancing + EQ wall); workshop (modular blocks + crane + glowing core machine).
- Replace the small bottom-right "▶ PLAY" button with a clear in-world **arcade cabinet** prop at `playX`. When the character reaches it: cabinet lights flash, a big floating "PRESS ▶" tag pops above it, and a parallel keyboard `Space` shortcut works. Cabinet is themed per chapter (e.g., sneaker drop terminal, vault console, mixing desk, AI terminal).

## 3. Floating tags become collectible pickups that pop during play

- Today: outcome strings are static chips covering the canvas. Change to **floating pickup tokens** scattered along the character's path (one per outcome, ~5-6 per chapter). Each token is a small pixel chip with the outcome label as a tooltip.
- As the character walks past, tokens auto-collect with a `+1` pop animation and slide into a thin **inventory rail** docked at the bottom of the viewport (always visible across panels).
- Replace the current `<div>` outcome chips on top of the canvas with these in-world tokens — nothing covers the artwork anymore.

## 4. CV-style "cliff notes" intro card per world

When a panel enters viewport, a clean modern **chapter card** slides in from the side (motion-driven) showing:
- Year · Org · Role (title)
- 1-line hook
- "Built on:" — chips of skills earned in *previous* panels that apply here (computed from a new `chapter.builtOn: SkillId[]` field added to `resume.ts`)
- "New skill:" — the skill this panel awards
- 2 short bullets (trimmed from current paragraphs)

The card slides out as the panel exits. It sits beside the canvas (right rail on desktop, top sheet on mobile <768px) and never overlaps the character. Long-form paragraphs stay only on `/cv`.

## 5. Modals appear as you scroll, not just on click

- The skill-earned modal, the cliff-notes card, and the end-of-journey "let's work together" card all surface automatically via `IntersectionObserver` triggers at scroll thresholds — using motion-react slide/fade.
- Mini-game modal still requires action (click cabinet / press Space) — auto-popping a game would be annoying.
- A "skills earned" pop appears briefly each time a new skill is added.

## 6. HIRE tab → full contact panel

Today HIRE is a `mailto:`. Change to a HUD button that opens a slide-out **HIRE panel** with:
- Photo / avatar block, name, location, availability line
- Email (copy button), LinkedIn, X, personal site
- "Currently building" — Iterate + Cats Can Dance with one-liners
- Quick stats row (from `HERO.stats`)
- A short pitch paragraph
- Direct `mailto:` CTA + "Download CV" link

Same drawer is reachable from a sticky bottom-right "HIRE" pill on mobile.

## 7. Modern, clean, professional look + theme switch

The current palette (deep purple + magenta + gold + cyan, NES-style) is what the user dislikes. Add a **theme switch** in the HUD that toggles between two cohesive themes; persisted to `localStorage`.

- **Theme A — "Console" (default new)**: charcoal + ivory + a single warm accent (terracotta/amber). Modern, editorial, calm. Pixel art still works but with muted palette.
- **Theme B — "Midnight"**: near-black + cool slate + electric mint accent. Sharper, tech-forward.

Both themes share: single accent, generous whitespace in the HUD/cards, modern sans (Inter for body, JetBrains Mono for labels), pixel font only for in-world signs and HUD micro-labels — not for body text. Pixel-art canvases are re-tinted per theme via CSS vars (`--scene-sky`, `--scene-ground`, `--scene-accent`, `--scene-silhouette`) that override per-scene defaults.

Cards/modals/HUD get: subtle 1px borders, soft elevation (no neon shadows), 8/16/24px rhythm, motion-react for entry/exit, no more `box-shadow: 4px 4px 0` brutalist blocks.

## 8. Files to change

- `src/content/resume.ts` — add `builtOn: SkillId[]`, `outcomes` stays (used as pickup labels), trim paragraphs to 2× <180 chars, add `entry`/`exit` hints.
- `src/game/scenes.ts` — add `entryProp`, `exitProp`, `entryX`, `exitX`; expand each `props` array (~16-20 each); add `pickups: { x, y, label, skillRef? }[]`; convert `playX` into an in-world `arcadeCabinet` prop.
- `src/game/draw.ts` — new prop renderers (`arcadeCabinet`, `rope`, `chute`, `cableCar`, `forklift`, `dog`, `djDeck`, `drumKit`, `holoGlobe`, `cat-dancing`, etc.), 3-layer parallax helper, theme-aware palette reading from CSS vars.
- `src/components/ChapterPanel.tsx` — share character across panels via a new top-level `GameWorld` provider (see below); render cliff-notes card with motion-react via `IntersectionObserver`; remove cover-up chips; render in-canvas pickups; show in-canvas cabinet + PRESS prompt.
- New `src/components/GameWorld.tsx` — wraps the page, owns the character's continuous position (scrollY-driven across all panels), draws the character onto whichever panel canvas is currently visible, runs the inventory rail at the bottom.
- New `src/components/CliffNotesCard.tsx` — slide-in chapter card.
- New `src/components/HirePanel.tsx` — full contact drawer.
- New `src/components/InventoryRail.tsx` — sticky bottom rail of collected tokens.
- New `src/components/ThemeSwitch.tsx` + `src/game/theme.ts` — two themes, localStorage, applies a `data-theme` attribute on `<html>`.
- `src/components/Hud.tsx` — wire theme switch + HIRE drawer; remove the brutalist styling.
- `src/styles.css` — add `[data-theme="console"]` and `[data-theme="midnight"]` palettes with shared modern tokens (spacing, borders, shadows); add `--scene-*` CSS vars per theme that the canvas reads.
- `src/routes/index.tsx` — render `<GameWorld>` wrapper around `CHAPTERS.map(...)`, plus `<InventoryRail>`, plus auto-surfacing end card.

Add `motion` (`framer-motion` replacement) via `bun add motion`.

## Out of scope

- Mini-game logic changes (same 3 kinds, just launched from the cabinet prop).
- `/cv` route changes.
- Audio bed beyond existing sfx.

## Open questions

1. **Two themes is the ask — should the *default* be the new "Console" (charcoal + amber) or "Midnight" (near-black + mint)?** I'll default to Console unless you say otherwise.
2. **For the inter-panel bridge, is one shared metaphor OK (e.g., always a rope) or per-chapter (rope → cargo lift → ladder → fire-escape → vault chain → stage truss → cable → tour bus stairs → conveyor)?** Per-chapter is richer; defaulting to that.
