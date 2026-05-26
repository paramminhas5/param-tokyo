"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { CHAPTERS, HERO } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { playWorld } from "@/game/ambient";
import { CvModal } from "./CvModal";

/**
 * The Journey — one continuous horizontal experience.
 *
 * Architecture:
 * - Horizontal scroll-snap container (100vw × 100vh, overflow-x: auto)
 * - 1 intro slide + 9 world slides + 1 outro slide = 11 viewport-width panels
 * - Each world: full BG + FG art with cinematic narrative overlays
 * - Narrative auto-advances in timed sequence when you land on a world
 * - Persistent HUD: progress bar (top), skill bar (bottom)
 * - Arrow keys, scroll wheel, and swipe all navigate horizontally
 * - CV accessible as modal overlay from HUD
 */
export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWorld, setActiveWorld] = useState(-1); // -1 = intro, 0-8 = worlds, 9 = outro
  const [skills, setSkills] = useState<Array<{ name: string; color: string }>>([]);
  const [narrativePhase, setNarrativePhase] = useState(0); // 0-4 phases per world
  const [cvOpen, setCvOpen] = useState(false);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevWorldRef = useRef(-1);

  // Detect which world is active based on scroll position
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const viewportW = el.clientWidth;
    const index = Math.round(scrollLeft / viewportW) - 1; // -1 because intro is first
    setActiveWorld(Math.max(-1, Math.min(CHAPTERS.length, index)));
  }, []);

  // Start narrative sequence when entering a new world
  useEffect(() => {
    if (activeWorld === prevWorldRef.current) return;
    prevWorldRef.current = activeWorld;

    // Clear previous timer
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    setNarrativePhase(0);

    if (activeWorld >= 0 && activeWorld < CHAPTERS.length) {
      playWorld(CHAPTERS[activeWorld].id);

      // Auto-advance narrative phases
      const advancePhase = (phase: number) => {
        if (phase > 4) return;
        phaseTimerRef.current = setTimeout(() => {
          setNarrativePhase(phase);
          // Add skill at phase 4
          if (phase === 4) {
            const ch = CHAPTERS[activeWorld];
            setSkills(prev => {
              if (prev.some(s => s.name === ch.skill.name)) return prev;
              return [...prev, { name: ch.skill.name, color: ch.skill.color }];
            });
          }
          advancePhase(phase + 1);
        }, phase === 0 ? 400 : 1800);
      };
      advancePhase(1);
    }

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [activeWorld]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const el = containerRef.current;
      if (!el || cvOpen) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cvOpen]);

  // Mouse wheel → horizontal scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (cvOpen) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY > 0 ? el.clientWidth : -el.clientWidth, behavior: "smooth" });
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [cvOpen]);

  const totalSlides = CHAPTERS.length + 2; // intro + worlds + outro
  const currentSlide = activeWorld + 1; // 0-indexed from intro

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#050310" }}>
      {/* === TOP HUD — Progress === */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          zIndex: 100,
          background: "rgba(240, 236, 228, 0.06)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(currentSlide / (totalSlides - 1)) * 100}%`,
            background: activeWorld >= 0 && activeWorld < CHAPTERS.length
              ? WORLDS[CHAPTERS[activeWorld].id]?.accent ?? "#fbbf24"
              : "#fbbf24",
            transition: "width 500ms ease, background 500ms ease",
            boxShadow: `0 0 8px ${activeWorld >= 0 && activeWorld < CHAPTERS.length ? WORLDS[CHAPTERS[activeWorld].id]?.accent + "88" : "#fbbf2488"}`,
          }}
        />
      </div>

      {/* === TOP-RIGHT HUD — CV button + world counter === */}
      <div
        style={{
          position: "fixed",
          top: 12,
          right: 16,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "rgba(240, 236, 228, 0.4)",
          }}
        >
          {String(Math.max(0, currentSlide)).padStart(2, "0")}/{String(totalSlides - 1).padStart(2, "0")}
        </span>
        <button
          onClick={() => setCvOpen(true)}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "6px 12px",
            color: "#f0ece4",
            background: "rgba(240, 236, 228, 0.06)",
            border: "1px solid rgba(240, 236, 228, 0.15)",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}
        >
          CV
        </button>
      </div>

      {/* === HORIZONTAL SCROLL CONTAINER === */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          width: "100%",
          height: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          display: "flex",
          scrollBehavior: "smooth",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {/* INTRO SLIDE */}
        <div
          style={{
            flexShrink: 0,
            width: "100vw",
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            background: "#050310",
          }}
        >
          {/* Subtle BG */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${WORLDS.origin.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.15,
              filter: "blur(2px) brightness(0.5)",
            }}
          />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 10vw, 96px)",
                fontWeight: 700,
                color: "#f0ece4",
                lineHeight: 0.95,
                marginBottom: 16,
              }}
            >
              {HERO.name}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(11px, 1.4vw, 14px)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(240, 236, 228, 0.5)",
                marginBottom: 40,
              }}
            >
              {HERO.tagline}
            </p>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "rgba(240, 236, 228, 0.3)",
                animation: "pulse-hint 2s ease-in-out infinite",
              }}
            >
              SCROLL OR → TO BEGIN
            </div>
          </div>
        </div>

        {/* WORLD SLIDES */}
        {CHAPTERS.map((chapter, i) => {
          const world = WORLDS[chapter.id];
          const isActive = activeWorld === i;
          const phase = isActive ? narrativePhase : (i < activeWorld ? 5 : 0);

          return (
            <div
              key={chapter.id}
              style={{
                flexShrink: 0,
                width: "100vw",
                height: "100vh",
                scrollSnapAlign: "start",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* BG */}
              <img
                src={world.bg}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  filter: "brightness(0.45) saturate(1.2)",
                  transition: "filter 800ms ease",
                }}
              />

              {/* FG — positioned bottom, proportional */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "clamp(300px, 50%, 700px)",
                  height: "60%",
                  pointerEvents: "none",
                  opacity: phase >= 1 ? 0.7 : 0.3,
                  transition: "opacity 1s ease",
                }}
              >
                <img
                  src={world.fg}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "bottom center",
                    filter: "drop-shadow(0 -16px 40px rgba(0,0,0,0.6))",
                  }}
                />
              </div>

              {/* Vignette */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(ellipse 80% 70% at 50% 50%, transparent 25%, rgba(5,3,16,0.75) 100%),
                    linear-gradient(180deg, ${world.ink}aa 0%, transparent 25%, transparent 65%, ${world.ink}dd 100%)
                  `,
                  pointerEvents: "none",
                }}
              />

              {/* Accent glow bottom */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "30%",
                  background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${world.accent}18 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* === NARRATIVE PANELS === */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 clamp(24px, 6vw, 80px)",
                  zIndex: 10,
                  pointerEvents: "none",
                  maxWidth: 640,
                }}
              >
                {/* Phase 1: Chapter + Title */}
                <div
                  style={{
                    opacity: phase >= 1 ? 1 : 0,
                    transform: phase >= 1 ? "translateX(0)" : "translateX(-30px)",
                    transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    marginBottom: 20,
                  }}
                >
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5em", textTransform: "uppercase", color: world.accent, marginBottom: 10 }}>
                    Chapter {String(chapter.index).padStart(2, "0")} — {chapter.year}
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 700, color: "#f0ece4", lineHeight: 1.0, textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}>
                    {chapter.org}
                  </h2>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.15em", color: "rgba(240,236,228,0.5)", textTransform: "uppercase", marginTop: 6 }}>
                    {chapter.role}
                  </div>
                </div>

                {/* Phase 2: Cliff note in glass panel */}
                <div
                  style={{
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? "translateX(0)" : "translateX(-20px)",
                    transition: "opacity 500ms ease 100ms, transform 500ms ease 100ms",
                    marginBottom: 16,
                    padding: "18px 22px",
                    background: "rgba(5, 3, 16, 0.7)",
                    backdropFilter: "blur(12px)",
                    borderLeft: `3px solid ${world.accent}`,
                  }}
                >
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px, 2vw, 20px)", color: "rgba(240,236,228,0.9)", lineHeight: 1.55, margin: 0 }}>
                    {chapter.cliff}
                  </p>
                </div>

                {/* Phase 3: Key paragraph */}
                <div
                  style={{
                    opacity: phase >= 3 ? 1 : 0,
                    transform: phase >= 3 ? "translateX(0)" : "translateX(-20px)",
                    transition: "opacity 500ms ease 200ms, transform 500ms ease 200ms",
                    marginBottom: 16,
                  }}
                >
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(13px, 1.4vw, 15px)", color: "rgba(240,236,228,0.65)", lineHeight: 1.7 }}>
                    {chapter.paragraphs[0]}
                  </p>
                </div>

                {/* Phase 4: Outcomes + Skill */}
                <div
                  style={{
                    opacity: phase >= 4 ? 1 : 0,
                    transform: phase >= 4 ? "translateY(0)" : "translateY(12px)",
                    transition: "opacity 500ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                    {chapter.outcomes.slice(0, 4).map((o, idx) => (
                      <span key={idx} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: world.accent, padding: "4px 10px", background: `${world.accent}12`, border: `1px solid ${world.accent}33`, letterSpacing: "0.05em" }}>
                        {o}
                      </span>
                    ))}
                  </div>
                  {/* Skill badge */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px", background: `${chapter.skill.color}15`, border: `1px solid ${chapter.skill.color}55`, boxShadow: `0 0 20px ${chapter.skill.color}22` }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: chapter.skill.color, boxShadow: `0 0 8px ${chapter.skill.color}` }} />
                    <div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase", color: chapter.skill.color }}>Skill Unlocked</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "#f0ece4" }}>{chapter.skill.name}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation hint */}
              {isActive && (
                <div style={{ position: "absolute", bottom: 60, right: 24, zIndex: 20, opacity: phase >= 4 ? 0.6 : 0, transition: "opacity 500ms ease" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(240,236,228,0.4)", textTransform: "uppercase" }}>
                    → Next world
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* OUTRO SLIDE */}
        <div
          style={{
            flexShrink: 0,
            width: "100vw",
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            background: "linear-gradient(135deg, #0a0a1e 0%, #050310 100%)",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 600, color: "#f0ece4", marginBottom: 12 }}>
            That&apos;s the journey so far.
          </h2>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(14px, 1.6vw, 17px)", color: "rgba(240,236,228,0.5)", maxWidth: 440, lineHeight: 1.6, marginBottom: 32 }}>
            {HERO.bio}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <a href={`mailto:${HERO.email}`} style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: "12px 24px", color: "#050310", background: "#f0ece4", textDecoration: "none" }}>
              Get in touch
            </a>
            <button onClick={() => setCvOpen(true)} style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: "12px 24px", color: "#f0ece4", background: "transparent", border: "1px solid rgba(240,236,228,0.25)", cursor: "pointer" }}>
              View full CV
            </button>
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
            {Object.entries(HERO.links).map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(240,236,228,0.35)", textDecoration: "none", textTransform: "capitalize" }}>
                {key}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* === BOTTOM SKILL HUD === */}
      {skills.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "8px 16px",
            background: "rgba(5, 3, 16, 0.85)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(240, 236, 228, 0.06)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(240,236,228,0.3)", textTransform: "uppercase", flexShrink: 0 }}>Skills</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
            {skills.map((s, i) => (
              <span key={s.name} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: s.color, padding: "3px 8px", background: `${s.color}12`, border: `1px solid ${s.color}33`, animation: i === skills.length - 1 ? "skill-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)" : "none" }}>
                {s.name}
              </span>
            ))}
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(240,236,228,0.4)", flexShrink: 0 }}>{skills.length}/9</span>
        </div>
      )}

      {/* CV Modal */}
      {cvOpen && <CvModal onClose={() => setCvOpen(false)} />}

      <style>{`
        @keyframes pulse-hint {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes skill-pop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        /* Hide scrollbar */
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
