"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ViewTransition } from "react";
import { displayName, type PokemonDetail } from "@/lib/pokedex-meta";

const pixelSteps = (frames: number) => (t: number) =>
  Math.min(1, Math.floor(t * frames) / (frames - 1));

export function DetailHero({ detail }: { detail: PokemonDetail }) {
  const heroSprite =
    detail.sprites.animated ?? detail.sprites.front ?? detail.sprites.artwork;

  return (
    <div className="relative flex flex-col items-center justify-end pb-2 pt-6">
      {/* base de batalha */}
      <span
        aria-hidden
        className="absolute bottom-4 h-8 w-44 rounded-[100%] bg-gb-dark/30 sm:w-56"
      />
      <ViewTransition name={`pokemon-${detail.id}`} share="morph">
        <motion.div
          initial={{ x: -90, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: pixelSteps(7) }}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{
              duration: 1.8,
              delay: 0.5,
              repeat: Infinity,
              ease: pixelSteps(4),
            }}
          >
            {heroSprite && (
              <Image
                src={heroSprite}
                alt={displayName(detail.name)}
                width={96}
                height={96}
                unoptimized
                priority
                className="pixelated relative z-10 h-40 w-40 object-contain [image-rendering:pixelated] sm:h-48 sm:w-48"
              />
            )}
          </motion.div>
        </motion.div>
      </ViewTransition>
    </div>
  );
}
