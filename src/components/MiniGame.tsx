import { useEffect, useRef, useState, useCallback } from "react";
import type { MiniGameKind } from "@/content/resume";

interface MiniGameProps {
  kind: MiniGameKind;
  prompt: string;
  success: string;
  accent: string;
  onComplete: () => void;
  onDismiss: () => void;
}

// ── Timing mini-game ─────────────────────────────────────────────────────────
function TimingGame({ prompt, success, accent, onComplete, onDismiss }: Omit<MiniGameProps, "kind">) {
  const [barPos, setBarPos] = useState(0);   // 0–100
  const [hits, setHits] = useState(0);
  const [flash, setFlash] = useState<"hit" | "miss" | null>(null);
  const [done, setDone] = useState(false);
  const dirRef = useRef(1);
  const speedRef = useRef(52); // units per second
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const posRef = useRef(0);

  useEffect(() => {
    if (done) return;
    const tick = (t: number) => {
      const dt = Math.min((t - lastRef.current) / 1000, 0.05);
      lastRef.current = t;
      posRef.current += speedRef.current * dirRef.current * dt;
      if (posRef.current >= 100) { posRef.current = 100; dirRef.current = -1; }
      if (posRef.current <= 0) { posRef.current = 0; dirRef.current = 1; }
      setBarPos(posRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [done]);

  const handleStop = useCallback(() => {
    if (done) return;
    const GREEN_MIN = 38, GREEN_MAX = 62;
    if (posRef.current >= GREEN_MIN && posRef.current <= GREEN_MAX) {
      const newHits = hits + 1;
      setHits(newHits);
      setFlash("hit");
      speedRef.current += 12;
      if (newHits >= 2) {
        setDone(true);
        cancelAnimationFrame(rafRef.current);
        setTimeout(onComplete, 500);
      }
    } else {
      setFlash("miss");
      speedRef.current = Math.max(30, speedRef.current - 8);
    }
    setTimeout(() => setFlash(null), 300);
  }, [done, hits, onComplete]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleStop(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleStop]);

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,236,228,0.7)", marginBottom: 12 }}>
        {prompt}
      </p>
      <div style={{ fontFamily: "monospace", fontSize: 11, color: accent, marginBottom: 20, letterSpacing: "0.12em" }}>
        HIT {hits}/2
      </div>

      {/* Track */}
      <div
        onClick={handleStop}
        style={{
          position: "relative", height: 40, background: "rgba(0,0,0,0.5)",
          border: `2px solid ${accent}44`, cursor: "pointer", marginBottom: 16,
          userSelect: "none",
        }}
      >
        {/* Green zone */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "38%", width: "24%",
          background: `${accent}33`, borderLeft: `2px solid ${accent}`, borderRight: `2px solid ${accent}`,
        }} />
        {/* Moving bar */}
        <div style={{
          position: "absolute", top: 4, bottom: 4, width: 6,
          left: `${barPos}%`, transform: "translateX(-50%)",
          background: flash === "hit" ? "#4ade80" : flash === "miss" ? "#f87171" : "#f0ece4",
          transition: "background 150ms ease",
          boxShadow: `0 0 12px ${flash === "hit" ? "#4ade80" : flash === "miss" ? "#f87171" : accent}`,
        }} />
      </div>

      <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,236,228,0.45)" }}>
        CLICK TRACK · SPACE/ENTER TO STOP
      </p>
      {done && (
        <p style={{ marginTop: 12, fontFamily: "monospace", fontSize: 12, color: "#4ade80", letterSpacing: "0.15em" }}>
          ✓ {success}
        </p>
      )}
    </div>
  );
}

// ── Tap mini-game ────────────────────────────────────────────────────────────
interface Target { id: number; x: number; y: number; active: boolean; hit: boolean }

function TapGame({ prompt, success, accent, onComplete, onDismiss }: Omit<MiniGameProps, "kind">) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const nextId = useRef(0);
  const total = 5;

  const spawnNext = useCallback(() => {
    const id = nextId.current++;
    const t: Target = { id, x: 10 + Math.random() * 80, y: 10 + Math.random() * 70, active: true, hit: false };
    setTargets((prev) => [...prev.filter((x) => !x.active || x.hit), t]);

    // Auto-miss after 1.3s
    setTimeout(() => {
      setTargets((prev) => prev.map((x) => x.id === id ? { ...x, active: false } : x));
    }, 1300);
  }, []);

  useEffect(() => {
    // Spawn 5 targets with staggered delays
    for (let i = 0; i < total; i++) {
      setTimeout(() => spawnNext(), i * 900);
    }
  }, [spawnNext]);

  const hit = (id: number) => {
    setTargets((prev) => prev.map((t) => t.id === id ? { ...t, hit: true, active: false } : t));
    const newScore = score + 1;
    setScore(newScore);
    if (newScore >= 3) {
      setDone(true);
      setTimeout(onComplete, 600);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,236,228,0.7)", marginBottom: 8 }}>
        {prompt}
      </p>
      <div style={{ fontFamily: "monospace", fontSize: 11, color: accent, marginBottom: 12, letterSpacing: "0.12em" }}>
        {score}/{total} TARGETS
      </div>

      <div style={{ position: "relative", width: "100%", height: 180, background: "rgba(0,0,0,0.4)", border: `1px solid ${accent}33` }}>
        {targets.map((t) => t.active && (
          <button
            key={t.id}
            onClick={() => hit(t.id)}
            style={{
              position: "absolute",
              left: `${t.x}%`, top: `${t.y}%`,
              width: 36, height: 36,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `3px solid ${accent}`,
              background: `${accent}22`,
              cursor: "crosshair",
              animation: "tap-pulse 0.3s ease-out",
              boxShadow: `0 0 16px ${accent}88`,
            }}
          />
        ))}
        {targets.filter((t) => t.hit).map((t) => (
          <div key={`hit-${t.id}`} style={{
            position: "absolute", left: `${t.x}%`, top: `${t.y}%`,
            transform: "translate(-50%, -50%)",
            fontFamily: "monospace", fontSize: 11, color: "#4ade80",
            animation: "tap-score 0.5s ease-out forwards",
            pointerEvents: "none",
          }}>+HIT</div>
        ))}
      </div>

      {done && (
        <p style={{ marginTop: 12, fontFamily: "monospace", fontSize: 12, color: "#4ade80", letterSpacing: "0.15em" }}>
          ✓ {success}
        </p>
      )}

      <style>{`
        @keyframes tap-pulse { from { transform: translate(-50%,-50%) scale(1.6); opacity:0.5; } to { transform: translate(-50%,-50%) scale(1); opacity:1; } }
        @keyframes tap-score { 0% { opacity:1; transform: translate(-50%,-60%); } 100% { opacity:0; transform: translate(-50%,-120%); } }
      `}</style>
    </div>
  );
}

// ── Sort mini-game ────────────────────────────────────────────────────────────
interface Card { id: number; label: string; bucket: number; placed: boolean }

const SORT_SETS = [
  { cards: ["Code", "Design", "Ship"], buckets: ["Build", "Make", "Launch"] },
  { cards: ["Data", "Price", "Index"], buckets: ["Crawl", "Catalog", "Score"] },
  { cards: ["Lead", "Follow", "Close"], buckets: ["Scout", "Chase", "Win"] },
];

function SortGame({ prompt, success, accent, onComplete }: Omit<MiniGameProps, "kind">) {
  const [set] = useState(() => SORT_SETS[Math.floor(Math.random() * SORT_SETS.length)]);
  const [cards, setCards] = useState<Card[]>(() =>
    set.cards.map((label, i) => ({ id: i, label, bucket: i, placed: false }))
  );
  const [dragging, setDragging] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const drop = (bucketIdx: number) => {
    if (dragging === null) return;
    const card = cards.find((c) => c.id === dragging);
    if (!card) return;
    const correct = card.bucket === bucketIdx;
    if (correct) {
      const newCards = cards.map((c) => c.id === dragging ? { ...c, placed: true } : c);
      setCards(newCards);
      if (newCards.every((c) => c.placed)) {
        setDone(true);
        setTimeout(onComplete, 600);
      }
    }
    setDragging(null);
  };

  const unplaced = cards.filter((c) => !c.placed);

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,236,228,0.7)", marginBottom: 16 }}>
        {prompt}
      </p>

      {/* Draggable cards */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24, minHeight: 44 }}>
        {unplaced.map((card) => (
          <div
            key={card.id}
            draggable
            onDragStart={() => setDragging(card.id)}
            onDragEnd={() => setDragging(null)}
            style={{
              padding: "8px 14px",
              border: `2px solid ${accent}`,
              background: dragging === card.id ? `${accent}44` : `${accent}22`,
              fontFamily: "monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#f0ece4", cursor: "grab",
              transition: "background 150ms ease",
              userSelect: "none",
            }}
          >
            {card.label}
          </div>
        ))}
      </div>

      {/* Drop buckets */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {set.buckets.map((label, i) => {
          const placed = cards.find((c) => c.placed && c.bucket === i);
          return (
            <div
              key={i}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(i)}
              style={{
                width: 90, height: 60,
                border: `2px dashed ${placed ? "#4ade80" : accent}66`,
                background: placed ? "#4ade8022" : "rgba(0,0,0,0.3)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                transition: "all 200ms ease",
              }}
            >
              <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: placed ? "#4ade80" : "rgba(240,236,228,0.5)" }}>
                {label}
              </span>
              {placed && <span style={{ fontFamily: "monospace", fontSize: 10, color: "#4ade80" }}>{placed.label}</span>}
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 10, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,236,228,0.4)" }}>
        DRAG CARD TO MATCHING BUCKET
      </p>

      {done && (
        <p style={{ marginTop: 12, fontFamily: "monospace", fontSize: 12, color: "#4ade80", letterSpacing: "0.15em" }}>
          ✓ {success}
        </p>
      )}
    </div>
  );
}

// ── Main MiniGame overlay ─────────────────────────────────────────────────────
export function MiniGame({ kind, prompt, success, accent, onComplete, onDismiss }: MiniGameProps) {
  const [visible, setVisible] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 350);
    }, 900);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(5,4,12,0.82)",
        backdropFilter: "blur(4px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(420px, 92vw)",
          background: "rgba(10,10,20,0.96)",
          border: `2px solid ${accent}`,
          padding: "24px 20px",
          boxShadow: `0 0 0 4px rgba(10,10,20,0.96), 0 0 40px ${accent}44, 0 24px 60px rgba(0,0,0,0.8)`,
          transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          transition: "transform 300ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: accent }}>
              ▶ MINI GAME
            </span>
          </div>
          {!completed && (
            <button
              onClick={() => { setVisible(false); setTimeout(onDismiss, 350); }}
              style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", color: "rgba(240,236,228,0.4)", cursor: "pointer", background: "none", border: "none" }}
            >
              SKIP ✕
            </button>
          )}
        </div>

        {/* Game content */}
        {kind === "timing" && <TimingGame prompt={prompt} success={success} accent={accent} onComplete={handleComplete} onDismiss={onDismiss} />}
        {kind === "tap"    && <TapGame    prompt={prompt} success={success} accent={accent} onComplete={handleComplete} onDismiss={onDismiss} />}
        {kind === "sort"   && <SortGame   prompt={prompt} success={success} accent={accent} onComplete={handleComplete} onDismiss={onDismiss} />}

        {/* Corner pixel decoration */}
        <div style={{ position: "absolute", top: 4, left: 4, width: 8, height: 8, background: accent, opacity: 0.6 }} />
        <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: accent, opacity: 0.6 }} />
        <div style={{ position: "absolute", bottom: 4, left: 4, width: 8, height: 8, background: accent, opacity: 0.6 }} />
        <div style={{ position: "absolute", bottom: 4, right: 4, width: 8, height: 8, background: accent, opacity: 0.6 }} />
      </div>
    </div>
  );
}
