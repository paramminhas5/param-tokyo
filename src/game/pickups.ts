import { useEffect, useState } from "react";

export interface CollectedPickup {
  id: string;          // unique: `${chapterId}:${index}`
  chapterId: string;
  label: string;
  color: string;
  ts: number;
}

const KEY = "pm-pickups-v1";

function read(): CollectedPickup[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

const listeners = new Set<(p: CollectedPickup[]) => void>();
let cache: CollectedPickup[] | null = null;

function get(): CollectedPickup[] {
  if (cache === null) cache = read();
  return cache;
}

export function collect(p: Omit<CollectedPickup, "ts">) {
  const cur = get();
  if (cur.some((x) => x.id === p.id)) return false;
  cache = [...cur, { ...p, ts: Date.now() }];
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l(cache!));
  return true;
}

export function resetPickups() {
  cache = [];
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
  listeners.forEach((l) => l([]));
}

export function usePickups(): CollectedPickup[] {
  const [p, setP] = useState<CollectedPickup[]>(() => get());
  useEffect(() => {
    const l = (x: CollectedPickup[]) => setP(x);
    listeners.add(l);
    setP(get());
    return () => { listeners.delete(l); };
  }, []);
  return p;
}

export function isCollected(id: string): boolean {
  return get().some((x) => x.id === id);
}
