import type { ICidade } from "@/entities/cidade/cidade.types";
import { CIDADES_PUBLICAS } from "@/entities/cidade/cidades.constants";
import {
  CIDADE_DEFAULT,
  type ICidadeAtual,
} from "./cidadeAtual.types";

export function findCidadeBySlug(slug: string): ICidadeAtual {
  const foundCidade: ICidade | undefined = CIDADES_PUBLICAS.find(
    (cidade: ICidade) => cidade.slug === slug
  );

  if (!foundCidade) {
    return CIDADE_DEFAULT;
  }

  return {
    id: foundCidade.id,
    nome: foundCidade.nome,
    slug: foundCidade.slug,
  };
}

export function isCidadeSlugValid(slug: string): boolean {
  return CIDADES_PUBLICAS.some((cidade: ICidade) => cidade.slug === slug);
}