import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { HERO } from "@/content/resume";
import { loadOgFont } from "../_og-fonts";

export const runtime = "nodejs";
export const alt = `${HERO.name} — Curriculum Vitae`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * /cv OG card. Cream paper background to match the actual CV page,
 * deep ink text. Title poster on the right as a printed-poster artifact.
 */
export default async function CvOpengraph() {
  const posterBuf = await readFile(
    path.join(process.cwd(), "public/game/posters/title.png"),
  );
  const posterUrl = `data:image/png;base64,${posterBuf.toString("base64")}`;

  const grotesk = await loadOgFont("display");
  const mono = await loadOgFont("mono");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6f1e6",
          color: "#0e0820",
          fontFamily: "Grotesk",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "70px 72px",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Mono",
              fontSize: 18,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "rgba(14,8,32,0.55)",
            }}
          >
            Curriculum Vitae · 2026
          </span>
          <span
            style={{
              fontSize: 110,
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: -4,
              marginTop: 22,
              color: "#0e0820",
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
              color: "#dc2626",
              marginTop: 22,
            }}
          >
            {HERO.tagline}
          </span>
          <span
            style={{
              fontSize: 24,
              color: "rgba(14,8,32,0.85)",
              marginTop: 20,
              lineHeight: 1.4,
              maxWidth: 540,
            }}
          >
            Nine chapters. Bengaluru → Bengaluru, with everything in between.
          </span>
          <span
            style={{
              fontFamily: "Mono",
              fontSize: 16,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "rgba(14,8,32,0.65)",
              marginTop: 32,
            }}
          >
            paramminhas.com / cv
          </span>
        </div>

        <div
          style={{
            display: "flex",
            width: 420,
            height: 630,
            padding: 32,
            background: "#0e0820",
          }}
        >
          <img
            alt=""
            src={posterUrl}
            width={356}
            height={566}
            style={{ objectFit: "cover" }}
          />
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
