import { createContext, useContext } from "react";
import type { Evento } from "../domain";

export type EventosContextValue = {
  eventos: Evento[];
  loading: boolean;
  error: string | null;

  createOrUpdateEvento: (evento: Omit<Evento, "id"> & { id?: string }) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;
  refreshEventos: () => Promise<void>;
};

export const EventosContext = createContext<EventosContextValue | undefined>(
  undefined
);

export function useEventosStore() {
  const ctx = useContext(EventosContext);
  if (!ctx) {
    throw new Error("useEventosStore deve ser usado dentro de EventosProvider");
  }
  return ctx;
}