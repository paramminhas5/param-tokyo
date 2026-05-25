"use client";

import { useEffect } from "react";

/**
 * Maps vertical touch swipes to page scroll, with momentum.
 * Mounted once at the top of /play so the cinematic experience is playable on
 * mobile without an explicit gesture model.
 *
 * No-op on desktop (touch events never fire) and on prefers-reduced-motion users
 * who'd rather use native scroll.
 */
export function MobileTouchScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let startY = 0;
    let startTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      const dt = Math.max(1, Date.now() - startTime);
      if (Math.abs(dy) < 10) return; // tap, not swipe
      // Momentum: scale scroll distance by swipe speed (px/ms)
      const velocity = Math.abs(dy / dt);
      const scrollAmt = dy * (1 + velocity * 2);
      window.scrollBy({ top: scrollAmt, behavior: "smooth" });
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return null;
}
