import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventosPage } from "../pages/EventosPage";

vi.mock("@/domains/catalogo-publico/shared/hooks/useCatalogoCidade", () => ({
  useCatalogoCidade: vi.fn(),
}));

vi.mock(
  "@/domains/catalogo-publico/shared/hooks/useCatalogoPublicoPaginado",
  () => ({
    useCatalogoPublicoPaginado: vi.fn(),
  }),
);

import { useCatalogoCidade } from "@/domains/catalogo-publico/shared/hooks/useCatalogoCidade";
import { useCatalogoPublicoPaginado } from "@/domains/catalogo-publico/shared/hooks/useCatalogoPublicoPaginado";

describe("EventosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCatalogoCidade).mockReturnValue({
      cidadeSlug: "dourados",
      cidadeNome: "Dourados",
      cidades: [
        { id: "dourados", nome: "Dourados", slug: "dourados", uf: "MS" },
        { id: "itapora", nome: "Itaporã", slug: "itapora", uf: "MS" },
      ],
      handleCidadeChange: vi.fn(),
      setCidadeSlug: vi.fn(),
    });
  });

  it("deve renderizar loading inicial", () => {
    vi.mocked(useCatalogoPublicoPaginado).mockReturnValue({
      data: {
        items: [],
        total: 0,
        page: 1,
        limit: 6,
        hasMore: false,
      },
      isInitialLoading: true,
      isLoadingMore: false,
      error: null,
      loadMore: vi.fn(),
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <EventosPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Eventos em Dourados")).toBeInTheDocument();
  });

  it("deve renderizar os itens da listagem", () => {
    vi.mocked(useCatalogoPublicoPaginado).mockReturnValue({
      data: {
        items: [
          {
            id: "evt-1",
            kind: "evento",
            cidadeId: "dourados",
            cidadeSlug: "dourados",
            titulo: "Festival Gastronômico",
            descricao: "Sabores regionais",
            categoria: "Gastronomia",
            dataLabel: "20 a 22 de março de 2026",
            localLabel: "Parque dos Ipês",
            href: "/eventos/evt-1",
            ctaLabel: "Ver evento",
          },
        ],
        total: 1,
        page: 1,
        limit: 6,
        hasMore: false,
      },
      isInitialLoading: false,
      isLoadingMore: false,
      error: null,
      loadMore: vi.fn(),
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <EventosPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Festival Gastronômico")).toBeInTheDocument();

    expect(screen.getByText("Sabores regionais")).toBeInTheDocument();
  });

  it("deve renderizar estado vazio", () => {
    vi.mocked(useCatalogoPublicoPaginado).mockReturnValue({
      data: {
        items: [],
        total: 0,
        page: 1,
        limit: 6,
        hasMore: false,
      },
      isInitialLoading: false,
      isLoadingMore: false,
      error: null,
      loadMore: vi.fn(),
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <EventosPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Nenhum evento encontrado")).toBeInTheDocument();
  });

  it("deve renderizar estado de erro", () => {
    vi.mocked(useCatalogoPublicoPaginado).mockReturnValue({
      data: {
        items: [],
        total: 0,
        page: 1,
        limit: 6,
        hasMore: false,
      },
      isInitialLoading: false,
      isLoadingMore: false,
      error: "Não foi possível carregar os dados.",
      loadMore: vi.fn(),
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <EventosPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Erro ao carregar eventos")).toBeInTheDocument();

    expect(
      screen.getByText("Não foi possível carregar os dados."),
    ).toBeInTheDocument();
  });

  it("deve renderizar botão de carregar mais quando houver mais itens", () => {
    vi.mocked(useCatalogoPublicoPaginado).mockReturnValue({
      data: {
        items: [
          {
            id: "evt-1",
            kind: "evento",
            cidadeId: "dourados",
            cidadeSlug: "dourados",
            titulo: "Festival Gastronômico",
            descricao: "Sabores regionais",
            href: "/eventos/evt-1",
          },
        ],
        total: 10,
        page: 1,
        limit: 6,
        hasMore: true,
      },
      isInitialLoading: false,
      isLoadingMore: true,
      error: null,
      loadMore: vi.fn(),
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <EventosPage />
      </MemoryRouter>,
    );

    screen.debug();

    expect(
      screen.getByRole("button", { name: /carregando/i }),
    ).toBeInTheDocument();
  });
});
