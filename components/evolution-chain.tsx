import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import {
  displayName,
  spriteUrl,
  type EvolutionStage,
} from "@/lib/pokedex-meta";

function Stage({
  stage,
  currentId,
}: {
  stage: EvolutionStage;
  currentId: number;
}) {
  const isCurrent = stage.id === currentId;
  const body = (
    <>
      <Image
        src={spriteUrl(stage.id)}
        alt={displayName(stage.name)}
        width={72}
        height={72}
        unoptimized
        className="pixelated"
      />
      <span className="max-w-24 text-center text-[8px] uppercase leading-relaxed">
        {displayName(stage.name)}
      </span>
      {stage.condition && (
        <span className="border-2 border-ink bg-gb-lightest px-1 py-0.5 font-terminal text-sm leading-none">
          {stage.condition}
        </span>
      )}
    </>
  );

  if (isCurrent) {
    return (
      <div
        aria-current="page"
        className="flex flex-col items-center gap-1 border-[3px] border-ink bg-led-yellow/50 p-2"
      >
        {body}
      </div>
    );
  }
  return (
    <Link
      href={`/pokemon/${stage.name}`}
      className="flex flex-col items-center gap-1 border-[3px] border-transparent p-2 hover:border-ink hover:bg-gb-lightest/60"
    >
      {body}
    </Link>
  );
}

export function EvolutionChain({
  stages,
  currentId,
}: {
  stages: EvolutionStage[][];
  currentId: number;
}) {
  if (stages.length <= 1) {
    return (
      <p className="font-terminal text-lg text-gb-dark">
        ESTE POKÉMON NÃO POSSUI EVOLUÇÕES REGISTRADAS.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
      {stages.map((stage, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span aria-hidden className="blink text-lg text-gb-dark">
              ▶
            </span>
          )}
          <div className="flex flex-col gap-2">
            {stage.map((s) => (
              <Stage key={s.id} stage={s} currentId={currentId} />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
