// Rich pixel-art drawing primitives for chapter panels.
// Logical canvas: 384x216. All draws use integer pixels.

import type { BgKind, PropKind, Action } from "./scenes";
import { LW, LH, GROUND_Y } from "./scenes";

type Ctx = CanvasRenderingContext2D;

/* ---------------- backdrops ---------------- */

function gradient(ctx: Ctx, top: string, bot: string, h: number) {
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, LW, Math.floor(h * 0.55));
  const bandY = Math.floor(h * 0.55);
  const bandH = 18;
  for (let y = 0; y < bandH; y++) {
    const r = y / bandH;
    ctx.fillStyle = r < 0.5 ? top : bot;
    ctx.fillRect(0, bandY + y, LW, 1);
    ctx.fillStyle = r < 0.5 ? bot : top;
    for (let x = (bandY + y) % 2; x < LW; x += 2) ctx.fillRect(x, bandY + y, 1, 1);
  }
  ctx.fillStyle = bot;
  ctx.fillRect(0, bandY + bandH, LW, h - bandY - bandH);
}

function moon(ctx: Ctx, x: number, y: number, c = "#fbe6b0") {
  ctx.fillStyle = c;
  ctx.fillRect(x + 2, y, 12, 16);
  ctx.fillRect(x, y + 2, 16, 12);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(x + 9, y + 2, 4, 4);
  ctx.fillRect(x + 5, y + 9, 3, 3);
}

function starField(ctx: Ctx, seed: number, count: number, t: number) {
  ctx.fillStyle = "#f3e6b8";
  for (let i = 0; i < count; i++) {
    const sx = ((seed * (i + 1) * 73) % LW);
    const sy = ((seed * (i + 7) * 31) % 110);
    const tw = ((i + Math.floor(t / 18)) % 9 < 4) ? 1 : 0;
    if (tw) ctx.fillRect(sx, sy, 1, 1);
    else { ctx.fillRect(sx, sy, 1, 1); ctx.fillRect(sx + 1, sy, 1, 1); }
  }
}

function silhouetteRange(ctx: Ctx, color: string, baseY: number, amp: number, freq: number, off: number) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  for (let x = 0; x <= LW; x += 4) {
    const y = baseY - Math.floor(Math.sin((x + off) * freq) * amp + amp);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(LW, LH); ctx.lineTo(0, LH);
  ctx.closePath();
  ctx.fill();
}

function cityline(ctx: Ctx, color: string, baseY: number, off: number) {
  ctx.fillStyle = color;
  let x = -((off | 0) % 24);
  while (x < LW) {
    const h = 18 + ((Math.abs(Math.floor((x + 13) * 1.7)) % 28));
    const w = 14 + ((Math.abs(Math.floor((x + 7) * 2.3)) % 12));
    ctx.fillRect(x, baseY - h, w, h);
    // windows
    ctx.fillStyle = "rgba(251,191,36,0.18)";
    for (let yy = baseY - h + 3; yy < baseY - 2; yy += 4) {
      for (let xx = x + 2; xx < x + w - 2; xx += 4) {
        if (((xx + yy) % 7) < 2) ctx.fillRect(xx, yy, 2, 2);
      }
    }
    ctx.fillStyle = color;
    x += w + 4;
  }
}

function groundStripe(ctx: Ctx, ground: string, accent: string) {
  ctx.fillStyle = ground;
  ctx.fillRect(0, GROUND_Y, LW, LH - GROUND_Y);
  ctx.fillStyle = accent;
  ctx.fillRect(0, GROUND_Y, LW, 1);
  // hatch
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  for (let x = 0; x < LW; x += 6) ctx.fillRect(x, GROUND_Y + 4, 2, 1);
  for (let x = 3; x < LW; x += 6) ctx.fillRect(x, GROUND_Y + 12, 2, 1);
}

export function drawBg(ctx: Ctx, bg: BgKind, t: number, scrollOff: number) {
  ctx.imageSmoothingEnabled = false;
  switch (bg) {
    case "rooftop-night": {
      gradient(ctx, "#1a0f3a", "#2d1b4e", LH);
      starField(ctx, 11, 50, t);
      moon(ctx, 300, 24);
      silhouetteRange(ctx, "#0e0820", GROUND_Y - 4, 8, 0.04, scrollOff * 0.2);
      cityline(ctx, "#16102e", GROUND_Y - 2, scrollOff * 0.4);
      groundStripe(ctx, "#1a0f33", "#fbbf24");
      // brick roof texture
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      for (let x = 0; x < LW; x += 16) ctx.fillRect(x, GROUND_Y + 2, 1, 3);
      break;
    }
    case "ecommerce-warehouse": {
      gradient(ctx, "#1e1144", "#10082a", LH);
      // distant racks
      silhouetteRange(ctx, "#080418", GROUND_Y - 4, 4, 0.06, scrollOff * 0.15);
      ctx.fillStyle = "#1a1040";
      for (let x = 0; x < LW; x += 28) ctx.fillRect(x, GROUND_Y - 40, 22, 40);
      // grid lines on floor
      groundStripe(ctx, "#10082a", "#22d3ee");
      ctx.fillStyle = "rgba(34,211,238,0.25)";
      for (let x = 0; x < LW; x += 12) ctx.fillRect(x, GROUND_Y + 6, 1, 1);
      break;
    }
    case "rental-street": {
      gradient(ctx, "#3a2410", "#1a0f08", LH);
      // dusk sky
      ctx.fillStyle = "#c2956b"; ctx.fillRect(0, 0, LW, 60);
      ctx.fillStyle = "#e8a87c"; ctx.fillRect(0, 40, LW, 14);
      // distant hills
      silhouetteRange(ctx, "#2a1810", GROUND_Y - 6, 10, 0.03, scrollOff * 0.2);
      // distant rooftops
      cityline(ctx, "#1a0f08", GROUND_Y, scrollOff * 0.5);
      groundStripe(ctx, "#5a2f1f", "#e84393");
      break;
    }
    case "ai-lab": {
      gradient(ctx, "#02021a", "#06061a", LH);
      // grid backdrop
      ctx.fillStyle = "rgba(34,211,238,0.20)";
      for (let y = 0; y < GROUND_Y - 4; y += 8) ctx.fillRect(0, y, LW, 1);
      for (let x = 0; x < LW; x += 12) ctx.fillRect(x, 0, 1, GROUND_Y - 4);
      // glowing horizon
      ctx.fillStyle = "rgba(34,211,238,0.35)";
      ctx.fillRect(0, GROUND_Y - 5, LW, 2);
      groundStripe(ctx, "#06061a", "#22d3ee");
      // floating bits
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      for (let i = 0; i < 12; i++) {
        const x = ((i * 47 + Math.floor(t / 4)) % LW);
        const y = 30 + (i * 13) % 80;
        ctx.fillRect(x, y, 1, 1);
      }
      break;
    }
    case "vault-tower": {
      gradient(ctx, "#04261e", "#031f17", LH);
      // distant ticker
      ctx.fillStyle = "#0a3a2c";
      ctx.fillRect(0, 28, LW, 8);
      ctx.fillStyle = "#fbbf24";
      const tickerOff = (Math.floor(t / 2)) % 48;
      for (let x = -tickerOff; x < LW; x += 16) ctx.fillRect(x, 30, 3, 1);
      // mountain
      silhouetteRange(ctx, "#012015", GROUND_Y - 4, 14, 0.025, scrollOff * 0.2);
      // stacked vault silhouettes
      ctx.fillStyle = "#013022";
      for (let x = 0; x < LW; x += 32) {
        const h = 20 + ((x * 7) % 30);
        ctx.fillRect(x + 4, GROUND_Y - h, 24, h);
      }
      groundStripe(ctx, "#031f17", "#fbbf24");
      break;
    }
    case "sneaker-arena": {
      // sunset
      ctx.fillStyle = "#ff6b35"; ctx.fillRect(0, 0, LW, LH);
      ctx.fillStyle = "#ff9a3c"; ctx.fillRect(0, 0, LW, 60);
      ctx.fillStyle = "#3a0a1f"; ctx.fillRect(0, 90, LW, GROUND_Y - 90);
      // city silhouette
      cityline(ctx, "#1a0510", GROUND_Y - 2, scrollOff * 0.4);
      // spotlights from sky
      ctx.fillStyle = "rgba(251,191,36,0.18)";
      for (let i = 0; i < 4; i++) {
        const cx = 60 + i * 80;
        ctx.beginPath();
        ctx.moveTo(cx, 0); ctx.lineTo(cx + 30, GROUND_Y); ctx.lineTo(cx - 30, GROUND_Y); ctx.closePath();
        ctx.fill();
      }
      groundStripe(ctx, "#3a0a1f", "#fbbf24");
      break;
    }
    case "agent-farm": {
      gradient(ctx, "#0a0a30", "#04040f", LH);
      // network lines pulsing
      ctx.strokeStyle = `rgba(34,211,238,${0.25 + 0.15 * Math.sin(t / 20)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < LW; x += 24) {
        ctx.moveTo(x, 40); ctx.lineTo(x + 24, 70);
        ctx.moveTo(x, 70); ctx.lineTo(x + 24, 40);
      }
      ctx.stroke();
      cityline(ctx, "#06061f", GROUND_Y - 2, scrollOff * 0.3);
      groundStripe(ctx, "#04040f", "#22d3ee");
      break;
    }
    case "stage-night": {
      gradient(ctx, "#1a1a3e", "#0a0a1f", LH);
      starField(ctx, 7, 40, t);
      // spotlights
      ctx.fillStyle = "rgba(34,211,238,0.18)";
      ctx.beginPath(); ctx.moveTo(80, 0); ctx.lineTo(180, GROUND_Y); ctx.lineTo(0, GROUND_Y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(232,67,147,0.18)";
      ctx.beginPath(); ctx.moveTo(310, 0); ctx.lineTo(384, GROUND_Y); ctx.lineTo(220, GROUND_Y); ctx.closePath(); ctx.fill();
      // crowd silhouette
      ctx.fillStyle = "#04020f";
      for (let x = 0; x < LW; x += 5) {
        const h = 10 + ((x * 31) % 8);
        ctx.fillRect(x, GROUND_Y - h, 4, h);
      }
      groundStripe(ctx, "#0f0a1f", "#22d3ee");
      break;
    }
    case "workshop": {
      gradient(ctx, "#2d1b4e", "#1a0f33", LH);
      // pegboard
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      for (let y = 18; y < GROUND_Y - 30; y += 10) {
        for (let x = 18; x < LW; x += 10) ctx.fillRect(x, y, 1, 1);
      }
      // distant glow
      ctx.fillStyle = "rgba(232,67,147,0.18)";
      ctx.fillRect(140, GROUND_Y - 70, 110, 60);
      cityline(ctx, "#150828", GROUND_Y - 2, scrollOff * 0.3);
      groundStripe(ctx, "#1a0f33", "#e84393");
      break;
    }
  }
}

/* ---------------- props ---------------- */

export function drawProp(ctx: Ctx, kind: PropKind, x: number, y: number, t: number, variant = 0) {
  const g = GROUND_Y;
  const sil = "#0a0510";
  switch (kind) {
    case "tree":
      ctx.fillStyle = sil; ctx.fillRect(x + 5, g - 22, 4, 22);
      ctx.fillStyle = "#2d5a3d"; ctx.fillRect(x, g - 34, 14, 14); ctx.fillRect(x + 2, g - 38, 10, 4);
      ctx.fillStyle = "#3e7a52"; ctx.fillRect(x + 4, g - 36, 6, 2);
      break;
    case "bush":
      ctx.fillStyle = "#2d5a3d"; ctx.fillRect(x, g - 8, 12, 8);
      ctx.fillStyle = "#3e7a52"; ctx.fillRect(x + 2, g - 10, 8, 2);
      break;
    case "rock":
      ctx.fillStyle = "#3a3a4a"; ctx.fillRect(x, g - 6, 10, 6); ctx.fillRect(x + 2, g - 8, 6, 2);
      break;
    case "lamp":
      ctx.fillStyle = sil; ctx.fillRect(x + 3, g - 24, 2, 24);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x, g - 28, 8, 4);
      // glow
      ctx.fillStyle = "rgba(251,191,36,0.18)"; ctx.fillRect(x - 4, g - 28, 16, 28);
      break;
    case "crate":
      ctx.fillStyle = "#6b4a2a"; ctx.fillRect(x, g - 12, 12, 12);
      ctx.fillStyle = "#3a2410"; ctx.fillRect(x, g - 12, 12, 1); ctx.fillRect(x, g - 1, 12, 1); ctx.fillRect(x + 5, g - 11, 2, 10);
      break;
    case "sign":
      ctx.fillStyle = sil; ctx.fillRect(x + 4, g - 18, 2, 18);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x, g - 22, 14, 8);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 2, g - 20, 10, 1); ctx.fillRect(x + 2, g - 18, 8, 1); ctx.fillRect(x + 2, g - 16, 6, 1);
      break;
    case "platform":
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x, g - 26, 30, 4);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x, g - 26, 30, 1);
      ctx.fillStyle = sil; ctx.fillRect(x + 4, g - 22, 2, 22); ctx.fillRect(x + 24, g - 22, 2, 22);
      break;
    case "ladder":
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x, g - 38, 2, 38); ctx.fillRect(x + 8, g - 38, 2, 38);
      for (let i = 0; i < 6; i++) ctx.fillRect(x, g - 34 + i * 6, 10, 2);
      break;

    case "crt": {
      ctx.fillStyle = "#2a1a3a"; ctx.fillRect(x, g - 16, 20, 16);
      ctx.fillStyle = "#22d3ee"; ctx.fillRect(x + 2, g - 14, 16, 10);
      // scanlines flicker
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      const off = Math.floor(t / 4) % 2;
      for (let yy = g - 14 + off; yy < g - 4; yy += 2) ctx.fillRect(x + 2, yy, 16, 1);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 5, g - 11, 2, 1); ctx.fillRect(x + 9, g - 9, 6, 1);
      break;
    }
    case "cassette":
      ctx.fillStyle = "#1a1040"; ctx.fillRect(x, g - 8, 18, 8);
      ctx.fillStyle = "#22d3ee"; ctx.fillRect(x + 2, g - 6, 6, 3); ctx.fillRect(x + 10, g - 6, 6, 3);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 4, g - 5, 2, 1); ctx.fillRect(x + 12, g - 5, 2, 1);
      break;
    case "poster":
      ctx.fillStyle = variant ? "#e84393" : "#22d3ee"; ctx.fillRect(x, g - 30, 14, 18);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 2, g - 28, 10, 2); ctx.fillRect(x + 2, g - 22, 6, 6);
      break;
    case "antenna-tall":
      ctx.fillStyle = sil; ctx.fillRect(x + 5, g - 48, 2, 48); ctx.fillRect(x, g - 40, 12, 2); ctx.fillRect(x + 2, g - 30, 8, 2);
      ctx.fillStyle = "#e84393"; ctx.fillRect(x + 4, g - 50, 4, 2);
      // blink
      if ((Math.floor(t / 20)) % 2) { ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 5, g - 52, 2, 2); }
      break;

    case "shopfront": {
      const col = variant === 0 ? "#2d4a8a" : variant === 1 ? "#8a2d4a" : "#4a8a2d";
      ctx.fillStyle = col; ctx.fillRect(x, g - 38, 26, 38);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 3, g - 34, 20, 10);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 5, g - 32, 16, 1); ctx.fillRect(x + 5, g - 29, 16, 1);
      // door
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 10, g - 18, 6, 18);
      break;
    }
    case "barcode":
      ctx.fillStyle = "#fff"; ctx.fillRect(x, g - 18, 16, 18);
      ctx.fillStyle = "#0a0510";
      const bars = [1, 2, 1, 3, 1, 2, 2, 1, 3, 1];
      let bx = x + 1;
      for (const b of bars) { ctx.fillRect(bx, g - 16, b, 12); bx += b + 1; if (bx > x + 15) break; }
      break;
    case "conveyor": {
      ctx.fillStyle = "#1a1a2e"; ctx.fillRect(x, g - 10, 50, 10);
      ctx.fillStyle = "#22d3ee"; ctx.fillRect(x, g - 11, 50, 1);
      // moving stripes
      const off = Math.floor(t / 3) % 6;
      ctx.fillStyle = "#0a0510";
      for (let xx = -off; xx < 50; xx += 6) ctx.fillRect(x + xx, g - 5, 3, 1);
      // little package
      ctx.fillStyle = "#6b4a2a"; ctx.fillRect(x + ((Math.floor(t / 2)) % 40), g - 16, 8, 6);
      break;
    }
    case "pricebox":
      ctx.fillStyle = "#e84393"; ctx.fillRect(x, g - 14, 14, 14);
      ctx.fillStyle = "#fff"; ctx.fillRect(x + 2, g - 12, 10, 4);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 3, g - 11, 1, 2); ctx.fillRect(x + 6, g - 11, 1, 2); ctx.fillRect(x + 9, g - 11, 1, 2);
      break;

    case "house":
      ctx.fillStyle = "#8a5a3a"; ctx.fillRect(x, g - 26, 24, 26);
      ctx.fillStyle = "#5a2f1f"; ctx.fillRect(x - 2, g - 32, 28, 6);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 4, g - 22, 4, 4); ctx.fillRect(x + 16, g - 22, 4, 4);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 10, g - 14, 4, 14);
      break;
    case "house2":
      ctx.fillStyle = "#a87a5a"; ctx.fillRect(x, g - 30, 22, 30);
      ctx.fillStyle = "#5a2f1f"; ctx.fillRect(x, g - 36, 22, 6);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 3, g - 26, 5, 5); ctx.fillRect(x + 14, g - 26, 5, 5);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 9, g - 16, 4, 16);
      break;
    case "rentSign":
      ctx.fillStyle = sil; ctx.fillRect(x + 4, g - 22, 2, 22);
      ctx.fillStyle = "#fff"; ctx.fillRect(x, g - 28, 16, 10);
      ctx.fillStyle = "#e84393"; ctx.fillRect(x + 2, g - 26, 12, 2);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 2, g - 22, 12, 1); ctx.fillRect(x + 2, g - 20, 8, 1);
      break;
    case "autorick":
      // yellow tuk-tuk silhouette
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 2, g - 14, 22, 10);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 4, g - 20, 18, 6);
      ctx.fillRect(x, g - 8, 4, 4); ctx.fillRect(x + 22, g - 8, 4, 4);
      ctx.fillStyle = "#22d3ee"; ctx.fillRect(x + 6, g - 18, 14, 3);
      break;

    case "terminal": {
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x, g - 22, 22, 22);
      ctx.fillStyle = "#22d3ee"; ctx.fillRect(x + 2, g - 20, 18, 14);
      // cursor blink
      const blink = (Math.floor(t / 16) % 2);
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(x + 4, g - 18, 8, 1); ctx.fillRect(x + 4, g - 16, 10, 1); ctx.fillRect(x + 4, g - 14, 6, 1);
      if (blink) ctx.fillRect(x + 4, g - 12, 3, 1);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 2, g - 5, 18, 1);
      break;
    }
    case "serverRack":
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x, g - 36, 20, 36);
      ctx.fillStyle = "#1a1a3e";
      for (let i = 0; i < 7; i++) ctx.fillRect(x + 2, g - 34 + i * 5, 16, 3);
      ctx.fillStyle = "#22d3ee";
      for (let i = 0; i < 7; i++) {
        if (((i + Math.floor(t / 10)) % 3) === 0) ctx.fillRect(x + 16, g - 33 + i * 5, 1, 1);
        else ctx.fillRect(x + 16, g - 33 + i * 5, 1, 1);
      }
      ctx.fillStyle = "#e84393"; ctx.fillRect(x + 14, g - 33 + (Math.floor(t / 8) % 7) * 5, 1, 1);
      break;
    case "neonGrid":
      ctx.fillStyle = "#22d3ee"; ctx.fillRect(x, g - 32, 1, 32);
      for (let i = 0; i < 5; i++) ctx.fillRect(x, g - 30 + i * 6, 30, 1);
      break;

    case "vault":
      ctx.fillStyle = "#3a3a4a"; ctx.fillRect(x, g - 22, 22, 22);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 2, g - 20, 18, 18);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 9, g - 14, 4, 4); ctx.fillRect(x + 10, g - 10, 2, 6);
      break;
    case "vaultStack":
      // two vaults stacked
      for (let i = 0; i < 2; i++) {
        const yy = g - 18 - i * 20;
        ctx.fillStyle = "#3a3a4a"; ctx.fillRect(x, yy, 20, 20);
        ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 2, yy + 2, 16, 16);
        ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 8, yy + 8, 4, 4);
      }
      break;
    case "tickerPole":
      ctx.fillStyle = sil; ctx.fillRect(x + 4, g - 60, 2, 60);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x, g - 64, 14, 6);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 2, g - 62, 10, 1); ctx.fillRect(x + 2, g - 60, 10, 1);
      break;

    case "sneakerBox": {
      const c = variant === 0 ? "#e84393" : variant === 1 ? "#22d3ee" : "#fbbf24";
      ctx.fillStyle = c; ctx.fillRect(x, g - 16, 28, 16);
      ctx.fillStyle = "#fff"; ctx.fillRect(x, g - 16, 28, 2); ctx.fillRect(x, g - 8, 28, 1);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 4, g - 14, 6, 4);
      break;
    }
    case "stageRig":
      ctx.fillStyle = sil; ctx.fillRect(x, g - 56, 2, 56); ctx.fillRect(x + 40, g - 56, 2, 56);
      ctx.fillRect(x, g - 56, 42, 4);
      ctx.fillStyle = "#fbbf24";
      for (let i = 0; i < 5; i++) ctx.fillRect(x + 4 + i * 8, g - 50, 4, 4);
      // light cones
      ctx.fillStyle = "rgba(251,191,36,0.18)";
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x + 6 + i * 8, g - 46);
        ctx.lineTo(x + 14 + i * 8, g);
        ctx.lineTo(x - 2 + i * 8, g);
        ctx.closePath(); ctx.fill();
      }
      break;
    case "spotlight":
      ctx.fillStyle = sil; ctx.fillRect(x + 2, g - 30, 2, 30);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x, g - 34, 8, 6);
      ctx.fillStyle = "rgba(251,191,36,0.20)";
      ctx.beginPath(); ctx.moveTo(x + 4, g - 30); ctx.lineTo(x + 24, g); ctx.lineTo(x - 16, g); ctx.closePath(); ctx.fill();
      break;
    case "crowd":
      ctx.fillStyle = "#04020f";
      for (let i = 0; i < 12; i++) {
        const hx = x + i * 4;
        const h = 14 + ((i * 7) % 6) + ((Math.floor(t / 8) + i) % 3);
        ctx.fillRect(hx, g - h, 3, h);
        ctx.fillStyle = "#0a0510"; ctx.fillRect(hx, g - h - 2, 3, 2);
        ctx.fillStyle = "#04020f";
      }
      break;

    case "agentRack": {
      const col = variant === 0 ? "#22d3ee" : variant === 1 ? "#e84393" : "#fbbf24";
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x, g - 30, 24, 30);
      ctx.fillStyle = col;
      for (let i = 0; i < 5; i++) {
        const on = ((i + Math.floor(t / 8)) % 3) !== 0;
        if (on) ctx.fillRect(x + 2, g - 28 + i * 5, 20, 3);
      }
      break;
    }
    case "satellite":
      ctx.fillStyle = sil; ctx.fillRect(x + 6, g - 30, 2, 30);
      ctx.fillStyle = "#22d3ee"; ctx.fillRect(x, g - 36, 14, 6);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 5, g - 34, 4, 2);
      break;

    case "mic":
      ctx.fillStyle = sil; ctx.fillRect(x + 4, g - 22, 2, 22);
      ctx.fillStyle = "#22d3ee"; ctx.fillRect(x + 2, g - 28, 6, 6);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 3, g - 27, 4, 1); ctx.fillRect(x + 3, g - 25, 4, 1);
      ctx.fillStyle = sil; ctx.fillRect(x, g - 2, 10, 2);
      break;
    case "speaker":
      ctx.fillStyle = "#1a1a2e"; ctx.fillRect(x, g - 30, 16, 30);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 2, g - 28, 12, 12); ctx.fillRect(x + 4, g - 14, 8, 8);
      ctx.fillStyle = "#22d3ee"; ctx.fillRect(x + 6, g - 24, 4, 4);
      // pulse
      if ((Math.floor(t / 6) % 4) === 0) { ctx.fillStyle = "rgba(34,211,238,0.3)"; ctx.fillRect(x - 4, g - 28, 24, 4); }
      break;
    case "cat": {
      const col = variant === 0 ? "#fbbf24" : "#e8e0c0";
      const bob = Math.floor(t / 10) % 2;
      ctx.fillStyle = col; ctx.fillRect(x, g - 8 - bob, 14, 8);
      ctx.fillRect(x + 1, g - 11 - bob, 4, 3); // head
      ctx.fillRect(x, g - 12 - bob, 2, 2); ctx.fillRect(x + 3, g - 12 - bob, 2, 2); // ears
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 2, g - 10 - bob, 1, 1);
      // tail
      ctx.fillStyle = col; ctx.fillRect(x + 12, g - 12 - bob, 2, 4);
      break;
    }
    case "eqBars":
      for (let i = 0; i < 8; i++) {
        const h = 4 + ((Math.floor(t / 4) + i * 3) % 14);
        ctx.fillStyle = i % 2 === 0 ? "#22d3ee" : "#e84393";
        ctx.fillRect(x + i * 4, g - h, 3, h);
      }
      break;

    case "moduleBlock": {
      const col = variant === 0 ? "#22d3ee" : variant === 1 ? "#e84393" : "#fbbf24";
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x, g - 16, 18, 16);
      ctx.fillStyle = col; ctx.fillRect(x + 2, g - 14, 14, 12);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 4, g - 12, 2, 2); ctx.fillRect(x + 10, g - 12, 2, 2); ctx.fillRect(x + 6, g - 8, 6, 2);
      break;
    }
    case "machineCore":
      ctx.fillStyle = "#1a1a3e"; ctx.fillRect(x, g - 40, 40, 40);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 4, g - 36, 32, 28);
      // pulsing core
      const pulse = 0.4 + 0.4 * Math.sin(t / 10);
      ctx.fillStyle = `rgba(232,67,147,${pulse})`;
      ctx.fillRect(x + 12, g - 30, 16, 16);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 16, g - 26, 8, 8);
      break;

    case "rope": {
      // hangs from top of canvas (y=0) down to ground at x
      ctx.fillStyle = "#a87a4a";
      for (let yy = 0; yy < g - 6; yy += 2) ctx.fillRect(x + 4, yy, 2, 1);
      ctx.fillStyle = "#6b4a2a";
      for (let yy = 1; yy < g - 6; yy += 4) ctx.fillRect(x + 4, yy, 2, 1);
      // anchor knot at top
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 2, 0, 6, 4);
      break;
    }
    case "exitRope": {
      // hangs from ground down to the bottom of the canvas — implies descent
      ctx.fillStyle = "#a87a4a";
      for (let yy = g - 4; yy < LH; yy += 2) ctx.fillRect(x + 4, yy, 2, 1);
      ctx.fillStyle = "#6b4a2a";
      for (let yy = g - 4; yy < LH; yy += 4) ctx.fillRect(x + 4, yy, 2, 1);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 2, g - 6, 6, 4);
      break;
    }
    case "arcadeCabinet": {
      // body
      ctx.fillStyle = "#1a1040"; ctx.fillRect(x, g - 40, 28, 40);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x, g - 40, 28, 2); ctx.fillRect(x, g - 1, 28, 1);
      // screen
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 3, g - 36, 22, 14);
      // animated screen content
      const blink = (Math.floor(t / 12) % 2);
      ctx.fillStyle = blink ? "#e84393" : "#22d3ee";
      ctx.fillRect(x + 7, g - 32, 14, 6);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 11, g - 30, 6, 2);
      // joystick
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 6, g - 18, 2, 6);
      ctx.fillStyle = "#e84393"; ctx.fillRect(x + 5, g - 20, 4, 4);
      // buttons
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 15, g - 16, 3, 3); ctx.fillRect(x + 20, g - 16, 3, 3);
      // marquee
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x, g - 44, 28, 4);
      ctx.fillStyle = "#0a0510"; ctx.font = "5px monospace"; ctx.fillText("PLAY", x + 7, g - 41);
      // pulsing glow
      const glow = 0.18 + 0.18 * Math.abs(Math.sin(t / 10));
      ctx.fillStyle = `rgba(232,67,147,${glow})`;
      ctx.fillRect(x - 4, g - 44, 36, 44);
      break;
    }
    case "powerLine":
      ctx.fillStyle = "#0a0510";
      ctx.fillRect(x + 4, g - 40, 1, 40);
      ctx.fillRect(x - 24, g - 36, 48, 1);
      ctx.fillRect(x - 24, g - 32, 48, 1);
      break;
    case "dog":
      ctx.fillStyle = "#6b4a2a"; ctx.fillRect(x, g - 6, 10, 6);
      ctx.fillRect(x + 8, g - 9, 4, 4);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 10, g - 8, 1, 1);
      ctx.fillStyle = "#6b4a2a"; ctx.fillRect(x - 2, g - 9, 2, 3);
      break;
    case "djDeck":
      ctx.fillStyle = "#1a1a3e"; ctx.fillRect(x, g - 10, 30, 10);
      ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 3, g - 9, 9, 7); ctx.fillRect(x + 18, g - 9, 9, 7);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 6, g - 6, 3, 1); ctx.fillRect(x + 21, g - 6, 3, 1);
      break;
    case "holoGlobe":
      ctx.fillStyle = "rgba(34,211,238,0.25)";
      ctx.beginPath(); ctx.arc(x + 10, g - 20, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#22d3ee";
      for (let i = 0; i < 4; i++) {
        const a = (t / 30) + i * Math.PI / 2;
        ctx.fillRect(x + 10 + Math.cos(a) * 12, g - 20 + Math.sin(a) * 6, 1, 1);
      }
      break;
  }
}

/** Floating outcome pickup token */
export function drawPickup(ctx: Ctx, x: number, y: number, collected: boolean, t: number, accent: string) {
  const bob = collected ? 0 : Math.sin((t + x) / 14) * 2;
  const py = Math.round(y + bob);
  if (collected) return; // collected tokens disappear from world
  // glow
  ctx.fillStyle = `rgba(251,191,36,${0.18 + 0.12 * Math.abs(Math.sin(t / 12))})`;
  ctx.fillRect(x - 4, py - 4, 16, 16);
  // body
  ctx.fillStyle = "#fbbf24"; ctx.fillRect(x, py, 8, 8);
  ctx.fillStyle = accent; ctx.fillRect(x + 2, py + 2, 4, 4);
  ctx.fillStyle = "#0a0510"; ctx.fillRect(x + 3, py + 3, 2, 2);
}


/* ---------------- character ---------------- */

export function drawCharacter(
  ctx: Ctx,
  x: number,
  y: number,
  frame: number,
  facing: 1 | -1,
  action: Action,
  accent: string,
  t: number,
) {
  const fx = Math.floor(x);
  let fy = Math.floor(y);

  // pose adjustments
  let bob = 0;
  if (action === "walk") bob = (frame % 4 < 2) ? 0 : -1;
  if (action === "dance") bob = (Math.floor(t / 6) % 2) ? -2 : 0;
  if (action === "jump") bob = -6;
  fy += bob;

  ctx.save();
  ctx.translate(fx, fy);
  const flip = action === "type" || action === "sit" ? 1 : facing;
  if (flip === -1) { ctx.scale(-1, 1); ctx.translate(-12, 0); }

  // hair
  ctx.fillStyle = "#fbbf24"; ctx.fillRect(2, 0, 8, 3);
  // face
  ctx.fillStyle = "#f5d0a9"; ctx.fillRect(2, 3, 8, 4);
  // eye
  ctx.fillStyle = "#0a0510"; ctx.fillRect(7, 4, 1, 1);
  // shirt
  ctx.fillStyle = accent; ctx.fillRect(1, 7, 10, 5);
  // pants
  ctx.fillStyle = "#2d1b4e"; ctx.fillRect(2, 12, 8, 2);

  // legs by action
  ctx.fillStyle = "#0a0510";
  if (action === "walk") {
    const f = frame % 4;
    if (f === 0) { ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2); }
    else if (f === 1) { ctx.fillRect(3, 14, 3, 2); ctx.fillRect(7, 14, 3, 2); }
    else if (f === 2) { ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2); }
    else { ctx.fillRect(2, 14, 3, 2); ctx.fillRect(6, 14, 3, 2); }
  } else if (action === "climb") {
    const f = frame % 2;
    ctx.fillRect(2, 14 - f, 3, 2); ctx.fillRect(7, 14 + f, 3, 2);
  } else if (action === "jump") {
    ctx.fillRect(2, 13, 3, 2); ctx.fillRect(7, 13, 3, 2);
  } else if (action === "dance") {
    const f = Math.floor(t / 6) % 2;
    ctx.fillRect(2 + f, 14, 3, 2); ctx.fillRect(7 - f, 14, 3, 2);
  } else {
    ctx.fillRect(2, 14, 3, 2); ctx.fillRect(7, 14, 3, 2);
  }

  // arms by action
  ctx.fillStyle = accent;
  if (action === "type") {
    const f = Math.floor(t / 6) % 2;
    ctx.fillRect(-1, 8 + f, 2, 3); ctx.fillRect(11, 8 + f, 2, 3);
  } else if (action === "wave") {
    const f = Math.floor(t / 8) % 2;
    ctx.fillRect(0, 8, 1, 3);
    ctx.fillRect(11, 5 - f, 2, 4);
  } else if (action === "lift") {
    ctx.fillRect(0, 6, 2, 3); ctx.fillRect(10, 6, 2, 3);
    // tiny crate
    ctx.fillStyle = "#6b4a2a"; ctx.fillRect(2, 3, 8, 4);
  } else if (action === "dance") {
    const f = Math.floor(t / 6) % 2;
    ctx.fillRect(-1, 7 + f, 2, 3); ctx.fillRect(11, 7 - f, 2, 3);
  } else if (action === "climb") {
    const f = frame % 2;
    ctx.fillRect(0, 5 + f, 2, 3); ctx.fillRect(10, 5 - f, 2, 3);
  } else if (action === "plant") {
    ctx.fillRect(0, 7, 2, 3); ctx.fillRect(11, 4, 2, 6);
    // flagpole in hand
    ctx.fillStyle = "#0a0510"; ctx.fillRect(13, -4, 1, 14);
    ctx.fillStyle = "#fbbf24"; ctx.fillRect(14, -4, 6, 4);
  } else {
    ctx.fillRect(0, 8, 1, 3); ctx.fillRect(11, 8, 1, 3);
  }

  ctx.restore();

  // emote bubble for some actions
  if (action === "wave" || action === "dance") {
    const sym = action === "dance" ? "♪" : "!";
    const ex = fx + (facing === 1 ? 14 : -10);
    const ey = fy - 8;
    ctx.fillStyle = "#fff"; ctx.fillRect(ex, ey, 9, 9);
    ctx.fillStyle = "#0a0510"; ctx.font = "8px monospace"; ctx.fillText(sym, ex + 1, ey + 7);
  }
}

/* ---------------- ambient particles ---------------- */

export function drawAmbient(ctx: Ctx, kind: NonNullable<import("./scenes").Scene["ambient"]>, t: number) {
  switch (kind) {
    case "stars":
      // handled in bg; add shooting star occasionally
      if ((Math.floor(t / 60)) % 7 === 0) {
        const sx = (t * 3) % LW; const sy = 30 + (t % 40);
        ctx.fillStyle = "#fff";
        ctx.fillRect(sx, sy, 3, 1);
      }
      break;
    case "papers":
      ctx.fillStyle = "#f5f3ee";
      for (let i = 0; i < 8; i++) {
        const x = ((i * 53 + Math.floor(t / 2)) % (LW + 20)) - 10;
        const y = 40 + ((i * 23 + Math.floor(t / 3)) % 80);
        ctx.fillRect(x, y, 3, 2);
      }
      break;
    case "snow":
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 30; i++) {
        const x = ((i * 41 + Math.floor(t / 2)) % LW);
        const y = ((i * 19 + Math.floor(t / 1.5)) % GROUND_Y);
        ctx.fillRect(x, y, 1, 1);
      }
      break;
    case "embers":
      for (let i = 0; i < 14; i++) {
        const x = ((i * 31 + Math.floor(t / 1.5)) % LW);
        const y = GROUND_Y - ((i * 19 + Math.floor(t / 2)) % 100);
        ctx.fillStyle = (i % 2) ? "#fbbf24" : "#e84393";
        ctx.fillRect(x, y, 1, 1);
      }
      break;
    case "bits":
      ctx.fillStyle = "#22d3ee";
      for (let i = 0; i < 16; i++) {
        const x = ((i * 47 + Math.floor(t / 3)) % LW);
        const y = ((i * 17) % (GROUND_Y - 20)) + 6;
        if ((i + Math.floor(t / 8)) % 3 === 0) ctx.fillRect(x, y, 1, 1);
        else { ctx.fillRect(x, y, 2, 1); }
      }
      break;
    case "notes":
      for (let i = 0; i < 6; i++) {
        const x = 40 + ((i * 70 + Math.floor(t / 2)) % (LW - 40));
        const y = GROUND_Y - 40 - ((i * 17 + Math.floor(t / 2)) % 80);
        ctx.fillStyle = i % 2 === 0 ? "#22d3ee" : "#e84393";
        ctx.fillRect(x, y, 2, 2); ctx.fillRect(x + 2, y - 4, 1, 4);
      }
      break;
    case "cats":
      // tiny silhouettes scampering
      ctx.fillStyle = "#0a0510";
      for (let i = 0; i < 3; i++) {
        const x = ((i * 130 + Math.floor(t / 2)) % (LW + 40)) - 20;
        ctx.fillRect(x, GROUND_Y - 4, 6, 3);
      }
      break;
    case "leaves":
      for (let i = 0; i < 8; i++) {
        const x = ((i * 53 + Math.floor(t / 2)) % LW);
        const y = ((i * 19 + Math.floor(t / 2)) % GROUND_Y);
        ctx.fillStyle = (i % 2) ? "#c2956b" : "#8b4423";
        ctx.fillRect(x, y, 2, 2);
      }
      break;
    case "rain":
      ctx.fillStyle = "rgba(160,180,255,0.6)";
      for (let i = 0; i < 30; i++) {
        const x = ((i * 41 + Math.floor(t / 1)) % LW);
        const y = ((i * 19 + Math.floor(t * 4)) % GROUND_Y);
        ctx.fillRect(x, y, 1, 3);
      }
      break;
  }
}

/* ---------------- waypoint interp ---------------- */

import type { Waypoint } from "./scenes";

export function interpPath(path: Waypoint[], p: number): { x: number; y: number; action: Action; facing: 1 | -1 } {
  if (path.length === 0) return { x: 0, y: GROUND_Y - 16, action: "walk", facing: 1 };
  if (path.length === 1) return { x: path[0].x, y: path[0].y, action: path[0].action, facing: path[0].facing ?? 1 };
  const clamped = Math.max(0, Math.min(0.9999, p));
  const seg = clamped * (path.length - 1);
  const i = Math.floor(seg);
  const f = seg - i;
  const a = path[i];
  const b = path[i + 1];
  const x = a.x + (b.x - a.x) * f;
  const y = a.y + (b.y - a.y) * f;
  const facing: 1 | -1 = b.x >= a.x ? 1 : -1;
  // action: use destination's action when past midpoint, else origin's
  const action = f > 0.5 ? b.action : a.action;
  return { x, y, action, facing };
}


