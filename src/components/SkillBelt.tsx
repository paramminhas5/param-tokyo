import { SKILLS, type SkillId } from "@/content/resume";
import { useSkills } from "@/game/state";
import { SkillIcon } from "./SkillIcon";

export function SkillBelt() {
  const earned = useSkills();
  const all = Object.keys(SKILLS) as SkillId[];
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      <div className="mx-auto max-w-3xl px-3 pb-3">
        <div
          className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md"
          style={{
            background: "rgba(20,18,28,0.7)",
            borderColor: "rgba(240,236,228,0.18)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
          }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#f0ece4]/70 hidden sm:inline">
            Skills
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
            {all.map((id) => (
              <SkillIcon key={id} id={id} size={32} earned={earned.includes(id)} />
            ))}
          </div>
          <span className="font-mono text-[10px] tabular-nums text-[#f0ece4]/80 ml-auto">
            {earned.length}/{all.length}
          </span>
        </div>
      </div>
    </div>
  );
}
