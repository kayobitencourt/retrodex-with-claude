import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-6 py-8 text-center">
      <div className="missingno h-40 w-32" aria-hidden />
      <div className="dialog-box max-w-md p-5">
        <h2 className="text-xs leading-relaxed">
          UM MISSINGNO. SELVAGEM APARECEU!
        </h2>
        <p className="mt-3 font-terminal text-xl leading-snug text-gb-dark">
          ERRO 404 — o registro procurado não existe nesta Pokédex. Fuja antes
          que ele corrompa seu save.
        </p>
      </div>
      <Link
        href="/"
        transitionTypes={["nav-back"]}
        className="press-btn bg-paper px-4 py-3 text-[10px]"
      >
        ▶ FUGIR PARA O INÍCIO
      </Link>
    </div>
  );
}
