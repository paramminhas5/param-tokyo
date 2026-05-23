import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CHAPTERS } from "@/content/resume";
import { useSkills } from "@/game/state";
import { sfx } from "@/game/audio";
import { setAmbientMuted } from "@/game/ambient";
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

  const skillCount = mounted ? skills.length : 0;

  const handleMute = () => {
    const m = sfx.toggleMute();
    setAmbientMuted(m);
    setMuted(m);
  };

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "background 300ms ease, border-color 300ms ease",
          background: scrolled ? "rgba(5,3,16,0.88)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "0 20px", height: 52 }}>
          {/* Logo */}
          <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ display: "flex", gap: 3 }}>
              <span style={{ width: 8, height: 8, background: "#fbbf24", display: "block" }} />
              <span style={{ width: 8, height: 8, background: "#ff6b5b", display: "block", marginTop: 2 }} />
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#f0ece4", fontWeight: 600 }}>
              Param Minhas
            </span>
          </a>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Skill counter */}
            <div
              style={{
                fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em",
                padding: "5px 10px",
                border: "1px solid rgba(251,191,36,0.3)",
                color: skillCount > 0 ? "#fbbf24" : "rgba(240,236,228,0.6)",
                background: skillCount > 0 ? "rgba(251,191,36,0.08)" : "transparent",
                transition: "all 300ms ease",
                userSelect: "none",
              }}
              suppressHydrationWarning
              title={`${skillCount} of ${CHAPTERS.length} skills unlocked`}
            >
              ★ {skillCount}/{CHAPTERS.length}
            </div>

            <Link
              to="/cv"
              style={{
                fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em",
                padding: "5px 10px",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(240,236,228,0.8)",
                textDecoration: "none",
              }}
            >
              CV
            </Link>

            <button
              type="button"
              onClick={() => { sfx.open(); setHireOpen(true); }}
              style={{
                fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em",
                padding: "6px 14px",
                background: "#fbbf24", color: "#050310", border: "none",
                cursor: "pointer", fontWeight: 700,
              }}
            >
              HIRE
            </button>

            <button
              type="button"
              onClick={handleMute}
              style={{
                fontFamily: "monospace", fontSize: 10,
                padding: "5px 8px",
                color: muted ? "rgba(240,236,228,0.3)" : "rgba(240,236,228,0.7)",
                background: "none", border: "none", cursor: "pointer",
                transition: "color 200ms ease",
              }}
              aria-label="Toggle sound"
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
