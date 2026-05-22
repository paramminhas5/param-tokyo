import { createFileRoute } from "@tanstack/react-router";
import { Hud } from "@/components/Hud";
import { WorldScene } from "@/components/WorldScene";
import { HERO } from "@/content/resume";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Param Minhas — Founder & Operator. Play the resume." },
      { name: "description", content: `${HERO.name} — ${HERO.tagline} ${HERO.bio}` },
      { property: "og:title", content: "Param Minhas — Playable Resume" },
      { property: "og:description", content: HERO.bio },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top" className="bg-[var(--pm-deep-2)] text-white">
      <Hud />
      <WorldScene />
    </div>
  );
}
