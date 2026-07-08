import { cacheLife } from "next/cache";
import {
  GENERATIONS,
  MAX_ID,
  PER_PAGE,
  TYPE_LABELS,
  type EvolutionStage,
  type PokemonCard,
  type PokemonDetail,
  type SearchFilters,
  type SearchResult,
  type SpeciesInfo,
} from "./pokedex-meta";

const API = "https://pokeapi.co/api/v2";

function idFromUrl(url: string) {
  return Number(url.replace(/\/$/, "").split("/").pop());
}

async function fetchJson(path: string): Promise<unknown | null> {
  const res = await fetch(`${API}${path}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`PokeAPI ${path} respondeu ${res.status}`);
  return res.json();
}

/** Índice completo da dex: nome + id, ordenado por id. */
export async function getPokedexIndex(): Promise<{ id: number; name: string }[]> {
  "use cache";
  cacheLife("max");
  const data = (await fetchJson(`/pokemon?limit=${MAX_ID}`)) as {
    results: { name: string; url: string }[];
  };
  return data.results.map((p) => ({ id: idFromUrl(p.url), name: p.name }));
}

async function getNamesByType(type: string): Promise<string[]> {
  "use cache";
  cacheLife("max");
  const data = (await fetchJson(`/type/${type}`)) as {
    pokemon: { pokemon: { name: string } }[];
  } | null;
  return data ? data.pokemon.map((e) => e.pokemon.name) : [];
}

async function getPokemonCard(name: string): Promise<PokemonCard> {
  "use cache";
  cacheLife("max");
  const data = (await fetchJson(`/pokemon/${name}`)) as {
    id: number;
    name: string;
    types: { slot: number; type: { name: string } }[];
  };
  return {
    id: data.id,
    name: data.name,
    types: data.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
  };
}

export async function searchPokedex({
  q,
  type,
  gen,
  page = 1,
}: SearchFilters): Promise<SearchResult> {
  "use cache";
  cacheLife("max");

  let entries = await getPokedexIndex();

  if (q) {
    const needle = q.trim().toLowerCase();
    entries = entries.filter(
      (e) => e.name.includes(needle) || String(e.id) === needle,
    );
  }
  if (gen) {
    const generation = GENERATIONS.find((g) => g.id === gen);
    if (generation) {
      const [lo, hi] = generation.range;
      entries = entries.filter((e) => e.id >= lo && e.id <= hi);
    }
  }
  if (type && type in TYPE_LABELS) {
    const names = new Set(await getNamesByType(type));
    entries = entries.filter((e) => names.has(e.name));
  }

  const total = entries.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const current = Math.min(Math.max(1, page), totalPages);
  const slice = entries.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const cards = await Promise.all(slice.map((e) => getPokemonCard(e.name)));

  return { cards, total, page: current, totalPages };
}

export async function getPokemonDetail(name: string): Promise<PokemonDetail | null> {
  "use cache";
  cacheLife("max");
  const data = (await fetchJson(`/pokemon/${name}`)) as {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: { slot: number; type: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
    abilities: { ability: { name: string }; is_hidden: boolean }[];
    cries: { latest: string | null; legacy: string | null } | null;
    sprites: {
      front_default: string | null;
      back_default: string | null;
      front_shiny: string | null;
      back_shiny: string | null;
      other?: { "official-artwork"?: { front_default: string | null } };
      versions?: {
        "generation-v"?: {
          "black-white"?: { animated?: { front_default: string | null } };
        };
      };
    };
  } | null;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    abilities: data.abilities.map((a) => ({
      name: a.ability.name,
      hidden: a.is_hidden,
    })),
    cryUrl: data.cries?.latest ?? data.cries?.legacy ?? null,
    sprites: {
      front: data.sprites.front_default,
      back: data.sprites.back_default,
      frontShiny: data.sprites.front_shiny,
      backShiny: data.sprites.back_shiny,
      animated:
        data.sprites.versions?.["generation-v"]?.["black-white"]?.animated
          ?.front_default ?? null,
      artwork: data.sprites.other?.["official-artwork"]?.front_default ?? null,
    },
  };
}

export async function getSpeciesInfo(id: number): Promise<SpeciesInfo | null> {
  "use cache";
  cacheLife("max");
  const data = (await fetchJson(`/pokemon-species/${id}`)) as {
    genera: { genus: string; language: { name: string } }[];
    flavor_text_entries: { flavor_text: string; language: { name: string } }[];
    is_legendary: boolean;
    is_mythical: boolean;
    evolution_chain: { url: string } | null;
  } | null;
  if (!data) return null;

  const flavor = data.flavor_text_entries.find((f) => f.language.name === "en");
  return {
    genus: data.genera.find((g) => g.language.name === "en")?.genus ?? null,
    flavorText: flavor
      ? flavor.flavor_text.replace(/[\n\f\r]+/g, " ").trim()
      : null,
    isLegendary: data.is_legendary,
    isMythical: data.is_mythical,
    evolutionChainId: data.evolution_chain
      ? idFromUrl(data.evolution_chain.url)
      : null,
  };
}

type ChainLink = {
  species: { name: string; url: string };
  evolution_details: {
    trigger: { name: string };
    min_level: number | null;
    item: { name: string } | null;
    min_happiness: number | null;
    time_of_day: string;
  }[];
  evolves_to: ChainLink[];
};

function evolutionCondition(link: ChainLink): string | null {
  const d = link.evolution_details[0];
  if (!d) return null;
  if (d.min_level) return `NÍVEL ${d.min_level}`;
  if (d.item) return d.item.name.replaceAll("-", " ").toUpperCase();
  if (d.trigger.name === "trade") return "TROCA";
  if (d.min_happiness) return "AMIZADE";
  return d.trigger.name.replaceAll("-", " ").toUpperCase();
}

/** Achata a cadeia em estágios; só inclui formas dentro da dex canônica. */
export async function getEvolutionChain(
  chainId: number,
): Promise<EvolutionStage[][]> {
  "use cache";
  cacheLife("max");
  const data = (await fetchJson(`/evolution-chain/${chainId}`)) as {
    chain: ChainLink;
  } | null;
  if (!data) return [];

  const stages: EvolutionStage[][] = [];
  let level: ChainLink[] = [data.chain];
  while (level.length > 0) {
    const stage = level
      .map((link) => ({
        id: idFromUrl(link.species.url),
        name: link.species.name,
        condition: evolutionCondition(link),
      }))
      .filter((s) => s.id <= MAX_ID);
    if (stage.length > 0) stages.push(stage);
    level = level.flatMap((link) => link.evolves_to);
  }
  return stages;
}
