"use client";

import { COMPANIES } from "@/content/resume";

/**
 * Infinite marquee of companies. CSS-only — no JS, no ResizeObserver.
 * Doubled list + 50% translate keyframe = seamless loop.
 *
 * Respects prefers-reduced-motion via the @media query in the keyframes block.
 */
export function HomeMarquee() {
  // Duplicate the list so the loop is seamless.
  const tape = [...COMPANIES, ...COMPANIES];

  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(2rem, 5vw, 3.5rem) 0",
        background: "#050310",
        borderTop: "1px solid rgba(240,236,228,0.06)",
        borderBottom: "1px solid rgba(240,236,228,0.06)",
        overflow: "hidden",
      }}
      aria-label="Worked with"
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(240,236,228,0.45)",
          textAlign: "center",
          marginBottom: 18,
        }}
      >
        ◤ Worked with · Featured in ◥
      </p>

      <div
        style={{
          display: "flex",
          gap: 0,
          width: "max-content",
          animation: "pm-marquee 38s linear infinite",
          willChange: "transform",
        }}
      >
        {tape.map((c, i) => (
          <span
            key={`${c}-${i}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 36,
              padding: "0 28px",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.25rem, 2.6vw, 1.85rem)",
              fontWeight: 600,
              color: "rgba(240,236,228,0.55)",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            {c}
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                background: "#fbbf24",
                opacity: 0.5,
              }}
            />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes pm-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="Worked with"] > div { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
