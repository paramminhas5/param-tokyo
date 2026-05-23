import { useEffect, useState } from "react";
import { SKILLS, type SkillId } from "@/content/resume";
import { useSkills } from "@/game/state";
import { SkillIcon } from "./SkillIcon";
import { SkillBag } from "./SkillBag";

/**
 * Bottom skill belt. Only renders earned skills — empty until the player
 * walks past their first pickup. Click any earned icon for details.
 *
 * Gated on `mounted` to avoid SSR/client hydration mismatches from
 * localStorage-backed `useSkills`.
 */
export function SkillBelt() {
  const earned = useSkills();
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<SkillId | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const all = Object.keys(SKILLS) as SkillId[];

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 0, right: 0, bottom: 0,
          zIndex: 40,
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          padding: "0 12px 12px",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            background: "rgba(10,10,20,0.88)",
            border: "2px solid rgba(240,236,228,0.2)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.5), 0 0 0 3px rgba(10,10,20,0.88)",
            maxWidth: "min(720px, 96vw)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,236,228,0.7)", whiteSpace: "nowrap" }}>
            Bag
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", flex: 1 }}>
            {earned.length === 0 ? (
              <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(240,236,228,0.45)", letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Empty — walk to collect skills
              </span>
            ) : (
              earned.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelected(id)}
                  title={SKILLS[id].name}
                  aria-label={SKILLS[id].name}
                  style={{ flexShrink: 0, padding: 0, border: "none", background: "transparent", cursor: "pointer" }}
                >
                  <SkillIcon id={id} size={32} earned />
                </button>
              ))
            )}
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(240,236,228,0.8)", fontVariantNumeric: "tabular-nums" }}>
            {earned.length}/{all.length}
          </span>
          <button
            type="button"
            onClick={() => setBagOpen(true)}
            style={{
              fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "4px 10px", border: "1px solid rgba(240,236,228,0.3)",
              color: "rgba(240,236,228,0.9)", background: "transparent", cursor: "pointer",
            }}
          >
            Open
          </button>
        </div>
      </div>

      {/* Popover */}
      {selected && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 70, display: "grid", placeItems: "center", padding: 16 }}
          onClick={() => setSelected(null)}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} />
          <div
            style={{
              position: "relative", width: "100%", maxWidth: 400, padding: 20,
              background: "rgba(10,10,20,0.95)",
              border: `2px solid ${SKILLS[selected].color}`,
              boxShadow: `0 0 0 3px rgba(10,10,20,0.95), 0 0 0 4px ${SKILLS[selected].color}55, 0 24px 60px rgba(0,0,0,0.7)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <SkillIcon id={selected} size={48} earned />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: SKILLS[selected].color }}>
                  {SKILLS[selected].family}
                </div>
                <h3 style={{ marginTop: 2, fontSize: 18, fontWeight: 600, color: "#f0ece4" }}>{SKILLS[selected].name}</h3>
                <div style={{ marginTop: 2, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,236,228,0.55)" }}>
                  {SKILLS[selected].earnedIn} · {SKILLS[selected].year}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", fontSize: 16, color: "rgba(240,236,228,0.6)", cursor: "pointer" }}>✕</button>
            </div>
            <p style={{ marginTop: 16, fontSize: 13, lineHeight: 1.5, color: "rgba(240,236,228,0.85)" }}>
              {SKILLS[selected].howUsed}
            </p>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,236,228,0.5)" }}>
                ✓ Collected
              </span>
              <a
                href={`#${SKILLS[selected].earnedInId}`}
                onClick={() => setSelected(null)}
                style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fbbf24", textDecoration: "none" }}
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
