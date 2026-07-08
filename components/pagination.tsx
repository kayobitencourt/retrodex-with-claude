import Link from "next/link";
import type { SearchFilters } from "@/lib/pokedex-meta";

function pageHref(filters: SearchFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.type) params.set("type", filters.type);
  if (filters.gen) params.set("gen", String(filters.gen));
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function PageButton({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const className = "press-btn bg-paper px-3 py-2.5 text-[9px] sm:text-[10px]";
  if (disabled) {
    return (
      <span aria-disabled="true" className={className}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Pagination({
  page,
  totalPages,
  filters,
}: {
  page: number;
  totalPages: number;
  filters: SearchFilters;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label="Paginação"
      className="mt-6 flex items-center justify-between gap-2 sm:gap-3"
    >
      <div className="flex gap-2">
        <PageButton href={pageHref(filters, 1)} disabled={page <= 1}>
          <span aria-hidden>◀◀</span>
          <span className="sr-only">Primeira página</span>
        </PageButton>
        <PageButton href={pageHref(filters, page - 1)} disabled={page <= 1}>
          ◀ ANTERIOR
        </PageButton>
      </div>
      <span className="font-terminal text-xl text-gb-darkest sm:text-2xl">
        PÁG {String(page).padStart(2, "0")}/{String(totalPages).padStart(2, "0")}
      </span>
      <div className="flex gap-2">
        <PageButton href={pageHref(filters, page + 1)} disabled={page >= totalPages}>
          PRÓXIMA ▶
        </PageButton>
        <PageButton href={pageHref(filters, totalPages)} disabled={page >= totalPages}>
          <span aria-hidden>▶▶</span>
          <span className="sr-only">Última página</span>
        </PageButton>
      </div>
    </nav>
  );
}
