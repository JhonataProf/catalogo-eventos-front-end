import { describe, expect, it, vi, beforeEach } from "vitest";
import { fetchPontosCatalogo } from "../config/pontosCatalogConfig";
import { tourismApiClient } from "@/services/tourism-api/client";
import type { IPontoTuristico } from "@/entities/ponto-turistico/pontoTuristico.types";
import type { ITourismApiListResponse } from "@/services/tourism-api/tourismApi.types";

vi.mock("@/services/tourism-api/client", () => ({
  tourismApiClient: {
    listPontosByCidade: vi.fn(),
  },
}));

describe("fetchPontosCatalogo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve mapear pontos turísticos para itens de catálogo", async () => {
    const mockResponse: ITourismApiListResponse<IPontoTuristico> = {
      items: [
        {
          id: "pto-1",
          cidadeId: "dourados",
          cidadeSlug: "dourados",
          nome: "Parque Antenor Martins",
          descricao: "Área verde com espaço de lazer.",
          categoria: "Natureza",
          endereco: "Rua Antônio Emílio de Figueiredo",
          horarioFuncionamento: "Todos os dias",
          imagemPrincipal: "/images/parque.jpg",
          destaque: true,
        },
      ],
      page: 1,
      limit: 6,
      total: 1,
    };

    vi.mocked(tourismApiClient.listPontosByCidade).mockResolvedValue(mockResponse);

    const result = await fetchPontosCatalogo({
      cidade: "dourados",
      page: 1,
      limit: 6,
    });

    expect(result).toEqual({
      items: [
        {
          id: "pto-1",
          kind: "ponto-turistico",
          cidadeId: "dourados",
          cidadeSlug: "dourados",
          titulo: "Parque Antenor Martins",
          descricao: "Área verde com espaço de lazer.",
          imagemUrl: "/images/parque.jpg",
          categoria: "Natureza",
          localLabel: "Rua Antônio Emílio de Figueiredo",
          destaque: true,
          href: "/pontos-turisticos/pto-1",
          ctaLabel: "Ver local",
        },
      ],
      page: 1,
      limit: 6,
      total: 1,
    });
  });
});