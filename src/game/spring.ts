/**
 * Spring physics — makes hero movement feel alive and weighty.
 * stiffness: how snappy (higher = faster snap). damping: how bouncy (higher = less bounce).
 */
export class Spring {
  pos: number;
  vel: number;
  readonly stiffness: number;
  readonly damping: number;

  constructor(initial = 0, stiffness = 220, damping = 26) {
    this.pos = initial;
    this.vel = 0;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  /** Step the spring by `dt` seconds toward `target`. Returns new position. */
  step(target: number, dt: number): number {
    const clampedDt = Math.min(dt, 0.033); // cap at 30fps to avoid huge jumps
    const force = (target - this.pos) * this.stiffness - this.vel * this.damping;
    this.vel += force * clampedDt;
    this.pos += this.vel * clampedDt;
    return this.pos;
  }

  get speed(): number {
    return Math.abs(this.vel);
  }

  /** Teleport without spring — use on world change */
  snap(value: number) {
    this.pos = value;
    this.vel = 0;
  }
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
