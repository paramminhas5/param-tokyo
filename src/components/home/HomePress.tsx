import { PRESS } from "@/content/resume";

export function HomePress() {
  return (
    <section
      style={{
        padding: "60px clamp(24px, 8vw, 120px)",
        borderTop: "1px solid rgba(240, 236, 228, 0.06)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(240, 236, 228, 0.4)",
          marginBottom: 24,
        }}
      >
        Press & Features
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {PRESS.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "baseline",
              paddingBottom: 16,
              borderBottom: "1px solid rgba(240, 236, 228, 0.06)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                color: "rgba(240, 236, 228, 0.5)",
                minWidth: 100,
                flexShrink: 0,
              }}
            >
              {p.outlet}
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                color: "rgba(240, 236, 228, 0.75)",
              }}
            >
              {p.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
