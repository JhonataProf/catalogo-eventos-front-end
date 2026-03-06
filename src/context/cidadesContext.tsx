import React, { useCallback, useMemo, useState } from "react";
import { findCidadeBySlug, listCidades, type SortDir } from "../bff/appBff";
import {
  CidadesContext,
  type CidadesContextValue,
  initialCidadesState,
} from "./cidadesStore";

export type CidadesQuery = {
  limit?: number;
  sortBy?: string;
  sortDir?: SortDir;
};

export const CidadesProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState(initialCidadesState);

  const fetchAll = useCallback(async (query?: CidadesQuery) => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await listCidades({
        page: 1,
        limit: query?.limit ?? 500,
        sortBy: query?.sortBy ?? "nome",
        sortDir: query?.sortDir ?? "asc",
      });

      setState({ items: res.items, loading: false, error: null });
    } catch (e) {
      console.error(e);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Não foi possível carregar cidades.",
      }));
    }
  }, []);

  const finbBySlug = useCallback(async (slugValue: string): Promise<void> => {
    const formmated = slugValue.toLowerCase().replace(/\s+/g, "-");

    const item = await findCidadeBySlug(formmated);
    const newItems = [item, ...state.items]
    setState({
      ...state,
      items: newItems
    })
  }, [setState, state])

  const value = useMemo<CidadesContextValue>(
    () => ({ state, fetchAll, finbBySlug }),
    [state, fetchAll, finbBySlug],
  );

  return (
    <CidadesContext.Provider value={value}>{children}</CidadesContext.Provider>
  );
};
