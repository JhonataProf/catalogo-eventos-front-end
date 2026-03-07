import { createContext, useContext } from "react";
import type { SortDir } from "../bff/appBff";
import type { PontoTuristico } from "../domain";

export type PontosQuery = {
  cidadeId?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: SortDir;
};

export type Query = {
  cidadeId?: number;
};

export type PontoView = {
  ponto: PontoTuristico;
  cidadeLabel: string;
};

export type PontosState = {
  items: PontoTuristico[];
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  error: string | null;
  search: string;
  tipo: string;
  cidadeId: number;
};

export const initial: PontosState = {
  items: [],
  page: 0,
  totalPages: 1,
  total: 0,
  loading: false,
  error: null,
  search: "",
  tipo: "",
  cidadeId: 0
};

export type PontosContextValue = {
  state: PontosState;
  query: PontosQuery;

  fetchFirstPage: (query?: PontosQuery) => Promise<void>;
  loadMore: () => Promise<void>;
  setQuery: (query: PontosQuery) => void;
};

export const PontosContext = createContext<PontosContextValue | null>(null);

export function usePontosPublic() {
  const ctx = useContext(PontosContext);
  if (!ctx) throw new Error("usePontosPublic deve ser usado dentro de PontosProvider");
  return ctx;
}