import type { Metadata } from "next";
import { CHAPTERS, HERO } from "@/content/resume";
import { JourneyIntro } from "@/components/JourneyIntro";
import { JourneyOutro } from "@/components/JourneyOutro";
import { JourneyNav } from "@/components/JourneyNav";
import { WorldScene } from "@/components/WorldScene";

export const metadata: Metadata = {
  title: "Experience",
  description: `${HERO.name} — interactive career journey. Scroll through ${CHAPTERS.length} worlds.`,
  openGraph: {
    title: "Experience · Param Minhas",
    description: "15 years of building. Scroll through 9 worlds.",
  },
};

/**
 * The Game — visual narrative walkthrough of career.
 *
 * Pure scroll-driven experience:
 *   - Intro (name + scroll prompt)
 *   - 9 world scenes (parallax + narration overlays)
 *   - Outro (CTA + links)
 *   - Fixed dot nav (right side)
 *
 * No hero sprite, no NPCs, no mini-games.
 * Ambient audio plays per world. Clean, atmospheric, immersive.
 */
export default function PlayPage() {
  return (
    <main style={{ position: "relative", background: "#050310" }}>
      <JourneyNav />
      <JourneyIntro />
      {CHAPTERS.map((chapter) => (
        <WorldScene key={chapter.id} chapter={chapter} />
      ))}
      <JourneyOutro />
    </main>
  );
}
