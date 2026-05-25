import type { Metadata } from "next";
import { CHAPTERS, HERO } from "@/content/resume";
import { Intro } from "@/components/Intro";
import { Outro } from "@/components/Outro";
import { Hud } from "@/components/Hud";
import { GlobalHero } from "@/components/GlobalHero";
import { WorldCard } from "@/components/WorldCard";
import { WorldTransition } from "@/components/WorldTransition";
import { WorldStage } from "@/components/WorldStage";
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
 * Mount order is critical — the fixed-position chrome (Hud, GlobalHero,
 * WorldCard, WorldTransition, SkillBelt) renders ABOVE the scrolling sections
 * (Intro → 9× WorldStage → Outro). The progress engine wires up via each
 * WorldStage's registerWorldEl on mount; the rest reacts via useProgress().
 */
export default function PlayPage() {
  return (
    <main className="game-chrome" style={{ position: "relative", background: "#050310" }}>
      {/* Input layer — one-shot effect components, no DOM */}
      <MobileTouchScroll />

      {/* Fixed-position cinematic chrome */}
      <Hud />
      <GlobalHero />
      <WorldCard />
      <WorldTransition />

      {/* Scrolling content stack */}
      <Intro />
      {CHAPTERS.map((chapter) => (
        <WorldStage key={chapter.id} chapter={chapter} />
      ))}
      <Outro />

      {/* Bottom inventory belt */}
      <SkillBelt />
    </main>
  );
}
