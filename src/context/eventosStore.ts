import { createContext, useContext } from "react";
import type { Cidade, Evento } from "../domain";
import type { EventosQuery } from "./eventosContext";

export type EventosState = {
  items: Evento[] | [];
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  error: string | null;
  cidade?: Cidade | null;
  eventoSelecionado?: Evento | null;
  category?: string | null;
  search?: string | null;
  auto?: boolean;
  resetOnQueryChange?: boolean;
};

export const initialEventosState: EventosState = {
  items: [],
  page: 0,
  totalPages: 1,
  total: 0,
  loading: false,
  error: null,
  cidade: null,
  eventoSelecionado: null,
  category: '',
  search: '',
  auto: true,
  resetOnQueryChange: true,
};

export type EventosContextValue = {
  state: EventosState;
  query: EventosQuery;
  categoryOptions: { value: string; label: string }[];
  filtrados: Evento[];
  setQuery: (query: EventosQuery) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  reset: () => void;

  fetchFirstPage: (query?: Omit<EventosQuery, "page">) => Promise<void>;
  loadMore: () => Promise<void>;
  findById: (id: number) => Promise<void>;
  findCidadeEvento: (id: number) => Promise<void>;
  canLoadMore: boolean;

};

export type EmptyQuery = Record<string, never>;

export const EventosContext = createContext<EventosContextValue | null>(null);

export function useEventosPublic() {
  const ctx = useContext(EventosContext);
  if (!ctx)
    throw new Error(
      "useEventosPublic deve ser usado dentro de EventosProvider",
    );
  return ctx;
}
