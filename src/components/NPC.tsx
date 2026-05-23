import type { NpcKind } from "@/content/resume";

interface Props {
  kind: NpcKind;
  label?: string;
  accent: string;
  ink?: string;
  size?: number;
}

/**
 * SVG silhouette NPC — riso-style. Tinted with the world's accent.
 * A tiny breathing animation gives them life without sprite frames.
 */
export function NPC({ kind, label, accent, ink = "#0e0820", size = 110 }: Props) {
  const body = SHAPES[kind] ?? SHAPES.fan;
  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{
        width: size,
        height: size * 1.4,
        filter: `drop-shadow(0 10px 14px rgba(0,0,0,0.5))`,
      }}
      aria-hidden
    >
      <div className="npc-breathe relative w-full h-full">
        <svg viewBox="0 0 100 140" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
          <g fill={ink} stroke={accent} strokeWidth="1.5">
            {body}
          </g>
          {/* Rim light */}
          <g fill="none" stroke={accent} strokeOpacity="0.55" strokeWidth="1">
            {body}
          </g>
        </svg>
        {label && (
          <div
            className="absolute left-1/2 -top-5 -translate-x-1/2 px-2 py-0.5 rounded font-mono whitespace-nowrap"
            style={{
              fontSize: 9,
              background: "rgba(15,12,20,0.85)",
              color: accent,
              border: `1px solid ${accent}`,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </div>
        )}
      </div>
      <style>{`
        .npc-breathe { animation: npc-breathe 3s ease-in-out infinite; transform-origin: center bottom; }
        @keyframes npc-breathe { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.02); } }
      `}</style>
    </div>
  );
}

// All silhouettes share a humanoid base, tweaked per role
const HUMAN = (
  <>
    <circle cx="50" cy="22" r="12" />
    <rect x="38" y="34" width="24" height="48" rx="6" />
    <rect x="34" y="82" width="12" height="42" rx="4" />
    <rect x="54" y="82" width="12" height="42" rx="4" />
  </>
);

const SHAPES: Record<NpcKind, React.ReactNode> = {
  founder: (
    <>
      {HUMAN}
      <rect x="30" y="38" width="40" height="14" rx="2" /> {/* shoulders / jacket */}
    </>
  ),
  dev: (
    <>
      {HUMAN}
      <rect x="38" y="58" width="24" height="14" rx="2" /> {/* laptop */}
    </>
  ),
  dancer: (
    <>
      <circle cx="50" cy="22" r="12" />
      <path d="M38 34 L62 34 L70 70 L55 82 L60 124 L50 124 L45 82 L30 70 Z" />
    </>
  ),
  trader: (
    <>
      {HUMAN}
      <rect x="40" y="50" width="20" height="22" rx="1" /> {/* monitor */}
    </>
  ),
  fan: (
    <>
      {HUMAN}
      <path d="M40 50 L46 40 L54 40 L60 50 Z" /> {/* cap */}
    </>
  ),
  investor: (
    <>
      {HUMAN}
      <rect x="44" y="60" width="12" height="18" /> {/* briefcase */}
    </>
  ),
  cat: (
    <>
      <path d="M30 80 Q30 50 50 50 Q70 50 70 80 L70 110 L30 110 Z" />
      <path d="M30 55 L36 38 L44 55 Z" /> {/* ear */}
      <path d="M70 55 L64 38 L56 55 Z" /> {/* ear */}
      <circle cx="42" cy="72" r="2" fill={undefined as any} />
      <circle cx="58" cy="72" r="2" />
      <path d="M70 90 Q92 70 84 56" fill="none" strokeWidth="3" />
    </>
  ),
  dog: (
    <>
      <path d="M28 80 Q28 55 50 55 Q72 55 72 80 L72 110 L28 110 Z" />
      <path d="M28 60 L24 42 L38 52 Z" />
      <path d="M72 60 L76 42 L62 52 Z" />
    </>
  ),
  rider: (
    <>
      {HUMAN}
      <circle cx="32" cy="118" r="8" />
      <circle cx="68" cy="118" r="8" />
      <rect x="32" y="110" width="36" height="6" />
    </>
  ),
};
