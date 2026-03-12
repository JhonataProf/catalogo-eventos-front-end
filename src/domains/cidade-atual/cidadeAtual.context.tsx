import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { useSearchParams } from "react-router-dom";
import {
  CIDADE_DEFAULT,
  CIDADE_DEFAULT_SLUG,
  CIDADE_STORAGE_KEY,
  type ICidadeAtual,
  type ICidadeAtualContextValue,
} from "./cidadeAtual.types";
import { findCidadeBySlug, isCidadeSlugValid } from "./cidadeAtual.utils";

const CidadeAtualContext = createContext<ICidadeAtualContextValue | null>(null);

function readStoredCidade(): ICidadeAtual | null {
  try {
    const rawValue: string | null = window.localStorage.getItem(
      CIDADE_STORAGE_KEY
    );

    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (
      typeof parsedValue === "object" &&
      parsedValue !== null &&
      "id" in parsedValue &&
      "nome" in parsedValue &&
      "slug" in parsedValue
    ) {
      const cidade = parsedValue as ICidadeAtual;

      if (!isCidadeSlugValid(cidade.slug)) {
        return null;
      }

      return cidade;
    }

    return null;
  } catch {
    return null;
  }
}

function resolveInitialCidade(searchParams: URLSearchParams): ICidadeAtual {
  const cidadeSlugFromUrl: string | null = searchParams.get("cidade");

  if (cidadeSlugFromUrl && isCidadeSlugValid(cidadeSlugFromUrl)) {
    return findCidadeBySlug(cidadeSlugFromUrl);
  }

  const storedCidade: ICidadeAtual | null = readStoredCidade();

  return storedCidade ?? CIDADE_DEFAULT;
}

export function CidadeAtualProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const [cidade, setCidadeState] = useState<ICidadeAtual>(() =>
    resolveInitialCidade(searchParams)
  );

  const syncSearchParam = useCallback(
    (slug: string): void => {
      const nextParams: URLSearchParams = new URLSearchParams(searchParams);
      nextParams.set("cidade", slug);
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const persistCidade = useCallback((nextCidade: ICidadeAtual): void => {
    window.localStorage.setItem(
      CIDADE_STORAGE_KEY,
      JSON.stringify(nextCidade)
    );
  }, []);

  const setCidade = useCallback(
    (nextCidade: ICidadeAtual): void => {
      setCidadeState(nextCidade);
      persistCidade(nextCidade);
      syncSearchParam(nextCidade.slug);
    },
    [persistCidade, syncSearchParam]
  );

  const setCidadeBySlug = useCallback(
    (slug: string): void => {
      const normalizedSlug: string = isCidadeSlugValid(slug)
        ? slug
        : CIDADE_DEFAULT_SLUG;

      const nextCidade: ICidadeAtual = findCidadeBySlug(normalizedSlug);

      setCidadeState(nextCidade);
      persistCidade(nextCidade);
      syncSearchParam(nextCidade.slug);
    },
    [persistCidade, syncSearchParam]
  );

  const contextValue: ICidadeAtualContextValue = useMemo(
    () => ({
      cidade,
      setCidade,
      setCidadeBySlug,
    }),
    [cidade, setCidade, setCidadeBySlug]
  );

  return (
    <CidadeAtualContext.Provider value={contextValue}>
      {children}
    </CidadeAtualContext.Provider>
  );
}

export { CidadeAtualContext };
