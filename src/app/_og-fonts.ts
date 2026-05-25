/**
 * Shared font loader for OpenGraph image routes.
 *
 * Satori (under next/og) cannot consume woff2 or variable-axis TTFs. We pull
 * static-axis TTFs directly from the google/fonts repo on GitHub. The fonts
 * are visually-close stand-ins for the on-page Space Grotesk + Space Mono.
 *
 *   Poppins-Bold     → display family (substitutes for Space Grotesk)
 *   IBMPlexMono-Reg  → monospace family (substitutes for Space Mono)
 *
 * Buffers are tiny (~50–250 KB) and Next's fetch cache memoizes them across
 * the OG routes so the second route call is free.
 */
const FONT_URLS = {
  display:
    "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf",
  mono:
    "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf",
} as const;

export type OgFont = keyof typeof FONT_URLS;

export async function loadOgFont(kind: OgFont): Promise<ArrayBuffer> {
  const res = await fetch(FONT_URLS[kind]);
  if (!res.ok) {
    throw new Error(`Failed to fetch OG font ${kind}: ${res.status}`);
  }
  return await res.arrayBuffer();
}
