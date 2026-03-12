import { describe, expect, it, vi, beforeEach } from "vitest";
import { fetchEventosCatalogo } from "../config/eventosCatalogConfig";
import { tourismApiClient } from "@/services/tourism-api/client";
import type { IEvento } from "@/entities/evento/evento.types";
import type { ITourismApiListResponse } from "@/services/tourism-api/tourismApi.types";

vi.mock("@/services/tourism-api/client", () => ({
  tourismApiClient: {
    listEventosByCidade: vi.fn(),
  },
}));

describe("fetchEventosCatalogo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve mapear eventos para itens de catálogo", async () => {
    const mockResponse: ITourismApiListResponse<IEvento> = {
      items: [
        {
          id: "evt-1",
          cidadeId: "dourados",
          cidadeSlug: "dourados",
          nome: "Festival Gastronômico",
          descricao: "Sabores regionais",
          categoria: "Gastronomia",
          dataInicio: "2026-03-20",
          dataFim: "2026-03-22",
          dataFormatada: "20 a 22 de março de 2026",
          local: "Parque dos Ipês",
          imagemPrincipal: "/images/festival.jpg",
          destaque: true,
        },
      ],
      page: 1,
      limit: 6,
      total: 1,
    };

    vi.mocked(tourismApiClient.listEventosByCidade).mockResolvedValue(mockResponse);

    const result = await fetchEventosCatalogo({
      cidade: "dourados",
      page: 1,
      limit: 6,
    });

    expect(result).toEqual({
      items: [
        {
          id: "evt-1",
          kind: "evento",
          cidadeId: "dourados",
          cidadeSlug: "dourados",
          titulo: "Festival Gastronômico",
          descricao: "Sabores regionais",
          imagemUrl: "/images/festival.jpg",
          categoria: "Gastronomia",
          dataLabel: "20 a 22 de março de 2026",
          localLabel: "Parque dos Ipês",
          destaque: true,
          href: "/eventos/evt-1",
          ctaLabel: "Ver evento",
        },
      ],
      page: 1,
      limit: 6,
      total: 1,
    });
  });

  it("deve encaminhar filtros para o client", async () => {
    vi.mocked(tourismApiClient.listEventosByCidade).mockResolvedValue({
      items: [],
      page: 1,
      limit: 6,
      total: 0,
    });

    await fetchEventosCatalogo({
      cidade: "dourados",
      page: 2,
      limit: 6,
      busca: "festival",
      categoria: "Cultura",
    });

    expect(tourismApiClient.listEventosByCidade).toHaveBeenCalledWith({
      cidade: "dourados",
      page: 2,
      limit: 6,
      busca: "festival",
      categoria: "Cultura",
    });
  });
});