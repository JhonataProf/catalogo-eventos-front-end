import { createContext, useContext } from "react";
import type { Cidade, PontoTuristico } from "../domain";

export type CidadesContextValue = {
  cidades: Cidade[];
  pontos: PontoTuristico[];
  loading: boolean;
  error: string | null;

  createOrUpdateCidade: (cidade: Omit<Cidade, "id" | "pontos"> & { id?: string }) => Promise<void>;
  deleteCidade: (id: string) => Promise<void>;

  createOrUpdatePonto: (cidadeId: string, ponto: Omit<PontoTuristico, "id"> & { id?: string }) => void;
  deletePonto: (cidadeId: string, pontoId: string) => void;

  refreshCidades: () => Promise<void>;
};

export const CidadesContext = createContext<CidadesContextValue | undefined>(undefined);

export function useCidadesStore() {
    const ctx = useContext(CidadesContext);
    if (!ctx) throw new Error("useCidadesStore deve ser usado dentro de CidadesProvider");
    return ctx;
}