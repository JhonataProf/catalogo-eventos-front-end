import { toEventoEntity } from "../adapters/evento.adapters";
import type { IEventoApiResponse } from "../contracts/evento.contracts";
import { describe, it, expect } from "vitest";

describe("toEventoEntity", () => {
  it("deve mapear corretamente o contrato da API para entidade de evento", () => {
    const apiResponse: IEventoApiResponse = {
      id: "evt-1",
      cidade_id: "dourados",
      cidade_slug: "dourados",
      nome: "Festival Gastronômico",
      descricao: "Evento com sabores regionais.",
      categoria: "Gastronomia",
      data_inicio: "2026-03-20",
      data_fim: "2026-03-22",
      data_formatada: "20 a 22 de março de 2026",
      local: "Parque dos Ipês",
      imagem_principal: "/images/highlights/festival-gastronomico.jpg",
      destaque: true,
    };

    const result = toEventoEntity(apiResponse);

    expect(result).toEqual({
      id: "evt-1",
      cidadeId: "dourados",
      cidadeSlug: "dourados",
      nome: "Festival Gastronômico",
      descricao: "Evento com sabores regionais.",
      categoria: "Gastronomia",
      dataInicio: "2026-03-20",
      dataFim: "2026-03-22",
      dataFormatada: "20 a 22 de março de 2026",
      local: "Parque dos Ipês",
      imagemPrincipal: "/images/highlights/festival-gastronomico.jpg",
      destaque: true,
    });
  });

  it("deve manter campos opcionais como undefined quando ausentes", () => {
    const apiResponse: IEventoApiResponse = {
      id: "evt-2",
      cidade_id: "dourados",
      cidade_slug: "dourados",
      nome: "Feira Cultural",
      descricao: "Evento cultural local.",
    };

    const result = toEventoEntity(apiResponse);

    expect(result).toEqual({
      id: "evt-2",
      cidadeId: "dourados",
      cidadeSlug: "dourados",
      nome: "Feira Cultural",
      descricao: "Evento cultural local.",
      categoria: undefined,
      dataInicio: undefined,
      dataFim: undefined,
      dataFormatada: undefined,
      local: undefined,
      imagemPrincipal: undefined,
      destaque: undefined,
    });
  });
});