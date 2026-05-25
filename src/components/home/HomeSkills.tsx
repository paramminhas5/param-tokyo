"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SKILLS, type SkillId } from "@/content/resume";
import { useSkills } from "@/game/state";
import { SkillIcon } from "../SkillIcon";
import { SectionHeader } from "./WorldsPreview";

/**
 * Full skills inventory + collected-state continuity from /play.
 *
 * If the visitor has played /play, the skills they've earned glow with a "✓"
 * badge — a tiny payoff for cross-page exploration. Otherwise renders all 9
 * skills in their resting state.
 */
export function HomeSkills() {
  const earned = useSkills();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const all = Object.keys(SKILLS) as SkillId[];

  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(4rem, 8vw, 6rem) 0",
        background: "#050310",
      }}
    >
      <SectionHeader
        kicker="9 Skills · Earned across 9 worlds"
        title="The kit."
        sub="Each skill was forged in a specific chapter — engineering, ops, AI, community, judgment. They compound."
      />

      <div
        style={{
          marginTop: 40,
          maxWidth: 1080,
          margin: "40px auto 0",
          padding: "0 clamp(1rem, 5vw, 4rem)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 14,
        }}
      >
        {all.map((id) => {
          const s = SKILLS[id];
          const isEarned = mounted && earned.includes(id);
          return (
            <Link
              key={id}
              href={`/play#${s.earnedInId}`}
              style={{
                display: "flex",
                gap: 14,
                padding: "16px 16px 16px 14px",
                background: "#0a0814",
                border: `1px solid ${isEarned ? s.color + "55" : "rgba(240,236,228,0.08)"}`,
                textDecoration: "none",
                color: "#f0ece4",
                position: "relative",
                transition: "border-color 200ms ease, transform 120ms ease",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  display: "grid",
                  placeItems: "center",
                  background: isEarned ? `${s.color}11` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isEarned ? s.color + "44" : "rgba(240,236,228,0.06)"}`,
                }}
              >
                <SkillIcon id={id} size={32} earned={isEarned} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: isEarned ? s.color : "rgba(240,236,228,0.45)",
                  }}
                >
                  {s.family}
                </div>
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#f0ece4",
                    lineHeight: 1.2,
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(240,236,228,0.5)",
                  }}
                >
                  {s.earnedIn} · {s.year}
                </div>
              </div>
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 10,
                  right: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: isEarned ? s.color : "rgba(240,236,228,0.18)",
                  fontWeight: 700,
                }}
                suppressHydrationWarning
              >
                {isEarned ? "✓" : "○"}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
