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
 * Structure:
 *   CustomCursor (fixed, color-synced to world)
 *   GlobalHud    (fixed overlay — progress bar, dot nav, skill HUD, CV link, mute)
 *   <main>
 *     Intro     (100vh)
 *     WorldStage × 9  (each 200vh — sticky scene + scroll space)
 *     Outro     (100vh+)
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
 * PreloadManager — preloads bg + fg images for the next world ahead of time.
 * Uses a hidden <link rel="preload"> strategy via DOM insertion.
 */
function PreloadManager() {
  const totalP = useTotalProgress();

  useEffect(() => {
    const INTRO_W = 1, WORLD_W = 2;
    const total_W = INTRO_W + CHAPTERS.length * WORLD_W + 1;

    // Find current world index
    const currentIdx = Math.min(
      CHAPTERS.length - 1,
      Math.max(0, Math.floor((totalP * total_W - INTRO_W) / WORLD_W))
    );

    // Preload next 2 worlds
    [currentIdx + 1, currentIdx + 2].forEach((idx) => {
      if (idx < 0 || idx >= CHAPTERS.length) return;
      const ch = CHAPTERS[idx];
      const world = WORLDS[ch.id];
      if (!world) return;

      [world.bg, world.fg].forEach((src) => {
        const id = `preload-${src}`;
        if (document.getElementById(id)) return;
        const link = document.createElement("link");
        link.id = id;
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      });
    });
  }, [totalP]);

  return null;
}
