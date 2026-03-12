import type { IEvento } from "@/entities/evento/evento.types";
import type { IEventoApiResponse } from "../contracts/evento.contracts";

export function toEventoEntity(api: IEventoApiResponse): IEvento {
  return {
    id: api.id,
    cidadeId: api.cidade_id,
    cidadeSlug: api.cidade_slug,
    nome: api.nome,
    descricao: api.descricao,
    categoria: api.categoria,
    dataInicio: api.data_inicio,
    dataFim: api.data_fim,
    dataFormatada: api.data_formatada,
    local: api.local,
    imagemPrincipal: api.imagem_principal,
    destaque: api.destaque,
  };
}