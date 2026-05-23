import { useEffect, useRef, useCallback, useState } from "react";
import heroSheet from "@/assets/game/hero/hero-v2.png";
import {
  GRAVITY, JUMP_VELOCITY, WALK_ACCEL, MAX_WALK_SPEED,
  GROUND_FRICTION, AIR_FRICTION, COYOTE_TIME, JUMP_BUFFER,
  HERO_W, HERO_H, GROUND_OFFSET,
  makeInputState, makeHero, makeCamera, spawnDust, updateDust,
  type Hero, type Camera, type DustParticle, type GameNpc, type InputState,
} from "@/game/engine";
import { ALL_LEVELS, type LevelDef } from "@/game/levels";
import { playWorld, setAmbientMuted } from "@/game/ambient";

interface Props {
  onSkillCollected: (skillId: string, label: string, color: string) => void;
  onNpcTalk: (npc: GameNpc) => void;
  onWorldChange: (levelId: string, levelName: string, year: string) => void;
  muted: boolean;
}

// ─── NPC drawing ──────────────────────────────────────────────────────────────
type NpcKind = "founder" | "dev" | "dancer" | "trader" | "fan" | "investor" | "cat" | "dog" | "rider";

function drawNpc(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  kind: NpcKind,
  accent: string,
  bobOffset: number,
  talked: boolean,
  nearby: boolean,
  worldAccent: string,
) {
  const S = 2.8; // scale
  const x = screenX;
  const y = screenY + bobOffset;

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 2, 18 * S * 0.35, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const pixel = (px: number, py: number, pw: number, ph: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(px * S - (pw * S) / 2, py * S, pw * S, ph * S);
  };

  const INK = "#0a0614";
  const SKIN = "#e8c9a0";

  // Body configs per kind
  type Cfg = { body: string; hair: string; legs: string; shoes: string; extra?: () => void };
  const cfgs: Record<NpcKind, Cfg> = {
    founder: {
      body: "#1e2a5e", hair: "#1a0f00", legs: "#1e2a5e", shoes: "#0a0a14",
      extra: () => {
        // Tie
        pixel(-0.5, -8, 1, 6, accent);
        // Suit lapels
        pixel(-3, -8, 1, 4, "#2e3a6e");
        pixel(2, -8, 1, 4, "#2e3a6e");
      },
    },
    dev: {
      body: "#1a1a2e", hair: "#2d1a00", legs: "#1a2040", shoes: "#0e1020",
      extra: () => {
        // Screen glow on face
        ctx.fillStyle = `${accent}44`;
        ctx.fillRect(-3 * S, -13 * S, 6 * S, 5 * S);
        // Hoodie pocket
        pixel(0, -4, 4, 2, "#252540");
      },
    },
    dancer: {
      body: accent, hair: "#ff6b9d", legs: "#1a0830", shoes: "#0e0620",
      extra: () => {
        // Arms out
        pixel(-6, -7, 2, 6, SKIN);
        pixel(5, -10, 2, 6, SKIN);
      },
    },
    trader: {
      body: "#2d1808", hair: "#1a1000", legs: "#1e1008", shoes: "#140c04",
      extra: () => {
        // Shoebox prop
        ctx.fillStyle = accent;
        ctx.fillRect(-3 * S, -16 * S, 6 * S, 4 * S);
        ctx.fillStyle = INK;
        ctx.fillRect(-3 * S, -16 * S, 6 * S, 1 * S);
      },
    },
    fan: {
      body: accent, hair: "#8b1a1a", legs: "#1a1a3e", shoes: "#0e0e20",
      extra: () => {
        // Arms raised
        pixel(-5, -12, 2, 5, SKIN);
        pixel(4, -12, 2, 5, SKIN);
      },
    },
    investor: {
      body: "#0d2a1e", hair: "#888888", legs: "#0d2a1e", shoes: "#050f0a",
      extra: () => {
        // Gold watch
        pixel(4, -7, 2, 2, "#fbbf24");
        // Lapel pin
        pixel(-3, -9, 2, 2, accent);
      },
    },
    cat: {
      body: "#3d1a4e", hair: "#9d4dbb", legs: "#2d0f3e", shoes: "#1e0830",
      extra: () => {
        // Cat ears
        ctx.fillStyle = accent;
        ctx.fillRect(-4 * S, -17 * S, 2 * S, 3 * S);
        ctx.fillRect(3 * S, -17 * S, 2 * S, 3 * S);
        // Tail
        ctx.fillStyle = "#9d4dbb";
        ctx.beginPath();
        ctx.arc(7 * S, -3 * S, 3 * S, 0, Math.PI * 2);
        ctx.fill();
        // Whiskers
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(-7 * S, -13 * S, 5 * S, 0.5 * S);
        ctx.fillRect(3 * S, -13 * S, 5 * S, 0.5 * S);
      },
    },
    dog: {
      body: "#3d2a0e", hair: "#8b6914", legs: "#2d1a08", shoes: "#1a0e04",
      extra: () => {
        // Dog ears flop
        ctx.fillStyle = "#8b6914";
        ctx.fillRect(-5 * S, -16 * S, 3 * S, 4 * S);
        ctx.fillRect(3 * S, -16 * S, 3 * S, 4 * S);
        // Collar
        pixel(0, -10, 5, 1, accent);
        // Tongue
        ctx.fillStyle = "#ff6b9d";
        ctx.fillRect(-0.5 * S, -11 * S, 1.5 * S, 2 * S);
      },
    },
    rider: {
      body: "#0a0a0a", hair: "#1a1a1a", legs: "#0a0a0a", shoes: "#050505",
      extra: () => {
        // Helmet visor
        ctx.fillStyle = `${accent}88`;
        ctx.fillRect(-3 * S, -16 * S, 6 * S, 3 * S);
        // Jacket stripe
        pixel(0, -7, 2, 8, accent);
      },
    },
  };

  const cfg = cfgs[kind] || cfgs.founder;

  // ── Draw character top-down (so layers stack correctly) ──
  // Hair / helmet top
  ctx.fillStyle = cfg.hair;
  ctx.fillRect(-3.5 * S, -17 * S, 7 * S, 4 * S);

  // Head
  ctx.fillStyle = SKIN;
  ctx.fillRect(-3 * S, -15 * S, 6 * S, 7 * S);

  // Eyes
  ctx.fillStyle = INK;
  ctx.fillRect(-1.5 * S, -12 * S, 1.5 * S, 1.5 * S);
  ctx.fillRect(1 * S, -12 * S, 1.5 * S, 1.5 * S);

  // Outline head
  ctx.strokeStyle = INK;
  ctx.lineWidth = S * 0.5;
  ctx.strokeRect(-3 * S, -15 * S, 6 * S, 7 * S);

  // Body
  ctx.fillStyle = cfg.body;
  ctx.fillRect(-4 * S, -8 * S, 8 * S, 10 * S);

  // Extra character details
  cfg.extra?.();

  // Arms (default)
  if (!["dancer", "fan"].includes(kind)) {
    ctx.fillStyle = cfg.body;
    ctx.fillRect(-6 * S, -8 * S, 2 * S, 7 * S);
    ctx.fillRect(4 * S, -8 * S, 2 * S, 7 * S);
    // Hands
    ctx.fillStyle = SKIN;
    ctx.fillRect(-6 * S, -1 * S, 2 * S, 2 * S);
    ctx.fillRect(4 * S, -1 * S, 2 * S, 2 * S);
  }

  // Legs
  ctx.fillStyle = cfg.legs;
  ctx.fillRect(-4 * S, 2 * S, 3.5 * S, 8 * S);
  ctx.fillRect(0.5 * S, 2 * S, 3.5 * S, 8 * S);

  // Shoes
  ctx.fillStyle = cfg.shoes;
  ctx.fillRect(-4 * S, 9 * S, 4 * S, 3 * S);
  ctx.fillRect(0.5 * S, 9 * S, 4 * S, 3 * S);

  // Talked checkmark
  if (talked) {
    ctx.fillStyle = "#4ade80";
    ctx.font = `${10}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText("✓", 0, -20 * S);
  }

  // Interact prompt
  if (nearby && !talked) {
    const t = Date.now() / 1000;
    const pulse = 0.5 + 0.5 * Math.sin(t * 4);
    ctx.fillStyle = `rgba(251,191,36,${0.6 + pulse * 0.4})`;
    ctx.font = `bold ${9}px "Space Mono", monospace`;
    ctx.textAlign = "center";
    ctx.fillText("[ E ]", 0, -22 * S);
  }

  // World accent glow under feet
  const grd = ctx.createRadialGradient(0, 12 * S, 0, 0, 12 * S, 16 * S);
  grd.addColorStop(0, `${worldAccent}55`);
  grd.addColorStop(1, `${worldAccent}00`);
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.ellipse(0, 12 * S, 16 * S, 5 * S, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Skill orb drawing ────────────────────────────────────────────────────────
function drawSkillOrb(
  ctx: CanvasRenderingContext2D,
  sx: number, sy: number,
  label: string, color: string,
  time: number, collected: boolean, collectAnim: number,
) {
  if (collected && collectAnim <= 0) return;
  const bob = Math.sin(time * 2.2) * 8;
  const oy = sy - 60 + bob;
  const alpha = collected ? collectAnim : 1;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(sx, oy);

  const scale = collected ? 1 + (1 - collectAnim) * 2 : 1;
  ctx.scale(scale, scale);

  // Glow
  const grd = ctx.createRadialGradient(0, 0, 4, 0, 0, 36);
  grd.addColorStop(0, `${color}cc`);
  grd.addColorStop(0.5, `${color}55`);
  grd.addColorStop(1, `${color}00`);
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.fill();

  // Orb body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  // Star
  ctx.fillStyle = "rgba(5,3,16,0.85)";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("★", 0, 1);

  // Label
  ctx.fillStyle = color;
  ctx.font = "7px 'Space Mono', monospace";
  ctx.textBaseline = "top";
  ctx.fillText(label.toUpperCase(), 0, 22);

  ctx.restore();
}

// ─── Exit portal drawing ──────────────────────────────────────────────────────
function drawPortal(ctx: CanvasRenderingContext2D, sx: number, sy: number, accent: string, time: number) {
  ctx.save();
  ctx.translate(sx, sy);
  const pulse = 0.6 + 0.4 * Math.sin(time * 3);

  // Portal glow
  const grd = ctx.createLinearGradient(0, -100, 0, 0);
  grd.addColorStop(0, `${accent}${Math.round(pulse * 200).toString(16).padStart(2, "0")}`);
  grd.addColorStop(1, `${accent}22`);
  ctx.fillStyle = grd;
  ctx.fillRect(-22, -100, 44, 100);

  // Frame
  ctx.strokeStyle = `${accent}`;
  ctx.lineWidth = 2;
  ctx.globalAlpha = pulse;
  ctx.strokeRect(-22, -100, 44, 100);
  ctx.globalAlpha = 1;

  // Label
  ctx.fillStyle = `${accent}cc`;
  ctx.font = "7px 'Space Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("NEXT →", 0, -110);

  ctx.restore();
}

// ─── Background image cache ───────────────────────────────────────────────────
const imgCache: Map<string, HTMLImageElement> = new Map();
function loadImg(url: string): HTMLImageElement | null {
  if (imgCache.has(url)) return imgCache.get(url)!;
  const img = new Image();
  img.onload = () => { imgCache.set(url, img); };
  img.src = url;
  imgCache.set(url, img); // store even before load to avoid duplicate creates
  return null; // not ready yet
}

// ─── Main component ───────────────────────────────────────────────────────────
export function GameCanvas({ onSkillCollected, onNpcTalk, onWorldChange, muted }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroImgRef = useRef<HTMLImageElement | null>(null);

  // Game state (all in refs — no React re-renders during gameplay)
  const levelIdxRef = useRef(0);
  const levelRef = useRef<LevelDef>({ ...ALL_LEVELS[0] });
  const heroRef = useRef<Hero | null>(null);
  const camRef = useRef<Camera>({ x: 0, y: 0, velX: 0, velY: 0 });
  const inputRef = useRef<InputState>(makeInputState());
  const timeRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const transitioning = useRef(false);

  const initLevel = useCallback((idx: number) => {
    const lvl = { ...ALL_LEVELS[idx], npcs: ALL_LEVELS[idx].npcs.map(n => ({ ...n, talked: false })), skill: { ...ALL_LEVELS[idx].skill, collected: false, collectAnim: 0 }, exit: { ...ALL_LEVELS[idx].exit, triggered: false } };
    levelRef.current = lvl;
    levelIdxRef.current = idx;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const groundY = canvas.height - GROUND_OFFSET;
    heroRef.current = makeHero(80, groundY);
    camRef.current = makeCamera(80);
    // Preload images
    loadImg(lvl.bgUrl);
    loadImg(lvl.fgUrl);
    playWorld(lvl.id);
    onWorldChange(lvl.id, lvl.name, lvl.year);
  }, [onWorldChange]);

  // ── Physics & game logic ──────────────────────────────────────────────────
  const update = useCallback((dt: number) => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const level = levelRef.current;
    const input = inputRef.current;
    if (!canvas || !hero) return;

    const groundY = canvas.height - GROUND_OFFSET;

    // Jump buffer
    if (input.jump && !input.jumpPrev) hero.jumpBufferTimer = JUMP_BUFFER;
    else hero.jumpBufferTimer = Math.max(0, hero.jumpBufferTimer - dt);

    // Horizontal
    const left  = input.left;
    const right = input.right;
    if (left  && hero.vel.x > -MAX_WALK_SPEED) hero.vel.x -= WALK_ACCEL * dt;
    if (right && hero.vel.x < MAX_WALK_SPEED)  hero.vel.x += WALK_ACCEL * dt;
    if (!left && !right) {
      const friction = hero.onGround ? GROUND_FRICTION : AIR_FRICTION;
      hero.vel.x *= Math.pow(friction, dt * 60);
    }
    if (left)  hero.facing = -1;
    if (right) hero.facing = 1;

    // Gravity
    hero.vel.y += GRAVITY * dt;

    // Move
    hero.pos.x += hero.vel.x * dt;
    hero.pos.y += hero.vel.y * dt;

    // World clamp
    hero.pos.x = Math.max(10, Math.min(level.worldWidth - HERO_W - 10, hero.pos.x));

    // Coyote time
    if (hero.onGround) hero.coyoteTimer = COYOTE_TIME;
    else hero.coyoteTimer = Math.max(0, hero.coyoteTimer - dt);

    const wasOnGround = hero.onGround;
    hero.onGround = false;

    // Ground collision
    if (hero.pos.y + HERO_H >= groundY) {
      hero.pos.y = groundY - HERO_H;
      if (hero.vel.y > 200) { // landing
        spawnDust(hero.landDust, hero.pos.x + HERO_W / 2, groundY, level.accent, 8, hero.vel.x * 0.3, true);
        hero.landTimer = 0.12;
      }
      hero.vel.y = 0;
      hero.onGround = true;
    }

    // Platform collisions
    for (const plat of level.platforms) {
      const py = groundY - plat.y;
      const heroFeet = hero.pos.y + HERO_H;
      const heroLeft = hero.pos.x + 4;
      const heroRight = hero.pos.x + HERO_W - 4;
      const platLeft = plat.x;
      const platRight = plat.x + plat.w;

      if (
        heroLeft < platRight && heroRight > platLeft &&
        heroFeet > py && heroFeet < py + plat.h + 24 &&
        hero.vel.y >= 0
      ) {
        const prevFeet = heroFeet - hero.vel.y * dt;
        if (prevFeet <= py + 2) {
          hero.pos.y = py - HERO_H;
          if (hero.vel.y > 200) {
            spawnDust(hero.landDust, hero.pos.x + HERO_W / 2, py, level.accent, 6, hero.vel.x * 0.3, true);
            hero.landTimer = 0.12;
          }
          hero.vel.y = 0;
          hero.onGround = true;
        }
      }
    }

    // Jump
    const canJump = hero.onGround || hero.coyoteTimer > 0;
    if (hero.jumpBufferTimer > 0 && canJump) {
      hero.vel.y = JUMP_VELOCITY;
      hero.jumpBufferTimer = 0;
      hero.coyoteTimer = 0;
      hero.onGround = false;
      // Walk dust on jump
      spawnDust(hero.walkDust, hero.pos.x + HERO_W / 2, hero.pos.y + HERO_H, level.accent, 5, hero.vel.x * 0.2, true);
    }

    // Landing timer
    hero.landTimer = Math.max(0, hero.landTimer - dt);

    // Animation
    hero.animTimer += dt;
    if (hero.onGround && Math.abs(hero.vel.x) > 15) {
      // Walk
      hero.state = "walk";
      if (hero.animTimer > 0.1) { hero.animFrame = (hero.animFrame % 4) + 2; hero.animTimer = 0; }
      // Walk dust
      if ((hero.animFrame === 2 || hero.animFrame === 4) && hero.animTimer < 0.05) {
        spawnDust(hero.walkDust, hero.pos.x + HERO_W / 2, hero.pos.y + HERO_H, level.accent, 2, -hero.vel.x * 0.1, false);
      }
    } else if (!hero.onGround) {
      hero.state = hero.vel.y < 0 ? "jump" : "fall";
      if (hero.animTimer > 0.5) { hero.animFrame = hero.animFrame === 0 ? 1 : 0; hero.animTimer = 0; }
    } else {
      hero.state = "idle";
      if (hero.animTimer > 0.55) { hero.animFrame = hero.animFrame === 0 ? 1 : 0; hero.animTimer = 0; }
    }

    // Skill orb collection
    const sk = level.skill;
    if (!sk.collected) {
      const heroMid = hero.pos.x + HERO_W / 2;
      const heroTop = hero.pos.y + HERO_H * 0.3;
      const gy = groundY - sk.groundY;
      if (Math.abs(heroMid - sk.worldX) < 50 && Math.abs(heroTop - (gy - 60)) < 60) {
        sk.collected = true;
        sk.collectAnim = 1;
        onSkillCollected(sk.skillId, sk.label, sk.color);
        spawnDust(hero.landDust, sk.worldX, gy - 60, sk.color, 12, 0, true);
      }
    }
    if (sk.collectAnim > 0) sk.collectAnim -= dt * 3;

    // NPC interaction
    if (input.interact && !input.interactPrev) {
      const heroMid = hero.pos.x + HERO_W / 2;
      for (const npc of level.npcs) {
        const dist = Math.abs(heroMid - npc.worldX);
        if (dist < npc.talkRadius && !npc.talked) {
          npc.talked = true;
          onNpcTalk(npc);
          break;
        }
      }
    }

    // Exit portal
    const exit = level.exit;
    if (!exit.triggered && hero.pos.x + HERO_W > exit.worldX - 30) {
      exit.triggered = true;
      if (!transitioning.current) {
        transitioning.current = true;
        setTimeout(() => {
          const nextIdx = (levelIdxRef.current + 1) % ALL_LEVELS.length;
          initLevel(nextIdx);
          transitioning.current = false;
        }, 600);
      }
    }

    // Camera spring follow
    const targetX = hero.pos.x - canvas.width * 0.38;
    const clampedTargetX = Math.max(0, Math.min(level.worldWidth - canvas.width, targetX));
    camRef.current.velX += (clampedTargetX - camRef.current.x) * 12 * dt - camRef.current.velX * 8 * dt;
    camRef.current.x += camRef.current.velX * dt;

    // Dust updates
    updateDust(hero.walkDust, dt);
    updateDust(hero.landDust, dt);

    // Update previous input
    input.jumpPrev = input.jump;
    input.interactPrev = input.interact;
  }, [initLevel, onSkillCollected, onNpcTalk]);

  // ── Rendering ─────────────────────────────────────────────────────────────
  const render = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const level = levelRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const groundY = H - GROUND_OFFSET;
    const cam = camRef.current;

    // World space → screen space
    const wx = (wx: number) => wx - cam.x;

    // ── Sky gradient ──
    const skyGrd = ctx.createLinearGradient(0, 0, 0, H);
    skyGrd.addColorStop(0, level.skyTop);
    skyGrd.addColorStop(0.65, level.skyBot);
    skyGrd.addColorStop(1, level.groundColor);
    ctx.fillStyle = skyGrd;
    ctx.fillRect(0, 0, W, H);

    // ── Stars ──
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    for (let i = 0; i < 100; i++) {
      const sx = ((i * 143.7 + cam.x * 0.04) % W + W) % W;
      const sy = (i * 67.3) % (H * 0.55);
      const sz = i % 5 === 0 ? 1.5 : 0.7;
      ctx.fillRect(sx, sy, sz, sz);
    }

    // ── Background image (parallax 0.18) ──
    const bgImg = imgCache.get(level.bgUrl);
    if (bgImg && bgImg.complete) {
      const bRatio = bgImg.naturalWidth / bgImg.naturalHeight;
      const bH = H;
      const bW = bH * bRatio;
      // Draw across world, repeating if needed
      const parallaxOffset = cam.x * 0.18;
      const startX = -(parallaxOffset % bW);
      for (let bx = startX - bW; bx < W + bW; bx += bW) {
        ctx.drawImage(bgImg, bx, 0, bW, bH);
      }
      // Darken/tint to match world sky
      ctx.fillStyle = `${level.skyTop}88`;
      ctx.fillRect(0, 0, W, H);
    }

    // ── Foreground image (parallax 0.6) ──
    const fgImg = imgCache.get(level.fgUrl);
    if (fgImg && fgImg.complete) {
      const fRatio = fgImg.naturalWidth / fgImg.naturalHeight;
      const fH = H * 0.72;
      const fW = fH * fRatio;
      const parallaxOffset = cam.x * 0.6;
      const startX = -(parallaxOffset % fW);
      for (let fx = startX - fW; fx < W + fW; fx += fW) {
        ctx.drawImage(fgImg, fx, H - fH, fW, fH);
      }
    }

    // ── Horizon glow ──
    const horizGrd = ctx.createLinearGradient(0, groundY - 80, 0, groundY);
    horizGrd.addColorStop(0, `${level.accent}00`);
    horizGrd.addColorStop(1, `${level.accent}1a`);
    ctx.fillStyle = horizGrd;
    ctx.fillRect(0, groundY - 80, W, 80);

    // ── Ground ──
    ctx.fillStyle = level.groundColor;
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.fillStyle = level.groundLineColor;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, groundY, W, 2);
    ctx.globalAlpha = 1;

    // ── Platforms ──
    for (const plat of level.platforms) {
      const px = wx(plat.x);
      const py = groundY - plat.y;
      if (px + plat.w < -20 || px > W + 20) continue;

      // Platform body
      ctx.fillStyle = level.groundColor;
      ctx.fillRect(px, py, plat.w, plat.h + 40);

      // Top face
      const platGrd = ctx.createLinearGradient(0, py, 0, py + plat.h);
      platGrd.addColorStop(0, `${level.accent}44`);
      platGrd.addColorStop(1, `${level.groundColor}`);
      ctx.fillStyle = platGrd;
      ctx.fillRect(px, py, plat.w, plat.h);

      // Top edge accent
      ctx.fillStyle = `${level.accent}99`;
      ctx.fillRect(px, py, plat.w, 2);

      // Vertical connection to ground (pillar)
      ctx.fillStyle = `${level.groundColor}cc`;
      ctx.fillRect(px + 4, py + plat.h, 8, (plat.y - plat.h));
      ctx.fillRect(px + plat.w - 12, py + plat.h, 8, (plat.y - plat.h));
    }

    // ── Dust particles ──
    for (const p of [...hero.walkDust, ...hero.landDust]) {
      ctx.save();
      ctx.globalAlpha = p.life * 0.7;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(wx(p.x), p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ── NPCs ──
    const heroMid = hero.pos.x + HERO_W / 2;
    for (const npc of level.npcs) {
      const nsx = wx(npc.worldX);
      if (nsx < -100 || nsx > W + 100) continue;
      const nsy = groundY - npc.groundY;
      const bob = Math.sin(time * 2.0 + npc.worldX * 0.01) * 3;
      const nearby = Math.abs(heroMid - npc.worldX) < npc.talkRadius;
      drawNpc(ctx, nsx, nsy, npc.kind as NpcKind, level.accent, bob, npc.talked, nearby, level.accent);
    }

    // ── Skill orb ──
    const sk = level.skill;
    drawSkillOrb(
      ctx, wx(sk.worldX), groundY - sk.groundY,
      sk.label, sk.color, time, sk.collected, sk.collectAnim,
    );

    // ── Exit portal ──
    drawPortal(ctx, wx(level.exit.worldX), groundY, level.accent, time);

    // ── Hero ──
    const heroImgEl = heroImgRef.current;
    const hsx = wx(hero.pos.x);
    const hsy = hero.pos.y;

    // Squash/stretch on land
    let scaleX = 1, scaleY = 1;
    if (hero.landTimer > 0) {
      const t = hero.landTimer / 0.12;
      scaleX = 1 + t * 0.22;
      scaleY = 1 - t * 0.18;
    } else if (hero.state === "jump") {
      scaleX = 0.82; scaleY = 1.18;
    } else if (hero.state === "fall") {
      scaleX = 1.1; scaleY = 0.92;
    }

    ctx.save();
    ctx.translate(hsx + HERO_W / 2, hsy + HERO_H);
    ctx.scale(hero.facing * scaleX, scaleY);
    ctx.translate(-HERO_W / 2, -HERO_H);

    if (heroImgEl && heroImgEl.complete) {
      const frameW = 1536 / 6;
      const frameH = 1024;
      const frame = hero.animFrame < 6 ? hero.animFrame : 0;
      ctx.drawImage(heroImgEl, frame * frameW, 0, frameW, frameH, 0, 0, HERO_W, HERO_H);
    } else {
      // Fallback rectangle hero
      ctx.fillStyle = level.accent;
      ctx.fillRect(0, HERO_H * 0.1, HERO_W, HERO_H * 0.9);
    }
    ctx.restore();

    // Hero shadow
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#000";
    const shadowW = HERO_W * 0.7 * scaleX;
    ctx.beginPath();
    ctx.ellipse(hsx + HERO_W / 2, hsy + HERO_H + 6, shadowW / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ── Scanlines ──
    ctx.save();
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = "rgba(0,0,0,0.055)";
      ctx.fillRect(0, y, W, 1);
    }
    ctx.restore();

    // ── CRT vignette ──
    ctx.save();
    const vigGrd = ctx.createRadialGradient(W/2, H/2, H * 0.4, W/2, H/2, H * 0.85);
    vigGrd.addColorStop(0, "transparent");
    vigGrd.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vigGrd;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // ── World name watermark ──
    ctx.save();
    ctx.font = "8px 'Space Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillStyle = `${level.accent}44`;
    ctx.fillText(`${level.name} · ${level.year}`, W - 12, H - 10);
    ctx.restore();
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────────
  const loop = useCallback((t: number) => {
    const dt = Math.min((t - lastRef.current) / 1000, 0.04);
    lastRef.current = t;
    timeRef.current += dt;
    if (!transitioning.current) update(dt);
    render(timeRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [update, render]);

  // ── Input handling ────────────────────────────────────────────────────────
  useEffect(() => {
    const input = inputRef.current;
    const onDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft"  || e.code === "KeyA") input.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") input.right = true;
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
        e.preventDefault(); input.jump = true;
      }
      if (e.code === "KeyE" || e.code === "Enter") { e.preventDefault(); input.interact = true; }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft"  || e.code === "KeyA") input.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") input.right = false;
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") input.jump = false;
      if (e.code === "KeyE" || e.code === "Enter") input.interact = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  // ── Canvas resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight - 88; // HUD top + bottom
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Load hero sprite
    const img = new Image();
    img.onload = () => { heroImgRef.current = img; };
    img.src = heroSheet;

    // Start game
    initLevel(0);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [initLevel, loop]);

  // ── Mute sync ─────────────────────────────────────────────────────────────
  useEffect(() => { setAmbientMuted(muted); }, [muted]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        background: "#050310",
        cursor: "none",
        outline: "none",
        userSelect: "none",
        imageRendering: "auto",
        marginTop: 48, // HUD height
      }}
      tabIndex={0}
    />
  );
}
