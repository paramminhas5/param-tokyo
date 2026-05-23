import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CHAPTERS } from "@/content/resume";
import { useSkills } from "@/game/state";
import { sfx } from "@/game/audio";
import { HirePanel } from "./HirePanel";

export function Hud() {
  const skills = useSkills();
  const [hireOpen, setHireOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  // Avoid hydration mismatch — skill count is client-only.
  const skillCount = mounted ? skills.length : 0;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all ${
          scrolled
            ? "bg-[#0a0a14]/85 backdrop-blur-md border-b border-white/10"
            : ""
        }`}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-3 px-4 sm:px-6 h-14">
          <a href="#top" className="flex items-center gap-2.5 group" aria-label="Home">
            <span className="w-2.5 h-2.5 bg-[#fbbf24]" />
            <span className="text-sm font-semibold tracking-tight text-[#f0ece4] group-hover:text-[#fbbf24] transition-colors">
              Param Minhas
            </span>
          </a>
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 border border-white/15 text-[#f0ece4]/80"
              title="Skills earned"
              suppressHydrationWarning
            >
              ★ {skillCount}/{CHAPTERS.length}
            </span>
            <Link
              to="/cv"
              className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 border border-white/15 text-[#f0ece4]/80 hover:border-[#fbbf24] hover:text-[#fbbf24] transition"
            >
              CV
            </Link>
            <button
              type="button"
              onClick={() => setHireOpen(true)}
              className="font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 bg-[#fbbf24] text-[#0a0a14] hover:opacity-90 transition"
            >
              Hire
            </button>
            <button
              type="button"
              onClick={() => { const m = sfx.toggleMute(); setMuted(m); }}
              className="font-mono text-[10px] px-2 py-1.5 text-[#f0ece4]/60 hover:text-[#f0ece4] transition-colors"
              aria-label="Toggle sound"
              title="Toggle sound"
            >
              {muted ? "♪✕" : "♪"}
            </button>
          </nav>
        </div>
      </header>

      <HirePanel open={hireOpen} onClose={() => setHireOpen(false)} />
    </>
  );
}
