import type {
  ICatalogoItem,
  ICatalogoQuery,
  ICatalogoResult,
} from "@/domains/catalogo-publico/shared/model/catalogo.types";
import type { IPontoTuristico } from "@/entities/ponto-turistico/pontoTuristico.types";
import { tourismApiClient } from "@/services/tourism-api/client";

function mapPontoToCatalogoItem(
  ponto: IPontoTuristico
): ICatalogoItem {
  return {
    id: ponto.id,
    kind: "ponto-turistico",
    cidadeId: ponto.cidadeId,
    cidadeSlug: ponto.cidadeSlug,
    titulo: ponto.nome,
    descricao: ponto.descricao,
    imagemUrl: ponto.imagemPrincipal,
    categoria: ponto.categoria,
    localLabel: ponto.endereco,
    destaque: ponto.destaque,
    href: `/pontos-turisticos/${ponto.id}`,
    ctaLabel: "Ver local",
  };
}

export async function fetchPontosCatalogo(
  query: ICatalogoQuery
): Promise<ICatalogoResult> {
  const response = await tourismApiClient.listPontosByCidade({
    cidade: query.cidade,
    page: query.page,
    limit: query.limit,
    busca: query.busca,
    categoria: query.categoria,
  });

  return {
    items: response.items.map(mapPontoToCatalogoItem),
    total: response.total,
    page: response.page,
    limit: response.limit,
  };
}