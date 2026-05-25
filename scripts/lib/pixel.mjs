import sharp from "sharp";

/**
 * Pixel-art post-processor.
 *
 * Flux outputs are smooth photographic. To make them feel like 16-bit pixel
 * art we downsample with nearest-neighbor (which destroys all the painterly
 * detail and locks us to a coarse grid), then upsample back to the output
 * size with nearest-neighbor (which keeps every pixel chunky and aliased).
 *
 * The `pixelScale` param controls how chunky: 4 = each "pixel" is a 4×4 block
 * at output size. 6+ for very chunky retro feel.
 */
export async function pixelize(input, { width, height, pixelScale = 4 }) {
  const dw = Math.max(1, Math.round(width / pixelScale));
  const dh = Math.max(1, Math.round(height / pixelScale));
  return await sharp(input)
    .resize(dw, dh, { kernel: "nearest", fit: "fill" })
    .resize(width, height, { kernel: "nearest", fit: "fill" })
    .toBuffer();
}

/**
 * Convert a "pure black silhouette on solid white background" image into a
 * transparent-background PNG silhouette. Pixels are weighted by inverted
 * luminance to drive alpha; RGB is forced to the chosen tint color.
 *
 * @param {Buffer} input - raw image buffer (any common format)
 * @param {object} opts
 * @param {string} [opts.tint] - RGB color of the silhouette (default black)
 * @param {number} [opts.alphaThreshold] - clamp anything brighter than this
 *   to alpha=0 to clean up dingy near-white background (0..255, default 235)
 */
export async function silhouetteToAlpha(input, { tint = "#000000", alphaThreshold = 235 } = {}) {
  const tintRgb = hexToRgb(tint);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Stride is RGBA. Walk pixels and rewrite.
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = (r * 299 + g * 587 + b * 114) / 1000; // perceived brightness
    // Brighter than threshold → fully transparent. Darker → opaque, by how dark.
    let alpha;
    if (lum >= alphaThreshold) {
      alpha = 0;
    } else {
      // Map [0..threshold] -> [255..0] linearly.
      alpha = Math.round(255 * (1 - lum / alphaThreshold));
    }
    data[i] = tintRgb.r;
    data[i + 1] = tintRgb.g;
    data[i + 2] = tintRgb.b;
    data[i + 3] = alpha;
  }

  return await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

/**
 * Strip a solid white background from an arbitrary image (e.g. character art
 * generated against a "pure white background" prompt). Keeps the subject's
 * own colors. Use a high threshold to avoid eating bright highlights.
 */
export async function whiteToAlpha(input, { threshold = 245 } = {}) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0;
    }
  }

  return await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

/**
 * Compose a horizontal sprite sheet from per-frame buffers.
 * Each frame buffer is resized to (cellW × cellH) with `fit: "contain"`,
 * preserving aspect ratio against a transparent background.
 */
export async function composeHorizontalSheet({ frames, cellW, cellH }) {
  const cells = await Promise.all(
    frames.map((buf) =>
      sharp(buf)
        .resize(cellW, cellH, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          kernel: "nearest",
        })
        .png()
        .toBuffer(),
    ),
  );

  const sheetW = cellW * frames.length;
  return await sharp({
    create: {
      width: sheetW,
      height: cellH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(cells.map((buf, i) => ({ input: buf, left: i * cellW, top: 0 })))
    .png()
    .toBuffer();
}

function hexToRgb(hex) {
  const m = hex.replace("#", "");
  return {
    r: parseInt(m.slice(0, 2), 16),
    g: parseInt(m.slice(2, 4), 16),
    b: parseInt(m.slice(4, 6), 16),
  };
}
