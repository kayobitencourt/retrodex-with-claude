# RETRODEX — Pokédex retrô

Pokédex portátil estilo jogos antigos: a moldura é o Pokédex vermelho do anime,
a área de conteúdo é uma tela Game Boy DMG com scanlines, e os painéis usam as
caixas de diálogo de borda dupla de Pokémon Red/Blue. Dados da
[PokeAPI](https://pokeapi.co/).

## Funcionalidades

- **Listagem** dos 1025 Pokémon canônicos com sprites pixelados
- **Filtros combináveis** por nome/número, tipo (18) e geração (I–IX) — tudo na
  URL, compartilhável
- **Paginação** estilo Game Boy (24 por página)
- **Detalhes**: sprite animado, entrada da dex, altura/peso/habilidades, stats
  com barras segmentadas, galeria de sprites (frente/costas/shiny), linha
  evolutiva navegável com condições, grito (áudio) e navegação nº anterior/próximo
- **404 com MissingNo.** e error boundary em forma de menu de batalha

## Stack e técnica

- Next.js 16 com **Cache Components** (`use cache` + `cacheLife("max")`) e PPR —
  dados da PokeAPI são imutáveis, então tudo cacheia agressivamente
- **View Transitions** (React `<ViewTransition>`): morph do sprite card→detalhe,
  slides direcionais avançar/voltar, revelação de Suspense
- **Motion** para microinterações (hover/tap dos cards, barras de stats, entrada
  do herói) com easing quantizado em "frames" de sprite
- Tailwind CSS v4, fontes Press Start 2P + VT323

## Rodando

```bash
npm install
npm run dev    # desenvolvimento
npm run build && npm start  # produção
```

Especificação de design em `docs/superpowers/specs/`.
