import { useState } from "react";
import { SKILLS, type SkillId } from "@/content/resume";
import { useSkills } from "@/game/state";
import { SkillIcon } from "./SkillIcon";
import { SkillBag } from "./SkillBag";

export function SkillBelt() {
  const earned = useSkills();
  const [selected, setSelected] = useState<SkillId | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const all = Object.keys(SKILLS) as SkillId[];

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
        <div className="mx-auto max-w-3xl px-3 pb-3">
          <div
            className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 backdrop-blur-md"
            style={{
              background: "rgba(15,12,20,0.85)",
              border: "1px solid rgba(240,236,228,0.18)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              borderRadius: 4,
            }}
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#f0ece4]/70 hidden sm:inline">
              Bag
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto flex-1">
              {all.map((id) => {
                const isEarned = earned.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelected(id)}
                    title={SKILLS[id].name}
                    aria-label={SKILLS[id].name}
                    className="shrink-0 transition-transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-[#f0ece4]/40 rounded-sm"
                  >
                    <SkillIcon id={id} size={32} earned={isEarned} />
                  </button>
                );
              })}
            </div>
            <span className="font-mono text-[10px] tabular-nums text-[#f0ece4]/80">
              {earned.length}/{all.length}
            </span>
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 border border-[#f0ece4]/30 text-[#f0ece4]/85 hover:border-[#fbbf24] hover:text-[#fbbf24] transition"
            >
              Open
            </button>
          </div>
        </div>
      </div>

      {/* Popover */}
      {selected && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm p-5"
            style={{
              background: "rgba(15,12,20,0.95)",
              border: `1px solid ${SKILLS[selected].color}`,
              boxShadow: `0 0 0 3px rgba(15,12,20,0.95), 0 0 0 4px ${SKILLS[selected].color}55, 0 24px 60px rgba(0,0,0,0.7)`,
              borderRadius: 4,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <SkillIcon id={selected} size={48} earned={earned.includes(selected)} />
              <div className="flex-1">
                <div className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: SKILLS[selected].color }}>
                  {SKILLS[selected].family}
                </div>
                <h3 className="text-lg font-semibold text-[#f0ece4] mt-0.5">{SKILLS[selected].name}</h3>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f0ece4]/55 mt-0.5">
                  {SKILLS[selected].earnedIn} · {SKILLS[selected].year}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="font-mono text-sm text-[#f0ece4]/60 hover:text-[#f0ece4]">✕</button>
            </div>
            <p className="mt-4 text-[13px] leading-snug text-[#f0ece4]/85">
              {SKILLS[selected].howUsed}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#f0ece4]/50">
                {earned.includes(selected) ? "✓ Collected" : "○ Walk through the world to earn"}
              </span>
              <a
                href={`#${SKILLS[selected].earnedInId}`}
                onClick={() => setSelected(null)}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#fbbf24] hover:underline"
              >
                Visit world →
              </a>
            </div>
          </div>
        </div>
      )}

      <SkillBag open={bagOpen} onClose={() => setBagOpen(false)} onSelect={(id) => { setBagOpen(false); setSelected(id); }} />
    </>
  );
}
