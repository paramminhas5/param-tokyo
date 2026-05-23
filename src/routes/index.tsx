import { createFileRoute } from "@tanstack/react-router";
import { Hud } from "@/components/Hud";
import { WorldStage } from "@/components/WorldStage";
import { SkillBelt } from "@/components/SkillBelt";
import { Intro } from "@/components/Intro";
import { Outro } from "@/components/Outro";
import { GlobalHero } from "@/components/GlobalHero";
import { WorldCard } from "@/components/WorldCard";
import { WorldTransition } from "@/components/WorldTransition";
import { HERO, CHAPTERS } from "@/content/resume";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Param Minhas — Founder & Operator. Play the résumé." },
      { name: "description", content: `${HERO.name} — ${HERO.tagline} ${HERO.bio}` },
      { property: "og:title", content: "Param Minhas — Playable Résumé" },
      { property: "og:description", content: HERO.bio },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top" style={{ background: "#050310", color: "#f0ece4" }}>
      <Hud />
      <GlobalHero />
      <WorldTransition />
      <WorldCard />
      <SkillBelt />
      <Intro />
      {CHAPTERS.map((c) => (
        <WorldStage key={c.id} chapter={c} />
      ))}
      <Outro />
    </div>
  );
}
