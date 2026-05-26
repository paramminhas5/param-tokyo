import type { Metadata } from "next";
import { HERO } from "@/content/resume";
import { Journey } from "@/components/Journey";

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
 * The entire experience lives on one page.
 * No routing between /, /play, /cv — it's one continuous world.
 * /cv and /play/legacy remain as separate routes.
 */
export default function HomePage() {
  return <Journey />;
}
