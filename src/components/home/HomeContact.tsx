"use client";

import { useState } from "react";
import Link from "next/link";
import { HERO } from "@/content/resume";
import { HirePanel } from "../HirePanel";
import { SectionHeader } from "./WorldsPreview";

export function HomeContact() {
  const [hireOpen, setHireOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(HERO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard might be blocked — silently noop */
    }
  };

  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(5rem, 10vw, 8rem) 0 clamp(3rem, 6vw, 5rem)",
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(232,67,147,0.10) 0%, transparent 60%), #050310",
        borderTop: "1px solid rgba(240,236,228,0.06)",
      }}
    >
      <SectionHeader
        kicker="End of Demo · Hire / collaborate"
        title="Let's build the next world."
        sub={`${HERO.location}. Open to founder roles, advisory, and brand-AI collaborations.`}
      />

      <div
        style={{
          marginTop: 40,
          maxWidth: 720,
          margin: "40px auto 0",
          padding: "0 clamp(1rem, 5vw, 4rem)",
        }}
      >
        <div
          style={{
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            background: "#0a0814",
            border: "2px solid #fbbf24",
            boxShadow:
              "0 0 0 4px rgba(10,10,20,0.92), 0 0 0 5px rgba(251,191,36,0.25), 0 24px 60px rgba(0,0,0,0.7)",
          }}
        >
          <p style={{ color: "rgba(240,236,228,0.85)", lineHeight: 1.65, fontSize: 15 }}>
            {HERO.bio}
          </p>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={() => setHireOpen(true)}
              style={{
                padding: "13px 24px",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                background: "#fbbf24",
                color: "#050310",
                border: "2px solid #fbbf24",
                cursor: "pointer",
              }}
            >
              ▶ Hire me
            </button>

            <a
              href={`mailto:${HERO.email}`}
              style={{
                padding: "13px 24px",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#f0ece4",
                border: "2px solid rgba(240,236,228,0.3)",
                textDecoration: "none",
              }}
            >
              ✉ {HERO.email}
            </a>

            <button
              type="button"
              onClick={copy}
              style={{
                padding: "13px 18px",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: copied ? "#22d3ee" : "rgba(240,236,228,0.7)",
                border: "1px solid rgba(240,236,228,0.2)",
                background: "transparent",
                cursor: "pointer",
                transition: "color 200ms ease",
              }}
            >
              {copied ? "✓ Copied" : "Copy email"}
            </button>
          </div>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
            }}
          >
            <FooterLink href={HERO.links.linkedin} external>
              LinkedIn
            </FooterLink>
            <FooterLink href={HERO.links.twitter} external>
              X / Twitter
            </FooterLink>
            <FooterLink href={HERO.links.site} external>
              Cats Can Dance
            </FooterLink>
            <FooterLink href="/cv">Full CV</FooterLink>
            <FooterLink href="/play">Play</FooterLink>
          </div>
        </div>

        <p
          style={{
            marginTop: 36,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.4)",
          }}
        >
          Art, code & life — {HERO.name} · {new Date().getFullYear()}
        </p>
      </div>

      <HirePanel open={hireOpen} onClose={() => setHireOpen(false)} />
    </section>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const style = {
    padding: "8px 14px",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "rgba(240,236,228,0.75)",
    border: "1px solid rgba(240,236,228,0.2)",
    textDecoration: "none",
    transition: "border-color 150ms ease, color 150ms ease",
  };
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} style={style}>
      {children}
    </Link>
  );
}
