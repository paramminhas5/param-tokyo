import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import titleFrame from "@/assets/game/ui/title-card.png";
import dialogFrame from "@/assets/game/ui/dialog-box.png";
import { SkillIcon } from "./SkillIcon";
import { collect, useSkills } from "@/game/state";

interface Props {
  chapter: Chapter;
  isFirst?: boolean;
}

export function WorldStage({ chapter, isFirst }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [bulletsRevealed, setBulletsRevealed] = useState(false);
  const skills = useSkills();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.15) {
            setRevealed(true);
            collect(chapter.skill);
          }
          if (e.isIntersecting && e.intersectionRatio > 0.55) {
            setBulletsRevealed(true);
          }
        }
      },
      { threshold: [0.15, 0.55] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [chapter.skill]);

  return (
    <section
      ref={ref}
      id={chapter.id}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "140vh",
        background: "#0a0a14",
      }}
    >
      {/* World background (full-bleed, fixed parallax) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${world.bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Soft paper tint on top so accents pop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(10,10,20,0.0) 0%, rgba(10,10,20,0.35) 80%, rgba(10,10,20,0.6) 100%)`,
        }}
      />

      {/* Title card — top */}
      <div className="relative z-10 pt-24 sm:pt-32 px-4 sm:px-8 flex justify-center">
        <div
          className={`relative w-[min(640px,92vw)] transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
        >
          <img
            src={titleFrame}
            alt=""
            aria-hidden
            className="w-full h-auto pixelated select-none pointer-events-none"
            style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.45))" }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 py-6 text-center">
            <div
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em]"
              style={{ color: world.accent }}
            >
              World {String(chapter.index).padStart(2, "0")} · {chapter.year}
            </div>
            <h2
              className="mt-1 text-xl sm:text-3xl font-semibold tracking-tight"
              style={{ color: world.ink, fontFamily: "var(--font-display)" }}
            >
              {chapter.org}
            </h2>
            <div
              className="mt-1 text-[11px] sm:text-sm"
              style={{ color: world.ink, opacity: 0.7 }}
            >
              {chapter.role}
            </div>
          </div>
        </div>
      </div>

      {/* Hook — speech-bubble style centered */}
      <div className="relative z-10 mt-8 sm:mt-12 px-4 flex justify-center">
        <div
          className={`max-w-xl text-center transition-all duration-700 delay-150 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
        >
          <p
            className="text-base sm:text-xl leading-snug"
            style={{
              color: "#f0ece4",
              textShadow: "0 2px 12px rgba(0,0,0,0.7), 0 0 24px rgba(0,0,0,0.4)",
            }}
          >
            "{chapter.hook}"
          </p>
        </div>
      </div>

      {/* Built-on skills strip */}
      {chapter.builtOn.length > 0 && (
        <div className="relative z-10 mt-6 px-4 flex justify-center">
          <div
            className={`flex items-center gap-2 transition-all duration-700 delay-300 ${revealed ? "opacity-100" : "opacity-0"}`}
          >
            <span
              className="font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: "#f0ece4", opacity: 0.7 }}
            >
              Built on
            </span>
            {chapter.builtOn.map((sid) => (
              <SkillIcon key={sid} id={sid} size={28} earned={skills.includes(sid)} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom dialog box with 2 bullets */}
      <div className="absolute bottom-12 left-0 right-0 z-10 px-4 flex justify-center">
        <div
          className={`relative w-[min(720px,94vw)] transition-all duration-700 ${bulletsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <img
            src={dialogFrame}
            alt=""
            aria-hidden
            className="w-full h-auto pixelated select-none pointer-events-none"
            style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.45))" }}
          />
          <div className="absolute inset-0 px-8 py-5 sm:px-12 sm:py-6 flex flex-col justify-center gap-1.5">
            {chapter.outcomes.slice(0, 2).map((o, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-[11px] sm:text-sm"
                style={{ color: world.ink, fontFamily: "var(--font-display)" }}
              >
                <span style={{ color: world.accent }}>▸</span>
                <span className="leading-snug">{o}</span>
              </div>
            ))}
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: world.ink, opacity: 0.55 }}>
                Skill earned
              </span>
              <SkillIcon id={chapter.skill} size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* First-world subtle scroll hint */}
      {isFirst && (
        <div className="absolute bottom-2 left-0 right-0 z-10 text-center font-mono text-[10px] tracking-[0.22em] uppercase animate-pulse" style={{ color: "#f0ece4", opacity: 0.7 }}>
          ↓ scroll to continue
        </div>
      )}
    </section>
  );
}
