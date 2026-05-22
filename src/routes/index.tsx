import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Hud } from "@/components/Hud";
import { ChapterSection } from "@/components/ChapterSection";
import { CHAPTERS, HERO, PRESS, COMPANIES, SKILL_GROUPS } from "@/content/resume";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Param Minhas — Founder & Operator. 15 years of building." },
      { name: "description", content: "Param Minhas — founder of Iterate and Cats Can Dance. 15 years across e-commerce, real estate, conversational AI, sneaker culture, and AI-native marketing. Play the resume." },
      { property: "og:title", content: "Param Minhas — Founder & Operator" },
      { property: "og:description", content: "15 years of building across e-commerce, real estate, conversational AI, sneaker culture, and AI-native marketing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top" className="min-h-screen bg-[var(--pm-deep-2)] text-white">
      <Hud />

      {/* HERO */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* corner pixel ornaments */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-scanlines opacity-20" />
        <div className="mx-auto max-w-6xl relative">
          <div className="font-pixel text-[10px] text-[var(--pm-gold)] mb-4">
            ▸ PORTFOLIO · RESUME · PLAYABLE
          </div>
          <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl leading-[1.1] text-white">
            {HERO.name}
          </h1>
          <p className="mt-5 font-mono text-base sm:text-xl text-[var(--pm-cyan)] max-w-2xl">
            {HERO.tagline}
          </p>
          <p className="mt-3 text-white/70 max-w-2xl leading-relaxed">
            {HERO.bio}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={`#${CHAPTERS[0].id}`} className="font-pixel text-[10px] px-4 py-3 bg-[var(--pm-magenta)] text-white hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors">
              ▶ PLAY THE RESUME
            </a>
            <Link to="/cv" className="font-pixel text-[10px] px-4 py-3 border-2 border-[var(--pm-gold)] text-[var(--pm-gold)] hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors">
              ⬇ DOWNLOAD CV
            </Link>
            <a href="#contact" className="font-pixel text-[10px] px-4 py-3 border-2 border-[var(--pm-cyan)] text-[var(--pm-cyan)] hover:bg-[var(--pm-cyan)] hover:text-[var(--pm-ink)] transition-colors">
              ✉ CONTACT
            </a>
          </div>

          {/* Stats strip */}
          <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {HERO.stats.map((s) => (
              <li key={s.label} className="pixel-box-cyan p-3">
                <div className="font-pixel text-sm text-[var(--pm-gold)]">{s.value}</div>
                <div className="font-mono text-[10px] text-white/70 mt-1 leading-snug">{s.label}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CHAPTERS */}
      <main>
        {CHAPTERS.map((c) => <ChapterSection key={c.id} chapter={c} />)}
      </main>

      {/* SKILLS GROUPS */}
      <section className="border-t border-[var(--border)] px-4 sm:px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="font-pixel text-[10px] text-[var(--pm-gold)] mb-3">▸ TOOLBOX</div>
          <h2 className="font-pixel text-xl sm:text-2xl text-white mb-8">All the skills, all the chapters.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SKILL_GROUPS.map((g) => (
              <div key={g.title} className="pixel-box p-4">
                <div className="font-pixel text-[10px] text-[var(--pm-cyan)] mb-3">{g.title}</div>
                <ul className="flex flex-wrap gap-1.5">
                  {g.items.map((i) => (
                    <li key={i} className="font-mono text-[11px] px-2 py-0.5 bg-[var(--pm-deep-2)] border border-[var(--border)] text-white/80">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS + COMPANIES */}
      <section className="border-t border-[var(--border)] px-4 sm:px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="font-pixel text-[10px] text-[var(--pm-gold)] mb-3">▸ SELECTED PRESS</div>
          <ul className="space-y-3">
            {PRESS.map((p) => (
              <li key={p.title} className="flex gap-3 items-baseline border-b border-[var(--border)] pb-3">
                <span className="font-pixel text-[10px] text-[var(--pm-cyan)] shrink-0 w-28">{p.outlet}</span>
                <span className="text-white/85 text-sm sm:text-base">{p.title}</span>
              </li>
            ))}
          </ul>

          <div className="font-pixel text-[10px] text-[var(--pm-gold)] mt-12 mb-3">▸ COMPANIES & BRANDS</div>
          <ul className="flex flex-wrap gap-2">
            {COMPANIES.map((c) => (
              <li key={c} className="font-mono text-xs px-2 py-1 border border-[var(--border)] text-white/70">{c}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-[var(--border)] px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="font-pixel text-[10px] text-[var(--pm-gold)] mb-3">▸ END SCREEN · CHOOSE A PATH</div>
          <h2 className="font-pixel text-2xl sm:text-3xl text-white">Let's build something.</h2>
          <p className="mt-4 text-white/75">
            Hire me, back me, collab, or just say hi. All four are good answers.
          </p>
          <div className="mt-7 grid sm:grid-cols-2 gap-3">
            <a href={`mailto:${HERO.email}`} className="font-pixel text-[10px] px-4 py-4 bg-[var(--pm-magenta)] text-white hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors">
              ✉ {HERO.email}
            </a>
            <a href={HERO.links.linkedin} target="_blank" rel="noreferrer" className="font-pixel text-[10px] px-4 py-4 border-2 border-[var(--pm-cyan)] text-[var(--pm-cyan)] hover:bg-[var(--pm-cyan)] hover:text-[var(--pm-ink)] transition-colors">
              in/paramminhas
            </a>
            <a href={HERO.links.twitter} target="_blank" rel="noreferrer" className="font-pixel text-[10px] px-4 py-4 border-2 border-[var(--pm-gold)] text-[var(--pm-gold)] hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors">
              @paramminhas
            </a>
            <a href={HERO.links.site} target="_blank" rel="noreferrer" className="font-pixel text-[10px] px-4 py-4 border-2 border-white/40 text-white hover:bg-white hover:text-[var(--pm-ink)] transition-colors">
              catscandance.com
            </a>
          </div>
          <p className="mt-8 font-mono text-xs text-white/40">
            {HERO.location}
          </p>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-4 sm:px-6 py-8 text-center">
        <p className="font-pixel text-[9px] text-white/40">
          © {new Date().getFullYear()} PARAM MINHAS · PRESS START
        </p>
      </footer>
    </div>
  );
}
