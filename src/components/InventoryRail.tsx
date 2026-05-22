import { usePickups } from "@/game/pickups";

/**
 * Sticky bottom inventory rail showing all collected outcome tokens.
 * Always visible so the player sees their collection grow across panels.
 */
export function InventoryRail() {
  const items = usePickups();
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      <div className="mx-auto max-w-6xl px-3 pb-3">
        <div className="pointer-events-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/85 backdrop-blur-md px-3 py-2 flex items-center gap-3 overflow-x-auto shadow-lg">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-fg)] shrink-0">
            Inventory · {items.length}
          </span>
          <div className="flex items-center gap-1.5">
            {items.length === 0 && (
              <span className="font-mono text-[10px] text-[color:var(--muted-fg)]/70">
                walk past glowing tokens to collect
              </span>
            )}
            {items.slice(-12).map((p) => (
              <span
                key={p.id}
                title={p.label}
                className="font-mono text-[10px] px-2 py-0.5 rounded-sm whitespace-nowrap animate-fade-in"
                style={{ background: p.color, color: "#0a0a0a" }}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
