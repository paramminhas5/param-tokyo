"use client";

import Link from "next/link";
import { HERO } from "@/content/resume";

export function HomeNav() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px clamp(16px, 4vw, 48px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(12px)",
        background: "rgba(5, 3, 16, 0.6)",
        borderBottom: "1px solid rgba(240, 236, 228, 0.06)",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 14,
          fontWeight: 600,
          color: "#f0ece4",
          textDecoration: "none",
          letterSpacing: "0.02em",
        }}
      >
        {HERO.name}
      </Link>

      <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <Link
          href="/play"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(240, 236, 228, 0.6)",
            textDecoration: "none",
            transition: "color 200ms",
          }}
        >
          Experience
        </Link>
        <Link
          href="/cv"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(240, 236, 228, 0.6)",
            textDecoration: "none",
          }}
        >
          CV
        </Link>
        <a
          href={`mailto:${HERO.email}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "6px 14px",
            color: "#050310",
            background: "#f0ece4",
            textDecoration: "none",
          }}
        >
          Hire me
        </a>
      </nav>
    </header>
  );
}
