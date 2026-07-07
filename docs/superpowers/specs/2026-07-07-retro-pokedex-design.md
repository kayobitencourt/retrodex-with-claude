# Retro Pokédex — Design

**Data:** 2026-07-07 · **Status:** aprovado por autorização prévia do usuário ("permissão total para começar de imediato")

## Objetivo

Aplicação Pokédex consumindo a [PokeAPI](https://pokeapi.co/): listagem com filtros e paginação,
página de detalhes rica, imagens/sprites — com visual fortemente retrô, estilo jogos antigos.

## Direção visual

O app é um **dispositivo**: a moldura externa é o Pokédex vermelho do anime (shell vermelho,
lente azul, LEDs), e a área de conteúdo é uma **tela Game Boy DMG** (paleta verde de 4 tons,
scanlines CRT, vinheta). Painéis de informação usam caixas de diálogo brancas com **borda dupla**
no estilo Pokémon Red/Blue. Tipografia: *Press Start 2P* (display/UI) + *VT323* (texto corrido).
Sprites renderizados com `image-rendering: pixelated`. Microinterações: cursor ▶ piscando,
botões que "afundam" (hard shadow), barras de stats que preenchem animadas, LED piscando.
Idioma da UI: pt-BR. Flavor text vem da API em inglês (não há pt na PokeAPI).

## Arquitetura (Next.js 16, Cache Components)

- `cacheComponents: true` em `next.config.ts`; imagens remotas liberadas para
  `raw.githubusercontent.com/PokeAPI/sprites/**`.
- **Camada de dados** `lib/pokeapi.ts`: funções assíncronas com `'use cache'` +
  `cacheLife('max')` (dados de Pokémon são estáticos). Retornam objetos planos serializáveis
  e enxutos (nunca a resposta bruta da API).
  - `getPokedexIndex()` — ids 1..1025 (formas canônicas; variantes id>10000 ficam fora).
  - `getPokemonCard(name)` — {id, name, types} para o grid.
  - `getPokemonDetail(name)`, `getSpecies(id)`, `getEvolutionChain(id)`.
  - `getNamesByType(type)` — conjunto de nomes por tipo.
  - `searchPokedex({q, type, gen, page})` — composição: índice → filtro nome/tipo/geração
    (geração por faixas de id de espécie) → paginação em memória (24/página) → cards em
    `Promise.all`.
- **Listagem `/`**: shell estático (moldura, header, controles); resultados dependem de
  `searchParams` (runtime) e ficam atrás de `<Suspense>` com fallback retrô. Filtros são um
  client component que escreve na URL (`?q=&type=&gen=&page=`) — estado compartilhável.
- **Detalhes `/pokemon/[name]`**: `generateStaticParams` com amostra (12 iniciais) para
  prerender; demais gerados sob demanda e cacheados. Seções: artwork oficial, galeria de
  sprites (frente/costas/shiny), tipos, stats (barras), habilidades, altura/peso, flavor
  text, cadeia de evolução navegável, botão de cry (áudio), navegação nº anterior/próximo.
- **Erros**: `not-found.tsx` com easter egg MissingNo.; `error.tsx` "um erro selvagem apareceu".
- **Metadata**: `generateMetadata` por Pokémon; título/descrição globais no layout.

## Decisões e trade-offs

1. **Filtro em memória sobre o índice completo** (escolhido) vs. paginação nativa da API:
   a API não combina filtros (tipo+nome+geração) nem pagina resultados de `/type/`;
   com o índice (~1025 itens) cacheado, filtros combinados e paginação ficam triviais.
2. **Cache Components** (escolhido) vs. modelo antigo de fetch-cache: é o modelo padrão
   documentado desta versão do Next; dados imutáveis da PokeAPI são o caso ideal de
   `use cache` + `cacheLife('max')`.
3. **Sprites por URL determinística** (escolhido) vs. ler URLs da API: as URLs do repositório
   oficial de sprites são função do id — evita um fetch por card.

## Testes/verificação

`next build` sem erros (valida também as fronteiras de Suspense do Cache Components),
navegação real no browser: filtros combinados, paginação, detalhes, 404.
