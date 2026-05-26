"use client";

import { useEffect, useState } from "react";
import { CHAPTERS } from "@/content/resume";

/**
 * Simplified scroll progress engine.
 * Tracks which world section the viewport is in and progress within it.
 */

export interface ProgressSnapshot {
  worldIndex: number;
  worldId: string | null;
  worldProgress: number;
  totalProgress: number;
}

const initial: ProgressSnapshot = {
  worldIndex: -1,
  worldId: null,
  worldProgress: 0,
  totalProgress: 0,
};

let snapshot: ProgressSnapshot = initial;
const listeners = new Set<(s: ProgressSnapshot) => void>();
const worldEls = new Map<string, HTMLElement>();
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
    const vhMid = window.innerHeight * 0.5;
    let bestIdx = -1;
    let bestId: string | null = null;
    let bestProgress = 0;

    CHAPTERS.forEach((c, i) => {
      const el = worldEls.get(c.id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= vhMid && rect.bottom >= vhMid) {
        bestIdx = i;
        bestId = c.id;
        const p = (vhMid - rect.top) / rect.height;
        bestProgress = Math.max(0, Math.min(1, p));
      }
    });

    const doc = document.documentElement;
    const totalProgress = Math.max(
      0,
      Math.min(1, window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight))
    );

    snapshot = {
      worldIndex: bestIdx,
      worldId: bestId,
      worldProgress: bestProgress,
      totalProgress,
    };
    listeners.forEach((l) => l(snapshot));
  };

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      recompute();
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
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
