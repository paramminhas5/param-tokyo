import { useEffect, useState } from "react";
import { CHAPTERS } from "@/content/resume";

/**
 * Global journey progress driven by window scroll.
 * - `worldIndex`: which chapter the hero is currently in (-1 = intro, CHAPTERS.length = outro).
 * - `worldProgress`: 0..1 inside that chapter section (drives hero X).
 * - `moving`: true for ~180ms after the last scroll delta (drives walk animation).
 *
 * The store is intentionally tiny. Each WorldStage registers its DOM section via
 * registerWorldEl(id, el); the listener computes which section currently contains
 * the viewport mid-line and writes a single snapshot to subscribers.
 */

export interface ProgressSnapshot {
  worldIndex: number;     // -1 = intro, 0..CHAPTERS.length-1 = world, CHAPTERS.length = outro
  worldId: string | null;
  worldProgress: number;  // 0..1
  totalProgress: number;  // 0..1 across the whole page
  moving: boolean;
}

const initial: ProgressSnapshot = {
  worldIndex: -1, worldId: null, worldProgress: 0, totalProgress: 0, moving: false,
};

let snapshot: ProgressSnapshot = initial;
const listeners = new Set<(s: ProgressSnapshot) => void>();
const worldEls = new Map<string, HTMLElement>();
let lastMoveTs = 0;
let movingTimeout: number | null = null;
let installed = false;

export function registerWorldEl(id: string, el: HTMLElement | null) {
  if (el) worldEls.set(id, el);
  else worldEls.delete(id);
  if (typeof window !== "undefined") install();
}

function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const recompute = () => {
    const vhMid = window.innerHeight * 0.55; // hero stands a bit below center
    let bestIdx = -1;
    let bestId: string | null = null;
    let bestProgress = 0;

    CHAPTERS.forEach((c, i) => {
      const el = worldEls.get(c.id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Section is "current" when the viewport mid-line is within it.
      if (rect.top <= vhMid && rect.bottom >= vhMid) {
        bestIdx = i;
        bestId = c.id;
        const p = (vhMid - rect.top) / rect.height;
        bestProgress = Math.max(0, Math.min(1, p));
      }
    });

    // Before first world → intro; after last → outro.
    if (bestIdx === -1) {
      const firstEl = worldEls.get(CHAPTERS[0].id);
      if (firstEl) {
        const r = firstEl.getBoundingClientRect();
        if (r.top > vhMid) {
          bestIdx = -1;
          bestId = null;
          bestProgress = 0;
        } else {
          bestIdx = CHAPTERS.length;
          bestId = null;
          bestProgress = 1;
        }
      }
    }

    const doc = document.documentElement;
    const totalProgress = Math.max(
      0,
      Math.min(1, window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight))
    );

    const prev = snapshot;
    const moved =
      prev.worldIndex !== bestIdx ||
      Math.abs(prev.worldProgress - bestProgress) > 0.0005 ||
      Math.abs(prev.totalProgress - totalProgress) > 0.0005;

    if (moved) {
      lastMoveTs = performance.now();
      if (movingTimeout) window.clearTimeout(movingTimeout);
      movingTimeout = window.setTimeout(() => {
        snapshot = { ...snapshot, moving: false };
        listeners.forEach((l) => l(snapshot));
      }, 180);
    }

    snapshot = {
      worldIndex: bestIdx,
      worldId: bestId,
      worldProgress: bestProgress,
      totalProgress,
      moving: moved || performance.now() - lastMoveTs < 180,
    };
    listeners.forEach((l) => l(snapshot));
  };

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; recompute(); });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // Keyboard advance: ↓/space scroll a screen; ↑ rewinds.
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      window.scrollBy({ top: window.innerHeight * 0.55, behavior: "smooth" });
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      window.scrollBy({ top: -window.innerHeight * 0.55, behavior: "smooth" });
    }
  });

  recompute();
}

export function useProgress(): ProgressSnapshot {
  const [s, setS] = useState<ProgressSnapshot>(snapshot);
  useEffect(() => {
    install();
    const l = (n: ProgressSnapshot) => setS(n);
    listeners.add(l);
    setS(snapshot);
    return () => { listeners.delete(l); };
  }, []);
  return s;
}
