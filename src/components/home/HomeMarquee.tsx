"use client";

import { COMPANIES } from "@/content/resume";

export function HomeMarquee() {
  const doubled = [...COMPANIES, ...COMPANIES];

  return (
    <section
      style={{
        padding: "40px 0",
        borderTop: "1px solid rgba(240, 236, 228, 0.06)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(240, 236, 228, 0.3)",
          marginBottom: 20,
          paddingLeft: "clamp(24px, 8vw, 120px)",
        }}
      >
        Worked with & featured in
      </div>

      <div
        style={{
          display: "flex",
          gap: 48,
          animation: "marquee-scroll 30s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(14px, 2vw, 18px)",
              fontWeight: 500,
              color: "rgba(240, 236, 228, 0.25)",
              flexShrink: 0,
            }}
          >
            {name}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
