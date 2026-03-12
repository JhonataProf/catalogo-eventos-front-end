import { describe, expect, it } from "vitest";
import { tourismApiClient } from "../client";

describe("tourismApiClient", () => {
  describe("listCidades", () => {
    it("deve retornar a lista de cidades adaptada para entidades", async () => {
      const result = await tourismApiClient.listCidades();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      expect(result[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          nome: expect.any(String),
          slug: expect.any(String),
          uf: expect.any(String),
        })
      );
    });
  });

  describe("listEventosByCidade", () => {
    it("deve retornar apenas eventos da cidade informada", async () => {
      const result = await tourismApiClient.listEventosByCidade({
        cidade: "dourados",
        page: 1,
        limit: 20,
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.every((item) => item.cidadeSlug === "dourados")).toBe(true);
    });

    it("deve filtrar eventos por busca", async () => {
      const result = await tourismApiClient.listEventosByCidade({
        cidade: "dourados",
        page: 1,
        limit: 20,
        busca: "gastronômico",
      });

      expect(
        result.items.every((item) =>
          item.nome.toLowerCase().includes("gastronômico")
        )
      ).toBe(true);
    });

    it("deve filtrar eventos por categoria", async () => {
      const result = await tourismApiClient.listEventosByCidade({
        cidade: "dourados",
        page: 1,
        limit: 20,
        categoria: "Cultura",
      });

      expect(
        result.items.every((item) => item.categoria === "Cultura")
      ).toBe(true);
    });

    it("deve paginar corretamente os eventos", async () => {
      const page1 = await tourismApiClient.listEventosByCidade({
        cidade: "dourados",
        page: 1,
        limit: 2,
      });

      const page2 = await tourismApiClient.listEventosByCidade({
        cidade: "dourados",
        page: 2,
        limit: 2,
      });

      expect(page1.items.length).toBeLessThanOrEqual(2);
      expect(page2.items.length).toBeLessThanOrEqual(2);

      if (page1.items.length > 0 && page2.items.length > 0) {
        expect(page1.items[0].id).not.toBe(page2.items[0].id);
      }
    });

    it("deve retornar página 1 quando page for inválida", async () => {
      const result = await tourismApiClient.listEventosByCidade({
        cidade: "dourados",
        page: 0,
        limit: 2,
      });

      expect(result.page).toBe(1);
    });

    it("deve retornar limit padrão quando limit for inválido", async () => {
      const result = await tourismApiClient.listEventosByCidade({
        cidade: "dourados",
        page: 1,
        limit: 0,
      });

      expect(result.limit).toBe(12);
    });
  });

  describe("listPontosByCidade", () => {
    it("deve retornar apenas pontos da cidade informada", async () => {
      const result = await tourismApiClient.listPontosByCidade({
        cidade: "dourados",
        page: 1,
        limit: 20,
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.every((item) => item.cidadeSlug === "dourados")).toBe(true);
    });

    it("deve filtrar pontos por busca", async () => {
      const result = await tourismApiClient.listPontosByCidade({
        cidade: "dourados",
        page: 1,
        limit: 20,
        busca: "parque",
      });

      expect(
        result.items.every((item) =>
          item.nome.toLowerCase().includes("parque")
        )
      ).toBe(true);
    });

    it("deve filtrar pontos por categoria", async () => {
      const result = await tourismApiClient.listPontosByCidade({
        cidade: "dourados",
        page: 1,
        limit: 20,
        categoria: "Natureza",
      });

      expect(
        result.items.every((item) => item.categoria === "Natureza")
      ).toBe(true);
    });
  });

  describe("getEventoById", () => {
    it("deve retornar o evento quando o id existir", async () => {
      const result = await tourismApiClient.getEventoById("evt-1");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("evt-1");
    });

    it("deve retornar null quando o evento não existir", async () => {
      const result = await tourismApiClient.getEventoById("evento-inexistente");

      expect(result).toBeNull();
    });
  });

  describe("getPontoById", () => {
    it("deve retornar o ponto turístico quando o id existir", async () => {
      const result = await tourismApiClient.getPontoById("pto-1");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("pto-1");
    });

    it("deve retornar null quando o ponto turístico não existir", async () => {
      const result = await tourismApiClient.getPontoById("ponto-inexistente");

      expect(result).toBeNull();
    });
  });
});