import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { SKILLS } from "@/content/resume";
import { WORLDS } from "@/game/journey";
import { addSkill, useSkills } from "@/game/state";
import { sfx } from "@/game/audio";
import { playWorld } from "@/game/ambient";
import { registerWorldEl, useProgress } from "@/game/progress";
import { SkillIcon } from "./SkillIcon";
import { NpcSprite } from "./NpcSprite";
import { PropSprite } from "./PropSprite";
import { MiniGame } from "./MiniGame";

interface Props { chapter: Chapter; }

/**
 * One world section. 4-layer parallax + NPC/Prop rendering + mini-game trigger.
 * Sky → Far BG → Mid FG Sprite → Props+NPCs layer → Skill pickups.
 * Mini-game fires when hero reaches 82% through the world.
 */
export function WorldStage({ chapter }: Props) {
  const world = WORLDS[chapter.id] ?? WORLDS.origin;
  const ref = useRef<HTMLElement | null>(null);
  const { worldId, worldProgress, worldIndex } = useProgress();
  const isActive = worldId === chapter.id;
  const collectedRef = useRef<Set<string>>(new Set());
  const earned = useSkills();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const miniGameDoneRef = useRef(false);
  const [miniGameKey, setMiniGameKey] = useState(0);
  const [pickupFlash, setPickupFlash] = useState<string | null>(null);

  useEffect(() => {
    registerWorldEl(chapter.id, ref.current);
    return () => registerWorldEl(chapter.id, null);
  }, [chapter.id]);

  // Ambient audio when world becomes active
  useEffect(() => {
    if (isActive) playWorld(chapter.id);
  }, [isActive, chapter.id]);

  // Collect pickups by hero position
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
        setPickupFlash(pid);
        setTimeout(() => setPickupFlash(null), 600);
      }
    });
  }, [isActive, worldProgress, chapter.pickups]);

  // Mini-game trigger at 82% progress
  useEffect(() => {
    if (!isActive || miniGameDoneRef.current || showMiniGame) return;
    if (worldProgress >= 0.82) {
      setShowMiniGame(true);
    }
  }, [isActive, worldProgress, showMiniGame]);

  const progress = isActive ? worldProgress : (worldIndex > chapter.index - 1 ? 1 : 0);

  // Parallax offsets
  const farOffset = progress * -4;    // BG barely drifts left
  const midOffset = progress * -9;    // FG sprite shifts more
  const propsOffset = progress * 6;   // Props drift right slightly (closer to camera)

  return (
    <section
      ref={ref}
      id={chapter.id}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "150vh",
        overflow: "hidden",
        background: "#050310",
      }}
    >
      {/* LAYER 1 — Sky (fixed, barely moves) */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${world.bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          transform: `translateX(${farOffset}%)`,
          transition: "transform 80ms linear",
          willChange: "transform",
        }}
      />

      {/* Sky tint + color grade per world */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg,
            ${world.ink}cc 0%,
            ${world.ink}44 18%,
            transparent 40%,
            ${world.ink}66 80%,
            ${world.ink}cc 100%
          )`,
        }}
      />

      {/* World accent atmosphere glow (bottom) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "35%",
          background: `radial-gradient(ellipse at 50% 100%, ${world.accent}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* LAYER 2 — FG sprite (mid parallax) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0, right: 0, bottom: 0,
          height: "75%",
          transform: `translateX(${midOffset}%)`,
          transition: "transform 100ms linear",
          willChange: "transform",
        }}
      >
        <img
          src={world.fg}
          alt=""
          loading="lazy"
          style={{
            position: "absolute",
            left: "-5%",
            bottom: "calc(16vh - 4px)",
            width: "110%",
            height: "auto",
            maxHeight: "72%",
            objectFit: "contain",
            objectPosition: "bottom",
            imageRendering: "auto",
            filter: `drop-shadow(0 16px 28px rgba(0,0,0,0.5))`,
          }}
        />
      </div>

      {/* LAYER 3 — Ground line */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "16vh",
          left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${world.accent}55 20%, ${world.accent}55 80%, transparent)`,
        }}
      />

      {/* LAYER 4 — Props (closest to camera, fastest parallax) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0, right: 0,
          bottom: "16vh",
          height: "30%",
          transform: `translateX(${propsOffset}%)`,
          transition: "transform 100ms linear",
          pointerEvents: "none",
        }}
      >
        {chapter.props.map((prop, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${prop.x}%`,
              bottom: 0,
              transform: "translateX(-50%)",
            }}
          >
            <PropSprite kind={prop.kind} scale={prop.scale ?? 1} accent={world.accent} />
          </div>
        ))}
      </div>

      {/* LAYER 5 — NPCs */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0,
          bottom: "16vh",
          height: "20%",
          pointerEvents: "auto",
        }}
      >
        {chapter.npcs.map((npc, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${npc.x}%`,
              bottom: 0,
              transform: "translateX(-50%)",
            }}
          >
            <NpcSprite
              kind={npc.kind}
              label={npc.label}
              accent={world.accent}
              bobDelay={i * 340}
            />
          </div>
        ))}
      </div>

      {/* LAYER 6 — Skill pickups */}
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
                bottom: "calc(16vh + 150px)",
                transform: "translateX(-50%)",
                transition: "opacity 400ms ease, transform 500ms ease",
                opacity: collected ? 0 : 1,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  padding: 14,
                  borderRadius: 999,
                  background: `radial-gradient(circle at 35% 30%, ${world.accent}dd 0%, ${world.accent}77 45%, transparent 75%)`,
                  boxShadow: `0 0 36px ${world.accent}88, 0 0 12px ${world.accent}44`,
                  animation: "pm-float 2.8s ease-in-out infinite",
                }}
              >
                <SkillIcon id={pid} size={44} earned />
              </div>
              <div
                style={{
                  marginTop: 6, textAlign: "center",
                  fontFamily: "monospace", fontSize: 9,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: world.accent,
                  textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                }}
              >
                {SKILLS[pid].name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pickup flash overlay */}
      {pickupFlash && (
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `${world.accent}22`,
            animation: "pm-flash 0.5s ease-out forwards",
            zIndex: 10,
          }}
        />
      )}

      {/* World chapter label (bottom right corner) */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(16vh + 12px)",
          right: "2%",
          pointerEvents: "none",
          opacity: isActive ? 0.6 : 0.25,
          transition: "opacity 400ms ease",
        }}
      >
        <span style={{
          fontFamily: "monospace", fontSize: 10,
          letterSpacing: "0.24em", textTransform: "uppercase",
          color: world.accent,
          textShadow: "0 2px 6px rgba(0,0,0,0.8)",
        }}>
          {String(chapter.index).padStart(2, "0")} · {chapter.year}
        </span>
      </div>

      {/* Scanlines overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)",
          pointerEvents: "none",
          zIndex: 8,
        }}
      />

      {/* Mini-game */}
      {showMiniGame && (
        <MiniGame
          key={miniGameKey}
          kind={chapter.mini.kind}
          prompt={chapter.mini.prompt}
          success={chapter.mini.success}
          accent={world.accent}
          onComplete={() => {
            miniGameDoneRef.current = true;
            setShowMiniGame(false);
          }}
          onDismiss={() => {
            setShowMiniGame(false);
          }}
        />
      )}

      <style>{`
        @keyframes pm-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes pm-flash {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
