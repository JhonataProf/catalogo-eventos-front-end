import type { ICidade } from "@/entities/cidade/cidade.types";
import type { ICidadeApiResponse } from "../contracts/cidade.contracts";

export function toCidadeEntity(api: ICidadeApiResponse): ICidade {
  return {
    id: api.id,
    nome: api.nome,
    slug: api.slug,
    uf: api.uf,
    descricao: api.descricao,
    imagemUrl: api.imagem_principal,
  };
}