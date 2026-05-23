import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { addSkill, useSkills } from "@/game/state";
import { sfx } from "@/game/audio";
import { CliffNoteCard } from "./CliffNoteCard";
import { WorldHero } from "./WorldHero";
import { NPC } from "./NPC";
import { Prop } from "./Prop";
import { SkillPickup } from "./SkillPickup";

interface Props {
  chapter: Chapter;
  isFirst?: boolean;
}

/**
 * One world section. Scroll progress (0..1) drives:
 *  - the hero's horizontal position (left → right)
 *  - skill pickup collection (each pickup has an x; once hero passes x, collect)
 *  - cliff-note card visibility (in/out)
 */
export function WorldStage({ chapter, isFirst }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const collectedRef = useRef<Set<string>>(new Set());
  const skills = useSkills();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height + vh;
        const traveled = vh - rect.top;
        const p = Math.max(0, Math.min(1, traveled / total));
        setProgress(p);
        setCardVisible(rect.top < vh * 0.7 && rect.bottom > vh * 0.25);

        // Hero-x equivalent in 0..100
        const heroX = 8 + p * 84;

        // Collect pickups the hero has walked past
        const step = 100 / (chapter.pickups.length + 1);
        chapter.pickups.forEach((pid, i) => {
          const px = step * (i + 1);
          if (heroX >= px - 4 && !collectedRef.current.has(pid)) {
            collectedRef.current.add(pid);
            addSkill(pid);
            sfx.pickup();
          }
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [chapter.pickups]);

  // Mark a hero-x window for entering (top 8%) and exiting (bottom 8%)
  const entering = progress < 0.08;
  const exiting = progress > 0.92;

  return (
    <section
      ref={ref}
      id={chapter.id}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "150vh",
        background: "#0a0a14",
        ["--world-accent" as string]: world.accent,
      }}
    >
      {/* Background image */}
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
      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(10,10,20,0.25) 0%, rgba(10,10,20,0) 25%, rgba(10,10,20,0.55) 100%)`,
        }}
      />

      {/* Ground plane where the action happens */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none">
        {/* Props */}
        {chapter.props.map((p, i) => (
          <div
            key={`p${i}`}
            className="absolute"
            style={{
              left: `${p.x}%`,
              bottom: "16%",
              transform: `translateX(-50%) scale(${p.scale ?? 1})`,
            }}
          >
            <Prop kind={p.kind} accent={world.accent} ink={chapter.theme.silhouette} size={100} />
          </div>
        ))}

        {/* NPCs */}
        {chapter.npcs.map((n, i) => (
          <div
            key={`n${i}`}
            className="absolute"
            style={{
              left: `${n.x}%`,
              bottom: "18%",
              transform: "translateX(-50%)",
            }}
          >
            <NPC kind={n.kind} label={n.label} accent={world.accent} ink={chapter.theme.silhouette} />
          </div>
        ))}

        {/* Skill pickups along the path */}
        {chapter.pickups.map((pid, i) => {
          const step = 100 / (chapter.pickups.length + 1);
          const px = step * (i + 1);
          return (
            <SkillPickup
              key={pid}
              id={pid}
              x={px}
              accent={world.accent}
              collected={skills.includes(pid)}
            />
          );
        })}

        {/* Hero */}
        <WorldHero progress={progress} entering={entering} exiting={exiting} accent={world.accent} />
      </div>

      {/* Cliff-note card (corner, never blocking) */}
      <CliffNoteCard chapter={chapter} accent={world.accent} visible={cardVisible} />

      {/* World progress bar (slim, bottom) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 w-[min(420px,80vw)] h-[3px] bg-white/10 overflow-hidden">
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${progress * 100}%`, background: world.accent }}
        />
      </div>

      {/* First-world scroll hint */}
      {isFirst && progress < 0.15 && (
        <div className="absolute bottom-24 left-0 right-0 z-30 text-center font-mono text-[10px] tracking-[0.22em] uppercase animate-pulse" style={{ color: "#f0ece4", opacity: 0.7 }}>
          ↓ scroll to walk
        </div>
      )}
    </section>
  );
}
