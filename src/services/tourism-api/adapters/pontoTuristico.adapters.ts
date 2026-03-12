import type { IPontoTuristico } from "@/entities/ponto-turistico/pontoTuristico.types";
import type { IPontoTuristicoApiResponse } from "../contracts/pontoTuristico.contracts";

export function toPontoTuristicoEntity(
  api: IPontoTuristicoApiResponse
): IPontoTuristico {
  return {
    id: api.id,
    cidadeId: api.cidade_id,
    cidadeSlug: api.cidade_slug,
    nome: api.nome,
    descricao: api.descricao,
    categoria: api.categoria,
    endereco: api.endereco,
    horarioFuncionamento: api.horario_funcionamento,
    imagemPrincipal: api.imagem_principal,
    destaque: api.destaque,
  };
}