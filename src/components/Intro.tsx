import { Link } from "@tanstack/react-router";
import { HERO, CHAPTERS } from "@/content/resume";
import heroSheet from "@/assets/game/hero/hero-sheet.png";
import { HERO_POSES, HERO_SHEET_COLS } from "@/game/journey";

export function Intro() {
  const cellH = 180;
  const cellW = cellH * (320 / 512);
  const sheetW = cellW * HERO_SHEET_COLS;
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-16 pb-10 overflow-hidden" style={{ background: "#0a0a14" }}>
      {/* Riso grain backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 50% 70%, rgba(255,107,91,0.30) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(251,191,36,0.18) 0%, transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 3px)",
        }}
      />

      <div className="relative max-w-3xl text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em]" style={{ color: "#fbbf24" }}>
          ◤ Playable résumé · 9 worlds ◥
        </span>
        <h1
          className="mt-5 text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-[#f0ece4] leading-[0.95]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {HERO.name}
        </h1>
        <p className="mt-4 text-base sm:text-lg font-mono uppercase tracking-[0.18em]" style={{ color: "#ff6b5b" }}>
          {HERO.tagline}
        </p>
        <p className="mt-4 text-[15px] sm:text-base text-[#f0ece4]/75 max-w-xl mx-auto leading-relaxed">
          {HERO.bio}
        </p>

        {/* Hero standing next to PRESS DOWN signpost */}
        <div className="mt-10 flex items-end justify-center gap-6">
          <div
            aria-hidden
            style={{
              width: cellW,
              height: cellH,
              backgroundImage: `url(${heroSheet})`,
              backgroundSize: `${sheetW}px ${cellH}px`,
              backgroundPosition: `-${HERO_POSES.idle * cellW}px 0px`,
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated",
              filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.55))",
            }}
          />
          <a
            href={`#${CHAPTERS[0].id}`}
            className="signpost relative px-5 py-4 font-mono text-xs uppercase tracking-[0.2em]"
            style={{
              background: "rgba(15,12,20,0.9)",
              color: "#fbbf24",
              border: "1px solid #fbbf24",
              boxShadow: "0 0 0 3px rgba(15,12,20,0.9), 0 0 0 4px #fbbf2444, 0 14px 28px rgba(0,0,0,0.6)",
            }}
          >
            ▼ Press ↓ to play
          </a>
        </div>

        <div className="mt-10 grid grid-cols-3 sm:grid-cols-6 gap-2 max-w-2xl mx-auto">
          {HERO.stats.map((s) => (
            <div
              key={s.label}
              className="px-2 py-2"
              style={{
                background: "rgba(15,12,20,0.6)",
                border: "1px solid rgba(240,236,228,0.15)",
              }}
            >
              <div className="text-sm font-semibold text-[#f0ece4]">{s.value}</div>
              <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#f0ece4]/55 mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap font-mono text-[10px] uppercase tracking-[0.2em]">
          <Link to="/cv" className="px-3 py-1.5 border border-[#f0ece4]/30 text-[#f0ece4]/80 hover:border-[#fbbf24] hover:text-[#fbbf24] transition">⬇ Full CV</Link>
          <a href={`mailto:${HERO.email}`} className="px-3 py-1.5 border border-[#f0ece4]/30 text-[#f0ece4]/80 hover:border-[#fbbf24] hover:text-[#fbbf24] transition">✉ Email</a>
          <a href={HERO.links.linkedin} target="_blank" rel="noreferrer" className="px-3 py-1.5 border border-[#f0ece4]/30 text-[#f0ece4]/80 hover:border-[#fbbf24] hover:text-[#fbbf24] transition">LinkedIn</a>
        </div>
      </div>
      <style>{`
        .signpost::before, .signpost::after {
          content: ""; position: absolute; background: #fbbf24; width: 6px; height: 6px;
        }
        .signpost::before { top: -3px; left: -3px; box-shadow: calc(100% + 3px) 0 0 #fbbf24; }
        .signpost::after  { bottom: -3px; left: -3px; box-shadow: calc(100% + 3px) 0 0 #fbbf24; }
      `}</style>
    </section>
  );
}
