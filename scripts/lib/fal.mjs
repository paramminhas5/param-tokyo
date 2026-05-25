/**
 * Tiny FAL.ai client — calls fal-ai/flux/schnell synchronously and returns
 * the raw image buffer. Also supports Minimax video generation for animated
 * backgrounds. No retries, no backoff; this script runs once and we re-roll
 * any bad outputs by editing the manifest and re-running.
 *
 * Intentionally fetch-based, no @fal-ai/client dep. Schnell completes in
 * < 1s of inference time, so the sync endpoint is fine.
 */

const FAL_ENDPOINT = "https://fal.run/fal-ai/flux/schnell";
const MINIMAX_ENDPOINT = "https://fal.run/fal-ai/minimax-video/image-to-video";

/**
 * @param {object} args
 * @param {string} args.prompt
 * @param {{ width: number, height: number } | string} args.size
 * @param {number} [args.steps] - 1..4 for schnell
 * @param {number} [args.seed] - optional seed for reproducibility
 * @returns {Promise<Buffer>} JPEG/PNG buffer of the generated image
 */
export async function callFlux({ prompt, size, steps = 4, seed }) {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY env var missing — load .env.local first");

  const body = {
    prompt,
    image_size: size,
    num_inference_steps: steps,
    num_images: 1,
    enable_safety_checker: false,
  };
  if (seed != null) body.seed = seed;

  const res = await fetch(FAL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`FAL ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = await res.json();
  const url = json?.images?.[0]?.url;
  if (!url) throw new Error(`FAL returned no image: ${JSON.stringify(json).slice(0, 200)}`);

  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status}`);
  const arrayBuffer = await imgRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generate video from image using Minimax image-to-video.
 * Perfect for animated Pokemon-style backgrounds (clouds drifting, water flowing, etc.)
 * 
 * @param {object} args
 * @param {string} args.imageUrl - URL of the input image (or base64 data URL)
 * @param {string} args.prompt - Motion description (e.g., "gentle clouds drifting left, subtle parallax")
 * @param {number} [args.duration] - Video duration in seconds (default: 5)
 * @param {number} [args.seed] - optional seed for reproducibility
 * @returns {Promise<Buffer>} MP4 buffer of the generated video
 */
export async function callMinimaxVideo({ imageUrl, prompt, duration = 5, seed }) {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY env var missing — load .env.local first");

  const body = {
    image_url: imageUrl,
    prompt,
    duration_seconds: duration,
  };
  if (seed != null) body.seed = seed;

  console.log(`  ▸ Minimax video generation (${duration}s): ${prompt.slice(0, 50)}...`);

  const res = await fetch(MINIMAX_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Minimax ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = await res.json();
  const url = json?.video?.url;
  if (!url) throw new Error(`Minimax returned no video: ${JSON.stringify(json).slice(0, 200)}`);

  const videoRes = await fetch(url);
  if (!videoRes.ok) throw new Error(`Video download failed: ${videoRes.status}`);
  const arrayBuffer = await videoRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generate video from text prompt using Minimax text-to-video.
 * For fully generative animated backgrounds.
 * 
 * @param {object} args
 * @param {string} args.prompt - Full scene description with motion
 * @param {number} [args.duration] - Video duration in seconds (default: 5)
 * @param {string} [args.aspectRatio] - "16:9" | "9:16" | "1:1" (default: "16:9")
 * @param {number} [args.seed] - optional seed for reproducibility
 * @returns {Promise<Buffer>} MP4 buffer of the generated video
 */
export async function callMinimaxTextToVideo({ prompt, duration = 5, aspectRatio = "16:9", seed }) {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY env var missing — load .env.local first");

  const body = {
    prompt,
    duration_seconds: duration,
    aspect_ratio: aspectRatio,
  };
  if (seed != null) body.seed = seed;

  console.log(`  ▸ Minimax text-to-video (${duration}s): ${prompt.slice(0, 50)}...`);

  // Note: text-to-video endpoint may be different, check FAL docs
  const endpoint = "https://fal.run/fal-ai/minimax-video/text-to-video";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Minimax T2V ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = await res.json();
  const url = json?.video?.url;
  if (!url) throw new Error(`Minimax T2V returned no video: ${JSON.stringify(json).slice(0, 200)}`);

  const videoRes = await fetch(url);
  if (!videoRes.ok) throw new Error(`Video download failed: ${videoRes.status}`);
  const arrayBuffer = await videoRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
