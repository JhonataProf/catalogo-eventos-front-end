import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ICatalogoPaginatedState,
  ICatalogoQuery,
  ICatalogoResult,
} from "../model/catalogo.types";

export interface IUseCatalogoPublicoPaginadoParams {
  baseQuery: Omit<ICatalogoQuery, "page">;
  fetcher: (query: ICatalogoQuery) => Promise<ICatalogoResult>;
  initialPage?: number;
}

export interface IUseCatalogoPublicoPaginadoResult {
  data: ICatalogoPaginatedState;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  reload: () => Promise<void>;
}

const DEFAULT_LIMIT = 12;

function buildInitialState(limit: number): ICatalogoPaginatedState {
  return {
    items: [],
    total: 0,
    page: 1,
    limit,
    hasMore: false,
  };
}

export function useCatalogoPublicoPaginado({
  baseQuery,
  fetcher,
  initialPage = 1,
}: IUseCatalogoPublicoPaginadoParams): IUseCatalogoPublicoPaginadoResult {
  const cidade: string = baseQuery.cidade;
  const busca: string | undefined = baseQuery.busca;
  const categoria: string | undefined = baseQuery.categoria;
  const safeLimit: number = baseQuery.limit > 0 ? baseQuery.limit : DEFAULT_LIMIT;

  const [data, setData] = useState<ICatalogoPaginatedState>(
    buildInitialState(safeLimit)
  );
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const stableBaseQuery = useMemo(
    () => ({
      cidade,
      busca,
      categoria,
      limit: safeLimit,
    }),
    [cidade, busca, categoria, safeLimit]
  );

  const executeFetch = useCallback(
    async (page: number, append: boolean): Promise<void> => {
      const query: ICatalogoQuery = {
        ...stableBaseQuery,
        page,
      };

      const response: ICatalogoResult = await fetcher(query);

      setData((currentState: ICatalogoPaginatedState) => {
        const nextItems = append
          ? [...currentState.items, ...response.items]
          : response.items;

        const loadedItemsCount: number = nextItems.length;
        const hasMore: boolean = loadedItemsCount < response.total;

        return {
          items: nextItems,
          total: response.total,
          page: response.page,
          limit: response.limit,
          hasMore,
        };
      });
    },
    [fetcher, stableBaseQuery]
  );

  const reload = useCallback(async (): Promise<void> => {
    try {
      setIsInitialLoading(true);
      setError(null);
      await executeFetch(initialPage, false);
    } catch {
      setError("Não foi possível carregar os dados.");
      setData(buildInitialState(safeLimit));
    } finally {
      setIsInitialLoading(false);
    }
  }, [executeFetch, initialPage, safeLimit]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (isLoadingMore || isInitialLoading || !data.hasMore) {
      return;
    }

    try {
      setIsLoadingMore(true);
      setError(null);
      await executeFetch(data.page + 1, true);
    } catch {
      setError("Não foi possível carregar mais os dados.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [data.hasMore, data.page, executeFetch, isInitialLoading, isLoadingMore]);

  useEffect(() => {
    let isActive: boolean = true;

    async function syncData(): Promise<void> {
      try {
        setIsInitialLoading(true);
        setError(null);

        const query: ICatalogoQuery = {
          ...stableBaseQuery,
          page: initialPage,
        };

        const response: ICatalogoResult = await fetcher(query);

        if (!isActive) {
          return;
        }

        setData({
          items: response.items,
          total: response.total,
          page: response.page,
          limit: response.limit,
          hasMore: response.items.length < response.total,
        });
      } catch {
        if (!isActive) {
          return;
        }

        setError("Não foi possível carregar os dados.");
        setData(buildInitialState(safeLimit));
      } finally {
        if (isActive) {
          setIsInitialLoading(false);
        }
      }
    }

    void syncData();

    return () => {
      isActive = false;
    };
  }, [fetcher, initialPage, safeLimit, stableBaseQuery]);

  return {
    data,
    isInitialLoading,
    isLoadingMore,
    error,
    loadMore,
    reload,
  };
}