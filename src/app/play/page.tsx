import type { Metadata } from "next";
import { CHAPTERS, HERO } from "@/content/resume";
import { PlayClient } from "@/components/PlayClient";

export const metadata: Metadata = {
  title: "Experience",
  description: `${HERO.name} — interactive career journey. Scroll through ${CHAPTERS.length} worlds.`,
  openGraph: {
    title: "Experience · Param Minhas",
    description: "15 years of building. Scroll through 9 worlds.",
  },
};

/**
 * The Game — visual novel style career walkthrough.
 * Server component wraps the client PlayClient.
 */
export default function PlayPage() {
  return <PlayClient />;
}
