import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { SKILLS } from "@/content/resume";
import { PixelStage } from "./PixelStage";
import { MiniGame } from "./MiniGame";
import { addSkill, useSkills } from "@/game/state";

interface Props { chapter: Chapter; }

export function ChapterSection({ chapter }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [showMini, setShowMini] = useState(false);
  const skills = useSkills();
  const completed = skills.includes(chapter.skill);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when top of section is at bottom of viewport, 1 when bottom of section is at top of viewport.
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const skill = SKILLS[chapter.skill];

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      className="relative border-t border-[var(--border)]"
      aria-label={`${chapter.org} — ${chapter.year}`}
    >
      <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10 px-4 sm:px-6 py-12 lg:py-20">
        {/* Text */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-pixel text-[10px] text-[var(--pm-gold)]">
              0{chapter.index} · {chapter.year}
            </span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <h2 className="font-pixel text-xl sm:text-2xl text-white leading-tight">
            {chapter.org}
          </h2>
          <div className="mt-1 text-[var(--pm-cyan)] font-mono text-sm">
            {chapter.role}
          </div>
          <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
            {chapter.hook}
          </p>
          <div className="mt-5 space-y-4 text-sm sm:text-base text-white/75 leading-relaxed">
            {chapter.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {chapter.outcomes.map((o) => (
              <li key={o} className="font-mono text-xs px-2 py-1 border border-[var(--pm-gold)] text-[var(--pm-gold)]">
                {o}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center gap-2">
            <span className="font-pixel text-[9px] text-white/60">SKILL EARNED →</span>
            <span
              className="font-pixel text-[10px] px-2 py-1"
              style={{
                background: completed ? skill.color : "transparent",
                color: completed ? "#1a0f33" : skill.color,
                border: `2px solid ${skill.color}`,
              }}
            >
              {completed ? "✓ " : ""}{skill.name}
            </span>
          </div>
        </div>

        {/* Pixel stage */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24 self-start">
          <div className="pixel-box aspect-[16/9] overflow-hidden">
            <PixelStage
              chapter={chapter}
              progress={progress}
              completed={completed}
              onTriggerMini={() => setShowMini(true)}
            />
          </div>
          <div className="mt-2 font-mono text-[10px] text-white/50 text-center">
            scroll to walk · tap PLAY for the mini-game
          </div>
        </div>
      </div>

      {showMini && (
        <MiniGame
          chapter={chapter}
          onClose={() => setShowMini(false)}
          onWin={() => { addSkill(chapter.skill); setTimeout(() => setShowMini(false), 800); }}
        />
      )}
    </section>
  );
}