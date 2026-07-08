import { TYPE_LABELS } from "@/lib/pokedex-meta";

export function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className="border-2 border-ink px-1.5 py-1 text-[8px] uppercase text-ink shadow-[2px_2px_0_var(--color-ink)]"
      style={{ backgroundColor: `var(--type-${type}, var(--color-ash))` }}
    >
      {TYPE_LABELS[type] ?? type}
    </span>
  );
}
