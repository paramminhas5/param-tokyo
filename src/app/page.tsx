import type { Metadata } from "next";
import { HERO } from "@/content/resume";
import { GameMenu } from "@/components/home/GameMenu";

export const metadata: Metadata = {
  title: "Param Minhas — Founder & Operator",
  description: HERO.bio,
  openGraph: {
    title: `${HERO.name} — ${HERO.tagline}`,
    description: HERO.bio,
    type: "website",
  },
};

/**
 * Home — styled as a game title screen / main menu.
 * Single viewport, no scroll. Full-bleed world art, cinematic feel.
 */
export default function HomePage() {
  return <GameMenu />;
}
