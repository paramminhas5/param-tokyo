# Art generation pipeline

All visible art on `/play` and `/` is generated via FAL.ai (Flux Schnell) and
post-processed into pixel art with `sharp`. The full set of assets is defined
in [`manifest.mjs`](./manifest.mjs).

## One-line usage

```bash
npm run art:gen                       # generate any missing assets
npm run art:gen -- --force             # regenerate everything (re-roll)
npm run art:gen -- --only=hero,grp     # regenerate only matching keys
npm run art:gen -- --dry-run           # list what would be generated
```

The runner expects `FAL_KEY` in `.env.local`. The npm script loads it via
Node's native `--env-file=.env.local`.

## What's in the manifest

| kind | count | output | post-process |
|---|---|---|---|
| sky | 9 | `public/game/worlds/{id}-sky.jpg` | nearest-neighbor pixelize |
| silhouette | 27 | `public/game/worlds/{id}-{far,mid,near}.png` | pixelize → luminance-to-alpha → tint |
| poster | 10 | `public/game/posters/{id}.png` (+ `title.png`) | pixelize |
| character | 2 staging | `public/game/hero/_hero-{idle,walk}.png` | pixelize → white-to-alpha |

After generation, the runner composes the two character frames into a
6-cell horizontal sprite sheet at `public/game/hero/hero-pixel.png` matching
the existing `HERO_FRAMES` contract (1920×512, frames 0–1 idle, 2–5 walk).

Total: ~50 Flux calls. Cost at flux/schnell rates ≈ $0.15. Runtime ~30–60s
with concurrency=6.

## Re-rolling

To re-roll a single asset:

1. Edit its prompt in `manifest.mjs`.
2. Delete the output file.
3. `npm run art:gen` — only the missing one regenerates.

To re-roll an entire world's layers, e.g. `hab`:

```bash
rm public/game/worlds/hab-{sky,far,mid,near}.* public/game/posters/hab.png
npm run art:gen
```

## Style lock

Every prompt ends with the style-lock clause:

> *16-bit pixel art, retro game aesthetic, sharp pixel edges, no anti-aliasing,
> limited palette, screen-print poster style.*

Reference stack: Sable + Katana Zero + Olly Moss + Fable. The pixel
post-process (downsample/upsample with nearest-neighbor) is what actually
delivers the look — the prompt only nudges Flux toward the right composition
and palette.

## When to re-run

- Adding a new chapter? Append it to `WORLD_BRIEFS` in `manifest.mjs`.
- Want a tighter palette on one world? Edit that world's prompts and re-roll
  with `--only={id}`.
- Bumping pixel chunkiness? Change `pixelScale` in the manifest entry (4 = chunky, 6+ = very chunky).
