import { CidadeAtualProvider } from "@/domains/cidade-atual/cidadeAtual.context";
import type { PropsWithChildren, ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

export function AppProviders({
  children,
}: PropsWithChildren): ReactElement {
  return (
    <BrowserRouter>
      <CidadeAtualProvider>{children}</CidadeAtualProvider>
    </BrowserRouter>
  );
}