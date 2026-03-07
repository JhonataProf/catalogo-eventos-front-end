import React, { useCallback, useMemo, useState } from "react";
import {
  listPontosTuristicos,
  listPontosByCidadeId,
} from "../bff/appBff";
import { initial, PontosContext, type PontosContextValue, type PontosQuery, type PontosState } from "./pontosStore";



export function PontosProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PontosState>(initial);
  const [query, setQueryState] = useState<PontosQuery>({
    limit: 12,
    sortBy: "nome",
    sortDir: "asc",
  });

  const setQuery = useCallback((q: PontosQuery) => setQueryState(q), []);

  const fetchPage = useCallback(async (page: number, q: PontosQuery) => {
    const params = {
      page,
      limit: q.limit ?? 12,
      sortBy: q.sortBy,
      sortDir: q.sortDir,
    };

    if (q.cidadeId) return listPontosByCidadeId(q.cidadeId, params);
    return listPontosTuristicos(params);
  }, []);

  const fetchFirstPage = useCallback(
    async (q?: PontosQuery) => {
      const nextQuery = q ?? query;
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const res = await fetchPage(1, nextQuery);
        setState((s) => ({
          ...s,
          items: res.items,
          page: res.page,
          totalPages: res.totalPages,
          total: res.total,
          loading: false,
          error: null,
        }));
      } catch (e) {
        console.error(e);
        setState((s) => ({
          ...s,
          loading: false,
          error: "Não foi possível carregar pontos turísticos.",
        }));
      }
    },
    [fetchPage, query],
  );

  const loadMore = useCallback(async () => {
    if (state.loading) return;
    if (state.page >= state.totalPages) return;

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const nextPage = state.page + 1;
      const res = await fetchPage(nextPage, query);

      setState((s) => ({
        ...s,
        items: [...s.items, ...res.items],
        page: res.page,
        totalPages: res.totalPages,
        total: res.total,
        loading: false,
        error: null,
      }));
    } catch (e) {
      console.error(e);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Não foi possível carregar mais pontos.",
      }));
    }
  }, [fetchPage, query, state.loading, state.page, state.totalPages]);

  const value = useMemo<PontosContextValue>(
    () => ({ state, query, fetchFirstPage, loadMore, setQuery }),
    [state, query, fetchFirstPage, loadMore, setQuery],
  );

  return (
    <PontosContext.Provider value={value}>{children}</PontosContext.Provider>
  );
}
