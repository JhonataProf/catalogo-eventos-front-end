import { toPontoTuristicoEntity } from "../adapters/pontoTuristico.adapters";
import type { IPontoTuristicoApiResponse } from "../contracts/pontoTuristico.contracts";
import { describe, it, expect } from "vitest";

describe("toPontoTuristicoEntity", () => {
  it("deve mapear corretamente o contrato da API para entidade de ponto turístico", () => {
    const apiResponse: IPontoTuristicoApiResponse = {
      id: "pto-1",
      cidade_id: "dourados",
      cidade_slug: "dourados",
      nome: "Parque Antenor Martins",
      descricao: "Área verde com espaço de lazer.",
      categoria: "Natureza",
      endereco: "Rua Antônio Emílio de Figueiredo",
      horario_funcionamento: "Todos os dias",
      imagem_principal: "/images/highlights/parque-antenor-martins.jpg",
      destaque: true,
    };

    const result = toPontoTuristicoEntity(apiResponse);

    expect(result).toEqual({
      id: "pto-1",
      cidadeId: "dourados",
      cidadeSlug: "dourados",
      nome: "Parque Antenor Martins",
      descricao: "Área verde com espaço de lazer.",
      categoria: "Natureza",
      endereco: "Rua Antônio Emílio de Figueiredo",
      horarioFuncionamento: "Todos os dias",
      imagemPrincipal: "/images/highlights/parque-antenor-martins.jpg",
      destaque: true,
    });
  });

  it("deve aceitar campos opcionais ausentes", () => {
    const apiResponse: IPontoTuristicoApiResponse = {
      id: "pto-2",
      cidade_id: "dourados",
      cidade_slug: "dourados",
      nome: "Museu Histórico",
      descricao: "Espaço cultural.",
    };

    const result = toPontoTuristicoEntity(apiResponse);

    expect(result).toEqual({
      id: "pto-2",
      cidadeId: "dourados",
      cidadeSlug: "dourados",
      nome: "Museu Histórico",
      descricao: "Espaço cultural.",
      categoria: undefined,
      endereco: undefined,
      horarioFuncionamento: undefined,
      imagemPrincipal: undefined,
      destaque: undefined,
    });
  });
});