import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Hud } from "@/components/Hud";
import { ChapterPanel } from "@/components/ChapterPanel";
import { InventoryRail } from "@/components/InventoryRail";
import { HirePanel } from "@/components/HirePanel";
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

function EndPanel() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => { if (x.isIntersecting) setVisible(true); }),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-16 bg-[color:var(--surface-1)]">
      <div
        ref={ref}
        className={`relative max-w-2xl text-center transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent)]">★ Quest complete</div>
        <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-[color:var(--fg)]">
          Let's build the next one.
        </h2>
        <p className="mt-4 text-[color:var(--fg)]/75">{HERO.location}</p>
        <div className="mt-7 flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setHireOpen(true)}
            className="px-5 py-2.5 rounded-md bg-[color:var(--accent)] text-[color:var(--accent-foreground)] text-sm font-medium hover:opacity-90 transition"
          >
            Hire me
          </button>
          <a href={`mailto:${HERO.email}`} className="px-5 py-2.5 rounded-md border border-[color:var(--border)] text-sm hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition">
            ✉ {HERO.email}
          </a>
          <Link to="/cv" className="px-5 py-2.5 rounded-md border border-[color:var(--border)] text-sm hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition">
            Full CV
          </Link>
        </div>
      </div>
      <HirePanel open={hireOpen} onClose={() => setHireOpen(false)} />
    </section>
  );
}

function Index() {
  return (
    <div id="top" className="bg-[color:var(--surface-1)] text-[color:var(--fg)]">
      <Hud />
      <InventoryRail />

      {/* Intro */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 pb-10 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 60%, color-mix(in oklab, var(--accent) 18%, transparent) 0%, var(--surface-1) 60%)"
        }} />
        <div className="relative max-w-3xl text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent)]">Playable resume · press start</span>
          <h1 className="mt-5 text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[color:var(--fg)] leading-[1.05]">
            {HERO.name}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[color:var(--accent)] font-mono">
            {HERO.tagline}
          </p>
          <p className="mt-4 text-[15px] sm:text-base text-[color:var(--fg)]/75 max-w-xl mx-auto leading-relaxed">
            {HERO.bio}
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            <a href={`#${CHAPTERS[0].id}`} className="px-5 py-2.5 rounded-md bg-[color:var(--accent)] text-[color:var(--accent-foreground)] text-sm font-medium hover:opacity-90 transition">
              ▼ Enter world
            </a>
            <Link to="/cv" className="px-5 py-2.5 rounded-md border border-[color:var(--border)] text-sm hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition">
              ⬇ CV
            </Link>
          </div>
          <div className="mt-12 font-mono text-[10px] tracking-widest text-[color:var(--muted-fg)]/80">
            scroll · collect outcomes · play each cabinet
          </div>
        </div>
      </section>

      {CHAPTERS.map((c) => (
        <ChapterPanel key={c.id} chapter={c} />
      ))}

      <EndPanel />
    </div>
  );
}
