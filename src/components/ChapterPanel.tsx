import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { SKILLS } from "@/content/resume";
import { MiniGame } from "./MiniGame";
import { addSkill, useSkills } from "@/game/state";
import { sfx } from "@/game/audio";
import { SCENES, LW, LH } from "@/game/scenes";
import { drawBg, drawProp, drawCharacter, drawAmbient, interpPath } from "@/game/draw";

interface Props { chapter: Chapter; }

export function ChapterPanel({ chapter }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const tickRef = useRef(0);
  const rafRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [showMini, setShowMini] = useState(false);
  const skills = useSkills();
  const completed = skills.includes(chapter.skill);
  const scene = SCENES[chapter.id];
  const skill = SKILLS[chapter.skill];

  // Scroll progress within section (0..1)
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh; // sticky scroll range
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

  // Render loop
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
      // background
      drawBg(ctx, scene.bg, t, p * 100);
      // props
      for (const pr of scene.props) drawProp(ctx, pr.kind, pr.x, pr.y ?? 0, t, pr.variant ?? 0);
      // mini-game flag (planted if completed) drawn as in-world arcade sign
      const px = scene.playX;
      const py = 188;
      // flagpole
      ctx.fillStyle = "#0a0510"; ctx.fillRect(px, py - 30, 1, 30);
      ctx.fillStyle = completed ? "#22d3ee" : "#e84393";
      ctx.fillRect(px + 1, py - 30, 10, 7);
      if (completed) {
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(px + 4, py - 28, 1, 1);
        ctx.fillRect(px + 5, py - 27, 2, 1);
        ctx.fillRect(px + 4, py - 26, 4, 1);
      } else {
        ctx.fillStyle = "#fff"; ctx.font = "6px monospace";
        ctx.fillText("?", px + 4, py - 24);
      }

      // ambient particles
      if (scene.ambient) drawAmbient(ctx, scene.ambient, t);

      // character along path
      const pose = interpPath(scene.path, p);
      const frame = Math.floor(t / 8);
      drawCharacter(ctx, pose.x, pose.y, frame, pose.facing, pose.action, chapter.theme.accent, t);

      // play hint when character is near play flag
      const near = Math.abs(pose.x - px) < 30 && !completed;
      if (near) {
        const bob = (Math.floor(t / 10) % 2) ? -1 : 0;
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(px - 2, py - 44 + bob, 14, 10);
        ctx.fillStyle = "#0a0510"; ctx.font = "7px monospace";
        ctx.fillText("PLAY", px - 1, py - 36 + bob);
        // arrow
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(px + 4, py - 34 + bob, 2, 2); ctx.fillRect(px + 3, py - 33 + bob, 4, 1);
      }

      // subtle scanlines overlay (in canvas, cheap)
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      for (let y = 0; y < LH; y += 2) ctx.fillRect(0, y, LW, 1);

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scene, chapter, completed]);

  // step sfx
  useEffect(() => {
    if (!scene || completed) return;
    const t = setTimeout(() => sfx.step(), 220);
    return () => clearTimeout(t);
  }, [progress, scene, completed]);

  if (!scene) return null;

  // Check if play prop is reachable now to enable button
  const pose = interpPath(scene.path, progress);
  const canPlay = Math.abs(pose.x - scene.playX) < 40;

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      className="relative"
      style={{ height: "180vh" }}
      aria-label={`${chapter.org} — ${chapter.year}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--pm-deep-2)]">
        <canvas
          ref={canvasRef}
          width={LW}
          height={LH}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: "pixelated" as never, objectFit: "fill" }}
        />

        {/* Narration boxes positioned in % of viewport (canvas stretches to fill, so percentages match canvas space) */}
        <div className="absolute inset-0 pointer-events-none">
          {scene.narration.map((n, i) => (
            <div
              key={i}
              className={
                n.kind === "title"
                  ? "absolute font-pixel text-[10px] sm:text-xs text-[var(--pm-gold)] bg-[var(--pm-deep-2)]/85 border-2 border-[var(--pm-gold)] px-2 py-1"
                  : n.kind === "hook"
                  ? "absolute font-display text-base sm:text-xl text-white bg-[var(--pm-deep-2)]/80 border-l-4 border-[var(--pm-magenta)] px-3 py-2 leading-tight"
                  : n.kind === "outcome"
                  ? "absolute font-mono text-xs text-[var(--pm-gold)] bg-[var(--pm-deep-2)]/80 border border-[var(--pm-gold)] px-2 py-1"
                  : "absolute font-mono text-xs sm:text-sm text-white/85 bg-[var(--pm-deep-2)]/80 border border-[var(--border)] px-3 py-2 leading-snug"
              }
              style={{
                left: `${n.ax * 100}%`,
                top: `${n.ay * 100}%`,
                width: `${n.w * 100}%`,
                maxWidth: "520px",
              }}
            >
              {n.text}
            </div>
          ))}

          {/* Outcomes as in-world signs along bottom */}
          <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 flex flex-wrap gap-2 justify-center max-w-[80%]">
            {chapter.outcomes.slice(0, 3).map((o) => (
              <span key={o} className="font-mono text-[10px] sm:text-xs text-[var(--pm-gold)] bg-[var(--pm-deep-2)]/85 border border-[var(--pm-gold)] px-2 py-1">
                ✦ {o}
              </span>
            ))}
          </div>

          {/* Skill earned chip */}
          <div className="absolute bottom-[4%] left-4 sm:left-6 flex items-center gap-2">
            <span className="font-pixel text-[8px] sm:text-[9px] text-white/60">SKILL →</span>
            <span
              className="font-pixel text-[9px] sm:text-[10px] px-2 py-1"
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

        {/* Play button — pointer-events on, surfaces when character reaches the prop */}
        <button
          type="button"
          onClick={() => { sfx.open(); setShowMini(true); }}
          disabled={!canPlay && !completed}
          className={`absolute bottom-[4%] right-4 sm:right-6 font-pixel text-[10px] px-3 py-2 transition-all ${
            canPlay || completed
              ? "bg-[var(--pm-gold)] text-[var(--pm-ink)] hover:bg-[var(--pm-magenta)] hover:text-white animate-pulse"
              : "bg-[var(--pm-deep)] text-white/40 border border-white/20"
          }`}
          aria-label={`Play ${chapter.org} mini-game`}
        >
          {completed ? "▶ REPLAY" : canPlay ? "▶ PLAY" : "▷ scroll closer"}
        </button>
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
