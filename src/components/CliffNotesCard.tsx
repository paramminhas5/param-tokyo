import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { SKILLS } from "@/content/resume";
import { useSkills } from "@/game/state";

interface Props { chapter: Chapter; progress: number; }

/**
 * Slide-in chapter card. Anchors to the right rail on desktop and the
 * top sheet on mobile. Fades/slides as the panel enters and exits view.
 */
export function CliffNotesCard({ chapter, progress }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const earned = useSkills();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setVisible(e.isIntersecting)),
      { threshold: 0.35, rootMargin: "-10% 0px -25% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Opacity also slightly tracks scroll progress so it fades near the panel edges.
  const fade =
    progress < 0.1 ? progress / 0.1 :
    progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) :
    1;

  const builtOnEarned = chapter.builtOn.filter((s) => earned.includes(s));
  const newSkill = SKILLS[chapter.skill];

  return (
    <div
      ref={ref}
      className={`
        pointer-events-auto absolute z-10
        right-4 md:right-8 top-1/2 -translate-y-1/2 w-[min(360px,calc(100vw-2rem))]
        max-md:right-1/2 max-md:translate-x-1/2 max-md:top-6 max-md:translate-y-0 max-md:w-[calc(100vw-1.5rem)]
        transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-x-0 max-md:translate-x-1/2" : "opacity-0 translate-x-6 max-md:translate-x-[calc(50%+24px)]"}
      `}
      style={{ opacity: visible ? fade : 0 }}
    >
      <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/95 backdrop-blur-md p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted-fg)]">
            Chapter {String(chapter.index).padStart(2, "0")} · {chapter.year}
          </span>
          <span className="font-mono text-[10px] text-[color:var(--accent)]">{chapter.role}</span>
        </div>

        <h2 className="text-2xl md:text-[28px] leading-tight font-semibold text-[color:var(--fg)] tracking-tight">
          {chapter.org}
        </h2>
        <p className="mt-2 text-sm md:text-[15px] text-[color:var(--fg)]/80 leading-snug">
          {chapter.hook}
        </p>

        {builtOnEarned.length > 0 && (
          <div className="mt-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-2">
              Built on
            </div>
            <div className="flex flex-wrap gap-1.5">
              {builtOnEarned.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[10px] px-2 py-1 rounded-sm border"
                  style={{ borderColor: SKILLS[s].color, color: SKILLS[s].color }}
                >
                  ✓ {SKILLS[s].name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-2">
            New skill
          </div>
          <span
            className="font-mono text-[11px] px-2 py-1 rounded-sm"
            style={{ background: newSkill.color, color: "#0a0a0a" }}
          >
            {newSkill.name}
          </span>
        </div>

        <ul className="mt-4 space-y-1.5">
          {chapter.outcomes.slice(0, 3).map((o) => (
            <li key={o} className="flex items-start gap-2 text-sm text-[color:var(--fg)]/85">
              <span className="text-[color:var(--accent)] mt-0.5">◆</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-3 border-t border-[color:var(--border)]/60 font-mono text-[10px] text-[color:var(--muted-fg)] leading-relaxed">
          {chapter.paragraphs[0]}
        </div>
      </div>
    </div>
  );
}
