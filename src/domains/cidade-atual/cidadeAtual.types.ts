export interface ICidadeAtual {
  id: string;
  nome: string;
  slug: string;
}

export interface ICidadeAtualContextValue {
  cidade: ICidadeAtual;
  setCidade: (cidade: ICidadeAtual) => void;
  setCidadeBySlug: (slug: string) => void;
}

export const CIDADE_DEFAULT_SLUG = "dourados";

export const CIDADE_DEFAULT: ICidadeAtual = {
  id: "dourados",
  nome: "Dourados",
  slug: CIDADE_DEFAULT_SLUG,
};

export const CIDADE_STORAGE_KEY = "cidade-atual";