import type { SkillId } from "@/content/resume";
import { SkillIcon } from "./SkillIcon";

interface Props {
  id: SkillId;
  x: number;            // 0–100 % across the world
  y?: number;           // bottom offset %
  collected: boolean;
  accent: string;
}

/** Floating skill orb the hero "collects" by walking past it. */
export function SkillPickup({ id, x, y = 28, collected, accent }: Props) {
  return (
    <div
      aria-hidden
      className="absolute z-20 pointer-events-none"
      style={{
        left: `${x}%`,
        bottom: `${y}%`,
        transform: "translateX(-50%)",
      }}
    >
      <div
        className={`relative skill-orb ${collected ? "collected" : ""}`}
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          background: `radial-gradient(circle at 35% 30%, ${accent} 0%, ${accent}aa 40%, transparent 75%)`,
          boxShadow: `0 0 24px ${accent}88, inset 0 0 12px ${accent}66`,
        }}
      >
        <div className="absolute inset-0 grid place-items-center">
          <SkillIcon id={id} size={28} earned />
        </div>
      </div>
      <style>{`
        .skill-orb { animation: orb-float 2.6s ease-in-out infinite; }
        @keyframes orb-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-10px); }
        }
        .skill-orb.collected {
          animation: orb-pop 600ms ease-out forwards;
        }
        @keyframes orb-pop {
          0%   { transform: scale(1); opacity: 1; }
          50%  { transform: scale(1.6); opacity: 1; }
          100% { transform: scale(0) translateY(-40px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
