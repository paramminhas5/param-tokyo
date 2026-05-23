import { Link } from "@tanstack/react-router";
import type { GameNpc } from "@/game/engine";

interface CollectedSkill { id: string; label: string; color: string; }

interface HudProps {
  worldName: string;
  worldYear: string;
  skills: CollectedSkill[];
  totalSkills: number;
  muted: boolean;
  onMuteToggle: () => void;
  activeNpc: GameNpc | null;
  onDialogueClose: () => void;
  onHire: () => void;
  latestSkill: CollectedSkill | null;
}

export function GameHud({
  worldName, worldYear, skills, totalSkills,
  muted, onMuteToggle, activeNpc, onDialogueClose, onHire, latestSkill,
}: HudProps) {

  const MONO: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  };

  return (
    <>
      {/* Top HUD bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 48, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 20px",
        background: "rgba(5,3,16,0.92)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
      }}>
        {/* Left: logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 3 }}>
            <span style={{ width: 7, height: 7, background: "#fbbf24", display: "block" }}/>
            <span style={{ width: 7, height: 7, background: "#ec4899", display: "block", marginTop: 2 }}/>
          </div>
          <span style={{ ...MONO, fontSize: 10, color: "#f0ece4", fontWeight: 700 }}>
            Param Minhas
          </span>
        </div>

        {/* Center: world name */}
        <div style={{ textAlign: "center" }}>
          <div style={{ ...MONO, fontSize: 9, color: "rgba(240,236,228,0.45)" }}>{worldYear}</div>
          <div style={{ ...MONO, fontSize: 10, color: "#f0ece4", marginTop: 1 }}>{worldName}</div>
        </div>

        {/* Right: nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            ...MONO, fontSize: 9,
            padding: "4px 10px",
            border: `1px solid ${skills.length > 0 ? "#fbbf2455" : "rgba(255,255,255,0.1)"}`,
            color: skills.length > 0 ? "#fbbf24" : "rgba(240,236,228,0.4)",
            background: skills.length > 0 ? "rgba(251,191,36,0.06)" : "transparent",
            transition: "all 300ms",
          }}>
            ★ {skills.length}/{totalSkills}
          </div>
          <Link to="/cv" style={{ ...MONO, fontSize: 9, padding: "4px 10px", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(240,236,228,0.7)", textDecoration: "none" }}>
            CV
          </Link>
          <button onClick={onHire} style={{ ...MONO, fontSize: 9, padding: "5px 14px", background: "#fbbf24", color: "#050310", border: "none", cursor: "pointer", fontWeight: 700 }}>
            HIRE
          </button>
          <button onClick={onMuteToggle} style={{ ...MONO, fontSize: 9, padding: "4px 8px", color: muted ? "rgba(240,236,228,0.25)" : "rgba(240,236,228,0.6)", background: "none", border: "none", cursor: "pointer" }}>
            {muted ? "♪✕" : "♪"}
          </button>
        </div>
      </div>

      {/* Bottom HUD bar - controls hint */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        height: 40, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 20px",
        background: "rgba(5,3,16,0.88)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ ...MONO, fontSize: 8, color: "rgba(240,236,228,0.3)" }}>
          ← → MOVE &nbsp;·&nbsp; SPACE JUMP &nbsp;·&nbsp; E TALK
        </div>
        {/* Skill inventory pills */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {skills.map(s => (
            <div key={s.id} style={{
              ...MONO, fontSize: 7, padding: "2px 7px",
              background: `${s.color}22`,
              border: `1px solid ${s.color}66`,
              color: s.color,
            }}>
              {s.label}
            </div>
          ))}
        </div>
        <div style={{ ...MONO, fontSize: 8, color: "rgba(240,236,228,0.25)" }}>
          PARAM TOKYO
        </div>
      </div>

      {/* NPC Dialogue box */}
      {activeNpc && (
        <div
          style={{
            position: "fixed",
            bottom: 48, left: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
            width: "min(520px, 90vw)",
            background: "rgba(5,3,16,0.97)",
            border: `2px solid ${/* use a default accent */ "#fbbf24"}`,
            padding: "20px 24px",
            boxShadow: "0 0 0 4px rgba(5,3,16,0.97), 0 0 40px rgba(251,191,36,0.25), 0 -24px 60px rgba(0,0,0,0.9)",
            animation: "dialogue-in 250ms cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Corner pixels */}
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
            <div key={v+h} style={{ position: "absolute", [v]: 4, [h]: 4, width: 6, height: 6, background: "#fbbf24", opacity: 0.7 }}/>
          ))}

          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* NPC identifier */}
            <div style={{ flexShrink: 0, width: 44, height: 44, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20 }}>
                {{ founder: "👔", dev: "💻", dancer: "🎵", trader: "👟", fan: "🌟", investor: "💰", cat: "🐱", dog: "🐶", rider: "🏍" }[activeNpc.kind] ?? "👤"}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...MONO, fontSize: 9, color: "#fbbf24", marginBottom: 4 }}>
                {activeNpc.name}
              </div>
              <div style={{ ...MONO, fontSize: 8, color: "rgba(240,236,228,0.4)", marginBottom: 10 }}>
                {activeNpc.title}
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, lineHeight: 1.7, color: "rgba(240,236,228,0.9)" }}>
                "{activeNpc.line}"
              </p>
            </div>
          </div>

          <button
            onClick={onDialogueClose}
            style={{
              position: "absolute", top: 12, right: 14,
              ...MONO, fontSize: 8, color: "rgba(240,236,228,0.35)",
              background: "none", border: "none", cursor: "pointer",
            }}
          >
            CLOSE [E]
          </button>
          <div style={{ ...MONO, fontSize: 7, color: "rgba(240,236,228,0.25)", marginTop: 12 }}>
            PRESS E TO DISMISS
          </div>
        </div>
      )}

      {/* Skill collected popup */}
      {latestSkill && (
        <div
          key={latestSkill.id}
          style={{
            position: "fixed",
            top: 60, right: 20,
            zIndex: 150,
            padding: "12px 18px",
            background: "rgba(5,3,16,0.96)",
            border: `2px solid ${latestSkill.color}`,
            boxShadow: `0 0 24px ${latestSkill.color}44`,
            animation: "skill-pop 3s ease forwards",
            pointerEvents: "none",
          }}
        >
          <div style={{ ...MONO, fontSize: 8, color: latestSkill.color, marginBottom: 4 }}>
            ★ SKILL UNLOCKED
          </div>
          <div style={{ ...MONO, fontSize: 11, color: "#f0ece4" }}>
            {latestSkill.label}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dialogue-in {
          from { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)  scale(1); }
        }
        @keyframes skill-pop {
          0%   { opacity: 0; transform: translateY(-6px); }
          12%  { opacity: 1; transform: translateY(0); }
          75%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
