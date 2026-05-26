import type { Metadata } from "next";
import { HERO } from "@/content/resume";
import { HomeNav } from "@/components/home/HomeNav";
import { HomeHero } from "@/components/home/HomeHero";
import { WorldsPreview } from "@/components/home/WorldsPreview";
import { HomeSkills } from "@/components/home/HomeSkills";
import { HomePress } from "@/components/home/HomePress";
import { HomeMarquee } from "@/components/home/HomeMarquee";
import { HomeContact } from "@/components/home/HomeContact";

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
 * Landing page — elegant one-pager interactive resume.
 *
 * Sections:
 *   1. Nav (fixed)
 *   2. Hero — name, tagline, CTAs, stats
 *   3. Worlds Preview — horizontal scroll chapter cards
 *   4. Skills — grouped skill tags
 *   5. Press — feature strip
 *   6. Marquee — companies ticker
 *   7. Contact — final CTA
 */
export default function HomePage() {
  return (
    <>
      <HomeNav />
      <main style={{ position: "relative", background: "#050310", color: "#f0ece4" }}>
        <HomeHero />
        <WorldsPreview />
        <HomeSkills />
        <HomePress />
        <HomeMarquee />
        <HomeContact />
      </main>
    </>
  );
}
