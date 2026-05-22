import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { HERO, CHAPTERS, SKILL_GROUPS, PRESS } from "@/content/resume";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: `${HERO.name} — CV` },
      { name: "description", content: `${HERO.name} — full CV. ${HERO.tagline}` },
    ],
  }),
  component: CvPage,
});

function CvPage() {
  // Auto-open the print dialog so "Save as PDF" is one click away.
  useEffect(() => {
    const t = setTimeout(() => { try { window.print(); } catch {} }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="no-print fixed top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
        <Link to="/" className="font-pixel text-[9px] px-3 py-2 bg-[var(--pm-deep-2)] text-white hover:bg-[var(--pm-magenta)] transition-colors">
          ← BACK
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="font-pixel text-[9px] px-3 py-2 bg-[var(--pm-magenta)] text-white hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors"
        >
          ⬇ SAVE AS PDF
        </button>
      </div>

      <main className="print-page mx-auto max-w-3xl px-8 py-12 sm:py-16">
        {/* Header */}
        <header className="border-b-2 border-black pb-5">
          <h1 className="font-pixel text-2xl sm:text-3xl tracking-tight">{HERO.name}</h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-700">{HERO.tagline}</p>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600">{HERO.bio}</p>
          <p className="mt-3 text-xs text-neutral-600">
            {HERO.email} · {HERO.location}
            <br />
            {HERO.links.linkedin} · {HERO.links.twitter} · {HERO.links.site}
          </p>
        </header>

        {/* Highlights */}
        <section className="mt-6">
          <h2 className="font-pixel text-[10px] mb-3 text-neutral-800">▸ HIGHLIGHTS</h2>
          <ul className="grid grid-cols-3 gap-2">
            {HERO.stats.map((s) => (
              <li key={s.label} className="border border-neutral-300 px-2 py-2">
                <div className="font-pixel text-[11px]">{s.value}</div>
                <div className="text-[10px] text-neutral-600 mt-0.5">{s.label}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Experience */}
        <section className="mt-7">
          <h2 className="font-pixel text-[10px] mb-3 text-neutral-800">▸ EXPERIENCE</h2>
          <ol className="space-y-5">
            {CHAPTERS.map((c) => (
              <li key={c.id} className="border-l-2 border-black pl-4">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-pixel text-[10px] text-neutral-500">{c.year}</span>
                  <span className="font-bold">{c.org}</span>
                  <span className="text-sm text-neutral-700">· {c.role}</span>
                </div>
                <p className="mt-1 text-sm text-neutral-800">{c.hook}</p>
                <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5 space-y-1">
                  {c.paragraphs.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
                {c.outcomes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.outcomes.map((o) => (
                      <span key={o} className="text-[10px] font-mono px-1.5 py-0.5 border border-neutral-400">{o}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Skills */}
        <section className="mt-7">
          <h2 className="font-pixel text-[10px] mb-3 text-neutral-800">▸ SKILLS</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {SKILL_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="font-pixel text-[9px] mb-1">{g.title}</div>
                <p className="text-xs text-neutral-700">{g.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Press */}
        <section className="mt-7">
          <h2 className="font-pixel text-[10px] mb-3 text-neutral-800">▸ SELECTED PRESS</h2>
          <ul className="text-sm space-y-1">
            {PRESS.map((p) => (
              <li key={p.title}>
                <span className="font-bold">{p.outlet}</span> · {p.title}
              </li>
            ))}
          </ul>
        </section>

        {/* Education */}
        <section className="mt-7">
          <h2 className="font-pixel text-[10px] mb-3 text-neutral-800">▸ EDUCATION</h2>
          <p className="text-sm">
            Bachelor of Engineering, Computer Science · Bangalore Institute of Technology
            <br />
            <span className="text-neutral-600 text-xs">Supplemented by 15 years of shipping.</span>
          </p>
        </section>

        <footer className="mt-10 pt-5 border-t border-neutral-300 text-[10px] text-neutral-500 font-mono">
          {HERO.name} · {HERO.email} · {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}