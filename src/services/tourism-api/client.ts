import type { ICidade } from "@/entities/cidade/cidade.types";
import type { IEvento } from "@/entities/evento/evento.types";
import type { IPontoTuristico } from "@/entities/ponto-turistico/pontoTuristico.types";
import { toCidadeEntity } from "./adapters/cidade.adapters";
import { toEventoEntity } from "./adapters/evento.adapters";
import { toPontoTuristicoEntity } from "./adapters/pontoTuristico.adapters";
import { cidadesMock, eventosMock, mockDelay, pontosMock } from "./mock-data";
import type {
  IListByCidadeParams,
  ITourismApiClient,
  ITourismApiListResponse,
} from "./tourismApi.types";

function paginateItems<TItem>(
  items: TItem[],
  page: number,
  limit: number
): ITourismApiListResponse<TItem> {
  const safePage: number = page > 0 ? page : 1;
  const safeLimit: number = limit > 0 ? limit : 12;
  const startIndex: number = (safePage - 1) * safeLimit;
  const endIndex: number = startIndex + safeLimit;

  return {
    items: items.slice(startIndex, endIndex),
    total: items.length,
    page: safePage,
    limit: safeLimit,
  };
}

function includesNormalizedValue(
  sourceValue: string | undefined,
  targetValue: string | undefined
): boolean {
  if (!targetValue) {
    return true;
  }

  if (!sourceValue) {
    return false;
  }

  return sourceValue.toLowerCase().includes(targetValue.toLowerCase());
}

export const tourismApiClient: ITourismApiClient = {
  async listCidades(): Promise<ICidade[]> {
    await mockDelay();
    return cidadesMock.map(toCidadeEntity);
  },

  async listEventosByCidade(
    params: IListByCidadeParams
  ): Promise<ITourismApiListResponse<IEvento>> {
    await mockDelay();

    const filteredItems = eventosMock.filter((item) => {
      const matchesCidade: boolean = item.cidade_slug === params.cidade;
      const matchesBusca: boolean = includesNormalizedValue(item.nome, params.busca);
      const matchesCategoria: boolean =
        !params.categoria || item.categoria === params.categoria;

      return matchesCidade && matchesBusca && matchesCategoria;
    });

    const mappedItems: IEvento[] = filteredItems.map(toEventoEntity);

    return paginateItems(mappedItems, params.page, params.limit);
  },

  async listPontosByCidade(
    params: IListByCidadeParams
  ): Promise<ITourismApiListResponse<IPontoTuristico>> {
    await mockDelay();

    const filteredItems = pontosMock.filter((item) => {
      const matchesCidade: boolean = item.cidade_slug === params.cidade;
      const matchesBusca: boolean = includesNormalizedValue(item.nome, params.busca);
      const matchesCategoria: boolean =
        !params.categoria || item.categoria === params.categoria;

      return matchesCidade && matchesBusca && matchesCategoria;
    });

    const mappedItems: IPontoTuristico[] = filteredItems.map(
      toPontoTuristicoEntity
    );

    return paginateItems(mappedItems, params.page, params.limit);
  },

  async getEventoById(id: string): Promise<IEvento | null> {
    await mockDelay(180);

    const foundItem = eventosMock.find((item) => item.id === id);

    if (!foundItem) {
      return null;
    }

    return toEventoEntity(foundItem);
  },

  async getPontoById(id: string): Promise<IPontoTuristico | null> {
    await mockDelay(180);

    const foundItem = pontosMock.find((item) => item.id === id);

    if (!foundItem) {
      return null;
    }

    return toPontoTuristicoEntity(foundItem);
  },
};