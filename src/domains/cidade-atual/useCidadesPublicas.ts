import type { ICidade } from "@/entities/cidade/cidade.types";
import { CIDADES_PUBLICAS } from "@/entities/cidade/cidades.constants";

export interface IUseCidadesPublicasResult {
  cidades: ICidade[];
}

export function useCidadesPublicas(): IUseCidadesPublicasResult {
  return {
    cidades: CIDADES_PUBLICAS,
  };
}