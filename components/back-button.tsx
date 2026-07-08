"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        // Volta para onde o usuário estava (lista com filtros/página na URL);
        // sem histórico (deep link), cai na página inicial.
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
      className="press-btn bg-paper px-3 py-2 text-[9px] cursor-pointer"
    >
      ◀ VOLTAR
    </button>
  );
}
