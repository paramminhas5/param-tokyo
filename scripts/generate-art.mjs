/**
 * Art generation runner. Reads manifest.mjs, calls FAL for each entry,
 * post-processes, writes to public/game/**, then composes the hero sprite sheet.
 *
 * Usage:
 *   npm run art:gen                    # generate everything that's missing
 *   npm run art:gen -- --force          # regenerate everything
 *   npm run art:gen -- --only=hero,grp  # regenerate only matching keys
 *
 * Concurrency is capped at 6 — Flux Schnell is fast (~1s) but FAL has rate
 * limits and we're polite. Failures are isolated; one bad prompt doesn't kill
 * the run.
 */

import { mkdir, writeFile, stat, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { callFlux } from "./lib/fal.mjs";
import { pixelize, silhouetteToAlpha, whiteToAlpha, composeHorizontalSheet } from "./lib/pixel.mjs";
import { buildManifest } from "./manifest.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const args = parseArgs(process.argv.slice(2));

async function main() {
  if (!process.env.FAL_KEY) {
    console.error("✗ FAL_KEY not in env. Run with: node --env-file=.env.local scripts/generate-art.mjs");
    process.exit(1);
  }

  const items = buildManifest().filter((it) => {
    if (args.only && !args.only.some((k) => it.key.includes(k))) return false;
    return true;
  });

  console.log(`▸ ${items.length} asset${items.length === 1 ? "" : "s"} queued`);
  if (args.dryRun) {
    items.forEach((it) => console.log(`   ${it.key.padEnd(20)} → ${it.out}`));
    return;
  }

  // Skip already-generated files unless --force.
  const todo = [];
  for (const it of items) {
    const abs = resolve(ROOT, it.out);
    if (!args.force && (await fileExists(abs))) {
      console.log(`  ✓ skip (exists)   ${it.key}`);
      continue;
    }
    todo.push(it);
  }

  console.log(`▸ ${todo.length} to generate (use --force to re-roll all)\n`);

  const results = await runWithConcurrency(todo, 6, async (it) => {
    try {
      await generateOne(it);
      return { ok: true, key: it.key };
    } catch (err) {
      return { ok: false, key: it.key, err };
    }
  });

  const fails = results.filter((r) => !r.ok);
  if (fails.length) {
    console.log("");
    console.log(`✗ ${fails.length} failed:`);
    fails.forEach((r) => console.log(`   ${r.key}: ${r.err.message}`));
  }

  // Compose the final hero sprite sheet from the two staging frames.
  const idleStaging = resolve(ROOT, "public/game/hero/_hero-idle.png");
  const walkStaging = resolve(ROOT, "public/game/hero/_hero-walk.png");
  if ((await fileExists(idleStaging)) && (await fileExists(walkStaging))) {
    await composeHeroSheet({ idleStaging, walkStaging });
  }

  console.log("\n✓ done");
}

async function generateOne(item) {
  const t0 = Date.now();
  const raw = await callFlux({
    prompt: item.prompt,
    size: item.size,
    seed: item.seed,
  });

  // Stage 1: pixelize via nearest-neighbor (the actual "look")
  const pixelized = await pixelize(raw, {
    width: item.size.width,
    height: item.size.height,
    pixelScale: item.pixelScale ?? 4,
  });

  // Stage 2: kind-specific post-processing
  let final;
  switch (item.kind) {
    case "silhouette":
      final = await silhouetteToAlpha(pixelized, { tint: item.tint ?? "#080414" });
      break;
    case "character":
      final = await whiteToAlpha(pixelized, { threshold: 245 });
      break;
    case "sky":
    case "poster":
    default:
      // Sky → re-encode as JPEG to keep size down. Poster → PNG for crispness.
      final =
        item.out.endsWith(".jpg") || item.out.endsWith(".jpeg")
          ? await sharp(pixelized).jpeg({ quality: 88 }).toBuffer()
          : await sharp(pixelized).png().toBuffer();
      break;
  }

  const abs = resolve(ROOT, item.out);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, final);

  const ms = Date.now() - t0;
  const kb = (final.length / 1024).toFixed(0);
  console.log(`  ✓ ${item.key.padEnd(20)} ${kb.padStart(5)} KB  ${ms}ms`);
}

/**
 * Compose hero-sheet.png: 6 cells × (1920/6=320 wide × 512 tall).
 * Cells 0,1: idle pose. Cells 2..5: walk pose with subtle horizontal offsets
 * to fake a foot-shuffle even before we have real per-frame art.
 */
async function composeHeroSheet({ idleStaging, walkStaging }) {
  console.log("\n▸ Composing hero sprite sheet (1920×512, 6 cells)…");
  const SHEET_W = 1920;
  const SHEET_H = 512;
  const CELL_W = SHEET_W / 6; // 320

  const idleBuf = await readFile(idleStaging);
  const walkBuf = await readFile(walkStaging);

  // Idle cells (0 and 1) — gentle 1px vertical offset on cell 1 for breathing.
  const idle0 = await fitToCell(idleBuf, CELL_W, SHEET_H, 0);
  const idle1 = await fitToCell(idleBuf, CELL_W, SHEET_H, 0); // same as 0; spring physics handles bob

  // Walk cells (2..5) — cycle through subtle horizontal offsets to fake stride.
  // Offsets in pixels: (-2, 0, 2, 0). Spring physics + scroll velocity make it feel real.
  const walk2 = await fitToCell(walkBuf, CELL_W, SHEET_H, -2);
  const walk3 = await fitToCell(walkBuf, CELL_W, SHEET_H, 0);
  const walk4 = await fitToCell(walkBuf, CELL_W, SHEET_H, 2);
  const walk5 = await fitToCell(walkBuf, CELL_W, SHEET_H, 0);

  const sheet = await composeHorizontalSheet({
    frames: [idle0, idle1, walk2, walk3, walk4, walk5],
    cellW: CELL_W,
    cellH: SHEET_H,
  });

  const out = resolve(ROOT, "public/game/hero/hero-pixel.png");
  await writeFile(out, sheet);
  console.log(`  ✓ hero-pixel.png   ${(sheet.length / 1024).toFixed(0)} KB`);
}

async function fitToCell(buf, cellW, cellH, xOffset) {
  // Resize the source to fit inside the cell (keep aspect, transparent bg),
  // then nudge horizontally by xOffset for fake stride.
  const fit = await sharp(buf)
    .resize(cellW, cellH, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: "nearest",
    })
    .png()
    .toBuffer();
  if (xOffset === 0) return fit;
  return await sharp({
    create: {
      width: cellW,
      height: cellH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: fit, left: xOffset, top: 0 }])
    .png()
    .toBuffer();
}

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function runWithConcurrency(items, limit, fn) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

function parseArgs(argv) {
  const out = { force: false, dryRun: false, only: null };
  for (const a of argv) {
    if (a === "--force") out.force = true;
    else if (a === "--dry-run") out.dryRun = true;
    else if (a.startsWith("--only=")) {
      out.only = a.slice("--only=".length).split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return out;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
