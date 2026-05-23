import type { Chapter } from "@/content/resume";
import { SkillIcon } from "./SkillIcon";
import { useSkills } from "@/game/state";

interface Props {
  chapter: Chapter;
  accent: string;
  visible: boolean;
}

/**
 * Single corner card per world — replaces all the floating dialogs.
 * Pinned top-left on desktop, top-center on mobile. Never blocks the playfield.
 */
export function CliffNoteCard({ chapter, accent, visible }: Props) {
  const skills = useSkills();
  return (
    <div
      className={`absolute z-40 top-20 sm:top-24 left-1/2 sm:left-6 -translate-x-1/2 sm:translate-x-0 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}
      style={{ maxWidth: "min(360px, 92vw)" }}
    >
      <div
        className="cliff-card relative px-4 py-3 sm:px-5 sm:py-4"
        style={{
          background: "rgba(15,12,20,0.88)",
          border: `1px solid ${accent}`,
          boxShadow: `0 12px 32px rgba(0,0,0,0.5), 0 0 0 3px rgba(15,12,20,0.88), 0 0 0 4px ${accent}44`,
          backdropFilter: "blur(6px)",
          imageRendering: "pixelated",
        }}
      >
        {/* Pixel corner notches */}
        <span className="cliff-corner" style={{ top: -3, left: -3, background: accent }} />
        <span className="cliff-corner" style={{ top: -3, right: -3, background: accent }} />
        <span className="cliff-corner" style={{ bottom: -3, left: -3, background: accent }} />
        <span className="cliff-corner" style={{ bottom: -3, right: -3, background: accent }} />

        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: accent }}>
            World {String(chapter.index).padStart(2, "0")} · {chapter.year}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#f0ece4]/55">
            {chapter.role}
          </span>
        </div>
        <h2
          className="mt-1 text-lg sm:text-xl font-semibold leading-tight"
          style={{ color: "#f0ece4", fontFamily: "var(--font-display)" }}
        >
          {chapter.org}
        </h2>
        <p className="mt-1.5 text-[12px] sm:text-[13px] leading-snug text-[#f0ece4]/80">
          {chapter.cliff}
        </p>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#f0ece4]/50">
            Earn
          </span>
          {chapter.pickups.map((s) => (
            <SkillIcon key={s} id={s} size={18} earned={skills.includes(s)} />
          ))}
        </div>
      </div>
      <style>{`
        .cliff-corner { position: absolute; width: 6px; height: 6px; }
      `}</style>
    </div>
  );
}
