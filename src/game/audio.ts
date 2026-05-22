let ctx: AudioContext | null = null;
let muted = false;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try { ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); }
    catch { return null; }
  }
  return ctx;
}

function blip(freq: number, dur: number, type: OscillatorType = "square", vol = 0.06) {
  if (muted) return;
  const c = getCtx(); if (!c) return;
  const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g); g.connect(c.destination);
  o.start(); o.stop(c.currentTime + dur);
}

export const sfx = {
  step: () => blip(180 + Math.random() * 40, 0.04, "square", 0.025),
  pickup: () => { blip(660, 0.08); setTimeout(() => blip(990, 0.12), 60); },
  open: () => { blip(440, 0.06); setTimeout(() => blip(660, 0.08), 50); },
  close: () => { blip(330, 0.05); setTimeout(() => blip(220, 0.07), 40); },
  warp: () => { blip(220, 0.05); setTimeout(() => blip(440, 0.05), 50); setTimeout(() => blip(880, 0.1), 100); },
  toggleMute: () => { muted = !muted; return muted; },
  isMuted: () => muted,
};
