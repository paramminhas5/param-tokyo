/** Core game types and physics constants */

export type NpcKind = "founder" | "dev" | "dancer" | "trader" | "fan" | "investor" | "cat" | "dog" | "rider";

export interface Vec2 { x: number; y: number; }

export interface Hero {
  pos: Vec2;
  vel: Vec2;
  onGround: boolean;
  coyoteTimer: number;    // seconds remaining of coyote-time grace
  jumpBufferTimer: number; // seconds remaining of jump-buffer grace
  facing: 1 | -1;
  state: "idle" | "walk" | "jump" | "fall" | "land";
  landTimer: number;      // squash duration after landing
  animFrame: number;
  animTimer: number;
  walkDust: DustParticle[];
  landDust: DustParticle[];
}

export interface DustParticle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;   // 0–1
  maxLife: number;
  r: number;
  color: string;
}

export interface Platform {
  x: number;       // world X
  y: number;       // world Y from ground (positive = higher up)
  w: number;
  h: number;
  kind?: "solid" | "slope";
  accent?: string; // optional highlight color
}

export interface GameNpc {
  id: string;
  worldX: number;
  groundY: number;  // 0 = ground, positive = on platform
  kind: NpcKind;
  name: string;
  title: string;
  line: string;     // dialogue line
  talked: boolean;
  talkRadius: number;
}

export interface SkillOrb {
  worldX: number;
  groundY: number;
  label: string;
  skillId: string;
  color: string;
  collected: boolean;
  collectAnim: number; // 0–1 burst animation
}

export interface ExitPortal {
  worldX: number;
  triggered: boolean;
}

export interface Camera {
  x: number;
  y: number;
  velX: number;
  velY: number;
}

// Physics
export const GRAVITY         = 1200;  // px/s²
export const JUMP_VELOCITY   = -560;  // px/s
export const WALK_ACCEL      = 1800;  // px/s² (applied while key held)
export const MAX_WALK_SPEED  = 260;   // px/s
export const GROUND_FRICTION = 0.80;  // multiplicative per frame (at 60fps)
export const AIR_FRICTION    = 0.94;
export const COYOTE_TIME     = 0.12;  // seconds
export const JUMP_BUFFER     = 0.12;  // seconds

// Display
export const HERO_W          = 44;    // display px
export const HERO_H          = 176;   // display px (frame ratio 256:1024)
export const GROUND_OFFSET   = 90;    // px from canvas bottom to ground line

// Input
export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  interact: boolean;
  jumpPrev: boolean;
  interactPrev: boolean;
}

export function makeInputState(): InputState {
  return { left: false, right: false, jump: false, interact: false, jumpPrev: false, interactPrev: false };
}

export function makeHero(startX: number, groundY: number): Hero {
  return {
    pos: { x: startX, y: groundY - HERO_H },
    vel: { x: 0, y: 0 },
    onGround: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    facing: 1,
    state: "idle",
    landTimer: 0,
    animFrame: 0,
    animTimer: 0,
    walkDust: [],
    landDust: [],
  };
}

export function makeCamera(heroX: number): Camera {
  return { x: heroX - 300, y: 0, velX: 0, velY: 0 };
}

export function spawnDust(
  particles: DustParticle[],
  x: number, y: number,
  color: string,
  count: number,
  vxBase = 0,
  burstUp = false,
) {
  for (let i = 0; i < count; i++) {
    const angle = burstUp ? (Math.random() * Math.PI) + Math.PI : Math.random() * Math.PI * 2;
    const speed = 20 + Math.random() * 60;
    particles.push({
      x, y,
      vx: vxBase + Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * (burstUp ? 1 : 0.4),
      life: 1,
      maxLife: 0.35 + Math.random() * 0.3,
      r: 2 + Math.random() * 3,
      color,
    });
  }
}

export function updateDust(particles: DustParticle[], dt: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 300 * dt; // gravity on dust
    p.life -= dt / p.maxLife;
    if (p.life <= 0) particles.splice(i, 1);
  }
}
