/**
 * Tiny FAL.ai client — calls fal-ai/flux/schnell synchronously and returns
 * the raw image buffer. No retries, no backoff; this script runs once and
 * we re-roll any bad outputs by editing the manifest and re-running.
 *
 * Intentionally fetch-based, no @fal-ai/client dep. Schnell completes in
 * < 1s of inference time, so the sync endpoint is fine.
 */

const FAL_ENDPOINT = "https://fal.run/fal-ai/flux/schnell";

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
