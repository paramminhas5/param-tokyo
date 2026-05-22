import { createFileRoute, Link } from "@tanstack/react-router";
import { Hud } from "@/components/Hud";
import { ChapterPanel } from "@/components/ChapterPanel";
import { HERO, CHAPTERS } from "@/content/resume";

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

      {/* Intro plate */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-scanlines opacity-30 pointer-events-none" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 60%, oklch(0.30 0.18 295) 0%, var(--pm-deep-2) 70%)"
        }} />
        <div className="relative max-w-3xl text-center">
          <span className="font-pixel text-[10px] sm:text-xs text-[var(--pm-gold)]">PRESS START</span>
          <h1 className="mt-4 font-pixel text-2xl sm:text-4xl md:text-5xl text-white leading-tight">
            {HERO.name}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--pm-cyan)] font-mono">
            {HERO.tagline}
          </p>
          <p className="mt-3 text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            {HERO.bio}
          </p>
          <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
            <a href={`#${CHAPTERS[0].id}`} className="font-pixel text-[10px] sm:text-xs px-4 py-2 bg-[var(--pm-magenta)] text-white hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors">
              ▼ ENTER WORLD
            </a>
            <Link to="/cv" className="font-pixel text-[10px] sm:text-xs px-4 py-2 border-2 border-[var(--pm-gold)] text-[var(--pm-gold)] hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors">
              ⬇ CV
            </Link>
          </div>
          <div className="mt-10 font-pixel text-[9px] sm:text-[10px] text-white/50">
            scroll · the world unfolds · play each level
          </div>
        </div>
      </section>

      {/* Chapter panels — each is a full-bleed playable world */}
      {CHAPTERS.map((c) => (
        <ChapterPanel key={c.id} chapter={c} />
      ))}

      {/* End / contact panel */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="absolute inset-0 bg-scanlines opacity-30 pointer-events-none" />
        <div className="relative max-w-2xl text-center">
          <div className="font-pixel text-xs text-[var(--pm-gold)]">★ QUEST COMPLETE ★</div>
          <h2 className="mt-4 font-pixel text-2xl sm:text-3xl text-white">
            Let's build the next one.
          </h2>
          <p className="mt-4 text-white/80">
            {HERO.location}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <a href={`mailto:${HERO.email}`} className="font-pixel text-[10px] sm:text-xs px-4 py-2 bg-[var(--pm-cyan)] text-[var(--pm-ink)] hover:bg-white transition-colors">
              ✉ {HERO.email}
            </a>
            <Link to="/cv" className="font-pixel text-[10px] sm:text-xs px-4 py-2 bg-[var(--pm-magenta)] text-white hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors">
              ⬇ FULL CV
            </Link>
            <a href={HERO.links.linkedin} target="_blank" rel="noreferrer" className="font-pixel text-[10px] sm:text-xs px-4 py-2 border border-white/30 text-white hover:border-[var(--pm-gold)] hover:text-[var(--pm-gold)] transition-colors">
              LinkedIn
            </a>
            <a href={HERO.links.twitter} target="_blank" rel="noreferrer" className="font-pixel text-[10px] sm:text-xs px-4 py-2 border border-white/30 text-white hover:border-[var(--pm-gold)] hover:text-[var(--pm-gold)] transition-colors">
              X / Twitter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
