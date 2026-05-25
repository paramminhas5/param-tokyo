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
 * Premium one-pager landing.
 *
 * Quieter than /play — no scanlines, no vignette, no auto-anim sequencing.
 * The job here is to set up two clear paths: ▶ Play the résumé, ⬇ Read the CV.
 *
 * Section order:
 *   1. HomeHero         — name, tagline, three CTAs, stat strip
 *   2. WorldsPreview    — horizontal scrolling chapter cards → /play#id
 *   3. HomeSkills       — 9 skills grid; cells light up if collected via /play
 *   4. HomePress        — selected press strip
 *   5. HomeMarquee      — "Worked with / featured in" infinite tape
 *   6. HomeContact      — final CTA, mailto, hire panel
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
