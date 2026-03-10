import { useEffect, useState } from "react";
import type {
  ICatalogoQuery,
  ICatalogoResult,
} from "../model/catalogo.types";

export interface IUseCatalogoPublicoParams {
  query: ICatalogoQuery;
  fetcher: (query: ICatalogoQuery) => Promise<ICatalogoResult>;
}

export interface IUseCatalogoPublicoResult {
  data: ICatalogoResult;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_RESULT: ICatalogoResult = {
  items: [],
  total: 0,
  page: 1,
  limit: 12,
};

export function useCatalogoPublico({
  query,
  fetcher,
}: IUseCatalogoPublicoParams): IUseCatalogoPublicoResult {
  const [data, setData] = useState<ICatalogoResult>({
    ...INITIAL_RESULT,
    page: query.page,
    limit: query.limit,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted: boolean = true;

    async function execute(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const result: ICatalogoResult = await fetcher(query);

        if (!isMounted) {
          return;
        }

        setData(result);
      } catch {
        if (!isMounted) {
          return;
        }

        setError("Não foi possível carregar os dados.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void execute();

    return () => {
      isMounted = false;
    };
  }, [fetcher, query]);

  return {
    data,
    isLoading,
    error,
  };
}