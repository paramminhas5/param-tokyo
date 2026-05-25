import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { HERO } from "@/content/resume";
import { loadOgFont } from "./_og-fonts";

// Node runtime so we can read /public from disk.
export const runtime = "nodejs";
export const alt = `${HERO.name} — ${HERO.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Root OG card for /. Generated at build time, then cached.
 *
 * Layout: title poster on the left (520×630, full-bleed cover) + name + tagline
 * + bio + the four headline stats on the right. ImageResponse uses Yoga so all
 * elements need explicit `display: flex`. No CSS animations — single-frame PNG.
 */
export default async function OpengraphImage() {
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
          background: "#050310",
          color: "#f0ece4",
          fontFamily: "Grotesk",
        }}
      >
        {/* Left: title poster */}
        <div style={{ display: "flex", width: 480, height: 630 }}>
          <img
            alt=""
            src={posterUrl}
            width={480}
            height={630}
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Right: text block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "60px 64px",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Mono",
              fontSize: 18,
              letterSpacing: 4,
              color: "#fbbf24",
              textTransform: "uppercase",
            }}
          >
            A Playable Résumé · 9 Worlds
          </span>

          <span
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: -3,
              marginTop: 24,
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
              color: "#ff6b5b",
              textTransform: "uppercase",
              marginTop: 18,
            }}
          >
            {HERO.tagline}
          </span>

          <span
            style={{
              fontSize: 22,
              color: "rgba(240,236,228,0.78)",
              marginTop: 22,
              lineHeight: 1.45,
            }}
          >
            E-commerce → AI → sneaker culture → AI-native marketing.
          </span>

          {/* Stat strip */}
          <div
            style={{
              display: "flex",
              marginTop: 40,
              gap: 1,
              border: "1px solid rgba(251,191,36,0.4)",
              background: "rgba(251,191,36,0.4)",
            }}
          >
            {HERO.stats.slice(0, 4).map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#0a0814",
                  padding: "14px 16px",
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: "Mono",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#fbbf24",
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontFamily: "Mono",
                    fontSize: 11,
                    letterSpacing: 1.5,
                    color: "rgba(240,236,228,0.55)",
                    textTransform: "uppercase",
                    marginTop: 6,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
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
