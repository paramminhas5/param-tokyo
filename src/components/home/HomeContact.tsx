import { HERO } from "@/content/resume";

export function HomeContact() {
  return (
    <section
      style={{
        padding: "80px clamp(24px, 8vw, 120px)",
        borderTop: "1px solid rgba(240, 236, 228, 0.06)",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: 600,
          color: "#f0ece4",
          marginBottom: 12,
        }}
      >
        Let&apos;s build something.
      </h2>

      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(14px, 1.6vw, 17px)",
          color: "rgba(240, 236, 228, 0.5)",
          maxWidth: 420,
          margin: "0 auto 32px",
          lineHeight: 1.6,
        }}
      >
        Open to founding roles, advisory, creative direction, and fractional operator positions.
      </p>

      <a
        href={`mailto:${HERO.email}`}
        style={{
          display: "inline-block",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          letterSpacing: "0.12em",
          padding: "14px 36px",
          color: "#050310",
          background: "#f0ece4",
          textDecoration: "none",
          marginBottom: 32,
        }}
      >
        {HERO.email}
      </a>

      <div
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(HERO.links).map(([key, url]) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "rgba(240, 236, 228, 0.4)",
              textDecoration: "none",
              textTransform: "capitalize",
            }}
          >
            {key}
          </a>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 64,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.15em",
          color: "rgba(240, 236, 228, 0.2)",
        }}
      >
        Built with intention. © {new Date().getFullYear()}
      </div>
    </section>
  );
}
