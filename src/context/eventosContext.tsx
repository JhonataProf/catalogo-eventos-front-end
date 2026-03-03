import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { Evento } from "../domain";
import {
  createEventoApi,
  deleteEventoApi,
//   fetchAppState,
  updateEventoApi,
} from "../bff/appBff";
import { EventosContext, type EventosContextValue } from "./eventosStore";

// const LS_KEY = "douradosplus-eventos-v1";

export const EventosProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // const data = await fetchAppState();
        // setEventos(data.eventos ?? []);
      } catch (e) {
        console.error(e);
         
        setError("Erro ao carregar eventos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const createOrUpdateEvento = useCallback(async (eventoInput: Omit<Evento, "id"> & { id?: string }) => {
    const isUpdate = Boolean(eventoInput.id);

    const idCreated = eventoInput.id ?? crypto.randomUUID();
    const payload: Evento = {
        ...eventoInput,
        id: idCreated,
    };

    const saved = isUpdate
      ? await updateEventoApi(payload)
      : await createEventoApi(payload);

    setEventos((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((e) => e.id === saved.id);
      if (idx >= 0) copy[idx] = saved;
      else copy.push(saved);
      return copy;
    });
  }, []);

  const deleteEvento = useCallback(async (id: string) => {
    await deleteEventoApi(id);
    setEventos((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const refreshEventos = useCallback(async () => {
    // const data = await fetchAppState();
    // setEventos(data.eventos ?? []);
  }, []);

  const value = useMemo<EventosContextValue>(
    () => ({
      eventos,
      loading,
      error,
      createOrUpdateEvento,
      deleteEvento,
      refreshEventos,
    }),
    [eventos, loading, error, createOrUpdateEvento, deleteEvento, refreshEventos]
  );

  return (
    <EventosContext.Provider value={value}>
      {children}
    </EventosContext.Provider>
  );
};