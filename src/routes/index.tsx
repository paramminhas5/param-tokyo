import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Hud } from "@/components/Hud";
import { Journey } from "@/components/Journey";
import { WorldStage } from "@/components/WorldStage";
import { SkillBelt } from "@/components/SkillBelt";
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

function Intro() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 pb-10 overflow-hidden bg-[#0f0c14]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(255,107,91,0.35) 0%, transparent 60%)",
        }}
      />
      <div className="relative max-w-3xl text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ff6b5b]">
          Playable résumé · press ↓ to begin
        </span>
        <h1 className="mt-5 text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#f0ece4] leading-[1.05]">
          {HERO.name}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-[#ff6b5b] font-mono">{HERO.tagline}</p>
        <p className="mt-4 text-[15px] sm:text-base text-[#f0ece4]/75 max-w-xl mx-auto leading-relaxed">
          {HERO.bio}
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
          <a
            href={`#${CHAPTERS[0].id}`}
            className="px-5 py-2.5 rounded-md bg-[#ff6b5b] text-[#1a1a2e] text-sm font-medium hover:opacity-90 transition"
          >
            ▼ Enter World 01
          </a>
          <Link
            to="/cv"
            className="px-5 py-2.5 rounded-md border border-[#f0ece4]/30 text-sm text-[#f0ece4] hover:border-[#ff6b5b] hover:text-[#ff6b5b] transition"
          >
            ⬇ Full CV
          </Link>
        </div>
        <div className="mt-12 font-mono text-[10px] tracking-[0.22em] text-[#f0ece4]/60">
          9 worlds · 9 skills · one character
        </div>
      </div>
    </section>
  );
}

function EndPanel() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => x.isIntersecting && setVisible(true)),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-24 bg-[#0f0c14]">
      <div
        ref={ref}
        className={`relative max-w-2xl text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#f2a93b]">★ Quest complete</div>
        <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-[#f0ece4]">
          Let's build the next world.
        </h2>
        <p className="mt-4 text-[#f0ece4]/70">{HERO.location}</p>
        <div className="mt-7 flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setHireOpen(true)}
            className="px-5 py-2.5 rounded-md bg-[#f2a93b] text-[#1a1a2e] text-sm font-medium hover:opacity-90 transition"
          >
            Hire me
          </button>
          <a
            href={`mailto:${HERO.email}`}
            className="px-5 py-2.5 rounded-md border border-[#f0ece4]/30 text-sm text-[#f0ece4] hover:border-[#f2a93b] hover:text-[#f2a93b] transition"
          >
            ✉ {HERO.email}
          </a>
          <Link
            to="/cv"
            className="px-5 py-2.5 rounded-md border border-[#f0ece4]/30 text-sm text-[#f0ece4] hover:border-[#f2a93b] hover:text-[#f2a93b] transition"
          >
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
    <div id="top" className="bg-[#0f0c14] text-[#f0ece4]">
      <Hud />
      <Journey />
      <SkillBelt />

      <Intro />

      {CHAPTERS.map((c, i) => (
        <WorldStage key={c.id} chapter={c} isFirst={i === 0} />
      ))}

      <EndPanel />
    </div>
  );
}
