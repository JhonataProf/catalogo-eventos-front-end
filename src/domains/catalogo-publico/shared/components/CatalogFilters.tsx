import type { ChangeEvent, ReactElement } from "react";
import type {
  ICatalogoFiltersConfig,
  ICatalogoFiltersValue,
} from "../model/catalogo.filters";

export interface ICatalogFiltersProps {
  value: ICatalogoFiltersValue;
  config: ICatalogoFiltersConfig;
  onChange: (nextValue: ICatalogoFiltersValue) => void;
}

export function CatalogFilters({
  value,
  config,
  onChange,
}: ICatalogFiltersProps): ReactElement {
  function handleBuscaChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    onChange({
      ...value,
      busca: event.target.value,
    });
  }

  function handleCategoriaChange(
    event: ChangeEvent<HTMLSelectElement>
  ): void {
    onChange({
      ...value,
      categoria: event.target.value,
    });
  }

  return (
    <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="catalogo-busca"
            className="text-sm font-medium text-zinc-700"
          >
            Buscar
          </label>
          <input
            id="catalogo-busca"
            type="text"
            value={value.busca}
            onChange={handleBuscaChange}
            placeholder={config.searchPlaceholder ?? "Busque por nome"}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="catalogo-categoria"
            className="text-sm font-medium text-zinc-700"
          >
            Categoria
          </label>
          <select
            id="catalogo-categoria"
            value={value.categoria}
            onChange={handleCategoriaChange}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition focus:border-emerald-500"
          >
            <option value="">Todas</option>
            {config.categorias.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}