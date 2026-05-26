"use client";

import { useState, useCallback } from "react";
import type { Chapter } from "@/content/resume";

interface Skill {
  name: string;
  color: string;
  family: string;
}

/**
 * Persistent skill HUD — accumulates skills as you progress through worlds.
 * Sticks to the bottom of the viewport like a game inventory bar.
 */
export function SkillHud() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  const addSkill = useCallback((skill: Skill) => {
    setSkills((prev) => {
      if (prev.some((s) => s.name === skill.name)) return prev;
      return [...prev, skill];
    });
    setFlash(skill.color);
    setTimeout(() => setFlash(null), 800);
  }, []);

  return { skills, addSkill, flash, SkillBar };
}

/**
 * The visual skill bar component.
 */
export function SkillBar({ skills, flash }: { skills: Array<{ name: string; color: string; family: string }>; flash: string | null }) {
  if (skills.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "10px 20px",
        background: "rgba(5, 3, 16, 0.85)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${flash ?? "rgba(240, 236, 228, 0.08)"}`,
        transition: "border-color 500ms ease",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: flash ? `0 -4px 20px ${flash}33` : "none",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(240, 236, 228, 0.35)",
          flexShrink: 0,
        }}
      >
        Skills
      </span>

      {/* Skill badges */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {skills.map((skill, i) => (
          <div
            key={skill.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              background: `${skill.color}12`,
              border: `1px solid ${skill.color}44`,
              animation: i === skills.length - 1 ? "skill-pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: skill.color,
                boxShadow: `0 0 6px ${skill.color}`,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: skill.color,
                letterSpacing: "0.05em",
              }}
            >
              {skill.name}
            </span>
          </div>
        ))}
      </div>

      {/* Count */}
      <span
        style={{
          marginLeft: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "rgba(240, 236, 228, 0.5)",
          flexShrink: 0,
        }}
      >
        {skills.length}/9
      </span>

      <style>{`
        @keyframes skill-pop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
