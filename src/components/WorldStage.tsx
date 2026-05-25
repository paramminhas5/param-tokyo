"use client";

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

interface Props {
  chapter: Chapter;
}

/**
 * One world section, rendered as a 9-layer cinematic parallax stack.
 *
 * Layers, back to front (z increases downward):
 *   1. SKY (painted, slow drift)
 *   2. FAR silhouettes (slow parallax)
 *   3. MID silhouettes (medium parallax)
 *   4. NEAR silhouettes (fast parallax, sits at the horizon)
 *   5. Ground line (per-world accent)
 *   6. Props + NPCs (fastest parallax, stand on ground)
 *   7. Skill pickups (float above ground)
 *   8. Color grade (per-world tint, multiply blend)
 *   9. Vignette (corner darkening)
 *
 * All parallax layers drift leftward as worldProgress goes 0→1, with magnitude
 * increasing toward the foreground. The hero (rendered globally) appears to
 * walk forward through the stack. Layers are 130% width so there's overhang
 * to absorb the leftward drift without exposing edges.
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
  const [pickupFlash, setPickupFlash] = useState<string | null>(null);

  useEffect(() => {
    registerWorldEl(chapter.id, ref.current);
    return () => registerWorldEl(chapter.id, null);
  }, [chapter.id]);

  useEffect(() => {
    if (isActive) playWorld(chapter.id);
  }, [isActive, chapter.id]);

  // Skill pickup detection — collect as the hero crosses each pickup's x position.
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

  // Mini-game trigger at 82% progress.
  useEffect(() => {
    if (!isActive || miniGameDoneRef.current || showMiniGame) return;
    if (worldProgress >= 0.82) setShowMiniGame(true);
  }, [isActive, worldProgress, showMiniGame]);

  // Use 0..1 progress while active; clamp to 0/1 outside the section.
  const p = isActive ? worldProgress : worldIndex > chapter.index - 1 ? 1 : 0;

  // Lazy mount: only render the heavy 9-layer art when within ±1 world of
  // the active chapter. The empty <section> stays in the DOM with its full
  // minHeight so the progress engine still measures it correctly.
  // chapter.index is 1-based; worldIndex is 0-based (with -1 = intro, N = outro).
  const distance = Math.abs((chapter.index - 1) - Math.max(0, worldIndex));
  const isNear = distance <= 1;

  // Parallax magnitudes — back to front, all drift LEFT.
  const skyShift = p * -2;
  const farShift = p * -6;
  const midShift = p * -12;
  const nearShift = p * -20;
  const propShift = p * -26;

  return (
    <section
      ref={ref}
      id={chapter.id}
      data-world-accent={world.accent}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "150vh",
        overflow: "hidden",
        background: world.ink,
      }}
    >
      {!isNear && (
        // Far-off worlds render only a tinted placeholder. Saves ~6 image fetches
        // and ~9 DOM layers per world until the user gets close.
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${world.ink} 0%, ${world.accent}11 50%, ${world.ink} 100%)`,
          }}
        />
      )}

      {isNear && (<>
      {/* L1 — SKY ───────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${world.sky})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "fixed",
          transform: `translateX(${skyShift}%)`,
          transition: "transform 80ms linear",
          willChange: "transform",
          imageRendering: "pixelated",
        }}
      />

      {/* L2 — FAR silhouettes ───────────────────────────────── */}
      <ParallaxBand
        src={world.far}
        bottom="calc(16vh + 26vh)"
        height="22vh"
        shift={farShift}
        opacity={0.85}
      />

      {/* L3 — MID silhouettes ───────────────────────────────── */}
      <ParallaxBand
        src={world.mid}
        bottom="calc(16vh + 8vh)"
        height="28vh"
        shift={midShift}
        opacity={0.95}
      />

      {/* L4 — NEAR silhouettes ──────────────────────────────── */}
      <ParallaxBand
        src={world.near}
        bottom="16vh"
        height="32vh"
        shift={nearShift}
        opacity={1}
      />

      {/* Bottom atmosphere glow (per-world accent) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "30%",
          background: `radial-gradient(ellipse at 50% 100%, ${world.accent}33 0%, transparent 75%)`,
          pointerEvents: "none",
        }}
      />

      {/* L5 — Ground line ───────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "16vh",
          height: 2,
          background: `linear-gradient(90deg, transparent, ${world.accent}88 18%, ${world.accent}88 82%, transparent)`,
          boxShadow: `0 0 12px ${world.accent}66`,
          zIndex: 6,
        }}
      />

      {/* L6 — Props (fastest parallax) ──────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "16vh",
          height: "32vh",
          transform: `translateX(${propShift}%)`,
          transition: "transform 100ms linear",
          willChange: "transform",
          pointerEvents: "none",
          zIndex: 7,
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

      {/* NPCs */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "16vh",
          height: "20vh",
          pointerEvents: "auto",
          zIndex: 8,
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
            <NpcSprite kind={npc.kind} label={npc.label} accent={world.accent} bobDelay={i * 340} />
          </div>
        ))}
      </div>

      {/* L7 — Skill pickups */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 9 }}>
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
                bottom: "calc(16vh + 18vh)",
                transform: "translateX(-50%)",
                transition: "opacity 400ms ease",
                opacity: collected ? 0 : 1,
              }}
            >
              <div
                style={{
                  position: "relative",
                  padding: 14,
                  borderRadius: 999,
                  background: `radial-gradient(circle at 35% 30%, ${world.accent}dd 0%, ${world.accent}66 45%, transparent 75%)`,
                  boxShadow: `0 0 36px ${world.accent}88, 0 0 12px ${world.accent}44`,
                  animation: "pm-float 2.8s ease-in-out infinite",
                }}
              >
                <SkillIcon id={pid} size={44} earned />
              </div>
              <div
                style={{
                  marginTop: 6,
                  textAlign: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
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
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `${world.accent}33`,
            animation: "pm-flash 0.5s ease-out forwards",
            zIndex: 12,
          }}
        />
      )}

      {/* L8 — Color grade (per-world tint, multiply blend) ─── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${world.ink}88 0%, ${world.ink}11 28%, transparent 55%, ${world.ink}66 90%, ${world.ink}cc 100%)`,
          pointerEvents: "none",
          zIndex: 13,
          mixBlendMode: "multiply",
        }}
      />

      {/* Per-world accent wash (lightly tints the whole section toward the world's signature) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: world.accent,
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 14,
          mixBlendMode: "color",
        }}
      />

      {/* L9 — Vignette ─────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 60%, transparent 45%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 15,
        }}
      />

      {/* Chapter index/year tag (corner) */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(16vh + 12px)",
          right: "2.5%",
          pointerEvents: "none",
          opacity: isActive ? 0.7 : 0.3,
          transition: "opacity 400ms ease",
          zIndex: 16,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: world.accent,
            textShadow: "0 2px 6px rgba(0,0,0,0.95)",
          }}
        >
          {String(chapter.index).padStart(2, "0")} · {chapter.year}
        </span>
      </div>

      {showMiniGame && (
        <MiniGame
          kind={chapter.mini.kind}
          prompt={chapter.mini.prompt}
          success={chapter.mini.success}
          accent={world.accent}
          onComplete={() => {
            miniGameDoneRef.current = true;
            setShowMiniGame(false);
          }}
          onDismiss={() => setShowMiniGame(false)}
        />
      )}
      </>)}

      <style>{`
        @keyframes pm-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes pm-flash {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/**
 * One parallax silhouette band. The image is rendered at 130% width so there's
 * overhang for the leftward drift to consume; image-rendering: pixelated keeps
 * the upscale crisp.
 */
function ParallaxBand({
  src,
  bottom,
  height,
  shift,
  opacity = 1,
}: {
  src: string;
  bottom: string;
  height: string;
  shift: number;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "-15%",
        right: "-15%",
        bottom,
        height,
        transform: `translateX(${shift}%)`,
        transition: "transform 100ms linear",
        willChange: "transform",
        pointerEvents: "none",
      }}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center bottom",
          imageRendering: "pixelated",
          opacity,
          filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.5))",
        }}
      />
    </div>
  );
}
