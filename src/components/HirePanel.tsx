import { useState } from "react";
import { HERO } from "@/content/resume";

interface Props { open: boolean; onClose: () => void; }

export function HirePanel({ open, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(HERO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };
  return (
    <>
      <div
        className={`fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed z-[81] top-0 right-0 h-full w-full max-w-md bg-[color:var(--surface-1)] border-l border-[color:var(--border)] shadow-2xl
          transition-transform duration-500 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="h-full overflow-y-auto p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted-fg)]">
                Hire / collaborate
              </div>
              <h2 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--fg)]">
                {HERO.name}
              </h2>
              <p className="mt-1 text-sm text-[color:var(--fg)]/70">{HERO.tagline}</p>
            </div>
            <button onClick={onClose} className="font-mono text-sm text-[color:var(--muted-fg)] hover:text-[color:var(--fg)]" aria-label="Close">✕</button>
          </div>

          <p className="text-[color:var(--fg)]/85 leading-relaxed">
            {HERO.bio}
          </p>
          <p className="mt-3 text-sm text-[color:var(--muted-fg)]">{HERO.location}</p>

          <div className="mt-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] mb-2">
              Currently building
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-[color:var(--accent)] mt-0.5">●</span><span><strong>Iterate</strong> — AI-native marketing agency. Speed × strategy × creativity.</span></li>
              <li className="flex items-start gap-2"><span className="text-[color:var(--accent)] mt-0.5">●</span><span><strong>Cats Can Dance</strong> — music label + pet culture brand. The work that exists because it has to.</span></li>
            </ul>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {HERO.stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3">
                <div className="text-lg font-semibold text-[color:var(--fg)]">{s.value}</div>
                <div className="font-mono text-[10px] text-[color:var(--muted-fg)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <a href={`mailto:${HERO.email}`} className="block w-full text-center rounded-md bg-[color:var(--accent)] text-[color:var(--accent-foreground)] py-3 font-medium hover:opacity-90 transition">
              ✉  {HERO.email}
            </a>
            <button onClick={copy} className="block w-full text-center rounded-md border border-[color:var(--border)] py-2 font-mono text-xs text-[color:var(--fg)]/80 hover:bg-[color:var(--surface-2)] transition">
              {copied ? "✓ copied" : "copy email"}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <a href={HERO.links.linkedin} target="_blank" rel="noreferrer" className="text-center rounded-md border border-[color:var(--border)] py-2 text-sm hover:border-[color:var(--accent)] transition">LinkedIn</a>
            <a href={HERO.links.twitter} target="_blank" rel="noreferrer" className="text-center rounded-md border border-[color:var(--border)] py-2 text-sm hover:border-[color:var(--accent)] transition">X</a>
            <a href={HERO.links.site} target="_blank" rel="noreferrer" className="text-center rounded-md border border-[color:var(--border)] py-2 text-sm hover:border-[color:var(--accent)] transition">Site</a>
          </div>

          <a href="/cv" className="mt-4 block w-full text-center rounded-md border border-[color:var(--accent)] py-2 font-mono text-xs text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)] transition">
            ⬇ Full CV
          </a>
        </div>
      </aside>
    </>
  );
}
