import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  findCidadeById,
  findEventById,
  listEventos,
  type SortDir,
} from "../bff/appBff";
import {
  type EmptyQuery,
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
  const queryKeyRef = useRef<string>("");

  const fetchFirstPage = useCallback(
    async (q?: Omit<EventosQuery, "page">) => {
      const nextQuery: EventosQuery = { ...query, ...q, page: 1 };

      setQuery(nextQuery);
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const res = await listEventos({
          page: nextQuery.page ?? 1,
          limit: nextQuery.limit ?? 12,
          sortBy: nextQuery.sortBy ?? "data",
          sortDir: nextQuery.sortDir ?? "asc",
        });

        const cidade = await findCidadeById(res.items[0].cidadeId);

        setState({
          items: res.items,
          page: res.page,
          totalPages: res.totalPages,
          total: res.total,
          loading: false,
          error: null,
          cidade: cidade,
        });
      } catch (e) {
        console.error(e);
        setState((s) => ({
          ...s,
          loading: false,
          error: "Não foi possível carregar eventos.",
        }));
      }
    },
    [query],
  );

  const findById = useCallback(async (id: number) => {
    try {
      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));
      const item = await findEventById(id);
      const cidadeEvt = await findCidadeById(id);
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
        error: "Não foi possível carregar pontos turísticos.",
      }));
    } finally {
      setState((s) => ({
        ...s,
        loading: false,
        error: null,
      }));
    }
  }, []);

  const findCidadeEvento = useCallback(async (id: number) => {
    try {
      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));
      const cidadeEvt = await findCidadeById(id);
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
        error: "Não foi possível carregar esse evento.",
      }));
    } finally {
      setState((s) => ({
        ...s,
        loading: false,
        error: null,
      }));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (state.loading) return;
    if (state.page >= state.totalPages) return;

    const nextPage = state.page + 1;
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await listEventos({
        page: nextPage,
        limit: query.limit ?? 12,
        sortBy: query.sortBy ?? "data",
        sortDir: query.sortDir ?? "asc",
      });

      setState((s) => ({
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
    }
  }, [state.loading, state.page, state.totalPages, query]);

  const categoryOptions = useMemo(() => {
    const cats = Array.from(
      new Set(state.items.map((e) => e.cat).filter(Boolean)),
    ).sort();
    return [
      { value: "", label: "Todas as categorias" },
      ...cats.map((c) => ({ value: c, label: c })),
    ];
  }, [state]);

  const filtrados = useMemo(() => {
    const q = state?.search?.trim().toLowerCase();
    return state.items.filter((ev) => {
      const okCat = !state.category || ev.cat === state.category;
      const okQ =
        !q || `${ev.titulo} ${ev.local} ${ev.cat}`.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [state.items, state.search, state.category]);

  const loadPage = useCallback(
    async ({
      page,
      limit,
    }: {
      page: number;
      limit: number;
      query: EmptyQuery;
    }) => {
      const res = await listEventos({
        page,
        limit,
        sortBy: "data",
        sortDir: "asc",
      });
      return {
        items: res.items,
        page: res.page,
        totalPages: res.totalPages,
        total: res.total,
      };
    },
    [],
  );

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

  const loadNext = useCallback(async () => {
    if (state.loading || inflight.current) return;
    if (!canLoadMore && state.page !== 0) return;
    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));
    try {
      const nextPage = state.page + 1;
      const res = await loadPage({
        page: nextPage,
        limit: query.limit || 10,
        query: {},
      });
      const { items, page, total, totalPages } = res;
      setState((s) => ({
        ...s,
        items,
        page,
        total,
        totalPages,
      }));
    } catch (error) {
      console.error(error);
    }
  }, [canLoadMore, loadPage, query.limit, state.loading, state.page]);

  useEffect(() => {
    if (!state.resetOnQueryChange) return;

    const key = JSON.stringify(query);
    if (queryKeyRef.current === "") queryKeyRef.current = key;

    if (queryKeyRef.current !== key) {
      queryKeyRef.current = key;
      reset();
      if (state.auto) void loadNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, state.resetOnQueryChange]);

  // load inicial
  useEffect(() => {
    if (!state.auto) return;
    if (state.page === 0 && state.items.length === 0 && !state.loading)
      void loadNext();
  }, [state.auto, loadNext, state.items.length, state.page, state.loading]);

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
      loadPage,
      setSearch,
      setCategory,
      reset,
      canLoadMore,
      loadNext,
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
      loadPage,
      setSearch,
      setCategory,
      reset,
      canLoadMore,
      loadNext,
    ],
  );

  return (
    <EventosContext.Provider value={value}>{children}</EventosContext.Provider>
  );
};
