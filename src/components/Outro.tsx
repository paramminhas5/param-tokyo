import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { HERO } from "@/content/resume";
import { HirePanel } from "./HirePanel";

export function Outro() {
  const [hireOpen, setHireOpen] = useState(false);
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-24 overflow-hidden" style={{ background: "#0a0a14" }}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.18) 0%, transparent 60%)",
        }}
      />
      <div className="relative max-w-xl w-full text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.32em]" style={{ color: "#fbbf24" }}>
          ★ Quest complete · End of demo
        </div>
        <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-[#f0ece4]" style={{ fontFamily: "var(--font-display)" }}>
          Let's build the next world.
        </h2>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f0ece4]/60">{HERO.location}</p>

        <div
          className="mt-8 px-6 py-6 mx-auto"
          style={{
            background: "rgba(15,12,20,0.9)",
            border: "1px solid #fbbf24",
            boxShadow: "0 0 0 3px rgba(15,12,20,0.9), 0 0 0 4px #fbbf2455, 0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          <p className="text-[#f0ece4]/85 leading-relaxed text-sm">{HERO.bio}</p>
          <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setHireOpen(true)}
              className="px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition"
              style={{ background: "#fbbf24", color: "#0a0a14" }}
            >
              ▶ Hire me
            </button>
            <a
              href={`mailto:${HERO.email}`}
              className="px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] border border-[#f0ece4]/30 text-[#f0ece4] hover:border-[#fbbf24] hover:text-[#fbbf24] transition"
            >
              ✉ {HERO.email}
            </a>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap font-mono text-[10px] uppercase tracking-[0.18em]">
            <Link to="/cv" className="px-3 py-1.5 border border-[#f0ece4]/25 text-[#f0ece4]/75 hover:border-[#fbbf24] hover:text-[#fbbf24] transition">Full CV</Link>
            <a href={HERO.links.linkedin} target="_blank" rel="noreferrer" className="px-3 py-1.5 border border-[#f0ece4]/25 text-[#f0ece4]/75 hover:border-[#fbbf24] hover:text-[#fbbf24] transition">LinkedIn</a>
            <a href={HERO.links.twitter} target="_blank" rel="noreferrer" className="px-3 py-1.5 border border-[#f0ece4]/25 text-[#f0ece4]/75 hover:border-[#fbbf24] hover:text-[#fbbf24] transition">X</a>
            <a href={HERO.links.site} target="_blank" rel="noreferrer" className="px-3 py-1.5 border border-[#f0ece4]/25 text-[#f0ece4]/75 hover:border-[#fbbf24] hover:text-[#fbbf24] transition">Cats Can Dance</a>
          </div>
        </div>

        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.32em] text-[#f0ece4]/40">
          Art, code & life — Param Minhas
        </p>
      </div>
      <HirePanel open={hireOpen} onClose={() => setHireOpen(false)} />
    </section>
  );
}
