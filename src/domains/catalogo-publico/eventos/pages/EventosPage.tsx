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
import { useMemo, useState, type ReactElement } from "react";
import { fetchEventosCatalogo } from "../config/eventosCatalogConfig";
import { eventosFiltersConfig } from "../config/eventosFiltersConfig";

export function EventosPage(): ReactElement {
  const { cidadeSlug, cidadeNome, cidades, setCidadeSlug } =
    useCatalogoCidade();

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
    });

  const isEmpty: boolean =
    !isInitialLoading && !error && data.items.length === 0;

  return (
    <Section spacing="xl">
      <SectionHeader description="Explore a agenda da cidade selecionada.">
        Eventos em {cidadeNome}
      </SectionHeader>

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

      <div className="mt-8">
        {isInitialLoading ? <CatalogGridSkeleton count={6} /> : null}

        {error ? (
          <EmptyState title="Erro ao carregar eventos" description={error} />
        ) : null}

        {isEmpty ? (
          <EmptyState
            title="Nenhum evento encontrado"
            description="Tente mudar a cidade, a busca ou a categoria."
          />
        ) : null}

        {!isInitialLoading && !error && data.items.length > 0 ? (
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
