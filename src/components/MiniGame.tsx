import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/content/resume";
import { sfx } from "@/game/audio";

interface Props {
  chapter: Chapter;
  onClose: () => void;
  onWin: () => void;
}

export function MiniGame({ chapter, onClose, onWin }: Props) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--pm-deep-2)]/85 p-4"
      onClick={onClose}
    >
      <div
        className="pixel-box w-full max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="font-pixel text-[10px] text-[var(--pm-gold)]">
              {chapter.org} · MINI-GAME
            </div>
            <p className="text-sm text-white/85 mt-2">{chapter.mini.prompt}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-pixel text-[9px] text-white/70 hover:text-white"
            aria-label="Close mini-game"
          >
            ✕
          </button>
        </div>
        {chapter.mini.kind === "tap"   && <TapGame chapter={chapter} onWin={() => { sfx.pickup(); onWin(); }} />}
        {chapter.mini.kind === "timing" && <TimingGame chapter={chapter} onWin={() => { sfx.pickup(); onWin(); }} />}
        {chapter.mini.kind === "sort"  && <SortGame   chapter={chapter} onWin={() => { sfx.pickup(); onWin(); }} />}

        <div className="mt-4 flex items-center justify-between gap-2">
          <button onClick={onClose} className="font-pixel text-[9px] text-white/60 hover:text-white">SKIP</button>
          <div className="font-pixel text-[8px] text-white/40">TAP · CLICK · SPACE</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- TAP: drop-day style. Tap N moving targets in time. ---------- */
function TapGame({ chapter, onWin }: { chapter: Chapter; onWin: () => void }) {
  const NEED = 5;
  const [hits, setHits] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setPos({ x: 10 + Math.random() * 75, y: 10 + Math.random() * 65 });
    }, 700);
    return () => clearInterval(id);
  }, [done]);

  const tap = () => {
    if (done) return;
    const next = hits + 1;
    setHits(next);
    if (next >= NEED) { setDone(true); setTimeout(onWin, 400); }
  };

  return (
    <div className="relative h-44 bg-[var(--pm-deep-2)] border border-[var(--pm-magenta)] overflow-hidden">
      {!done && (
        <button
          type="button"
          onClick={tap}
          className="absolute w-10 h-10 transition-all duration-300 ease-out"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: chapter.theme.accent }}
          aria-label="Tap target"
        >
          <span className="font-pixel text-[10px] text-black">!</span>
        </button>
      )}
      {done && (
        <div className="absolute inset-0 flex items-center justify-center font-pixel text-[10px] text-[var(--pm-gold)]">
          {chapter.mini.success}
        </div>
      )}
      <div className="absolute bottom-1 left-2 font-pixel text-[8px] text-white/70">
        {hits}/{NEED}
      </div>
    </div>
  );
}

/* ---------- TIMING: stop the meter in the green zone twice. ---------- */
function TimingGame({ chapter, onWin }: { chapter: Chapter; onWin: () => void }) {
  const NEED = 2;
  const [pos, setPos] = useState(0);
  const [hits, setHits] = useState(0);
  const [last, setLast] = useState<"hit" | "miss" | null>(null);
  const [done, setDone] = useState(false);
  const dir = useRef(1);
  const runRef = useRef(true);

  useEffect(() => {
    runRef.current = !done;
    let raf = 0;
    const tick = () => {
      if (!runRef.current) return;
      setPos((p) => {
        let n = p + dir.current * 1.6;
        if (n > 100) { n = 100; dir.current = -1; }
        if (n < 0)   { n = 0;   dir.current = 1; }
        return n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  const stop = () => {
    if (done) return;
    const hit = pos > 42 && pos < 58;
    setLast(hit ? "hit" : "miss");
    if (hit) {
      const next = hits + 1;
      setHits(next);
      if (next >= NEED) { setDone(true); setTimeout(onWin, 400); }
    }
    setTimeout(() => setLast(null), 250);
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.code === "Space") { e.preventDefault(); stop(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  return (
    <div>
      <div className="relative h-12 bg-[var(--pm-deep-2)] border border-[var(--pm-magenta)] overflow-hidden">
        <div className="absolute top-0 bottom-0" style={{ left: "42%", width: "16%", background: "rgba(34,211,238,0.25)" }} />
        <div className="absolute top-0 bottom-0 w-1 bg-[var(--pm-gold)]" style={{ left: `${pos}%` }} />
        {last && (
          <div className={`absolute right-2 top-1 font-pixel text-[10px] ${last === "hit" ? "text-[var(--pm-cyan)]" : "text-[var(--pm-magenta)]"}`}>
            {last === "hit" ? "✓" : "✗"}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={stop}
        disabled={done}
        className="mt-3 w-full font-pixel text-[10px] py-2 bg-[var(--pm-magenta)] hover:bg-[var(--pm-gold)] hover:text-[var(--pm-ink)] text-white transition-colors disabled:opacity-50"
      >
        {done ? chapter.mini.success : `STOP  (${hits}/${NEED})`}
      </button>
    </div>
  );
}

/* ---------- SORT: tap an item, tap a bucket. Get 3 right. ---------- */
function SortGame({ chapter, onWin }: { chapter: Chapter; onWin: () => void }) {
  // Items shaped to the chapter context
  const decks: Record<string, { items: { label: string; bucket: string }[]; buckets: string[] }> = {
    grp: {
      buckets: ["Phones", "Books", "Shoes"],
      items: [
        { label: "₹19,999", bucket: "Phones" },
        { label: "₹499",    bucket: "Books" },
        { label: "₹6,499",  bucket: "Shoes" },
      ],
    },
    octo: {
      buckets: ["Greet", "Refund", "Status"],
      items: [
        { label: "“hi there!”",            bucket: "Greet" },
        { label: "“where is my order?”",   bucket: "Status" },
        { label: "“I want my money back”", bucket: "Refund" },
      ],
    },
    investopad: {
      buckets: ["Yes", "Maybe", "No"],
      items: [
        { label: "Repeat founder, real wedge", bucket: "Yes" },
        { label: "Solid team, fuzzy market",   bucket: "Maybe" },
        { label: "Slide deck only, no signal", bucket: "No" },
      ],
    },
    fere: {
      buckets: ["Observe", "Decide", "Execute"],
      items: [
        { label: "read mempool",  bucket: "Observe" },
        { label: "score signals", bucket: "Decide" },
        { label: "submit tx",     bucket: "Execute" },
      ],
    },
    iterate: {
      buckets: ["Brief", "Build", "Distribute"],
      items: [
        { label: "POV doc",         bucket: "Brief" },
        { label: "AI-native asset", bucket: "Build" },
        { label: "Launch loop",     bucket: "Distribute" },
      ],
    },
  };
  const fallback = {
    buckets: ["A", "B", "C"],
    items: [
      { label: "one", bucket: "A" },
      { label: "two", bucket: "B" },
      { label: "three", bucket: "C" },
    ],
  };
  const deck = decks[chapter.id] ?? fallback;
  const [picked, setPicked] = useState<number | null>(null);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<number | null>(null);

  const tryBucket = (b: string) => {
    if (picked === null) return;
    if (deck.items[picked].bucket === b) {
      const ns = new Set(solved); ns.add(picked); setSolved(ns); setPicked(null);
      if (ns.size >= deck.items.length) setTimeout(onWin, 350);
    } else {
      setWrong(picked); setTimeout(() => setWrong(null), 250); setPicked(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {deck.items.map((it, i) => {
          const isSolved = solved.has(i);
          const isPicked = picked === i;
          const isWrong = wrong === i;
          return (
            <button
              key={i}
              type="button"
              disabled={isSolved}
              onClick={() => setPicked(i)}
              className={`min-h-16 px-2 py-3 text-xs font-mono text-left border-2 transition-colors ${
                isSolved ? "bg-[var(--pm-cyan)] text-[var(--pm-ink)] border-[var(--pm-cyan)]"
                : isWrong  ? "bg-[var(--pm-magenta)] text-white border-[var(--pm-magenta)]"
                : isPicked ? "bg-[var(--pm-gold)] text-[var(--pm-ink)] border-[var(--pm-gold)]"
                           : "bg-[var(--pm-deep-2)] text-white/85 border-[var(--pm-magenta)] hover:border-[var(--pm-gold)]"
              }`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {deck.buckets.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => tryBucket(b)}
            disabled={picked === null}
            className="font-pixel text-[9px] py-3 bg-[var(--pm-deep-2)] border-2 border-dashed border-[var(--pm-cyan)] hover:bg-[var(--pm-cyan)] hover:text-[var(--pm-ink)] disabled:opacity-50 transition-colors"
          >
            {b}
          </button>
        ))}
      </div>
      {solved.size >= deck.items.length && (
        <div className="mt-3 font-pixel text-[10px] text-[var(--pm-gold)] text-center">
          {chapter.mini.success}
        </div>
      )}
    </div>
  );
}