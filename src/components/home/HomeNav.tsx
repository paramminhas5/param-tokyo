"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HERO } from "@/content/resume";
import { HirePanel } from "../HirePanel";

/**
 * Slim sticky top navigation for /. Becomes opaque after scroll.
 * Mirrors the look of the in-game Hud, minus the skill counter — homepage
 * doesn't need that signal.
 */
export function HomeNav() {
  const [hireOpen, setHireOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "background 300ms ease, border-color 300ms ease",
          background: scrolled ? "rgba(5,3,16,0.85)" : "transparent",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "0 clamp(1rem, 5vw, 4rem)",
            height: 56,
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <span style={{ display: "flex", gap: 3 }}>
              <span style={{ width: 9, height: 9, background: "#fbbf24", display: "block" }} />
              <span style={{ width: 9, height: 9, background: "#ff6b5b", display: "block", marginTop: 2 }} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#f0ece4",
                fontWeight: 700,
              }}
            >
              {HERO.name}
            </span>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <NavLink href="/play">Play</NavLink>
            <NavLink href="/cv">CV</NavLink>
            <button
              type="button"
              onClick={() => setHireOpen(true)}
              style={{
                padding: "7px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 700,
                background: "#fbbf24",
                color: "#050310",
                border: "none",
                cursor: "pointer",
              }}
            >
              Hire
            </button>
          </nav>
        </div>
      </header>

      <HirePanel open={hireOpen} onClose={() => setHireOpen(false)} />
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        padding: "6px 12px",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(240,236,228,0.85)",
        textDecoration: "none",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {children}
    </Link>
  );
}
