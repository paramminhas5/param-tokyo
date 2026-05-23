import { useEffect, useRef } from "react";
import type { Chapter } from "@/content/resume";
import { SKILLS } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { addSkill, useSkills } from "@/game/state";
import { sfx } from "@/game/audio";
import { registerWorldEl, useProgress } from "@/game/progress";
import { SkillIcon } from "./SkillIcon";

interface Props {
  chapter: Chapter;
}

/**
 * One world section. Pure sprite art — background image + foreground PNG overlay +
 * skill pickups laid out along the path. The hero is rendered globally (GlobalHero),
 * so this component only paints the world itself.
 */
export function WorldStage({ chapter }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const ref = useRef<HTMLElement | null>(null);
  const { worldId, worldProgress } = useProgress();
  const isActive = worldId === chapter.id;
  const collectedRef = useRef<Set<string>>(new Set());
  const earned = useSkills();

  useEffect(() => {
    registerWorldEl(chapter.id, ref.current);
    return () => registerWorldEl(chapter.id, null);
  }, [chapter.id]);

  // Collect pickups the hero has visually passed.
  useEffect(() => {
    if (!isActive) return;
    const heroX = 12 + worldProgress * 76;
    const step = 100 / (chapter.pickups.length + 1);
    chapter.pickups.forEach((pid, i) => {
      const px = step * (i + 1);
      if (heroX >= px - 2 && !collectedRef.current.has(pid)) {
        collectedRef.current.add(pid);
        addSkill(pid);
        sfx.pickup();
      }
    });
  }, [isActive, worldProgress, chapter.pickups]);

  return (
    <section
      ref={ref}
      id={chapter.id}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "150vh",
        overflow: "hidden",
        background: "#0a0a14",
      }}
    >
      {/* Background image (deep layer) */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${world.bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(10,10,20,0.35) 0%, rgba(10,10,20,0) 22%, rgba(10,10,20,0.6) 100%)",
        }}
      />

      {/* Foreground prop layer (parallax based on world progress) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0, right: 0, bottom: 0,
          height: "75%",
          transform: `translateX(${(isActive ? worldProgress : 0) * -8}%)`,
          transition: "transform 200ms linear",
        }}
      >
        <img
          src={world.fg}
          alt=""
          loading="lazy"
          style={{
            position: "absolute",
            left: "-4%",
            bottom: "12vh",
            width: "108%",
            height: "auto",
            maxHeight: "70%",
            objectFit: "contain",
            objectPosition: "bottom",
            imageRendering: "auto",
            filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.45))",
          }}
        />
      </div>

      {/* Skill pickups along the path */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {chapter.pickups.map((pid, i) => {
          const step = 100 / (chapter.pickups.length + 1);
          const px = step * (i + 1);
          const collected = earned.includes(pid);
          return (
            <div
              key={pid}
              style={{
                position: "absolute",
                left: `${px}%`,
                bottom: "calc(16vh + 130px)",
                transform: "translateX(-50%)",
                transition: "opacity 350ms ease, transform 450ms ease",
                opacity: collected ? 0 : 1,
              }}
            >
              <div
                style={{
                  position: "relative",
                  padding: 12,
                  borderRadius: 999,
                  background: `radial-gradient(circle at 35% 30%, ${world.accent}cc 0%, ${world.accent}66 45%, transparent 75%)`,
                  boxShadow: `0 0 32px ${world.accent}88`,
                  animation: "pm-float 2.6s ease-in-out infinite",
                }}
              >
                <SkillIcon id={pid} size={40} earned />
              </div>
              <div
                style={{
                  marginTop: 6,
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: world.accent,
                  textShadow: "0 2px 6px rgba(0,0,0,0.85)",
                }}
              >
                {SKILLS[pid].name}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pm-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
