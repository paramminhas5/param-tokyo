import { SKILL_GROUPS } from "@/content/resume";

export function HomeSkills() {
  return (
    <section
      style={{
        padding: "80px clamp(24px, 8vw, 120px)",
        borderTop: "1px solid rgba(240, 236, 228, 0.06)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 3vw, 32px)",
          fontWeight: 600,
          color: "#f0ece4",
          marginBottom: 40,
        }}
      >
        Skills & Tools
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 32,
        }}
      >
        {SKILL_GROUPS.map((group) => (
          <div key={group.title}>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(240, 236, 228, 0.5)",
                marginBottom: 12,
              }}
            >
              {group.title}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {group.items.map((item) => (
                <span
                  key={item}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    color: "rgba(240, 236, 228, 0.7)",
                    padding: "4px 10px",
                    background: "rgba(240, 236, 228, 0.04)",
                    border: "1px solid rgba(240, 236, 228, 0.08)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
