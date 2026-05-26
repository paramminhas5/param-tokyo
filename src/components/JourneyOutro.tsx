"use client";

import { HERO } from "@/content/resume";

/**
 * Closing section for /play — CTA to hire/contact + link to CV.
 */
export function JourneyOutro() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #1a1a2e 0%, #050310 100%)",
        padding: "0 8vw",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 4vw, 44px)",
          fontWeight: 600,
          color: "#f0ece4",
          lineHeight: 1.2,
          marginBottom: 16,
        }}
      >
        That&apos;s the journey so far.
      </h2>

      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(14px, 1.8vw, 18px)",
          color: "rgba(240, 236, 228, 0.6)",
          maxWidth: 500,
          lineHeight: 1.6,
          marginBottom: 40,
        }}
      >
        {HERO.bio}
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href={`mailto:${HERO.email}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "12px 28px",
            color: "#050310",
            background: "#f0ece4",
            textDecoration: "none",
            transition: "opacity 200ms",
          }}
        >
          Get in touch
        </a>
        <a
          href="/cv"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "12px 28px",
            color: "#f0ece4",
            border: "1px solid rgba(240, 236, 228, 0.3)",
            textDecoration: "none",
            transition: "border-color 200ms",
          }}
        >
          View full CV
        </a>
      </div>

      <div
        style={{
          marginTop: 48,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
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
    </section>
  );
}
