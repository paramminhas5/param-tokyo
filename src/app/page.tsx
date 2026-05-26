import type { Metadata } from "next";
import { HERO } from "@/content/resume";
import { GameExperience } from "@/components/GameExperience";

export const metadata: Metadata = {
  title: "Param Minhas — Interactive Resume",
  description: HERO.bio,
  openGraph: {
    title: `${HERO.name} — ${HERO.tagline}`,
    description: "An interactive journey through 15 years of building.",
    type: "website",
  },
};

/**
 * Home — the full scroll-driven experience.
 * One continuous vertical scroll journey.
 * /cv = printable CV
 * /play/legacy = Easter egg (original game)
 */
export default function HomePage() {
  return <GameExperience />;
}
