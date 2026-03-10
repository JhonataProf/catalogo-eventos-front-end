import { CatalogFilters } from "@/domains/catalogo-publico/shared/components/CatalogFilters";
import { CatalogGrid } from "@/domains/catalogo-publico/shared/components/CatalogGrid";
import { CatalogGridSkeleton } from "@/domains/catalogo-publico/shared/components/CatalogGridSkeleton";
import { EmptyState } from "@/domains/catalogo-publico/shared/components/EmptyState";
import { LoadMoreButton } from "@/domains/catalogo-publico/shared/components/LoadMoreButton";
import { useCatalogoPublicoPaginado } from "@/domains/catalogo-publico/shared/hooks/useCatalogoPublicoPaginado";
import type { ICatalogoFiltersValue } from "@/domains/catalogo-publico/shared/model/catalogo.filters";
import type { ICatalogoQuery } from "@/domains/catalogo-publico/shared/model/catalogo.types";
import { useSyncCidadeFromUrl } from "@/domains/cidade-atual/useSyncCidadeFromUrl";
import { useMemo, useState, type ReactElement } from "react";
import { fetchEventosCatalogo } from "../config/eventosCatalogConfig";
import { eventosFiltersConfig } from "../config/eventosFiltersConfig";
import { useCidadeAtual } from "@/domains/cidade-atual/useCidadeAtual";

export function EventosPage(): ReactElement {
  useSyncCidadeFromUrl();

  const { cidade } = useCidadeAtual();
  const [filters, setFilters] = useState<ICatalogoFiltersValue>({
    busca: "",
    categoria: "",
  });

  const baseQuery: Omit<ICatalogoQuery, "page"> = useMemo(
    () => ({
      cidade: cidade.slug,
      busca: filters.busca,
      categoria: filters.categoria,
      limit: 6,
    }),
    [cidade.slug, filters.busca, filters.categoria]
  );

  const {
    data,
    isInitialLoading,
    isLoadingMore,
    error,
    loadMore,
  } = useCatalogoPublicoPaginado({
    baseQuery,
    fetcher: fetchEventosCatalogo,
  });

  const isEmpty: boolean =
    !isInitialLoading && !error && data.items.length === 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-zinc-900">
          Eventos em {cidade.nome}
        </h1>
        <p className="text-zinc-600">
          Explore a agenda da cidade selecionada.
        </p>
      </header>

      <CatalogFilters
        value={filters}
        onChange={setFilters}
        config={eventosFiltersConfig}
      />

      {isInitialLoading ? <CatalogGridSkeleton count={6} /> : null}

      {error ? (
        <EmptyState
          title="Erro ao carregar eventos"
          description={error}
        />
      ) : null}

      {isEmpty ? (
        <EmptyState
          title="Nenhum evento encontrado"
          description="Tente mudar a busca, categoria ou cidade selecionada."
        />
      ) : null}

      {!isInitialLoading && !error && data.items.length > 0 ? (
        <>
          <CatalogGrid items={data.items} />

          {data.hasMore ? (
            <LoadMoreButton
              isLoading={isLoadingMore}
              onClick={loadMore}
            />
          ) : null}
        </>
      ) : null}
    </section>
  );
}