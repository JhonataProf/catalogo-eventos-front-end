import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CatalogFilters } from "../components/CatalogFilters";
import type { ICidade } from "@/entities/cidade/cidade.types";
import type {
  ICatalogoFiltersConfig,
  ICatalogoFiltersValue,
} from "../model/catalogo.filters";

describe("CatalogFilters", () => {
  const cidades: ICidade[] = [
    {
      id: "dourados",
      nome: "Dourados",
      slug: "dourados",
      uf: "MS",
    },
    {
      id: "itapora",
      nome: "Itaporã",
      slug: "itapora",
      uf: "MS",
    },
  ];

  const config: ICatalogoFiltersConfig = {
    searchPlaceholder: "Busque por nome",
    categorias: [
      { label: "Cultura", value: "Cultura" },
      { label: "Natureza", value: "Natureza" },
    ],
  };

  const value: ICatalogoFiltersValue = {
    busca: "",
    categoria: "",
  };

  it("deve renderizar os campos de cidade, busca e categoria", () => {
    render(
      <CatalogFilters
        cidadeSlug="dourados"
        cidades={cidades}
        value={value}
        config={config}
        onCidadeChange={vi.fn()}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Cidade")).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar")).toBeInTheDocument();
    expect(screen.getByLabelText("Categoria")).toBeInTheDocument();
  });

  it("deve chamar onCidadeChange ao trocar a cidade", () => {
    const onCidadeChange = vi.fn();

    render(
      <CatalogFilters
        cidadeSlug="dourados"
        cidades={cidades}
        value={value}
        config={config}
        onCidadeChange={onCidadeChange}
        onChange={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("Cidade"), {
      target: { value: "itapora" },
    });

    expect(onCidadeChange).toHaveBeenCalledTimes(1);
    expect(onCidadeChange).toHaveBeenCalledWith("itapora");
  });

  it("deve chamar onChange ao digitar na busca", () => {
    const onChange = vi.fn();

    render(
      <CatalogFilters
        cidadeSlug="dourados"
        cidades={cidades}
        value={value}
        config={config}
        onCidadeChange={vi.fn()}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Buscar"), {
      target: { value: "festival" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      busca: "festival",
      categoria: "",
    });
  });

  it("deve chamar onChange ao trocar a categoria", () => {
    const onChange = vi.fn();

    render(
      <CatalogFilters
        cidadeSlug="dourados"
        cidades={cidades}
        value={value}
        config={config}
        onCidadeChange={vi.fn()}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Categoria"), {
      target: { value: "Cultura" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      busca: "",
      categoria: "Cultura",
    });
  });

  it("deve exibir o placeholder configurado", () => {
    render(
      <CatalogFilters
        cidadeSlug="dourados"
        cidades={cidades}
        value={value}
        config={config}
        onCidadeChange={vi.fn()}
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText("Busque por nome")
    ).toBeInTheDocument();
  });
});