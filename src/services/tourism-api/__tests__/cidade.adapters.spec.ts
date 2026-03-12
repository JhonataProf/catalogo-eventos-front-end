import { toCidadeEntity } from "../adapters/cidade.adapters";
import type { ICidadeApiResponse } from "../contracts/cidade.contracts";
import { describe, it, expect } from "vitest";

describe("toCidadeEntity", () => {
  it("deve mapear corretamente o contrato da API para entidade de cidade", () => {
    const apiResponse: ICidadeApiResponse = {
      id: "dourados",
      nome: "Dourados",
      slug: "dourados",
      uf: "MS",
      descricao: "Centro regional com forte vida cultural e turística.",
      imagem_principal: "/images/cidades/dourados.jpg",
    };

    const result = toCidadeEntity(apiResponse);

    expect(result).toEqual({
      id: "dourados",
      nome: "Dourados",
      slug: "dourados",
      uf: "MS",
      descricao: "Centro regional com forte vida cultural e turística.",
      imagemUrl: "/images/cidades/dourados.jpg",
    });
  });

  it("deve aceitar campos opcionais ausentes", () => {
    const apiResponse: ICidadeApiResponse = {
      id: "itapora",
      nome: "Itaporã",
      slug: "itapora",
      uf: "MS",
    };

    const result = toCidadeEntity(apiResponse);

    expect(result).toEqual({
      id: "itapora",
      nome: "Itaporã",
      slug: "itapora",
      uf: "MS",
      descricao: undefined,
      imagemUrl: undefined,
    });
  });
});