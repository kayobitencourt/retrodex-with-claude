"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { GENERATIONS, TYPE_LABELS } from "@/lib/pokedex-meta";

const controlClass =
  "border-[3px] border-gb-darkest bg-gb-lightest px-2 py-1.5 font-terminal text-xl leading-none text-gb-darkest outline-none focus:bg-paper";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const type = searchParams.get("type") ?? "";
  const gen = searchParams.get("gen") ?? "";

  // A URL só atualiza quando a navegação commita, então mudanças rápidas em
  // sequência precisam se acumular aqui para não sobrescrever push pendente.
  const pendingRef = useRef<URLSearchParams | null>(null);
  useEffect(() => {
    pendingRef.current = null;
  }, [searchParams]);

  const apply = useCallback(
    (patch: Record<string, string>) => {
      const params =
        pendingRef.current ?? new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(patch)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      params.delete("page");
      pendingRef.current = params;
      const query = params.toString();
      router.push(query ? `/?${query}` : "/");
    },
    [router],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const current =
        new URLSearchParams(window.location.search).get("q") ?? "";
      if (current !== q.trim()) apply({ q: q.trim() });
    }, 350);
    return () => clearTimeout(timer);
  }, [q, apply]);

  const hasFilters = Boolean(q || type || gen);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex min-w-40 flex-1 flex-col gap-1.5">
        <span className="text-[9px] text-gb-darkest">BUSCAR</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="NOME OU NÚMERO..."
          className={`${controlClass} w-full placeholder:text-gb-dark/70`}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[9px] text-gb-darkest">TIPO</span>
        <select
          value={type}
          onChange={(e) => apply({ type: e.target.value })}
          className={`${controlClass} appearance-none pr-6`}
        >
          <option value="">TODOS</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[9px] text-gb-darkest">GERAÇÃO</span>
        <select
          value={gen}
          onChange={(e) => apply({ gen: e.target.value })}
          className={`${controlClass} appearance-none pr-6`}
        >
          <option value="">TODAS</option>
          {GENERATIONS.map((g) => (
            <option key={g.id} value={g.id}>
              GERAÇÃO {g.numeral}
            </option>
          ))}
        </select>
      </label>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setQ("");
            apply({ q: "", type: "", gen: "" });
          }}
          className="press-btn bg-dex-red px-3 py-2 text-[9px] text-paper"
        >
          LIMPAR ✕
        </button>
      )}
    </div>
  );
}
