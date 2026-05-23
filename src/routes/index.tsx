import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { GameCanvas } from "@/components/GameCanvas";
import { GameHud } from "@/components/GameHud";
import { HirePanel } from "@/components/HirePanel";
import type { GameNpc } from "@/game/engine";
import { ALL_LEVELS } from "@/game/levels";
import { HERO } from "@/content/resume";
import { sfx } from "@/game/audio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Param Minhas — Play the Résumé" },
      { name: "description", content: `${HERO.name} — ${HERO.tagline}` },
      { property: "og:title", content: "Param Minhas — Playable Résumé" },
      { property: "og:description", content: "15 years of building. Keyboard to play." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

interface CollectedSkill { id: string; label: string; color: string; }

function Index() {
  const [muted, setMuted] = useState(false);
  const [skills, setSkills] = useState<CollectedSkill[]>([]);
  const [latestSkill, setLatestSkill] = useState<CollectedSkill | null>(null);
  const [activeNpc, setActiveNpc] = useState<GameNpc | null>(null);
  const [worldName, setWorldName] = useState(ALL_LEVELS[0].name);
  const [worldYear, setWorldYear] = useState(ALL_LEVELS[0].year);
  const [hireOpen, setHireOpen] = useState(false);

  const handleSkillCollected = useCallback((skillId: string, label: string, color: string) => {
    const s = { id: skillId, label, color };
    setSkills(prev => prev.find(x => x.id === skillId) ? prev : [...prev, s]);
    setLatestSkill(s);
    setTimeout(() => setLatestSkill(null), 3200);
    sfx.pickup();
  }, []);

  const handleNpcTalk = useCallback((npc: GameNpc) => {
    setActiveNpc(npc);
    sfx.open();
  }, []);

  const handleDialogueClose = useCallback(() => {
    setActiveNpc(null);
  }, []);

  const handleWorldChange = useCallback((id: string, name: string, year: string) => {
    setWorldName(name);
    setWorldYear(year);
  }, []);

  const handleMuteToggle = useCallback(() => {
    setMuted(m => {
      sfx.toggleMute();
      return !m;
    });
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#050310" }}>
      <GameHud
        worldName={worldName}
        worldYear={worldYear}
        skills={skills}
        totalSkills={ALL_LEVELS.length}
        muted={muted}
        onMuteToggle={handleMuteToggle}
        activeNpc={activeNpc}
        onDialogueClose={handleDialogueClose}
        onHire={() => { sfx.open(); setHireOpen(true); }}
        latestSkill={latestSkill}
      />
      <GameCanvas
        onSkillCollected={handleSkillCollected}
        onNpcTalk={handleNpcTalk}
        onWorldChange={handleWorldChange}
        muted={muted}
      />
      <HirePanel open={hireOpen} onClose={() => setHireOpen(false)} />
    </div>
  );
}
