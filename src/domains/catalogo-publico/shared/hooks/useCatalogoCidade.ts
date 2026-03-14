import { useCallback, useMemo, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import type { ICidade } from "@/entities/cidade/cidade.types";
import { CIDADES_PUBLICAS } from "@/entities/cidade/cidades.constants";

const DEFAULT_CIDADE_SLUG = "dourados";

interface IUseCatalogoCidadeResult {
  cidadeSlug: string;
  cidadeNome: string;
  cidades: ICidade[];
  handleCidadeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  setCidadeSlug: (slug: string) => void;
}

function isCidadeValida(slug: string): boolean {
  return CIDADES_PUBLICAS.some((cidade: ICidade) => cidade.slug === slug);
}

function getCidadeBySlug(slug: string): ICidade | undefined {
  return CIDADES_PUBLICAS.find((cidade: ICidade) => cidade.slug === slug);
}

export function useCatalogoCidade(): IUseCatalogoCidadeResult {
  const [searchParams, setSearchParams] = useSearchParams();

  const cidadeSlug: string = useMemo(() => {
    const slugFromUrl: string | null = searchParams.get("cidade");

    if (!slugFromUrl) {
      return DEFAULT_CIDADE_SLUG;
    }

    return isCidadeValida(slugFromUrl) ? slugFromUrl : DEFAULT_CIDADE_SLUG;
  }, [searchParams]);

  const cidadeNome: string = useMemo(() => {
    const cidade: ICidade | undefined = getCidadeBySlug(cidadeSlug);
    return cidade?.nome ?? "Dourados";
  }, [cidadeSlug]);

  const setCidadeSlug = useCallback(
    (slug: string): void => {
      const nextSlug: string = isCidadeValida(slug) ? slug : DEFAULT_CIDADE_SLUG;
      const nextParams: URLSearchParams = new URLSearchParams(searchParams);
      nextParams.set("cidade", nextSlug);
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleCidadeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>): void => {
      setCidadeSlug(event.target.value);
    },
    [setCidadeSlug]
  );

  return {
    cidadeSlug,
    cidadeNome,
    cidades: CIDADES_PUBLICAS,
    handleCidadeChange,
    setCidadeSlug,
  };
}