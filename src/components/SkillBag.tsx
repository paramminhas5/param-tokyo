import { SKILLS, type SkillId } from "@/content/resume";
import { useSkills } from "@/game/state";
import { SkillIcon } from "./SkillIcon";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (id: SkillId) => void;
}

export function SkillBag({ open, onClose, onSelect }: Props) {
  const earned = useSkills();
  const all = Object.keys(SKILLS) as SkillId[];
  const grouped = all.reduce<Record<string, SkillId[]>>((acc, id) => {
    const f = SKILLS[id].family;
    (acc[f] ||= []).push(id);
    return acc;
  }, {});

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[75] grid place-items-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(15,12,20,0.96)",
          border: "1px solid rgba(240,236,228,0.25)",
          boxShadow: "0 0 0 3px rgba(15,12,20,0.96), 0 0 0 4px rgba(251,191,36,0.35), 0 24px 60px rgba(0,0,0,0.7)",
          borderRadius: 4,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#fbbf24]">Skill bag</div>
            <h2 className="text-xl font-semibold text-[#f0ece4]">{earned.length} of {all.length} earned</h2>
          </div>
          <button onClick={onClose} className="font-mono text-sm text-[#f0ece4]/60 hover:text-[#f0ece4]">✕</button>
        </div>

        {Object.entries(grouped).map(([family, ids]) => (
          <div key={family} className="mb-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#f0ece4]/55 mb-2">
              {family}
            </div>
            <ul className="space-y-1.5">
              {ids.map((id) => {
                const isEarned = earned.includes(id);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left border border-transparent hover:border-[#fbbf24] transition"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <SkillIcon id={id} size={28} earned={isEarned} />
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-[#f0ece4]">{SKILLS[id].name}</div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#f0ece4]/50">
                          {SKILLS[id].earnedIn} · {SKILLS[id].year}
                        </div>
                      </div>
                      <span className="font-mono text-[10px]" style={{ color: isEarned ? SKILLS[id].color : "#f0ece4", opacity: isEarned ? 1 : 0.4 }}>
                        {isEarned ? "✓" : "○"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
