"use client";
import { useEffect, useState } from "react";

/**
 * Pure scroll engine — no timers, no IntersectionObserver delays.
 * All progress values are computed directly from scroll position math.
 *
 * useWorldProgress(id):
 *   Returns 0 when element's top hits viewport top,
 *   returns 1 when element's bottom leaves viewport bottom.
 *   The section must be minHeight: 200vh so sticky scene works correctly.
 *
 * useTotalProgress():
 *   Returns 0→1 for entire page scroll.
 */

export function useWorldProgress(id: string): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    let raf = 0;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const p = -rect.top / scrollable;
      setProgress(Math.max(0, Math.min(1, p)));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    compute();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [id]);

  return progress;
}

export function useTotalProgress(): number {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const total = doc.scrollHeight - window.innerHeight;
        setP(total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return p;
}
