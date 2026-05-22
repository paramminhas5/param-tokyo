import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SKILLS, CHAPTERS } from "@/content/resume";
import { useSkills, resetSkills } from "@/game/state";
import { sfx } from "@/game/audio";
import { useTheme } from "@/game/theme";
import { HirePanel } from "./HirePanel";

export function Hud() {
  const skills = useSkills();
  const [open, setOpen] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all ${
          scrolled
            ? "bg-[color:var(--surface-1)]/85 backdrop-blur-md border-b border-[color:var(--border)]"
            : ""
        }`}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-3 px-4 sm:px-6 h-14">
          <a href="#top" className="flex items-center gap-2.5 group" aria-label="Home">
            <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--accent)]" />
            <span className="text-sm font-semibold tracking-tight text-[color:var(--fg)] group-hover:text-[color:var(--accent)] transition-colors">
              Param Minhas
            </span>
          </a>
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-mono text-[11px] px-2.5 py-1.5 rounded-md border border-[color:var(--border)] text-[color:var(--fg)]/80 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
              title="Skills earned"
            >
              ★ {skills.length}/{CHAPTERS.length}
            </button>
            <button
              type="button"
              onClick={() => setTheme(theme === "console" ? "midnight" : "console")}
              className="font-mono text-[11px] px-2.5 py-1.5 rounded-md border border-[color:var(--border)] text-[color:var(--fg)]/80 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
              title="Switch theme"
              aria-label="Switch theme"
            >
              {theme === "console" ? "◐ Midnight" : "◑ Console"}
            </button>
            <Link
              to="/cv"
              className="hidden sm:inline-block font-mono text-[11px] px-2.5 py-1.5 rounded-md border border-[color:var(--border)] text-[color:var(--fg)]/80 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
            >
              CV
            </Link>
            <button
              type="button"
              onClick={() => setHireOpen(true)}
              className="font-mono text-[11px] px-3 py-1.5 rounded-md bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:opacity-90 transition"
            >
              Hire
            </button>
            <button
              type="button"
              onClick={() => { const m = sfx.toggleMute(); setMuted(m); }}
              className="font-mono text-[11px] px-2 py-1.5 rounded-md text-[color:var(--muted-fg)] hover:text-[color:var(--fg)] transition-colors"
              aria-label="Toggle sound"
              title="Toggle sound"
            >
              {muted ? "♪✕" : "♪"}
            </button>
          </nav>
        </div>
      </header>

      <HirePanel open={hireOpen} onClose={() => setHireOpen(false)} />

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold tracking-tight text-[color:var(--fg)]">Skills earned</h3>
              <button onClick={() => setOpen(false)} className="font-mono text-sm text-[color:var(--muted-fg)] hover:text-[color:var(--fg)]">✕</button>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {(Object.keys(SKILLS) as Array<keyof typeof SKILLS>).map((k) => {
                const earned = skills.includes(k);
                const s = SKILLS[k];
                return (
                  <li
                    key={k}
                    className="font-mono text-[11px] px-2.5 py-2 rounded-md border"
                    style={{
                      borderColor: s.color,
                      background: earned ? s.color : "transparent",
                      color: earned ? "#0a0a0a" : s.color,
                    }}
                  >
                    {earned ? "✓ " : "○ "}{s.name}
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => { resetSkills(); setOpen(false); }}
              className="mt-4 font-mono text-[10px] text-[color:var(--muted-fg)] hover:text-[color:var(--accent)]"
            >
              reset progress
            </button>
          </div>
        </div>
      )}
    </>
  );
}
