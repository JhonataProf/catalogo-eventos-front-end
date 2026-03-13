import type { ITouristPoint } from "@/entities/tourist-point/touristPoint.types";
import { publicApiClient } from "@/services/public-api/client";
import type { ICatalogoItem, ICatalogoQuery, ICatalogoResult } from "../../shared/model/catalogo.types";

function mapTouristPointToCatalogItem(
  touristPoint: ITouristPoint
): ICatalogoItem {
  return {
    id: touristPoint.id,
    kind: "ponto-turistico",
    cidadeId: touristPoint.cityId,
    cidadeSlug: touristPoint.citySlug,
    titulo: touristPoint.name,
    descricao: touristPoint.description,
    imagemUrl: touristPoint.imageUrl,
    categoria: touristPoint.category,
    localLabel: touristPoint.address,
    destaque: touristPoint.featured,
    href: `/pontos-turisticos/${touristPoint.id}`,
    ctaLabel: "Ver local",
  };
}

export async function fetchPontosCatalogo(
  query: ICatalogoQuery
): Promise<ICatalogoResult> {
  const response = await publicApiClient.listPublishedTouristPoints({
    citySlug: query.cidade,
    search: query.busca,
    category: query.categoria,
    page: query.page,
    limit: query.limit,
  });

  return {
    items: response.items.map(mapTouristPointToCatalogItem),
    total: response.total,
    page: response.page,
    limit: response.limit,
  };
}