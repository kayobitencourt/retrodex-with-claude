"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import {
  dexNumber,
  displayName,
  spriteUrl,
  type PokemonCard as CardData,
} from "@/lib/pokedex-meta";
import { TypeBadge } from "./type-badge";

/** Easing quantizado: movimento em "frames", como sprite de jogo antigo. */
const pixelSteps = (frames: number) => (t: number) =>
  Math.min(1, Math.floor(t * frames) / (frames - 1));

export function PokemonCard({ card, index }: { card: CardData; index: number }) {
  return (
    <li
      className="card-enter list-none"
      style={{ animationDelay: `${Math.min(index * 40, 700)}ms` }}
    >
      <motion.div
        className="h-full"
        whileHover="hover"
        whileTap={{ scale: 0.96 }}
      >
        <Link
          href={`/pokemon/${card.name}`}
          transitionTypes={["nav-forward"]}
          className="dialog-box group flex h-full flex-col items-center gap-2 p-3 pt-2"
        >
          <span className="self-end font-terminal text-lg leading-none text-gb-dark">
            {dexNumber(card.id)}
          </span>
          <ViewTransition name={`pokemon-${card.id}`} share="morph">
            <motion.span
              className="block"
              variants={{
                hover: {
                  y: -6,
                  transition: { duration: 0.18, ease: pixelSteps(3) },
                },
              }}
            >
              <Image
                src={spriteUrl(card.id)}
                alt={displayName(card.name)}
                width={96}
                height={96}
                unoptimized
                className="pixelated"
              />
            </motion.span>
          </ViewTransition>
          <h3 className="text-center text-[10px] uppercase leading-relaxed">
            <span className="blink mr-1 inline-block opacity-0 group-hover:opacity-100">
              ▶
            </span>
            {displayName(card.name)}
          </h3>
          <div className="mt-auto flex flex-wrap justify-center gap-1.5 pt-1">
            {card.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
        </Link>
      </motion.div>
    </li>
  );
}
