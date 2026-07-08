/** Constantes e helpers puros, seguros para client components. */

/** Formas canônicas (1..1025). Variantes (id > 10000) ficam fora da dex. */
export const MAX_ID = 1025;
export const PER_PAGE = 24;

export const GENERATIONS = [
  { id: 1, numeral: "I", range: [1, 151] },
  { id: 2, numeral: "II", range: [152, 251] },
  { id: 3, numeral: "III", range: [252, 386] },
  { id: 4, numeral: "IV", range: [387, 493] },
  { id: 5, numeral: "V", range: [494, 649] },
  { id: 6, numeral: "VI", range: [650, 721] },
  { id: 7, numeral: "VII", range: [722, 809] },
  { id: 8, numeral: "VIII", range: [810, 905] },
  { id: 9, numeral: "IX", range: [906, 1025] },
] as const;

export const TYPE_LABELS: Record<string, string> = {
  normal: "NORMAL",
  fire: "FOGO",
  water: "ÁGUA",
  grass: "PLANTA",
  electric: "ELÉTRICO",
  ice: "GELO",
  fighting: "LUTADOR",
  poison: "VENENO",
  ground: "TERRA",
  flying: "VOADOR",
  psychic: "PSÍQUICO",
  bug: "INSETO",
  rock: "PEDRA",
  ghost: "FANTASMA",
  dragon: "DRAGÃO",
  dark: "SOMBRIO",
  steel: "AÇO",
  fairy: "FADA",
};

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATAQUE",
  defense: "DEFESA",
  "special-attack": "AT. ESP",
  "special-defense": "DF. ESP",
  speed: "VELOC.",
};

export type PokemonCard = {
  id: number;
  name: string;
  types: string[];
};

export type PokemonDetail = {
  id: number;
  name: string;
  types: string[];
  height: number; // decímetros
  weight: number; // hectogramas
  stats: { name: string; value: number }[];
  abilities: { name: string; hidden: boolean }[];
  cryUrl: string | null;
  sprites: {
    front: string | null;
    back: string | null;
    frontShiny: string | null;
    backShiny: string | null;
    animated: string | null;
    artwork: string | null;
  };
};

export type SpeciesInfo = {
  genus: string | null;
  flavorText: string | null;
  isLegendary: boolean;
  isMythical: boolean;
  evolutionChainId: number | null;
};

export type EvolutionStage = {
  id: number;
  name: string;
  condition: string | null;
};

export type SearchFilters = {
  q?: string;
  type?: string;
  gen?: number;
  page?: number;
};

export type SearchResult = {
  cards: PokemonCard[];
  total: number;
  page: number;
  totalPages: number;
};

export function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function artworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function displayName(name: string) {
  return name.replaceAll("-", " ");
}

export function dexNumber(id: number) {
  return `Nº ${String(id).padStart(4, "0")}`;
}
