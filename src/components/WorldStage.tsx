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
 * One world section, rendered as a 5-layer optimized parallax stack.
 * Reduced from 9 to 5 layers for better performance and visual clarity.
 *
 * Layers, back to front (z increases downward):
 *   1. SKY (painted, subtle drift)
 *   2. FAR silhouettes (30% opacity, slow parallax) - atmospheric depth
 *   3. MID silhouettes (60% opacity, medium parallax) - environmental context
 *   4. Ground plane (accent color line, solid)
 *   5. Props + NPCs + Skills (100% opacity, fast parallax, focal plane)
 *
 * REMOVED for clarity: NEAR layer (merged into mid), separate color grade layer,
 * separate vignette layer. Color grading and vignette now applied as overlays.
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

  // Lazy mount: only render the heavy 5-layer art when within ±1 world of
  // the active chapter. The empty <section> stays in the DOM with its full
  // minHeight so the progress engine still measures it correctly.
  // chapter.index is 1-based; worldIndex is 0-based (with -1 = intro, N = outro).
  const distance = Math.abs((chapter.index - 1) - Math.max(0, worldIndex));
  const isNear = distance <= 1;

  // Optimized parallax magnitudes — fewer layers, clearer depth cues
  const skyShift = p * -2;    // subtle background drift
  const farShift = p * -4;    // reduced from -6, 30% opacity
  const midShift = p * -10;   // reduced from -12, 60% opacity  
  const propShift = p * -18;  // reduced from -26, 100% opacity focal plane

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
        // Far-off worlds render only a tinted placeholder. Saves ~4 image fetches
        // and ~5 DOM layers per world until the user gets close.
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
          transform: `translate3d(${skyShift}%, 0, 0)`,
          transition: "transform 80ms linear",
          willChange: "transform",
          imageRendering: "pixelated",
        }}
      />

      {/* L2 — FAR silhouettes (30% opacity for atmospheric depth) */}
      <ParallaxBand
        src={world.far}
        bottom="calc(16vh + 24vh)"
        height="24vh"
        shift={farShift}
        opacity={0.3}
      />

      {/* L3 — MID silhouettes (60% opacity for environmental context) */}
      <ParallaxBand
        src={world.mid}
        bottom="calc(16vh + 8vh)"
        height="30vh"
        shift={midShift}
        opacity={0.6}
      />

      {/* Bottom atmosphere glow (per-world accent) - stronger for Pokemon feel */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "35%",
          background: `radial-gradient(ellipse at 50% 100%, ${world.accent}44 0%, ${world.accent}22 35%, transparent 80%)`,
          pointerEvents: "none",
        }}
      />

      {/* L4 — Ground plane (solid accent line) ──────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "16vh",
          height: 3,
          background: `linear-gradient(90deg, transparent, ${world.accent}cc 18%, ${world.accent}cc 82%, transparent)`,
          boxShadow: `0 0 16px ${world.accent}88, 0 4px 24px ${world.accent}44`,
          zIndex: 6,
        }}
      />

      {/* L5 — Props + NPCs + Skills (focal plane, fastest parallax) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "16vh",
          height: "32vh",
          transform: `translate3d(${propShift}%, 0, 0)`,
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

      {/* Skill pickups */}
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

      {/* Integrated color grade + vignette overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(0,0,0,0.6) 100%),
            linear-gradient(180deg, ${world.ink}88 0%, ${world.ink}11 28%, transparent 55%, ${world.ink}66 90%, ${world.ink}cc 100%)
          `,
          pointerEvents: "none",
          zIndex: 13,
          mixBlendMode: "multiply",
        }}
      />

      {/* Per-world accent wash (Pokemon-style color tinting) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: world.accent,
          opacity: 0.08,
          pointerEvents: "none",
          zIndex: 14,
          mixBlendMode: "color",
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
 * the upscale crisp. Now uses translate3d for GPU acceleration.
 * 
 * Opacity controls atmospheric depth: far layers are more transparent.
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
        transform: `translate3d(${shift}%, 0, 0)`,
        transition: "transform 100ms linear",
        willChange: "transform",
        pointerEvents: "none",
        backfaceVisibility: "hidden",
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
          filter: opacity < 0.5 
            ? "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" 
            : "drop-shadow(0 14px 24px rgba(0,0,0,0.5))",
        }}
      />
    </div>
  );
}
