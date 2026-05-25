import type { Metadata } from "next";
import { CHAPTERS, HERO } from "@/content/resume";
import { Intro } from "@/components/Intro";
import { Outro } from "@/components/Outro";
import { Hud } from "@/components/Hud";
import { GlobalHero } from "@/components/GlobalHero";
import { WorldCard } from "@/components/WorldCard";
import { WorldTransition } from "@/components/WorldTransition";
import { WorldStage } from "@/components/WorldStage";
import { WorldTitleSplash } from "@/components/WorldTitleSplash";
import { CinematicGrain } from "@/components/CinematicGrain";
import { SkillBelt } from "@/components/SkillBelt";
import { MobileTouchScroll } from "@/components/MobileTouchScroll";

export const metadata: Metadata = {
  title: "Play",
  description: `${HERO.name} — playable résumé. Scroll through ${CHAPTERS.length} worlds.`,
  openGraph: {
    title: "Play · Param Minhas",
    description: "15 years of building. Scroll through 9 worlds.",
  },
};

/**
 * Cinematic 9-world playable résumé.
 *
 * Rendering stack (back → front):
 *   - Scrolling content:  Intro → 9× WorldStage (each: 9-layer parallax) → Outro
 *   - Fixed chrome:       Hud (top) · GlobalHero (mid) · WorldCard (corner)
 *                         WorldTitleSplash (center, on world change)
 *                         WorldTransition (letterbox + noise on world change)
 *                         CinematicGrain (full-screen film grain)
 *                         SkillBelt (bottom)
 *   - Input layer:        MobileTouchScroll (touch swipe → scroll, no DOM)
 *
 * The progress engine wires up via each WorldStage's registerWorldEl on mount.
 */
export default function PlayPage() {
  return (
    <main className="game-chrome" style={{ position: "relative", background: "#050310" }}>
      <a href="#start" className="skip-link">
        Skip to first world
      </a>
      <MobileTouchScroll />

      {/* Fixed-position cinematic chrome */}
      <Hud />
      <GlobalHero />
      <WorldCard />
      <WorldTitleSplash />
      <WorldTransition />
      <CinematicGrain />

      {/* Scrolling content stack */}
      <Intro />
      <div id="start" />
      {CHAPTERS.map((chapter) => (
        <WorldStage key={chapter.id} chapter={chapter} />
      ))}
      <Outro />

      <SkillBelt />
    </main>
  );
}
