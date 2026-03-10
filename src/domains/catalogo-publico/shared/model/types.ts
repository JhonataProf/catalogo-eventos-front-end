// src/features/catalogo-publico/model/types.ts
export type CatalogKind = "evento" | "ponto-turistico";

export type CatalogItem = {
  id: string;
  kind: CatalogKind;
  cidadeId: string;
  cidadeSlug: string;
  titulo: string;
  descricao: string;
  imagemUrl?: string;
  categoria?: string;
  dataLabel?: string;
  localLabel?: string;
  destaque?: boolean;
  href?: string;
};

export type CatalogQuery = {
  cidade: string;
  busca?: string;
  categoria?: string;
  page?: number;
  limit?: number;
};

export type CatalogResult = {
  items: CatalogItem[];
  total: number;
  page: number;
  limit: number;
};