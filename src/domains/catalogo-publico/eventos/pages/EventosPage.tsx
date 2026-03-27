import { Section, SectionHeader } from "@/design-system/ui";
import { CatalogFilters } from "@/domains/catalogo-publico/shared/components/CatalogFilters";
import { CatalogGrid } from "@/domains/catalogo-publico/shared/components/CatalogGrid";
import { CatalogGridSkeleton } from "@/domains/catalogo-publico/shared/components/CatalogGridSkeleton";
import { EmptyState } from "@/domains/catalogo-publico/shared/components/EmptyState";
import { LoadMoreButton } from "@/domains/catalogo-publico/shared/components/LoadMoreButton";
import { useCatalogoCidade } from "@/domains/catalogo-publico/shared/hooks/useCatalogoCidade";
import { useCatalogoPublicoPaginado } from "@/domains/catalogo-publico/shared/hooks/useCatalogoPublicoPaginado";
import type { ICatalogoFiltersValue } from "@/domains/catalogo-publico/shared/model/catalogo.filters";
import type { ICatalogoQuery } from "@/domains/catalogo-publico/shared/model/catalogo.types";
import { usePublicPageMetadata } from "@/shell/public/seo/usePublicPageMetadata";
import { useMemo, useState, type ReactElement } from "react";
import { fetchEventosCatalogo } from "../config/eventosCatalogConfig";
import { eventosFiltersConfig } from "../config/eventosFiltersConfig";

export function EventosPage(): ReactElement {
  usePublicPageMetadata({
    title: "Eventos | Celeiro do MS",
    description:
      "Agenda de eventos no Mato Grosso do Sul — festivais, cultura e experiências.",
    canonicalPath: "/eventos",
  });

  const {
    cidadeSlug,
    cidadeNome,
    cidades,
    setCidadeSlug,
    isLoadingCidades,
    errorCidades,
    isCitiesReady,
  } = useCatalogoCidade();

  const [filters, setFilters] = useState<ICatalogoFiltersValue>({
    busca: "",
    categoria: "",
  });

  const baseQuery: Omit<ICatalogoQuery, "page"> = useMemo(
    () => ({
      cidade: cidadeSlug,
      busca: filters.busca,
      categoria: filters.categoria,
      limit: 6,
    }),
    [cidadeSlug, filters.busca, filters.categoria],
  );

  const { data, isInitialLoading, isLoadingMore, error, loadMore } =
    useCatalogoPublicoPaginado({
      baseQuery,
      fetcher: fetchEventosCatalogo,
      enabled: isCitiesReady,
    });

  const showGridSkeleton: boolean = isCitiesReady && isInitialLoading;
  const showGridError: boolean = isCitiesReady && Boolean(error);
  const isEmpty: boolean =
    isCitiesReady && !isInitialLoading && !error && data.items.length === 0;

  return (
    <Section spacing="xl">
      <SectionHeader description="Explore a agenda da cidade selecionada.">
        Eventos em {cidadeNome || "…"}
      </SectionHeader>

      {errorCidades ? (
        <div className="mt-8">
          <EmptyState
            title="Erro ao carregar cidades"
            description={errorCidades}
          />
        </div>
      ) : null}

      {!errorCidades && isLoadingCidades ? (
        <p className="mt-8 text-sm text-zinc-600">Carregando cidades…</p>
      ) : null}

      {!errorCidades && !isLoadingCidades ? (
        <div className="mt-8">
          <CatalogFilters
            cidadeSlug={cidadeSlug}
            cidades={cidades}
            value={filters}
            onCidadeChange={setCidadeSlug}
            onChange={setFilters}
            config={eventosFiltersConfig}
          />
        </div>
      ) : null}

      <div className="mt-8">
        {showGridSkeleton ? <CatalogGridSkeleton count={6} /> : null}

        {showGridError && error ? (
          <EmptyState title="Erro ao carregar eventos" description={error} />
        ) : null}

        {isEmpty ? (
          <EmptyState
            title="Nenhum evento encontrado"
            description="Tente mudar a cidade, a busca ou a categoria."
          />
        ) : null}

        {!isInitialLoading && !error && isCitiesReady && data.items.length > 0 ? (
          <>
            <CatalogGrid items={data.items} />
            {data.hasMore ? (
              <LoadMoreButton isLoading={isLoadingMore} onClick={loadMore} />
            ) : null}
          </>
        ) : null}
      </div>
    </Section>
  );
}
