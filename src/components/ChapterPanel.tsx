import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { SKILLS } from "@/content/resume";
import { MiniGame } from "./MiniGame";
import { CliffNotesCard } from "./CliffNotesCard";
import { addSkill, useSkills } from "@/game/state";
import { collect, isCollected } from "@/game/pickups";
import { sfx } from "@/game/audio";
import { SCENES, LW, LH, GROUND_Y, ROPE_X, EXIT_X } from "@/game/scenes";
import { drawBg, drawProp, drawCharacter, drawAmbient, drawPickup, interpPath } from "@/game/draw";

interface Props { chapter: Chapter; }

export function ChapterPanel({ chapter }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const tickRef = useRef(0);
  const rafRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [showMini, setShowMini] = useState(false);
  const [, setCollectTick] = useState(0);
  const skills = useSkills();
  const completed = skills.includes(chapter.skill);
  const scene = SCENES[chapter.id];
  const skill = SKILLS[chapter.skill];

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const passed = -rect.top;
      const p = Math.max(0, Math.min(1, passed / Math.max(1, total)));
      progressRef.current = p;
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

  // Keyboard: Space launches mini-game when near the arcade cabinet.
  useEffect(() => {
    if (!scene) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const vh = window.innerHeight;
      const inView = rect.top < vh * 0.6 && rect.bottom > vh * 0.4;
      if (!inView) return;
      const pose = interpPath(scene.path, progressRef.current);
      if (Math.abs(pose.x - scene.arcadeX) < 40) {
        e.preventDefault();
        sfx.open();
        setShowMini(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scene]);

  useEffect(() => {
    if (!scene) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let last = performance.now();
    const render = (now: number) => {
      const dt = now - last; last = now;
      tickRef.current += dt / 16.7;
      const t = tickRef.current;
      const p = progressRef.current;

      ctx.imageSmoothingEnabled = false;
      drawBg(ctx, scene.bg, t, p * 100);
      // entry/exit ropes (always drawn so continuity reads top→bottom)
      drawProp(ctx, "rope",     ROPE_X - 4, 0, t, 0);
      drawProp(ctx, "exitRope", EXIT_X - 4, 0, t, 0);
      // scene props
      for (const pr of scene.props) drawProp(ctx, pr.kind, pr.x, pr.y ?? 0, t, pr.variant ?? 0);
      // arcade cabinet (in-world play prompt)
      drawProp(ctx, "arcadeCabinet", scene.arcadeX, 0, t, 0);

      // pickups
      const pose = interpPath(scene.path, p);
      scene.pickups.forEach((pk, i) => {
        const id = `${chapter.id}:${i}`;
        const got = isCollected(id);
        drawPickup(ctx, pk.x, pk.y, got, t, chapter.theme.accent);
        if (!got && Math.hypot(pose.x - (pk.x + 4), pose.y - (pk.y + 4)) < 14) {
          if (collect({ id, chapterId: chapter.id, label: pk.label, color: chapter.theme.accent })) {
            sfx.pickup();
            setCollectTick((x) => x + 1);
          }
        }
      });

      if (scene.ambient) drawAmbient(ctx, scene.ambient, t);

      const frame = Math.floor(t / 8);
      drawCharacter(ctx, pose.x, pose.y, frame, pose.facing, pose.action, chapter.theme.accent, t);

      // "PRESS ▶" prompt floats above arcade when character is close
      const near = Math.abs(pose.x - scene.arcadeX) < 36 && !completed;
      if (near) {
        const bob = (Math.floor(t / 10) % 2) ? -1 : 0;
        const px = scene.arcadeX;
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(px - 4, GROUND_Y - 60 + bob, 36, 12);
        ctx.fillStyle = "#0a0510"; ctx.font = "7px monospace";
        ctx.fillText("PRESS ▶", px, GROUND_Y - 52 + bob);
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(px + 14, GROUND_Y - 48 + bob, 4, 4);
      }
      if (completed) {
        const px = scene.arcadeX;
        ctx.fillStyle = "#22d3ee"; ctx.font = "7px monospace";
        ctx.fillText("✓ DONE", px, GROUND_Y - 50);
      }

      // gentle scanlines
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      for (let y = 0; y < LH; y += 3) ctx.fillRect(0, y, LW, 1);

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scene, chapter, completed]);

  useEffect(() => {
    if (!scene || completed) return;
    const t = setTimeout(() => sfx.step(), 220);
    return () => clearTimeout(t);
  }, [progress, scene, completed]);

  if (!scene) return null;

  const pose = interpPath(scene.path, progress);
  const canPlay = Math.abs(pose.x - scene.arcadeX) < 40;

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      className="relative"
      style={{ height: "200vh" }}
      aria-label={`${chapter.org} — ${chapter.year}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[color:var(--surface-1)]">
        {/* The pixel-art canvas fills the viewport — text now lives in side cards */}
        <canvas
          ref={canvasRef}
          width={LW}
          height={LH}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: "pixelated" as never, objectFit: "fill" }}
        />

        {/* Cliff-notes card slides in from the right; never overlaps the character */}
        <CliffNotesCard chapter={chapter} progress={progress} />

        {/* Subtle desktop hint */}
        <div className="hidden md:block absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] text-white/40 tracking-wider">
          ↓ scroll · {canPlay ? "press space to play" : "walk to the cabinet"}
        </div>

        {/* Fallback Play pill for touch — small, only visible when reachable */}
        {(canPlay || completed) && (
          <button
            type="button"
            onClick={() => { sfx.open(); setShowMini(true); }}
            className="md:hidden absolute bottom-4 right-4 font-mono text-xs px-3 py-2 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] shadow-md"
          >
            {completed ? "▶ replay" : "▶ play"}
          </button>
        )}

        {/* Skill chip — bottom left, tiny */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            {completed ? "earned" : "unlocks"}
          </span>
          <span
            className="font-mono text-[11px] px-2 py-0.5 rounded-sm"
            style={{
              background: completed ? skill.color : "transparent",
              color: completed ? "#0a0a0a" : skill.color,
              border: `1px solid ${skill.color}`,
            }}
          >
            {skill.name}
          </span>
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
