import { useEffect, useState } from "react";

export type ThemeName = "console" | "midnight";
const KEY = "pm-theme-v1";

function read(): ThemeName {
  if (typeof window === "undefined") return "console";
  const v = localStorage.getItem(KEY);
  return v === "midnight" ? "midnight" : "console";
}

function apply(t: ThemeName) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = t;
}

const listeners = new Set<(t: ThemeName) => void>();
let current: ThemeName | null = null;

export function getTheme(): ThemeName {
  if (current === null) current = read();
  return current;
}

export function setTheme(t: ThemeName) {
  current = t;
  if (typeof window !== "undefined") localStorage.setItem(KEY, t);
  apply(t);
  listeners.forEach((l) => l(t));
}

export function useTheme(): [ThemeName, (t: ThemeName) => void] {
  const [t, setT] = useState<ThemeName>(() => getTheme());
  useEffect(() => {
    apply(getTheme());
    const l = (x: ThemeName) => setT(x);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return [t, setTheme];
}
