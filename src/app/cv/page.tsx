"use client";

import Link from "next/link";
import { HERO, CHAPTERS, SKILL_GROUPS, PRESS } from "@/content/resume";

/**
 * Magazine-grade printable CV.
 * Clean layout optimized for PDF export / print.
 */
export default function CvPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf8f4",
        color: "#0e0820",
        fontFamily: "var(--font-display)",
        padding: "clamp(24px, 4vw, 60px)",
      }}
    >
      {/* No-print nav */}
      <div
        className="no-print"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "flex",
          gap: 12,
          zIndex: 50,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            padding: "8px 16px",
            color: "#0e0820",
            border: "1px solid #0e082033",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          Home
        </Link>
        <button
          onClick={() => { if (typeof window !== "undefined") window.print(); }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            padding: "8px 16px",
            color: "#faf8f4",
            background: "#0e0820",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          Print / Save PDF
        </button>
      </div>

      {/* Header */}
      <header style={{ marginBottom: 48, maxWidth: 700 }}>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          {HERO.name}
        </h1>
        <p style={{ fontSize: 16, color: "#0e082099", marginBottom: 4 }}>
          {HERO.tagline}
        </p>
        <p style={{ fontSize: 14, color: "#0e082077" }}>
          {HERO.location} · {HERO.email}
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          {Object.entries(HERO.links).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#0e082066",
                textDecoration: "none",
                textTransform: "capitalize",
              }}
            >
              {key}
            </a>
          ))}
        </div>
      </header>

      {/* Summary */}
      <section style={{ marginBottom: 48, maxWidth: 700 }}>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#0e0820cc" }}>
          {HERO.bio}
        </p>
      </section>

      {/* Chapters */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#0e082066",
            marginBottom: 24,
            borderBottom: "1px solid #0e082011",
            paddingBottom: 8,
          }}
        >
          Experience
        </h2>

        {CHAPTERS.map((ch) => (
          <article
            key={ch.id}
            style={{
              marginBottom: 32,
              paddingBottom: 32,
              borderBottom: "1px solid #0e082008",
              breakInside: "avoid",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600 }}>
                {ch.org}
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "#0e082066",
                }}
              >
                {ch.year}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "#0e082088",
                marginBottom: 10,
              }}
            >
              {ch.role}
            </div>
            {ch.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#0e0820bb", marginBottom: 6 }}>
                {p}
              </p>
            ))}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {ch.outcomes.map((o, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    padding: "3px 8px",
                    background: "#0e082008",
                    color: "#0e0820aa",
                    letterSpacing: "0.05em",
                  }}
                >
                  {o}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* Skills */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#0e082066",
            marginBottom: 20,
            borderBottom: "1px solid #0e082011",
            paddingBottom: 8,
          }}
        >
          Skills & Tools
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {SKILL_GROUPS.map((g) => (
            <div key={g.title}>
              <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#0e0820aa" }}>
                {g.title}
              </h3>
              <p style={{ fontSize: 12, lineHeight: 1.8, color: "#0e082088" }}>
                {g.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Press */}
      <section>
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#0e082066",
            marginBottom: 16,
            borderBottom: "1px solid #0e082011",
            paddingBottom: 8,
          }}
        >
          Press
        </h2>
        {PRESS.map((p, i) => (
          <div key={i} style={{ marginBottom: 8, display: "flex", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#0e082066", minWidth: 90 }}>
              {p.outlet}
            </span>
            <span style={{ fontSize: 13, color: "#0e0820aa" }}>
              {p.title}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
