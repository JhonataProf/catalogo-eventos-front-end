import type { ICidade } from "@/entities/cidade/cidade.types";

export interface ICatalogoFilterOption {
  label: string;
  value: string;
}

export interface ICatalogoFiltersValue {
  busca: string;
  categoria: string;
}

export interface ICatalogoFiltersConfig {
  title?: string;
  searchPlaceholder?: string;
  categorias: ICatalogoFilterOption[];
}

export interface ICatalogFiltersWithCidadeProps {
  cidadeSlug: string;
  cidades: ICidade[];
  value: ICatalogoFiltersValue;
  config: ICatalogoFiltersConfig;
  onCidadeChange: (slug: string) => void;
  onChange: (nextValue: ICatalogoFiltersValue) => void;
}