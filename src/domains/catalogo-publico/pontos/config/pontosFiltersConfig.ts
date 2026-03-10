import type { ICatalogoFiltersConfig } from "@/domains/catalogo-publico/shared/model/catalogo.filters";

export const pontosFiltersConfig: ICatalogoFiltersConfig = {
  searchPlaceholder: "Busque um ponto turístico por nome",
  categorias: [
    { label: "Natureza", value: "Natureza" },
    { label: "Cultura", value: "Cultura" },
    { label: "Lazer", value: "Lazer" },
  ],
};