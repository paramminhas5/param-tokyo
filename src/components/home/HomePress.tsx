"use client";

import { PRESS } from "@/content/resume";
import { SectionHeader } from "./WorldsPreview";

export function HomePress() {
  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(4rem, 8vw, 6rem) 0",
        background: "#0a0814",
        borderTop: "1px solid rgba(240,236,228,0.06)",
      }}
    >
      <SectionHeader kicker="Selected Press" title="In their words." />

      <ul
        style={{
          marginTop: 36,
          maxWidth: 880,
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0 clamp(1rem, 5vw, 4rem)",
          listStyle: "none",
        }}
      >
        {PRESS.map((p, i) => (
          <li
            key={p.title}
            style={{
              padding: "18px 0",
              borderTop: i === 0 ? "1px solid rgba(240,236,228,0.12)" : "none",
              borderBottom: "1px solid rgba(240,236,228,0.12)",
              display: "flex",
              gap: 18,
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#fbbf24",
                fontWeight: 700,
                flex: "0 0 140px",
              }}
            >
              {p.outlet}
            </span>
            <span
              style={{
                color: "rgba(240,236,228,0.85)",
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              {p.title}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
