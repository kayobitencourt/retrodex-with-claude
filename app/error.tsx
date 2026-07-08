"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-5 py-8">
      <div className="dialog-box max-w-md p-5 text-center">
        <h2 className="text-xs leading-relaxed">UM ERRO SELVAGEM APARECEU!</h2>
        <p className="mt-3 font-terminal text-xl leading-snug text-gb-dark">
          A conexão com o laboratório do Prof. Carvalho falhou. O que você vai
          fazer?
        </p>
      </div>
      <div className="dialog-box flex flex-col gap-3 p-5 text-[10px]">
        <button type="button" onClick={reset} className="group text-left">
          <span className="blink mr-2 inline-block opacity-0 group-hover:opacity-100">
            ▶
          </span>
          LUTAR (TENTAR DE NOVO)
        </button>
        <Link href="/" className="group text-left">
          <span className="blink mr-2 inline-block opacity-0 group-hover:opacity-100">
            ▶
          </span>
          FUGIR (VOLTAR AO INÍCIO)
        </Link>
      </div>
    </div>
  );
}
