import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { HERO, SKILLS, CHAPTERS } from "@/content/resume";
import { useSkills, resetSkills } from "@/game/state";
import { sfx } from "@/game/audio";

export function Hud() {
  const skills = useSkills();
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors ${
          scrolled ? "bg-[var(--pm-deep-2)]/90 backdrop-blur border-b border-[var(--border)]" : ""
        }`}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-3 px-4 sm:px-6 h-14">
          <a href="#top" className="flex items-center gap-2 group" aria-label="Home">
            <span className="w-6 h-6 bg-[var(--pm-magenta)] inline-block" />
            <span className="font-pixel text-[10px] sm:text-xs text-white group-hover:text-[var(--pm-gold)] transition-colors">
              PARAM MINHAS
            </span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-pixel text-[9px] px-2 py-1 border border-[var(--pm-gold)] text-[var(--pm-gold)] hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors"
            >
              ★ {skills.length}/{CHAPTERS.length}
            </button>
            <Link
              to="/cv"
              className="hidden sm:inline-block font-pixel text-[9px] px-2 py-1 bg-[var(--pm-magenta)] text-white hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors"
            >
              ⬇ CV
            </Link>
            <a
              href={`mailto:${HERO.email}`}
              className="font-pixel text-[9px] px-2 py-1 bg-[var(--pm-cyan)] text-[var(--pm-ink)] hover:bg-white transition-colors"
            >
              HIRE
            </a>
            <button
              type="button"
              onClick={() => { const m = sfx.toggleMute(); setMuted(m); }}
              className="font-pixel text-[9px] px-2 py-1 text-white/60 hover:text-white"
              aria-label="Toggle sound"
              title="Toggle sound"
            >
              {muted ? "♪✕" : "♪"}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-[var(--pm-deep-2)]/85 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="pixel-box-cyan max-w-md w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-pixel text-sm text-[var(--pm-cyan)]">SKILLS EARNED</h3>
              <button onClick={() => setOpen(false)} className="font-pixel text-[10px] text-white/60 hover:text-white">✕</button>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {(Object.keys(SKILLS) as Array<keyof typeof SKILLS>).map((k) => {
                const earned = skills.includes(k);
                const s = SKILLS[k];
                return (
                  <li
                    key={k}
                    className="font-pixel text-[9px] px-2 py-2 border-2"
                    style={{
                      borderColor: s.color,
                      background: earned ? s.color : "transparent",
                      color: earned ? "#1a0f33" : s.color,
                    }}
                  >
                    {earned ? "✓ " : "□ "}{s.name}
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => { resetSkills(); setOpen(false); }}
              className="mt-4 font-pixel text-[9px] text-white/50 hover:text-[var(--pm-magenta)]"
            >
              reset progress
            </button>
          </div>
        </div>
      )}
    </>
  );
}