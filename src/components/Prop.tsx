import type { PropKind } from "@/content/resume";

interface Props {
  kind: PropKind;
  accent: string;
  ink?: string;
  size?: number;
}

/** Foreground prop rendered as an SVG silhouette tinted with the world's accent. */
export function Prop({ kind, accent, ink = "#0e0820", size = 90 }: Props) {
  const shape = SHAPES[kind] ?? SHAPES.house;
  return (
    <div
      className="absolute pointer-events-none z-10"
      style={{
        width: size,
        height: size * 1.3,
        filter: `drop-shadow(0 10px 14px rgba(0,0,0,0.55))`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 100 130" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
        <g fill={ink} stroke={accent} strokeWidth="2">
          {shape}
        </g>
      </svg>
    </div>
  );
}

const SHAPES: Record<PropKind, React.ReactNode> = {
  tree:     <><rect x="46" y="60" width="8" height="60" /><circle cx="50" cy="50" r="28" /></>,
  house:    <><polygon points="20,60 50,30 80,60 80,120 20,120" /><rect x="42" y="82" width="16" height="38" fill={undefined as any} /></>,
  antenna:  <><rect x="46" y="20" width="8" height="100" /><polygon points="30,20 70,20 50,4" /><circle cx="50" cy="10" r="3" /></>,
  building: <><rect x="22" y="20" width="56" height="100" /><rect x="32" y="34" width="8" height="8" fill={accentDot()} /><rect x="48" y="34" width="8" height="8" fill={accentDot()} /><rect x="64" y="34" width="8" height="8" fill={accentDot()} /><rect x="32" y="54" width="8" height="8" fill={accentDot()} /><rect x="48" y="54" width="8" height="8" fill={accentDot()} /></>,
  rack:     <><rect x="24" y="14" width="52" height="106" /><rect x="30" y="22" width="40" height="6" fill={accentDot()} /><rect x="30" y="34" width="40" height="6" fill={accentDot()} /><rect x="30" y="46" width="40" height="6" fill={accentDot()} /><rect x="30" y="58" width="40" height="6" fill={accentDot()} /><rect x="30" y="70" width="40" height="6" fill={accentDot()} /></>,
  vault:    <><rect x="18" y="30" width="64" height="90" /><circle cx="50" cy="74" r="20" fill="none" /><circle cx="50" cy="74" r="8" /></>,
  shoe:     <><path d="M10 110 Q10 70 40 70 L70 70 Q92 70 92 100 L92 120 L10 120 Z" /><circle cx="70" cy="86" r="6" fill={accentDot()} /></>,
  mic:      <><rect x="46" y="44" width="8" height="60" /><ellipse cx="50" cy="34" rx="14" ry="20" /><rect x="40" y="106" width="20" height="6" /></>,
  ladder:   <><rect x="34" y="10" width="6" height="110" /><rect x="60" y="10" width="6" height="110" /><rect x="34" y="28" width="32" height="4" /><rect x="34" y="50" width="32" height="4" /><rect x="34" y="72" width="32" height="4" /><rect x="34" y="94" width="32" height="4" /></>,
  platform: <><rect x="10" y="80" width="80" height="14" /><rect x="14" y="94" width="6" height="26" /><rect x="80" y="94" width="6" height="26" /></>,
  sign:     <><rect x="46" y="60" width="8" height="60" /><rect x="14" y="34" width="72" height="30" /><rect x="20" y="42" width="60" height="4" fill={accentDot()} /><rect x="20" y="52" width="40" height="4" fill={accentDot()} /></>,
  crate:    <><rect x="20" y="50" width="60" height="70" /><line x1="20" y1="85" x2="80" y2="85" stroke="currentColor" /><line x1="50" y1="50" x2="50" y2="120" stroke="currentColor" /></>,
};

function accentDot() { return "var(--world-accent, #fbbf24)"; }
