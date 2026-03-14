import { describe, expect, it, vi, beforeEach } from "vitest";
import { fetchPontosCatalogo } from "../config/pontosCatalogConfig";

vi.mock("@/services/public-api/client", () => ({
  publicApiClient: {
    listPublishedTouristPoints: vi.fn(),
  },
}));

import { publicApiClient } from "@/services/public-api/client";

describe("fetchPontosCatalogo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve mapear pontos turísticos para itens de catálogo", async () => {
    vi.mocked(publicApiClient.listPublishedTouristPoints).mockResolvedValue({
      items: [
        {
          id: "pto-1",
          cityId: "city-dourados",
          citySlug: "dourados",
          name: "Parque Antenor Martins",
          description: "Área verde com lazer",
          category: "Natureza",
          address: "Rua Antônio Emílio de Figueiredo",
          imageUrl: "/images/parque.jpg",
          featured: true,
          published: true,
          openingHours: "Todos os dias",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      limit: 6,
    });

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
          cidadeId: "city-dourados",
          cidadeSlug: "dourados",
          titulo: "Parque Antenor Martins",
          descricao: "Área verde com lazer",
          imagemUrl: "/images/parque.jpg",
          categoria: "Natureza",
          localLabel: "Rua Antônio Emílio de Figueiredo",
          destaque: true,
          href: "/pontos-turisticos/pto-1",
          ctaLabel: "Ver local",
        },
      ],
      total: 1,
      page: 1,
      limit: 6,
    });
  });
});
