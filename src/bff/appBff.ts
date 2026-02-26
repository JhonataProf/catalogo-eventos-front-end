// src/bff/appBff.ts
import type { AppState } from "../context/appDataContext";
import type { Cidade, Evento, PontoTuristico } from "../domain";
import { api } from "../http/api";


export async function findEventById(id: string): Promise<Evento> {
  const response = await api.get<Evento>(`/eventos/${id}`);
  return response.data;
}

export async function findPontoById(id: string): Promise<PontoTuristico> {
  const response = await api.get<PontoTuristico>(`/pontos/${id}`);
  return response.data;
}
// --------- Carga inicial ---------
export async function fetchAppState(): Promise<AppState> {
  const [eventosRes, cidadesRes, pontosRes] = await Promise.all([
    api.get<Evento[]>("/eventos"),
    api.get<Cidade[]>("/cidades"),
    api.get<PontoTuristico[]>("/pontos")
  ]);
  console.log("fetchAppState: eventos", eventosRes.data);
  console.log("fetchAppState: cidades", cidadesRes.data);
  console.log("fetchAppState: pontos", pontosRes.data);

  return {
    eventos: eventosRes.data,
    cidades: cidadesRes.data,
    pontos: pontosRes.data,
  };
}

// --------- Eventos ---------

export async function createEventoApi(payload: Evento): Promise<Evento> {
  const response = await api.post<Evento>("/eventos", payload);
  console.log("createEventoApi response:", response.data);
  return response.data;
}

export async function updateEventoApi(payload: Evento): Promise<Evento> {
  if (!payload.id) {
    throw new Error("updateEventoApi: evento sem id");
  }
  const response = await api.put<Evento>(`/eventos/${payload.id}`, payload);
  return response.data;
}

export async function deleteEventoApi(id: string): Promise<void> {
  await api.delete(`/eventos/${id}`);
}

// --------- (Cidades – se quiser evoluir depois) ---------

export async function createCidadeApi(payload: Omit<Cidade, "id">): Promise<Cidade> {
  const response = await api.post<Cidade>("/cidades", payload);
  return response.data;
}

export async function updateCidadeApi(payload: Cidade): Promise<Cidade> {
  if (!payload.id) {
    throw new Error("updateCidadeApi: cidade sem id");
  }
  const response = await api.put<Cidade>(`/cidades/${payload.id}`, payload);
  return response.data;
}

export async function deleteCidadeApi(id: string): Promise<void> {
  await api.delete(`/cidades/${id}`);
}
