import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Chapter, PropKind } from "@/content/resume";
import { CHAPTERS, HERO, SKILLS } from "@/content/resume";
import { sfx } from "@/game/audio";
import { addSkill, useSkills } from "@/game/state";
import { MiniGame } from "./MiniGame";

// Logical resolution per "screen". World is many screens wide.
const LW = 256;
const LH = 144;
const ZONE_W = 256;
const GROUND_BASE = LH - 22;

type ZoneAction = "walk" | "climb" | "jump" | "dance" | "type" | "spawn" | "end";

interface Zone {
  id: string;
  kind: "hero" | "chapter" | "end";
  chapter?: Chapter;
  label: string;
  sublabel?: string;
  hook?: string;
  action: ZoneAction;
  // sky/ground/accent/silhouette
  theme: { sky: string; ground: string; accent: string; silhouette: string };
  props: Array<{ x: number; kind: PropKind }>;
  // extra collectibles drawn on top
  collectibles?: Array<{ x: number; label: string }>;
}

const HERO_THEME = { sky: "#2d1b4e", ground: "#1a0f33", accent: "#fbbf24", silhouette: "#0e0820" };
const END_THEME  = { sky: "#1a1a2e", ground: "#0f0a1f", accent: "#22d3ee", silhouette: "#070512" };

const ACTION_BY_ID: Record<string, ZoneAction> = {
  origin: "type",
  grp: "walk",
  hab: "walk",
  octo: "type",
  investopad: "climb",
  solesearch: "jump",
  fere: "type",
  ccd: "dance",
  iterate: "walk",
};

const ZONES: Zone[] = [
  {
    id: "spawn",
    kind: "hero",
    label: HERO.name.toUpperCase(),
    sublabel: "PRESS SCROLL TO PLAY",
    hook: HERO.tagline,
    action: "spawn",
    theme: HERO_THEME,
    props: [{ x: 30, kind: "sign" }, { x: 200, kind: "tree" }],
  },
  ...CHAPTERS.map<Zone>((c) => ({
    id: c.id,
    kind: "chapter",
    chapter: c,
    label: c.org.toUpperCase(),
    sublabel: `${c.year} · ${c.role}`,
    hook: c.hook,
    action: ACTION_BY_ID[c.id] ?? "walk",
    theme: c.theme,
    props: c.props,
    collectibles: c.outcomes.slice(0, 3).map((label, i) => ({ x: 60 + i * 50, label })),
  })),
  {
    id: "end",
    kind: "end",
    label: "LET'S BUILD",
    sublabel: HERO.email,
    hook: "Hire · back · collab · or just say hi.",
    action: "end",
    theme: END_THEME,
    props: [{ x: 40, kind: "house" }, { x: 110, kind: "sign" }, { x: 200, kind: "antenna" }],
  },
];

const WORLD_W = ZONES.length * ZONE_W;

/* ----------------------------- Drawing helpers ----------------------------- */

function drawProp(ctx: CanvasRenderingContext2D, p: { x: number; kind: PropKind }, theme: Zone["theme"], groundY: number) {
  const x = Math.floor(p.x);
  const sil = theme.silhouette;
  const acc = theme.accent;
  switch (p.kind) {
    case "tree":
      ctx.fillStyle = sil; ctx.fillRect(x + 5, groundY - 18, 4, 18);
      ctx.fillStyle = "#2d5a3d";
      ctx.fillRect(x, groundY - 28, 14, 12);
      ctx.fillRect(x + 2, groundY - 32, 10, 4);
      break;
    case "house":
      ctx.fillStyle = sil; ctx.fillRect(x, groundY - 22, 20, 22);
      ctx.fillStyle = acc; ctx.fillRect(x - 2, groundY - 28, 24, 6);
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(x + 4, groundY - 14, 4, 4);
      ctx.fillRect(x + 12, groundY - 14, 4, 4);
      ctx.fillStyle = acc; ctx.fillRect(x + 8, groundY - 8, 4, 8);
      break;
    case "building":
      ctx.fillStyle = sil; ctx.fillRect(x, groundY - 50, 22, 50);
      ctx.fillStyle = acc;
      for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) {
        ctx.fillRect(x + 4 + j * 10, groundY - 46 + i * 8, 4, 4);
      }
      break;
    case "antenna":
      ctx.fillStyle = sil; ctx.fillRect(x, groundY - 28, 12, 28);
      ctx.fillRect(x + 5, groundY - 40, 2, 12);
      ctx.fillStyle = acc; ctx.fillRect(x + 4, groundY - 42, 4, 2);
      break;
    case "rack":
      ctx.fillStyle = sil; ctx.fillRect(x, groundY - 24, 14, 24);
      ctx.fillStyle = acc;
      for (let i = 0; i < 4; i++) ctx.fillRect(x + 2, groundY - 22 + i * 6, 10, 2);
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(x + 11, groundY - 20, 1, 1);
      ctx.fillRect(x + 11, groundY - 14, 1, 1);
      break;
    case "vault":
      ctx.fillStyle = sil; ctx.fillRect(x, groundY - 18, 18, 18);
      ctx.fillStyle = acc; ctx.fillRect(x + 7, groundY - 11, 4, 4);
      ctx.fillRect(x + 8, groundY - 7, 2, 4);
      break;
    case "shoe":
      ctx.fillStyle = sil; ctx.fillRect(x, groundY - 6, 14, 6);
      ctx.fillStyle = acc; ctx.fillRect(x + 2, groundY - 10, 8, 4);
      ctx.fillStyle = "#fff"; ctx.fillRect(x + 1, groundY - 3, 12, 1);
      break;
    case "mic":
      ctx.fillStyle = sil; ctx.fillRect(x + 4, groundY - 12, 2, 12);
      ctx.fillStyle = acc; ctx.fillRect(x + 2, groundY - 18, 6, 6);
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(x + 3, groundY - 17, 4, 1);
      ctx.fillRect(x + 3, groundY - 15, 4, 1);
      break;
    case "ladder":
      ctx.fillStyle = acc;
      ctx.fillRect(x, groundY - 40, 2, 40);
      ctx.fillRect(x + 10, groundY - 40, 2, 40);
      for (let i = 0; i < 6; i++) ctx.fillRect(x, groundY - 36 + i * 6, 12, 2);
      break;
    case "platform":
      ctx.fillStyle = sil; ctx.fillRect(x, groundY - 22, 26, 4);
      ctx.fillStyle = acc; ctx.fillRect(x, groundY - 22, 26, 1);
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(x + 4, groundY - 18, 2, 18);
      ctx.fillRect(x + 20, groundY - 18, 2, 18);
      break;
    case "sign":
      ctx.fillStyle = sil; ctx.fillRect(x + 3, groundY - 14, 2, 14);
      ctx.fillStyle = acc; ctx.fillRect(x, groundY - 22, 16, 10);
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(x + 2, groundY - 19, 12, 1);
      ctx.fillRect(x + 2, groundY - 16, 8, 1);
      ctx.fillRect(x + 2, groundY - 14, 10, 1);
      break;
    case "crate":
      ctx.fillStyle = sil; ctx.fillRect(x, groundY - 10, 10, 10);
      ctx.fillStyle = acc;
      ctx.fillRect(x, groundY - 10, 10, 1);
      ctx.fillRect(x, groundY - 1, 10, 1);
      ctx.fillRect(x + 4, groundY - 9, 2, 8);
      break;
  }
}

/** 12×16 character. action=walk/climb/jump/dance/idle. */
function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  frame: number, facing: 1 | -1,
  action: "walk" | "climb" | "jump" | "dance" | "idle" | "type",
  accent: string,
) {
  const fx = Math.floor(x);
  const fy = Math.floor(y);
  ctx.save();
  ctx.translate(fx, fy);
  if (facing === -1) { ctx.scale(-1, 1); ctx.translate(-12, 0); }
  ctx.fillStyle = "#fbbf24"; ctx.fillRect(2, 0, 8, 3);
  ctx.fillStyle = "#f5d0a9"; ctx.fillRect(2, 3, 8, 4);
  ctx.fillStyle = "#0a0510"; ctx.fillRect(7, 4, 1, 1);
  ctx.fillStyle = accent;    ctx.fillRect(1, 7, 10, 5);
  ctx.fillStyle = "#2d1b4e"; ctx.fillRect(2, 12, 8, 2);
  ctx.fillStyle = "#0a0510";

  const f = frame % 4;
  if (action === "walk") {
    if (f === 0) { ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2); }
    else if (f === 1) { ctx.fillRect(3, 14, 3, 2); ctx.fillRect(7, 14, 3, 2); }
    else if (f === 2) { ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2); }
    else { ctx.fillRect(2, 14, 3, 2); ctx.fillRect(6, 14, 3, 2); }
    ctx.fillStyle = accent;
    ctx.fillRect(0, 8, 1, 3); ctx.fillRect(11, 8, 1, 3);
  } else if (action === "climb") {
    // legs spread, arms up
    ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2);
    ctx.fillStyle = accent;
    const armUp = f % 2 === 0 ? 5 : 6;
    ctx.fillRect(0, 8 - armUp, 1, 3); ctx.fillRect(11, 8 - armUp, 1, 3);
  } else if (action === "jump") {
    ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 6, 1, 3); ctx.fillRect(11, 6, 1, 3);
  } else if (action === "dance") {
    if (f < 2) { ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2); }
    else      { ctx.fillRect(3, 14, 3, 2); ctx.fillRect(6, 14, 3, 2); }
    ctx.fillStyle = accent;
    const up = f % 2 === 0 ? 4 : 0;
    ctx.fillRect(0, 8 - up, 1, 3); ctx.fillRect(11, 8 - (4 - up), 1, 3);
  } else if (action === "type") {
    ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2);
    ctx.fillStyle = accent;
    const tap = f % 2;
    ctx.fillRect(0, 9 + tap, 1, 2); ctx.fillRect(11, 9 + (1 - tap), 1, 2);
  } else { // idle
    ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 8, 1, 3); ctx.fillRect(11, 8, 1, 3);
  }
  ctx.restore();
}

function fillSky(ctx: CanvasRenderingContext2D, x0: number, top: string, bottom: string) {
  ctx.fillStyle = top;
  ctx.fillRect(x0, 0, LW, Math.floor(LH * 0.55));
  const bandY = Math.floor(LH * 0.55);
  const bandH = 14;
  for (let y = 0; y < bandH; y++) {
    const ratio = y / bandH;
    ctx.fillStyle = ratio < 0.5 ? top : bottom;
    ctx.fillRect(x0, bandY + y, LW, 1);
    ctx.fillStyle = ratio < 0.5 ? bottom : top;
    for (let x = (bandY + y) % 2; x < LW; x += 2) ctx.fillRect(x0 + x, bandY + y, 1, 1);
  }
  ctx.fillStyle = bottom;
  ctx.fillRect(x0, bandY + bandH, LW, LH - bandY - bandH);
}

/** Bigger pickup star/floppy drawn at world-x */
function drawPickup(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, collected: boolean, frame: number) {
  if (collected) return;
  const bob = Math.floor(frame / 4) % 2;
  ctx.fillStyle = "#0a0510";
  ctx.fillRect(x - 1, y - 6 - bob, 8, 8);
  ctx.fillStyle = color;
  ctx.fillRect(x, y - 5 - bob, 6, 6);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + 2, y - 4 - bob, 2, 2);
}

/** Skill flag */
function drawFlag(ctx: CanvasRenderingContext2D, x: number, groundY: number, color: string, completed: boolean) {
  ctx.fillStyle = "#0a0510";
  ctx.fillRect(x, groundY - 28, 1, 28);
  ctx.fillStyle = completed ? "#22d3ee" : color;
  ctx.fillRect(x + 1, groundY - 28, 10, 7);
  if (completed) {
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(x + 4, groundY - 26, 1, 1);
    ctx.fillRect(x + 5, groundY - 25, 2, 1);
    ctx.fillRect(x + 4, groundY - 24, 4, 1);
  }
}

/* ------------------------------ Component ------------------------------ */

export function WorldScene() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraXRef = useRef(0);
  const targetCamRef = useRef(0);
  const velRef = useRef(0);
  const frameRef = useRef(0);
  const lastStepRef = useRef(0);
  const collectedRef = useRef<Set<string>>(new Set());

  const [activeZoneIdx, setActiveZoneIdx] = useState(0);
  const [miniChapter, setMiniChapter] = useState<Chapter | null>(null);
  const [promptZoneId, setPromptZoneId] = useState<string | null>(null);
  const skills = useSkills();
  const skillsRef = useRef(skills);
  useEffect(() => { skillsRef.current = skills; }, [skills]);

  // Map page scroll → target cameraX
  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const passed = -rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      targetCamRef.current = p * (WORLD_W - LW);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // RAF render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let walkFrame = 0;
    let frameTimer = 0;
    let lastZoneIdx = -1;

    const render = (now: number) => {
      const dt = Math.min(50, now - last); last = now;
      // ease cameraX toward target
      const prev = cameraXRef.current;
      const next = prev + (targetCamRef.current - prev) * 0.12;
      cameraXRef.current = next;
      const vel = next - prev;
      velRef.current = vel;

      frameTimer += dt;
      const moving = Math.abs(vel) > 0.15;
      if ((moving && frameTimer > 90) || frameTimer > 220) {
        walkFrame++; frameTimer = 0;
      }
      frameRef.current = walkFrame;

      ctx.imageSmoothingEnabled = false;
      // Clear
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, LW, LH);

      const camX = next;
      // Determine which zones are visible: usually 1-2 at most.
      const startZ = Math.max(0, Math.floor(camX / ZONE_W));
      const endZ = Math.min(ZONES.length - 1, Math.floor((camX + LW) / ZONE_W));

      // ---- background fill: blend two zones across seam ----
      for (let zi = startZ; zi <= endZ; zi++) {
        const z = ZONES[zi];
        const zoneStartScreen = zi * ZONE_W - camX;
        // Sky for this zone only within zone window, clipped to screen.
        ctx.save();
        const clipX = Math.max(0, zoneStartScreen);
        const clipR = Math.min(LW, zoneStartScreen + ZONE_W);
        ctx.beginPath();
        ctx.rect(clipX, 0, clipR - clipX, LH);
        ctx.clip();
        fillSky(ctx, zoneStartScreen, z.theme.sky, z.theme.ground);

        // distant silhouettes (parallax 0.4)
        ctx.fillStyle = z.theme.silhouette;
        const parallax = camX * 0.4;
        for (let i = -2; i < 8; i++) {
          const mx = zoneStartScreen + i * 50 - (parallax % 50);
          ctx.beginPath();
          ctx.moveTo(mx, GROUND_BASE);
          ctx.lineTo(mx + 22, GROUND_BASE - 24);
          ctx.lineTo(mx + 44, GROUND_BASE);
          ctx.closePath();
          ctx.fill();
        }

        // props
        for (const p of z.props) {
          drawProp(ctx, { x: zoneStartScreen + p.x, kind: p.kind }, z.theme, GROUND_BASE);
        }

        // ground stripe
        ctx.fillStyle = z.theme.ground;
        ctx.fillRect(zoneStartScreen, GROUND_BASE, ZONE_W, LH - GROUND_BASE);
        ctx.fillStyle = z.theme.accent;
        ctx.fillRect(zoneStartScreen, GROUND_BASE, ZONE_W, 1);

        // collectibles (outcomes)
        if (z.collectibles) {
          for (let ci = 0; ci < z.collectibles.length; ci++) {
            const c = z.collectibles[ci];
            const key = `${z.id}:${ci}`;
            drawPickup(
              ctx,
              Math.floor(zoneStartScreen + c.x),
              GROUND_BASE - 22,
              z.theme.accent,
              collectedRef.current.has(key),
              walkFrame,
            );
          }
        }

        // skill flag at zone center for chapter zones
        if (z.kind === "chapter" && z.chapter) {
          const skill = SKILLS[z.chapter.skill];
          const completed = skillsRef.current.includes(z.chapter.skill);
          drawFlag(ctx, Math.floor(zoneStartScreen + ZONE_W * 0.7), GROUND_BASE, skill.color, completed);
        }

        ctx.restore();
      }

      // ---- character ----
      const currentZ = ZONES[Math.min(ZONES.length - 1, Math.max(0, Math.floor((camX + LW * 0.5) / ZONE_W)))];
      const localX = (camX + LW * 0.5) - Math.floor((camX + LW * 0.5) / ZONE_W) * ZONE_W; // 0..256

      // Vertical & action based on zone action
      let charY = GROUND_BASE - 16;
      let action: "walk" | "climb" | "jump" | "dance" | "idle" | "type" = moving ? "walk" : "idle";
      const inActionBand = localX > 90 && localX < 180;

      if (currentZ.action === "climb" && inActionBand) {
        const t = (localX - 90) / 90;
        charY = GROUND_BASE - 16 - Math.sin(t * Math.PI) * 28;
        action = "climb";
      } else if (currentZ.action === "jump" && inActionBand) {
        const t = (localX - 90) / 90;
        charY = GROUND_BASE - 16 - Math.sin(t * Math.PI) * 20;
        action = "jump";
      } else if (currentZ.action === "dance") {
        charY = GROUND_BASE - 16 - (Math.floor(walkFrame / 2) % 2) * 2;
        action = "dance";
      } else if (currentZ.action === "type" && inActionBand) {
        action = "type";
      } else if (currentZ.action === "spawn" || currentZ.action === "end") {
        if (!moving) action = "idle";
      }

      const facing: 1 | -1 = vel < -0.2 ? -1 : 1;
      drawCharacter(ctx, LW * 0.5 - 6, charY, walkFrame, facing, action, currentZ.theme.accent);

      // emote bubble when near skill flag
      if (currentZ.kind === "chapter" && currentZ.chapter) {
        const flagScreenX = Math.floor((Math.floor((camX + LW * 0.5) / ZONE_W) * ZONE_W + ZONE_W * 0.7) - camX);
        const distToFlag = Math.abs(LW * 0.5 - flagScreenX);
        const completed = skillsRef.current.includes(currentZ.chapter.skill);
        if (distToFlag < 30 && !completed) {
          const bob = Math.floor(walkFrame / 2) % 2;
          ctx.fillStyle = "#fbbf24";
          ctx.fillRect(LW * 0.5 - 3, charY - 12 - bob, 6, 8);
          ctx.fillStyle = "#0a0510";
          ctx.fillRect(LW * 0.5 - 1, charY - 10 - bob, 2, 3);
          ctx.fillRect(LW * 0.5 - 1, charY - 6 - bob, 2, 1);
        }
        // Detect prompt
        const wantPrompt = distToFlag < 24 && !completed;
        if (wantPrompt && promptZoneId !== currentZ.id) setPromptZoneId(currentZ.id);
        else if (!wantPrompt && promptZoneId === currentZ.id) setPromptZoneId(null);

        // Auto-collect outcomes the character passes
        if (currentZ.collectibles) {
          const zoneStartWorld = Math.floor((camX + LW * 0.5) / ZONE_W) * ZONE_W;
          const charWorldX = camX + LW * 0.5;
          currentZ.collectibles.forEach((c, ci) => {
            const key = `${currentZ.id}:${ci}`;
            if (!collectedRef.current.has(key) && Math.abs(charWorldX - (zoneStartWorld + c.x)) < 8) {
              collectedRef.current.add(key);
              sfx.pickup();
            }
          });
        }
      } else if (promptZoneId) {
        setPromptZoneId(null);
      }

      // step sfx
      if (moving && Math.abs(vel) > 0.4 && now - lastStepRef.current > 220) {
        sfx.step();
        lastStepRef.current = now;
      }

      // scanlines overlay drawn in CSS layer, not canvas
      // active zone tracking (for caption layer)
      const camCenter = camX + LW * 0.5;
      const zi = Math.min(ZONES.length - 1, Math.max(0, Math.floor(camCenter / ZONE_W)));
      if (zi !== lastZoneIdx) { lastZoneIdx = zi; setActiveZoneIdx(zi); }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [promptZoneId]);

  const activeZone = ZONES[activeZoneIdx];

  // Caption opacity: peaks at zone center
  const captionOpacity = (() => {
    const camCenter = cameraXRef.current + LW * 0.5;
    const zoneCenter = activeZoneIdx * ZONE_W + ZONE_W * 0.5;
    const d = Math.abs(camCenter - zoneCenter) / (ZONE_W * 0.5);
    return Math.max(0.25, 1 - d);
  })();

  return (
    <>
      {/* Fixed full-viewport pixel canvas */}
      <div className="fixed inset-0 z-0 bg-[var(--pm-deep-2)]">
        <canvas
          ref={canvasRef}
          width={LW}
          height={LH}
          className="pixelated absolute inset-0 w-full h-full"
          style={{ imageRendering: "pixelated" as never }}
        />
        <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-30" />

        {/* Caption layer */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 sm:px-8 pb-24 sm:pb-28">
          <div
            className="mx-auto max-w-2xl text-center transition-opacity duration-200"
            style={{ opacity: captionOpacity }}
            key={activeZone.id}
          >
            <div className="font-pixel text-[9px] sm:text-[10px] text-[var(--pm-gold)] mb-2 tracking-widest">
              {activeZone.sublabel}
            </div>
            <h2 className="font-pixel text-lg sm:text-2xl md:text-3xl text-white leading-tight drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
              {activeZone.label}
            </h2>
            {activeZone.hook && (
              <p className="mt-3 font-mono text-xs sm:text-sm text-[var(--pm-cyan)] max-w-xl mx-auto drop-shadow-[1px_1px_0_rgba(0,0,0,0.9)]">
                {activeZone.hook}
              </p>
            )}
            {activeZone.kind === "chapter" && activeZone.chapter && (
              <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
                {activeZone.chapter.outcomes.slice(0, 3).map((o, i) => {
                  const got = collectedRef.current.has(`${activeZone.id}:${i}`);
                  return (
                    <li
                      key={o}
                      className="font-mono text-[10px] sm:text-xs px-2 py-0.5 border"
                      style={{
                        borderColor: activeZone.theme.accent,
                        color: got ? "#1a0f33" : activeZone.theme.accent,
                        background: got ? activeZone.theme.accent : "transparent",
                      }}
                    >
                      {got ? "✓ " : "◇ "}{o}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom HUD bar: progress + zone dots */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-3xl px-4 pb-3">
            <div className="flex items-center justify-between gap-2 font-pixel text-[8px] text-white/60">
              <span>◀ SCROLL</span>
              <div className="flex-1 mx-3 h-[3px] bg-white/10 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--pm-gold)]"
                  style={{ width: `${(activeZoneIdx / (ZONES.length - 1)) * 100}%` }}
                />
                {ZONES.map((_, i) => (
                  <span
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5"
                    style={{
                      left: `${(i / (ZONES.length - 1)) * 100}%`,
                      background: i <= activeZoneIdx ? "var(--pm-gold)" : "rgba(255,255,255,0.25)",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </div>
              <span>SCROLL ▶</span>
            </div>
          </div>
        </div>

        {/* Interaction prompt */}
        {promptZoneId && (() => {
          const z = ZONES.find((zz) => zz.id === promptZoneId);
          if (!z?.chapter) return null;
          return (
            <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={() => { sfx.open(); setMiniChapter(z.chapter!); }}
                className="font-pixel text-[10px] px-4 py-3 bg-[var(--pm-magenta)] text-white border-2 border-[var(--pm-gold)] hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors animate-pulse"
              >
                ▶ PRESS TO PLAY · {SKILLS[z.chapter.skill].name.toUpperCase()}
              </button>
            </div>
          );
        })()}

        {/* End screen contact buttons */}
        {activeZone.kind === "end" && (
          <div className="absolute inset-x-0 top-[18%] flex justify-center">
            <div className="grid grid-cols-2 gap-2 max-w-sm w-[90%]">
              <a href={`mailto:${HERO.email}`} className="font-pixel text-[9px] px-3 py-3 bg-[var(--pm-magenta)] text-white text-center hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors">✉ EMAIL</a>
              <Link to="/cv" className="font-pixel text-[9px] px-3 py-3 border-2 border-[var(--pm-gold)] text-[var(--pm-gold)] text-center hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] transition-colors">📜 FULL CV</Link>
              <a href={HERO.links.linkedin} target="_blank" rel="noreferrer" className="font-pixel text-[9px] px-3 py-3 border-2 border-[var(--pm-cyan)] text-[var(--pm-cyan)] text-center hover:bg-[var(--pm-cyan)] hover:text-[var(--pm-ink)] transition-colors">in/LINKEDIN</a>
              <a href={HERO.links.twitter} target="_blank" rel="noreferrer" className="font-pixel text-[9px] px-3 py-3 border-2 border-white/40 text-white text-center hover:bg-white hover:text-[var(--pm-ink)] transition-colors">@X</a>
            </div>
          </div>
        )}

        {/* Hero screen call-to-action */}
        {activeZone.kind === "hero" && (
          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center gap-2">
            <div className="font-pixel text-[8px] text-white/50 animate-pulse">▼ SCROLL TO BEGIN</div>
          </div>
        )}
      </div>

      {/* Tall invisible scroll track. Height controls scroll length. */}
      <div ref={trackRef} className="relative" style={{ height: `${ZONES.length * 110}vh` }} aria-hidden />

      {miniChapter && (
        <MiniGame
          chapter={miniChapter}
          onClose={() => setMiniChapter(null)}
          onWin={() => { addSkill(miniChapter.skill); setTimeout(() => setMiniChapter(null), 800); }}
        />
      )}
    </>
  );
}
