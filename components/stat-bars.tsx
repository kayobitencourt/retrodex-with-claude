"use client";

import { motion } from "motion/react";
import { STAT_LABELS } from "@/lib/pokedex-meta";

const MAX_STAT = 255;

const pixelSteps = (frames: number) => (t: number) =>
  Math.min(1, Math.floor(t * frames) / (frames - 1));

function barColor(value: number) {
  if (value < 50) return "var(--type-fighting)";
  if (value < 80) return "var(--type-electric)";
  if (value < 110) return "var(--type-grass)";
  return "var(--type-water)";
}

export function StatBars({ stats }: { stats: { name: string; value: number }[] }) {
  const total = stats.reduce((sum, s) => sum + s.value, 0);
  return (
    <dl className="flex flex-col gap-2.5">
      {stats.map((stat, i) => (
        <div key={stat.name} className="flex items-center gap-2">
          <dt className="w-24 shrink-0 text-right text-[8px] leading-none">
            {STAT_LABELS[stat.name] ?? stat.name.toUpperCase()}
          </dt>
          <dd className="flex flex-1 items-center gap-2">
            <span className="w-9 shrink-0 text-right font-terminal text-lg leading-none">
              {stat.value}
            </span>
            <div className="relative h-4 flex-1 border-2 border-ink bg-ash/40">
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  backgroundColor: barColor(stat.value),
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent 0 6px, rgb(0 0 0 / 0.18) 6px 8px)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(stat.value / MAX_STAT) * 100}%` }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + i * 0.09,
                  ease: pixelSteps(12),
                }}
              />
            </div>
          </dd>
        </div>
      ))}
      <div className="mt-1 flex items-center gap-2 border-t-2 border-dashed border-ash pt-2">
        <span className="w-24 shrink-0 text-right text-[8px]">TOTAL</span>
        <span className="font-terminal text-lg leading-none">{total}</span>
      </div>
    </dl>
  );
}
