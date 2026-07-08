import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { CryButton } from "@/components/cry-button";
import { Pokeball } from "@/components/pokeball";
import { DetailHero } from "@/components/detail-hero";
import { EvolutionChain } from "@/components/evolution-chain";
import { StatBars } from "@/components/stat-bars";
import { TypeBadge } from "@/components/type-badge";
import {
  getEvolutionChain,
  getPokedexIndex,
  getPokemonDetail,
  getSpeciesInfo,
} from "@/lib/pokeapi";
import { dexNumber, displayName, MAX_ID } from "@/lib/pokedex-meta";

type Params = Promise<{ name: string }>;

export async function generateStaticParams() {
  return [
    "bulbasaur",
    "charmander",
    "squirtle",
    "pikachu",
    "eevee",
    "gengar",
    "snorlax",
    "mewtwo",
    "charizard",
    "lucario",
    "greninja",
    "garchomp",
  ].map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { name } = await params;
  const detail = await getPokemonDetail(name.toLowerCase());
  if (!detail) return { title: "REGISTRO NÃO ENCONTRADO" };
  const species = await getSpeciesInfo(detail.id);
  return {
    title: `${dexNumber(detail.id)} ${displayName(detail.name).toUpperCase()}`,
    description: species?.flavorText ?? undefined,
  };
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`dialog-box p-4 ${className}`}>
      <h3 className="mb-3 border-b-2 border-dashed border-ash pb-2 text-[9px]">
        ▶ {title}
      </h3>
      {children}
    </section>
  );
}

const SPRITE_LABELS = [
  ["front", "FRENTE"],
  ["back", "COSTAS"],
  ["frontShiny", "SHINY"],
  ["backShiny", "SHINY (COSTAS)"],
] as const;

export default function PokemonPage({ params }: { params: Params }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      {/* O Suspense faz o shell commitar de imediato: a transição não fica
          segurada (viewport congelado) enquanto a PokeAPI responde. */}
      <Suspense
        fallback={
          <ViewTransition exit="reveal-out">
            <div className="flex min-h-96 flex-col items-center justify-center gap-4">
              <Pokeball spin />
              <p className="font-terminal text-xl text-gb-dark">
                <span className="blink">▮</span> CAPTURANDO DADOS...
              </p>
            </div>
          </ViewTransition>
        }
      >
        <ViewTransition enter="reveal-in" default="none">
          <PokemonContent params={params} />
        </ViewTransition>
      </Suspense>
    </ViewTransition>
  );
}

async function PokemonContent({ params }: { params: Params }) {
  const { name } = await params;
  const detail = await getPokemonDetail(name.toLowerCase());
  if (!detail) notFound();

  const [species, index] = await Promise.all([
    getSpeciesInfo(detail.id),
    getPokedexIndex(),
  ]);
  const evolution = species?.evolutionChainId
    ? await getEvolutionChain(species.evolutionChainId)
    : [];
  const prev = detail.id > 1 ? index[detail.id - 2] : null;
  const next = detail.id < MAX_ID ? index[detail.id] : null;

  return (
      <div className="flex flex-col gap-4">
        <nav className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/"
            transitionTypes={["nav-back"]}
            className="press-btn bg-paper px-3 py-2 text-[9px]"
          >
            ◀ VOLTAR
          </Link>
          <div className="flex gap-2">
            {prev && (
              <Link
                href={`/pokemon/${prev.name}`}
                transitionTypes={["nav-back"]}
                className="press-btn bg-paper px-3 py-2 text-[9px]"
              >
                ◀ {dexNumber(prev.id)}
              </Link>
            )}
            {next && (
              <Link
                href={`/pokemon/${next.name}`}
                transitionTypes={["nav-forward"]}
                className="press-btn bg-paper px-3 py-2 text-[9px]"
              >
                {dexNumber(next.id)} ▶
              </Link>
            )}
          </div>
        </nav>

        <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b-[3px] border-gb-darkest pb-3">
          <span className="font-terminal text-2xl leading-none text-gb-dark">
            {dexNumber(detail.id)}
          </span>
          <h2 className="text-sm uppercase text-gb-darkest sm:text-lg">
            {displayName(detail.name)}
          </h2>
          {species?.genus && (
            <span className="font-terminal text-lg leading-none text-gb-dark">
              {species.genus}
            </span>
          )}
          <div className="flex gap-1.5">
            {detail.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
          {species?.isLegendary && (
            <span className="border-2 border-ink bg-dex-red px-1.5 py-1 text-[8px] text-paper shadow-[2px_2px_0_var(--color-ink)]">
              ★ LENDÁRIO
            </span>
          )}
          {species?.isMythical && (
            <span className="border-2 border-ink bg-lens-deep px-1.5 py-1 text-[8px] text-paper shadow-[2px_2px_0_var(--color-ink)]">
              ◆ MÍTICO
            </span>
          )}
        </header>

        <div className="grid gap-4 md:grid-cols-5">
          <Panel title="CRIATURA" className="md:col-span-2">
            <DetailHero detail={detail} />
            {detail.cryUrl && (
              <div className="mt-2 flex justify-center">
                <CryButton url={detail.cryUrl} />
              </div>
            )}
          </Panel>

          <div className="flex flex-col gap-4 md:col-span-3">
            <Panel title="ENTRADA NA DEX">
              <p className="font-terminal text-xl leading-snug sm:text-2xl">
                {species?.flavorText ?? "DADOS DE CAMPO INDISPONÍVEIS."}
                <span aria-hidden className="blink ml-2 inline-block">
                  ▼
                </span>
              </p>
            </Panel>

            <Panel title="DADOS DE CAMPO" className="flex-1">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 font-terminal text-xl">
                <div>
                  <dt className="text-sm text-gb-dark">ALTURA</dt>
                  <dd>{(detail.height / 10).toFixed(1).replace(".", ",")} m</dd>
                </div>
                <div>
                  <dt className="text-sm text-gb-dark">PESO</dt>
                  <dd>{(detail.weight / 10).toFixed(1).replace(".", ",")} kg</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-gb-dark">HABILIDADES</dt>
                  <dd className="uppercase">
                    {detail.abilities
                      .map(
                        (a) =>
                          `${displayName(a.name)}${a.hidden ? " (OCULTA)" : ""}`,
                      )
                      .join(" · ")}
                  </dd>
                </div>
              </dl>
            </Panel>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel title="ATRIBUTOS DE COMBATE">
            <StatBars stats={detail.stats} />
          </Panel>

          <Panel title="SPRITES">
            <div className="flex flex-wrap items-start justify-center gap-3">
              {SPRITE_LABELS.map(([key, label]) => {
                const src = detail.sprites[key];
                if (!src) return null;
                return (
                  <figure key={key} className="flex flex-col items-center gap-1">
                    <span className="border-2 border-ink bg-gb-lightest p-1">
                      <Image
                        src={src}
                        alt={`${displayName(detail.name)} — ${label}`}
                        width={96}
                        height={96}
                        unoptimized
                        className="pixelated"
                      />
                    </span>
                    <figcaption className="text-[7px]">{label}</figcaption>
                  </figure>
                );
              })}
            </div>
          </Panel>
        </div>

        <Panel title="LINHA EVOLUTIVA">
          <EvolutionChain stages={evolution} currentId={detail.id} />
        </Panel>
      </div>
  );
}
