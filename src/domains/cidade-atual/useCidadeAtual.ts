import { useContext } from "react";
import { CidadeAtualContext } from "./cidadeAtual.context";
import type { ICidadeAtualContextValue } from "./cidadeAtual.types";

export function useCidadeAtual(): ICidadeAtualContextValue {
  const context: ICidadeAtualContextValue | null =
    useContext(CidadeAtualContext);

  if (!context) {
    throw new Error(
      "useCidadeAtual deve ser usado dentro de CidadeAtualProvider"
    );
  }

  return context;
}