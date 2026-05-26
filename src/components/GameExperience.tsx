"use client";

import { useEffect } from "react";
import { CHAPTERS } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { useTotalProgress } from "@/game/scroller";
import { Intro } from "./Intro";
import { WorldStage } from "./WorldStage";
import { Outro } from "./Outro";
import { GlobalHud } from "./GlobalHud";
import { CustomCursor } from "./CustomCursor";

/**
 * GameExperience — the entire scroll-driven résumé.
 *
 * Total scroll height:
 *   Intro   1 × 100vh
 *   Worlds  9 × 300vh = 2700vh
 *   Outro   ~120vh
 *   ≈ 2920vh
 *
 * Structure:
 *   CustomCursor  (fixed, colour-synced to world)
 *   GlobalHud     (fixed overlay — progress, dots, skill bar, mute, CV)
 *   PreloadManager (invisible, preloads next 2 worlds)
 *   <main>
 *     Intro
 *     WorldStage × 9
 *     Outro
 *   </main>
 */
export function GameExperience() {
  return (
    <>
      <CustomCursor />
      <GlobalHud />
      <PreloadManager />
      <main style={{ background: "#050310" }}>
        <Intro />
        {CHAPTERS.map((ch) => (
          <WorldStage key={ch.id} chapter={ch} />
        ))}
        <Outro />
      </main>
    </>
  );
}

/**
 * Preloads bg + all layer assets for the next 2 worlds ahead of scroll position.
 */
function PreloadManager() {
  const totalP = useTotalProgress();

  useEffect(() => {
    const INTRO_W = 1, WORLD_W = 3;
    const total_W = INTRO_W + CHAPTERS.length * WORLD_W + 1;
    const currentIdx = Math.min(
      CHAPTERS.length - 1,
      Math.max(0, Math.floor((totalP * total_W - INTRO_W) / WORLD_W))
    );

    [currentIdx + 1, currentIdx + 2].forEach((idx) => {
      if (idx < 0 || idx >= CHAPTERS.length) return;
      const ch = CHAPTERS[idx];
      const w  = WORLDS[ch.id];
      if (!w) return;
      const layers = [w.sky, w.far, w.mid, w.near, w.fg];
      layers.forEach((src) => {
        const id = `preload-${src}`;
        if (document.getElementById(id)) return;
        const link  = document.createElement("link");
        link.id     = id;
        link.rel    = "preload";
        link.as     = "image";
        link.href   = src;
        document.head.appendChild(link);
      });
    });
  }, [totalP]);

  return null;
}
