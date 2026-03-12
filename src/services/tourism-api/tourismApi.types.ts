import type { ICidade } from "@/entities/cidade/cidade.types";
import type { IEvento } from "@/entities/evento/evento.types";
import type { IPontoTuristico } from "@/entities/ponto-turistico/pontoTuristico.types";

export interface IListByCidadeParams {
  cidade: string;
  page: number;
  limit: number;
  busca?: string;
  categoria?: string;
}

export interface ITourismApiListResponse<TItem> {
  items: TItem[];
  page: number;
  limit: number;
  total: number;
}

export interface ITourismApiClient {
  listCidades: () => Promise<ICidade[]>;
  listEventosByCidade: (
    params: IListByCidadeParams
  ) => Promise<ITourismApiListResponse<IEvento>>;
  listPontosByCidade: (
    params: IListByCidadeParams
  ) => Promise<ITourismApiListResponse<IPontoTuristico>>;
  getEventoById: (id: string) => Promise<IEvento | null>;
  getPontoById: (id: string) => Promise<IPontoTuristico | null>;
}