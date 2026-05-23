/**
 * Ambient audio engine. One drone per world — procedural tones built from
 * the Web Audio graph: oscillator → filter → gain → reverb → master.
 * Crossfades between worlds in 800ms. Completely silent when muted.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let reverbNode: ConvolverNode | null = null;
let currentWorldId: string | null = null;
let currentNodes: OscillatorNode[] = [];
let currentGain: GainNode | null = null;
let globalMuted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch { return null; }
  }
  return ctx;
}

function getMaster(): GainNode | null {
  const c = getCtx();
  if (!c) return null;
  if (!masterGain) {
    masterGain = c.createGain();
    masterGain.gain.value = globalMuted ? 0 : 0.18;
    masterGain.connect(c.destination);
  }
  return masterGain;
}

async function getOrCreateReverb(): Promise<ConvolverNode | null> {
  const c = getCtx();
  if (!c) return null;
  if (reverbNode) return reverbNode;

  // Synthetic impulse response — a short reverb tail
  const sr = c.sampleRate;
  const len = sr * 1.8;
  const buf = c.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
    }
  }
  reverbNode = c.createConvolver();
  reverbNode.buffer = buf;
  return reverbNode;
}

interface WorldConfig {
  root: number;       // Hz
  intervals: number[]; // ratios relative to root for chord
  tempo: number;      // BPM for melodic pings (0 = none)
  scale: number[];    // pitch ratios for melody
  filterFreq: number; // LP filter cutoff (Hz)
  gainMult: number;   // volume relative to master
}

const WORLD_AUDIO: Record<string, WorldConfig> = {
  origin:     { root: 110,    intervals: [1, 1.498, 1.782],         tempo: 34, scale: [1, 1.122, 1.260, 1.498, 1.682],                   filterFreq: 800,  gainMult: 0.7 },
  grp:        { root: 146.83, intervals: [1, 1.335, 2.0],           tempo: 52, scale: [1, 1.122, 1.189, 1.335, 1.498, 1.682, 1.888],      filterFreq: 1400, gainMult: 0.9 },
  hab:        { root: 130.81, intervals: [1, 1.189, 1.498],         tempo: 44, scale: [1, 1.122, 1.189, 1.335, 1.498, 1.587, 1.782],      filterFreq: 900,  gainMult: 0.8 },
  octo:       { root: 164.81, intervals: [1, 1.414, 1.888],         tempo: 60, scale: [1, 1.122, 1.260, 1.414, 1.498, 1.682, 1.888],      filterFreq: 1800, gainMult: 0.85 },
  investopad: { root: 138.59, intervals: [1, 1.189, 1.587],         tempo: 38, scale: [1, 1.122, 1.189, 1.335, 1.498, 1.587, 1.782],      filterFreq: 750,  gainMult: 0.7 },
  solesearch: { root: 174.61, intervals: [1, 1.260, 1.498, 1.682],  tempo: 72, scale: [1, 1.122, 1.260, 1.498, 1.682],                   filterFreq: 2200, gainMult: 1.0 },
  fere:       { root: 184.99, intervals: [1, 1.414, 2.0],           tempo: 56, scale: [1, 1.122, 1.260, 1.414, 1.498, 1.682, 1.888],      filterFreq: 3000, gainMult: 0.9 },
  ccd:        { root: 195.99, intervals: [1, 1.260, 1.498, 1.888],  tempo: 64, scale: [1, 1.122, 1.260, 1.335, 1.498, 1.682, 1.888],      filterFreq: 2800, gainMult: 1.0 },
  iterate:    { root: 220,    intervals: [1, 1.122, 1.498, 1.782],  tempo: 48, scale: [1, 1.122, 1.189, 1.335, 1.498, 1.682, 1.888],      filterFreq: 2000, gainMult: 0.85 },
};

let melodyTimer: ReturnType<typeof setInterval> | null = null;

function stopMelody() {
  if (melodyTimer) { clearInterval(melodyTimer); melodyTimer = null; }
}

function startMelody(config: WorldConfig, gainDst: GainNode) {
  if (config.tempo === 0) return;
  const c = getCtx(); if (!c) return;
  const intervalMs = (60 / config.tempo) * 1000 * 2;

  melodyTimer = setInterval(() => {
    if (globalMuted) return;
    const ratio = config.scale[Math.floor(Math.random() * config.scale.length)];
    const octave = Math.random() > 0.5 ? 2 : 4;
    const freq = config.root * ratio * octave;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, c.currentTime);
    g.gain.linearRampToValueAtTime(0.038, c.currentTime + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.4);
    o.connect(g);
    g.connect(gainDst);
    o.start();
    o.stop(c.currentTime + 1.5);
  }, intervalMs);
}

export async function playWorld(worldId: string) {
  if (currentWorldId === worldId) return;
  currentWorldId = worldId;

  const c = getCtx(); if (!c) return;
  const master = getMaster(); if (!master) return;

  // Unlock on first interaction
  if (c.state === "suspended") { await c.resume(); }

  const config = WORLD_AUDIO[worldId];
  if (!config) return;

  const reverb = await getOrCreateReverb();

  // Fade out current
  stopMelody();
  if (currentGain) {
    const cg = currentGain;
    cg.gain.linearRampToValueAtTime(0, c.currentTime + 0.7);
    setTimeout(() => {
      currentNodes.forEach((n) => { try { n.stop(); } catch {} });
      currentNodes = [];
    }, 800);
    currentGain = null;
  }

  // Build new layer
  const worldGain = c.createGain();
  worldGain.gain.setValueAtTime(0, c.currentTime);
  worldGain.gain.linearRampToValueAtTime(config.gainMult, c.currentTime + 1.2);
  currentGain = worldGain;

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = config.filterFreq;
  filter.Q.value = 0.8;

  const dryGain = c.createGain();
  dryGain.gain.value = 0.75;
  const wetGain = c.createGain();
  wetGain.gain.value = 0.25;

  worldGain.connect(filter);
  filter.connect(dryGain);
  dryGain.connect(master);
  if (reverb) {
    filter.connect(reverb);
    reverb.connect(wetGain);
    wetGain.connect(master);
  }

  const newNodes: OscillatorNode[] = [];
  config.intervals.forEach((ratio, i) => {
    const o = c.createOscillator();
    const og = c.createGain();
    o.type = i === 0 ? "sine" : "triangle";
    o.frequency.value = config.root * ratio;
    // Subtle detune for warmth
    o.detune.value = (Math.random() - 0.5) * 8;
    og.gain.value = i === 0 ? 0.6 : 0.25;
    o.connect(og);
    og.connect(worldGain);
    o.start();
    newNodes.push(o);
  });
  currentNodes = newNodes;
  startMelody(config, worldGain);
}

export function stopWorld() {
  stopMelody();
  const c = getCtx();
  if (!c || !currentGain) return;
  currentGain.gain.linearRampToValueAtTime(0, c.currentTime + 0.8);
  setTimeout(() => {
    currentNodes.forEach((n) => { try { n.stop(); } catch {} });
    currentNodes = [];
  }, 900);
  currentGain = null;
  currentWorldId = null;
}

export function setAmbientMuted(muted: boolean) {
  globalMuted = muted;
  const c = getCtx();
  const m = getMaster();
  if (!c || !m) return;
  m.gain.linearRampToValueAtTime(muted ? 0 : 0.18, c.currentTime + 0.3);
}
