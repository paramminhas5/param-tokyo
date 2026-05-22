import { useEffect, useState } from "react";
import type { SkillId } from "@/content/resume";

const KEY = "pm-skills-v1";

function read(): SkillId[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

type Listener = (s: SkillId[]) => void;
const listeners = new Set<Listener>();
let cache: SkillId[] | null = null;

function get(): SkillId[] {
  if (cache === null) cache = read();
  return cache;
}

export function addSkill(s: SkillId) {
  const cur = get();
  if (cur.includes(s)) return;
  cache = [...cur, s];
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l(cache!));
}

export function resetSkills() {
  cache = [];
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
  listeners.forEach((l) => l([]));
}

export function useSkills(): SkillId[] {
  const [s, setS] = useState<SkillId[]>(() => get());
  useEffect(() => {
    const l: Listener = (x) => setS(x);
    listeners.add(l);
    setS(get());
    return () => { listeners.delete(l); };
  }, []);
  return s;
}