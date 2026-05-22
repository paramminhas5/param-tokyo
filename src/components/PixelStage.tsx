import { useEffect, useRef, useState } from "react";
import type { Chapter, PropKind } from "@/content/resume";
import { sfx } from "@/game/audio";

// Logical resolution — tiny, crisp, no shadow blobs.
const LW = 256;
const LH = 144;

interface Props {
  chapter: Chapter;
  // 0..1 within section viewport
  progress: number;
  // Has the mini-game been completed?
  completed: boolean;
  onTriggerMini: () => void;
}

/** Draw an NES-style prop. Pure flat fills, no shadows. */
function drawProp(ctx: CanvasRenderingContext2D, p: { x: number; kind: PropKind }, theme: Chapter["theme"], groundY: number) {
  const x = p.x;
  const sil = theme.silhouette;
  const acc = theme.accent;
  ctx.imageSmoothingEnabled = false;
  switch (p.kind) {
    case "tree":
      ctx.fillStyle = sil;
      ctx.fillRect(x + 5, groundY - 18, 4, 18);
      ctx.fillStyle = "#2d5a3d";
      ctx.fillRect(x, groundY - 28, 14, 12);
      ctx.fillRect(x + 2, groundY - 32, 10, 4);
      break;
    case "house":
      ctx.fillStyle = sil;
      ctx.fillRect(x, groundY - 22, 20, 22);
      ctx.fillStyle = acc;
      ctx.fillRect(x - 2, groundY - 28, 24, 6);
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(x + 4, groundY - 14, 4, 4);
      ctx.fillRect(x + 12, groundY - 14, 4, 4);
      ctx.fillStyle = acc;
      ctx.fillRect(x + 8, groundY - 8, 4, 8);
      break;
    case "building":
      ctx.fillStyle = sil;
      ctx.fillRect(x, groundY - 50, 22, 50);
      ctx.fillStyle = acc;
      for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) {
        ctx.fillRect(x + 4 + j * 10, groundY - 46 + i * 8, 4, 4);
      }
      break;
    case "antenna":
      ctx.fillStyle = sil;
      ctx.fillRect(x, groundY - 28, 12, 28);
      ctx.fillRect(x + 5, groundY - 40, 2, 12);
      ctx.fillStyle = acc;
      ctx.fillRect(x + 4, groundY - 42, 4, 2);
      break;
    case "rack":
      ctx.fillStyle = sil;
      ctx.fillRect(x, groundY - 24, 14, 24);
      ctx.fillStyle = acc;
      for (let i = 0; i < 4; i++) ctx.fillRect(x + 2, groundY - 22 + i * 6, 10, 2);
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(x + 11, groundY - 20, 1, 1);
      ctx.fillRect(x + 11, groundY - 14, 1, 1);
      break;
    case "vault":
      ctx.fillStyle = sil;
      ctx.fillRect(x, groundY - 18, 18, 18);
      ctx.fillStyle = acc;
      ctx.fillRect(x + 7, groundY - 11, 4, 4);
      ctx.fillRect(x + 8, groundY - 7, 2, 4);
      break;
    case "shoe":
      ctx.fillStyle = sil;
      ctx.fillRect(x, groundY - 6, 14, 6);
      ctx.fillStyle = acc;
      ctx.fillRect(x + 2, groundY - 10, 8, 4);
      ctx.fillStyle = "#fff";
      ctx.fillRect(x + 1, groundY - 3, 12, 1);
      break;
    case "mic":
      ctx.fillStyle = sil;
      ctx.fillRect(x + 4, groundY - 12, 2, 12);
      ctx.fillStyle = acc;
      ctx.fillRect(x + 2, groundY - 18, 6, 6);
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(x + 3, groundY - 17, 4, 1);
      ctx.fillRect(x + 3, groundY - 15, 4, 1);
      break;
    case "ladder":
      ctx.fillStyle = acc;
      ctx.fillRect(x, groundY - 32, 2, 32);
      ctx.fillRect(x + 8, groundY - 32, 2, 32);
      for (let i = 0; i < 5; i++) ctx.fillRect(x, groundY - 28 + i * 6, 10, 2);
      break;
    case "platform":
      ctx.fillStyle = sil;
      ctx.fillRect(x, groundY - 22, 26, 4);
      ctx.fillStyle = acc;
      ctx.fillRect(x, groundY - 22, 26, 1);
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(x + 4, groundY - 18, 2, 18);
      ctx.fillRect(x + 20, groundY - 18, 2, 18);
      break;
    case "sign":
      ctx.fillStyle = sil;
      ctx.fillRect(x + 3, groundY - 14, 2, 14);
      ctx.fillStyle = acc;
      ctx.fillRect(x, groundY - 18, 10, 6);
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(x + 2, groundY - 16, 6, 1);
      ctx.fillRect(x + 2, groundY - 14, 4, 1);
      break;
    case "crate":
      ctx.fillStyle = sil;
      ctx.fillRect(x, groundY - 10, 10, 10);
      ctx.fillStyle = acc;
      ctx.strokeStyle = acc;
      ctx.fillRect(x, groundY - 10, 10, 1);
      ctx.fillRect(x, groundY - 1, 10, 1);
      ctx.fillRect(x + 4, groundY - 9, 2, 8);
      break;
  }
}

/** Tiny 12×16 character. Walk cycle is 4 frames. */
function drawCharacter(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, facing: 1 | -1, theme: Chapter["theme"]) {
  const fx = Math.floor(x);
  const fy = Math.floor(y);
  ctx.save();
  ctx.translate(fx, fy);
  if (facing === -1) { ctx.scale(-1, 1); ctx.translate(-12, 0); }
  // body
  ctx.fillStyle = "#fbbf24"; // hair/cap
  ctx.fillRect(2, 0, 8, 3);
  ctx.fillStyle = "#f5d0a9"; // face
  ctx.fillRect(2, 3, 8, 4);
  ctx.fillStyle = "#0a0510"; // eyes
  ctx.fillRect(7, 4, 1, 1);
  ctx.fillStyle = theme.accent; // shirt
  ctx.fillRect(1, 7, 10, 5);
  ctx.fillStyle = "#2d1b4e"; // pants
  ctx.fillRect(2, 12, 8, 2);
  // legs animated
  ctx.fillStyle = "#0a0510";
  const f = frame % 4;
  if (f === 0) { ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2); }
  else if (f === 1) { ctx.fillRect(3, 14, 3, 2); ctx.fillRect(7, 14, 3, 2); }
  else if (f === 2) { ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2); }
  else { ctx.fillRect(2, 14, 3, 2); ctx.fillRect(6, 14, 3, 2); }
  // arm
  ctx.fillStyle = theme.accent;
  ctx.fillRect(0, 8, 1, 3);
  ctx.fillRect(11, 8, 1, 3);
  ctx.restore();
}

/** 1-bit dither between two colors for a sky gradient. */
function fillSky(ctx: CanvasRenderingContext2D, top: string, bottom: string) {
  // Solid top half, mid dither, solid bottom
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, LW, Math.floor(LH * 0.55));
  // dither band
  const bandY = Math.floor(LH * 0.55);
  const bandH = 14;
  for (let y = 0; y < bandH; y++) {
    const ratio = y / bandH;
    ctx.fillStyle = ratio < 0.5 ? top : bottom;
    ctx.fillRect(0, bandY + y, LW, 1);
    // checker overlay
    ctx.fillStyle = ratio < 0.5 ? bottom : top;
    for (let x = (bandY + y) % 2; x < LW; x += 2) ctx.fillRect(x, bandY + y, 1, 1);
  }
  ctx.fillStyle = bottom;
  ctx.fillRect(0, bandY + bandH, LW, LH - bandY - bandH);
}

export function PixelStage({ chapter, progress, completed, onTriggerMini }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const [showHint, setShowHint] = useState(false);

  // Trigger zone: ~70% across
  const triggerX = 0.7;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let last = performance.now();
    let walkFrame = 0;
    let frameTimer = 0;

    const render = (now: number) => {
      const dt = now - last;
      last = now;
      frameTimer += dt;
      if (frameTimer > 120) { walkFrame++; frameTimer = 0; }
      frameRef.current = walkFrame;

      ctx.imageSmoothingEnabled = false;
      // sky
      fillSky(ctx, chapter.theme.sky, chapter.theme.ground);

      // distant silhouettes (parallax 1 layer)
      ctx.fillStyle = chapter.theme.silhouette;
      const groundY = LH - 18;
      // simple mountain row
      for (let i = 0; i < 6; i++) {
        const mx = i * 50 - (progress * 20) % 50;
        ctx.beginPath();
        ctx.moveTo(mx, groundY);
        ctx.lineTo(mx + 20, groundY - 24);
        ctx.lineTo(mx + 40, groundY);
        ctx.closePath();
        ctx.fill();
      }

      // props
      for (const p of chapter.props) drawProp(ctx, p, chapter.theme, groundY);

      // ground stripe
      ctx.fillStyle = chapter.theme.ground;
      ctx.fillRect(0, groundY, LW, LH - groundY);
      ctx.fillStyle = chapter.theme.accent;
      ctx.fillRect(0, groundY, LW, 1);

      // trigger flag at trigger zone
      const flagX = Math.floor(triggerX * LW);
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(flagX, groundY - 22, 1, 22);
      ctx.fillStyle = completed ? "#22d3ee" : "#e84393";
      ctx.fillRect(flagX + 1, groundY - 22, 8, 6);
      if (completed) {
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(flagX + 3, groundY - 20, 1, 1);
        ctx.fillRect(flagX + 4, groundY - 19, 2, 1);
        ctx.fillRect(flagX + 3, groundY - 18, 4, 1);
      }

      // character — clamped to walk band 5%..95% of width
      const cx = Math.max(8, Math.min(LW - 20, progress * LW - 6));
      const cy = groundY - 16;
      drawCharacter(ctx, cx, cy, walkFrame, 1, chapter.theme);

      // hint when near trigger and not completed
      const nearTrigger = Math.abs(progress - triggerX) < 0.08 && !completed;
      if (nearTrigger !== showHint) setShowHint(nearTrigger);
      if (nearTrigger) {
        ctx.fillStyle = "#fbbf24";
        const bob = Math.floor(walkFrame / 2) % 2;
        ctx.fillRect(flagX + 2, groundY - 32 - bob, 6, 8);
        ctx.fillStyle = "#0a0510";
        ctx.fillRect(flagX + 4, groundY - 30 - bob, 2, 4);
        ctx.fillRect(flagX + 4, groundY - 25 - bob, 2, 1);
      }

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [chapter, progress, completed, showHint]);

  // SFX every ~half second while walking
  useEffect(() => {
    if (progress > 0 && progress < 1 && !completed) {
      const t = setTimeout(() => sfx.step(), 200);
      return () => clearTimeout(t);
    }
  }, [progress, completed]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={LW}
        height={LH}
        className="pixelated w-full h-full block"
        style={{ imageRendering: "pixelated" as never }}
      />
      {/* Subtle scanlines on top of canvas — no big shadow blob */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-40" />
      {/* Play button — always tappable, surfaces clearly */}
      <button
        type="button"
        onClick={() => { sfx.open(); onTriggerMini(); }}
        className="absolute bottom-2 right-2 font-pixel text-[10px] px-2 py-1 bg-[var(--pm-gold)] text-[var(--pm-ink)] hover:bg-[var(--pm-magenta)] hover:text-white transition-colors"
        aria-label={`Play ${chapter.org} mini-game`}
      >
        {completed ? "REPLAY" : "▶ PLAY"}
      </button>
      <div className="absolute top-2 left-2 font-pixel text-[9px] text-white/90 bg-black/40 px-2 py-1">
        {chapter.year} · {chapter.org}
      </div>
    </div>
  );
}