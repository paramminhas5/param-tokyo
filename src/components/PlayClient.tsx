"use client";

import { useState, useCallback } from "react";
import { CHAPTERS } from "@/content/resume";
import { JourneyIntro } from "./JourneyIntro";
import { JourneyOutro } from "./JourneyOutro";
import { JourneyNav } from "./JourneyNav";
import { WorldScene } from "./WorldScene";
import { SkillBar } from "./SkillHud";

interface Skill {
  name: string;
  color: string;
  family: string;
}

/**
 * Client wrapper for the Play page — manages skill state across worlds.
 */
export function PlayClient() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  const handleSkillEarned = useCallback((skill: Skill) => {
    setSkills((prev) => {
      if (prev.some((s) => s.name === skill.name)) return prev;
      return [...prev, skill];
    });
    setFlash(skill.color);
    setTimeout(() => setFlash(null), 800);
  }, []);

  return (
    <main style={{ position: "relative", background: "#050310" }}>
      <JourneyNav />
      <JourneyIntro />
      {CHAPTERS.map((chapter) => (
        <WorldScene
          key={chapter.id}
          chapter={chapter}
          onSkillEarned={handleSkillEarned}
        />
      ))}
      <JourneyOutro />
      <SkillBar skills={skills} flash={flash} />
    </main>
  );
}
