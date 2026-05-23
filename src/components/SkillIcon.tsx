import skillsSheet from "@/assets/game/skills/skills-sheet.png";
import { SKILL_ICON_INDEX, SKILL_SHEET_COLS, SKILL_SHEET_ROWS } from "@/game/journey";
import { SKILLS, type SkillId } from "@/content/resume";

interface Props {
  id: SkillId;
  size?: number;
  earned?: boolean;
  className?: string;
}

export function SkillIcon({ id, size = 48, earned = true, className }: Props) {
  const idx = SKILL_ICON_INDEX[id];
  const col = idx % SKILL_SHEET_COLS;
  const row = Math.floor(idx / SKILL_SHEET_COLS);
  // background-size scales the whole sheet so each cell = `size`px.
  const sheetW = size * SKILL_SHEET_COLS;
  const sheetH = size * SKILL_SHEET_ROWS;
  return (
    <span
      role="img"
      aria-label={SKILLS[id].name}
      title={SKILLS[id].name}
      className={`inline-block shrink-0 ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${skillsSheet})`,
        backgroundSize: `${sheetW}px ${sheetH}px`,
        backgroundPosition: `-${col * size}px -${row * size}px`,
        imageRendering: "pixelated",
        opacity: earned ? 1 : 0.25,
        filter: earned ? "none" : "grayscale(1)",
        transition: "opacity 240ms ease, filter 240ms ease",
      }}
    />
  );
}
