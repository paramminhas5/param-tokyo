"use client";

import { CHAPTERS } from "@/content/resume";
import { Intro } from "./Intro";
import { WorldStage } from "./WorldStage";
import { Outro } from "./Outro";
import { GlobalHud } from "./GlobalHud";

/**
 * GameExperience — the entire scroll-driven résumé.
 *
 * Structure:
 *   GlobalHud  (fixed overlay — progress bar, skill HUD, CV link)
 *   <main>
 *     Intro     (100vh)
 *     WorldStage × 9  (each 200vh — sticky scene + scroll space)
 *     Outro     (100vh)
 *   </main>
 *
 * Total scroll height ≈ 2000vh
 * NO horizontal scroll. NO timers. Pure vertical scroll math.
 */
export function GameExperience() {
  return (
    <>
      <GlobalHud />
      <main
        style={{
          background: "#050310",
          // No overflow: hidden — would break sticky positioning
        }}
      >
        <Intro />
        {CHAPTERS.map((ch) => (
          <WorldStage key={ch.id} chapter={ch} />
        ))}
        <Outro />
      </main>
    </>
  );
}
