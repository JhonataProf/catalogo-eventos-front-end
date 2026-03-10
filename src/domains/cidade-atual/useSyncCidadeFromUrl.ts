import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CIDADE_DEFAULT_SLUG } from "./cidadeAtual.types";
import { isCidadeSlugValid } from "./cidadeAtual.utils";
import { useCidadeAtual } from "./useCidadeAtual";

export function useSyncCidadeFromUrl(): void {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cidade, setCidadeBySlug } = useCidadeAtual();

  useEffect(() => {
    const cidadeSlugFromUrl: string | null = searchParams.get("cidade");

    if (!cidadeSlugFromUrl) {
      const nextParams: URLSearchParams = new URLSearchParams(searchParams);
      nextParams.set("cidade", cidade.slug || CIDADE_DEFAULT_SLUG);
      setSearchParams(nextParams, { replace: true });
      return;
    }

    if (!isCidadeSlugValid(cidadeSlugFromUrl)) {
      const nextParams: URLSearchParams = new URLSearchParams(searchParams);
      nextParams.set("cidade", CIDADE_DEFAULT_SLUG);
      setSearchParams(nextParams, { replace: true });
      return;
    }

    if (cidade.slug !== cidadeSlugFromUrl) {
      setCidadeBySlug(cidadeSlugFromUrl);
    }
  }, [cidade.slug, searchParams, setCidadeBySlug, setSearchParams]);
}