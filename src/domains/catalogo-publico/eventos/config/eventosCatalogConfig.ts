import type {
  ICatalogoItem,
  ICatalogoQuery,
  ICatalogoResult,
} from "@/domains/catalogo-publico/shared/model/catalogo.types";
import type { IEvento } from "@/entities/evento/evento.types";
import { tourismApiClient } from "@/services/tourism-api/client";

function mapEventoToCatalogoItem(evento: IEvento): ICatalogoItem {
  return {
    id: evento.id,
    kind: "evento",
    cidadeId: evento.cidadeId,
    cidadeSlug: evento.cidadeSlug,
    titulo: evento.nome,
    descricao: evento.descricao,
    imagemUrl: evento.imagemPrincipal,
    categoria: evento.categoria,
    dataLabel: evento.dataFormatada,
    localLabel: evento.local,
    destaque: evento.destaque,
    href: `/eventos/${evento.id}`,
    ctaLabel: "Ver evento",
  };
}

export async function fetchEventosCatalogo(
  query: ICatalogoQuery
): Promise<ICatalogoResult> {
  const response = await tourismApiClient.listEventosByCidade({
    cidade: query.cidade,
    page: query.page,
    limit: query.limit,
    busca: query.busca,
    categoria: query.categoria,
  });

  return {
    items: response.items.map(mapEventoToCatalogoItem),
    total: response.total,
    page: response.page,
    limit: response.limit,
  };
}