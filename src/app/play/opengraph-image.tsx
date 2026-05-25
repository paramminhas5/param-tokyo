import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { CHAPTERS, HERO } from "@/content/resume";
import { loadOgFont } from "../_og-fonts";

export const runtime = "nodejs";
export const alt = `Play · ${HERO.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * /play OG card. Strip of all 9 chapter posters across the bottom, big "PLAY"
 * banner on top. Communicates "this is the cinematic experience" at a glance.
 */
export default async function PlayOpengraph() {
  const posters = await Promise.all(
    CHAPTERS.map(async (c) => {
      const buf = await readFile(
        path.join(process.cwd(), "public/game/posters", `${c.id}.png`),
      );
      return `data:image/png;base64,${buf.toString("base64")}`;
    }),
  );

  const grotesk = await loadOgFont("display");
  const mono = await loadOgFont("mono");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#050310",
          color: "#f0ece4",
          fontFamily: "Grotesk",
        }}
      >
        {/* Top: title block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "56px 64px 24px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Mono",
              fontSize: 18,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#fbbf24",
            }}
          >
            Play · 9 Worlds · 15 Years
          </span>
          <span
            style={{
              fontSize: 120,
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: -4,
              marginTop: 16,
              color: "#f0ece4",
            }}
          >
            {HERO.name}
          </span>
          <span
            style={{
              fontFamily: "Mono",
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#ff6b5b",
              marginTop: 18,
            }}
          >
            {HERO.tagline}
          </span>
        </div>

        {/* Bottom: poster strip — 9 chapter posters in a row */}
        <div
          style={{
            display: "flex",
            height: 240,
            background: "#0a0814",
            borderTop: "2px solid rgba(251,191,36,0.4)",
          }}
        >
          {posters.map((url, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flex: 1,
                height: "100%",
                borderRight:
                  i < posters.length - 1 ? "1px solid rgba(251,191,36,0.2)" : "none",
              }}
            >
              <img
                alt=""
                src={url}
                width={133}
                height={240}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Grotesk", data: grotesk, weight: 700 },
        { name: "Mono", data: mono, weight: 400 },
      ],
    },
  );
}
