import type { ICatalogoFiltersConfig } from "@/domains/catalogo-publico/shared/model/catalogo.filters";

export const eventosFiltersConfig: ICatalogoFiltersConfig = {
  searchPlaceholder: "Busque um evento por nome",
  categorias: [
    { label: "Cultura", value: "Cultura" },
    { label: "Gastronomia", value: "Gastronomia" },
    { label: "Música", value: "Música" },
  ],
};