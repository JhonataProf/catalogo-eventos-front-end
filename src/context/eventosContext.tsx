import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  findCidadeById,
  findEventById,
  listEventos,
  type SortDir,
} from "../bff/appBff";
import {
  EventosContext,
  type EventosContextValue,
  initialEventosState,
} from "./eventosStore";

export type EventosQuery = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: SortDir;
};

export const EventosProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState(initialEventosState);
  const [query, setQuery] = useState<EventosQuery>({
    page: 1,
    limit: 12,
    sortBy: "data",
    sortDir: "asc",
  });

  const inflight = useRef(false);

  const fetchFirstPage = useCallback(
    async (q?: Omit<EventosQuery, "page">) => {
      const nextQuery: EventosQuery = { ...query, ...q, page: 1 };

      if (inflight.current) return;
      inflight.current = true;

      setQuery(nextQuery);
      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));

      try {
        const res = await listEventos({
          page: nextQuery.page ?? 1,
          limit: nextQuery.limit ?? 12,
          sortBy: nextQuery.sortBy ?? "data",
          sortDir: nextQuery.sortDir ?? "asc",
        });

        let cidade = null;
        if (res.items.length > 0) {
          try {
            cidade = await findCidadeById(res.items[0].cidadeId);
          } catch (e) {
            console.error("Não foi possível carregar a cidade do primeiro evento.", e);
          }
        }

        setState((s) => ({
          ...s,
          items: res.items,
          page: res.page,
          totalPages: res.totalPages,
          total: res.total,
          cidade,
          loading: false,
          error: null,
        }));
      } catch (e) {
        console.error(e);
        setState((s) => ({
          ...s,
          loading: false,
          error: "Não foi possível carregar eventos.",
        }));
      } finally {
        inflight.current = false;
      }
    },
    [query],
  );

  const findById = useCallback(async (id: number) => {
    if (inflight.current) return;
    inflight.current = true;

    try {
      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));

      const item = await findEventById(id);
      const cidadeEvt = await findCidadeById(item.cidadeId);

      setState((s) => ({
        ...s,
        eventoSelecionado: item,
        cidade: cidadeEvt,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error(error);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Não foi possível carregar esse evento.",
      }));
    } finally {
      inflight.current = false;
    }
  }, []);

  const findCidadeEvento = useCallback(async (cidadeId: number) => {
    if (inflight.current) return;
    inflight.current = true;

    try {
      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));

      const cidadeEvt = await findCidadeById(cidadeId);

      setState((s) => ({
        ...s,
        cidade: cidadeEvt,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error(error);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Não foi possível carregar a cidade desse evento.",
      }));
    } finally {
      inflight.current = false;
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (state.loading || inflight.current) return;
    if (state.page >= state.totalPages) return;

    inflight.current = true;

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    try {
      const nextPage = state.page + 1;
      const res = await listEventos({
        page: nextPage,
        limit: query.limit ?? 12,
        sortBy: query.sortBy ?? "data",
        sortDir: query.sortDir ?? "asc",
      });

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
        error: "Não foi possível carregar mais eventos.",
      }));
    } finally {
      inflight.current = false;
    }
  }, [state.loading, state.page, state.totalPages, query]);

  const setSearch = useCallback((search: string) => {
    setState((s) => ({
      ...s,
      search,
    }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setState((s) => ({
      ...s,
      category,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialEventosState);
  }, []);

  const canLoadMore = state.page < state.totalPages;

  const categoryOptions = useMemo(() => {
    const cats = Array.from(
      new Set(state.items.map((e) => e.cat).filter(Boolean)),
    ).sort();

    return [
      { value: "", label: "Todas as categorias" },
      ...cats.map((c) => ({ value: c, label: c })),
    ];
  }, [state.items]);

  const filtrados = useMemo(() => {
    const q = state.search?.trim().toLowerCase();

    return state.items.filter((ev) => {
      const okCat = !state.category || ev.cat === state.category;
      const okQ =
        !q || `${ev.titulo} ${ev.local} ${ev.cat}`.toLowerCase().includes(q);

      return okCat && okQ;
    });
  }, [state.items, state.search, state.category]);

  const value = useMemo<EventosContextValue>(
    () => ({
      state,
      query,
      fetchFirstPage,
      loadMore,
      setQuery,
      findById,
      findCidadeEvento,
      categoryOptions,
      filtrados,
      setSearch,
      setCategory,
      reset,
      canLoadMore,
    }),
    [
      state,
      query,
      fetchFirstPage,
      loadMore,
      findById,
      findCidadeEvento,
      categoryOptions,
      filtrados,
      setSearch,
      setCategory,
      reset,
      canLoadMore,
    ],
  );

  return (
    <EventosContext.Provider value={value}>
      {children}
    </EventosContext.Provider>
  );
};