import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RETRODEX — Pokédex retrô",
    template: "%s · RETRODEX",
  },
  description:
    "Pokédex portátil estilo jogos antigos: 1025 Pokémon com filtros, detalhes, evoluções e sprites — dados da PokeAPI.",
};

export const viewport: Viewport = {
  themeColor: "#dc0a2d",
};

function DexHeader() {
  return (
    <header
      style={{ viewTransitionName: "dex-chrome" }}
      className="flex items-center gap-4 sm:gap-6"
    >
      <div className="lens h-14 w-14 shrink-0 sm:h-20 sm:w-20" aria-hidden />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2" aria-hidden>
          <span className="led led-blink h-3.5 w-3.5 bg-dex-red-light" />
          <span className="led h-3.5 w-3.5 bg-led-yellow" />
          <span className="led h-3.5 w-3.5 bg-led-green" />
        </div>
        <Link href="/" className="group">
          <h1 className="text-xl text-paper [text-shadow:3px_3px_0_var(--color-ink)] sm:text-3xl">
            RETRO<span className="text-led-yellow">DEX</span>
          </h1>
        </Link>
        <p className="font-terminal text-base leading-none text-paper/85 sm:text-lg">
          SISTEMA POKÉDEX PORTÁTIL · VER. 1.0
        </p>
      </div>
    </header>
  );
}

function DexFooter() {
  return (
    <footer
      style={{ viewTransitionName: "dex-footer" }}
      className="mt-4 flex items-end justify-between gap-4"
    >
      <p className="font-terminal text-base text-paper/80 sm:text-lg">
        DADOS: POKEAPI.CO · SPRITES © NINTENDO/GAME FREAK
      </p>
      <div className="speaker h-10 w-24 shrink-0 sm:w-32" aria-hidden />
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${pressStart.variable} ${vt323.variable} h-full`}
    >
      <body className="min-h-full">
        <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-3 py-4 sm:px-6 sm:py-6">
          <DexHeader />
          <main className="screen-bezel mt-4 flex-1 p-2 sm:mt-5 sm:p-3">
            <div className="screen min-h-full p-3 sm:p-5">{children}</div>
          </main>
          <DexFooter />
        </div>
      </body>
    </html>
  );
}
