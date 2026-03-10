import React, { useCallback, useMemo, useRef, useState } from "react";
import { listPontosTuristicos, listPontosByCidadeId, findCidadeById, listCidades } from "../bff/appBff";
import {
  initial,
  PontosContext,
  type PontosContextValue,
  type PontosQuery,
  type PontosState,
  type PontoView,
} from "./pontosStore";
import type { Cidade } from "../domain";
import { api } from "../http/api";

export function PontosProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PontosState>(initial);
  const [cidade, setCidade] = useState<Cidade|null>(null)
  const [query, setQueryState] = useState<PontosQuery>({
    limit: 12,
    sortBy: "nome",
    sortDir: "asc",
  });

  const inflight = useRef(false);

  const setQuery = useCallback((q: PontosQuery) => {
    setQueryState((qs) => ({
      ...qs,
      ...q,
    }));
  }, []);

  const canLoadMore = state.page < state.totalPages;

  const fetchCidade = useCallback(async() => {
    if(!query.cidadeId) return;
    const resCidade = await findCidadeById(query.cidadeId)
    if(!resCidade) return;
    setCidade(resCidade)
  }, [query.cidadeId])

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

      if (inflight.current) return;
      inflight.current = true;

      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));

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
      } finally {
        inflight.current = false;
      }
    },
    [fetchPage, query],
  );

  const loadMore = useCallback(async () => {
    if (state.loading || inflight.current) return;
    if (!canLoadMore && state.page !== 0) return;

    inflight.current = true;

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

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
    } finally {
      inflight.current = false;
    }
  }, [canLoadMore, fetchPage, query, state.loading, state.page]);

  const fetchAllCidades = useCallback(async() => {

    const cidades = await api.get<Cidade[]>("/cidades");
  }, [])

  const cidadesMap = useMemo(() => {
    return new Map<number, Cidade>(cidades.map((c) => [c.id, c]));
  }, [cidades]);

  const cidadeOptions = useMemo(() => {
    return [
      { value: "", label: "Todas as cidades" },
      ...cidades.map((c) => ({
        value: String(c.id),
        label: `${c.nome} / ${c.uf}`,
      })),
    ];
  }, [cidades]);
  // ====== ViewModels (para UI) ======
  const pontosView = useMemo<PontoView[]>(() => {
    return (pontos ?? []).map((p) => {
      const c = cidadesMap.get(p.cidadeId);
      const cidadeLabel = c ? `${c.nome} / ${c.uf}` : "";
      return { ponto: p, cidadeLabel };
    });
  }, [pontos, cidadesMap]);

  const tipoOptions = useMemo(() => {
    const types = Array.from(
      new Set(pontosView.map((x) => x.ponto.tipo).filter(Boolean)),
    ).sort();
    return [
      { value: "", label: "Todos os tipos" },
      ...types.map((t) => ({ value: t, label: t })),
    ];
  }, [pontosView]);

  // ====== filtros locais (não re-bate na API) ======
  const filtrados = useMemo(() => {
    const q = query?.search?.trim().toLowerCase() ?? {};
    return pontosView.filter(({ ponto, cidadeLabel }) => {
      const okTipo = !query.tipo || ponto.tipo === query.tipo;
      const txt = `${ponto.nome} ${ponto.tipo} ${cidadeLabel}`.toLowerCase();
      const okSearch = !q || txt.includes(q);
      return okTipo && okSearch;
    });
  }, [pontosView, query.search, query.tipo]);

  const reset = useCallback(() => {
    setState(initial);
  }, []);

  const value = useMemo<PontosContextValue>(
    () => ({
      state,
      query,
      fetchFirstPage,
      loadMore,
      setQuery,
      canLoadMore,
      reset,
      fetchPage,
    }),
    [
      state,
      query,
      fetchFirstPage,
      loadMore,
      setQuery,
      canLoadMore,
      reset,
      fetchPage,
    ],
  );

  return (
    <PontosContext.Provider value={value}>{children}</PontosContext.Provider>
  );
}
