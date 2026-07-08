import { Suspense, ViewTransition } from "react";
import { FilterBar } from "@/components/filter-bar";
import { Pagination } from "@/components/pagination";
import { Pokeball } from "@/components/pokeball";
import { PokemonCard } from "@/components/pokemon-card";
import { searchPokedex } from "@/lib/pokeapi";
import type { SearchFilters } from "@/lib/pokedex-meta";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filters: SearchFilters = {
    q: first(sp.q)?.trim() || undefined,
    type: first(sp.type) || undefined,
    gen: Number(first(sp.gen)) || undefined,
    page: Number(first(sp.page)) || 1,
  };
  const { cards, total, page, totalPages } = await searchPokedex(filters);

  return (
    <ViewTransition enter="reveal-in" default="none">
      <div>
        <p className="mb-3 font-terminal text-xl leading-none text-gb-dark">
          {total === 0
            ? "NENHUM REGISTRO LOCALIZADO"
            : `${total} REGISTRO${total > 1 ? "S" : ""} · EXIBINDO ${cards.length}`}
        </p>

        {cards.length === 0 ? (
          <div className="dialog-box mx-auto my-10 flex max-w-md flex-col items-center gap-4 p-6 text-center">
            <span className="text-4xl" aria-hidden>
              ?
            </span>
            <p className="text-[10px] leading-relaxed">
              NENHUM POKÉMON CORRESPONDE À BUSCA!
            </p>
            <p className="font-terminal text-lg text-gb-dark">
              Tente outro nome, número ou combinação de filtros.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {cards.map((card, index) => (
              <PokemonCard key={card.id} card={card} index={index} />
            ))}
          </ul>
        )}

        <Pagination page={page} totalPages={totalPages} filters={filters} />
      </div>
    </ViewTransition>
  );
}

function GridSkeleton() {
  return (
    <ViewTransition exit="reveal-out">
      <div>
        <p className="mb-3 font-terminal text-xl leading-none text-gb-dark">
          <span className="blink">▮</span> CONSULTANDO BANCO DE DADOS...
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 12 }, (_, i) => (
            <li
              key={i}
              className="dialog-box flex h-44 items-center justify-center"
            >
              <Pokeball spin className="opacity-70" />
            </li>
          ))}
        </ul>
      </div>
    </ViewTransition>
  );
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-gb-darkest pb-3">
        <h2 className="text-[11px] text-gb-darkest sm:text-sm">
          <span className="blink">▶</span> BANCO DE DADOS
        </h2>
        <span className="font-terminal text-lg text-gb-dark sm:text-xl">
          1025 CRIATURAS CATALOGADAS
        </span>
      </div>

      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>

      <Suspense fallback={<GridSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
      </div>
    </ViewTransition>
  );
}
