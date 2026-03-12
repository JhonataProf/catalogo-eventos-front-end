import type { ICidadeApiResponse } from "./contracts/cidade.contracts";
import type { IEventoApiResponse } from "./contracts/evento.contracts";
import type { IPontoTuristicoApiResponse } from "./contracts/pontoTuristico.contracts";

export const cidadesMock: ICidadeApiResponse[] = [
  {
    id: "dourados",
    nome: "Dourados",
    slug: "dourados",
    uf: "MS",
    descricao: "Centro regional com forte vida cultural e turística.",
    imagem_principal: "/images/cidades/dourados.jpg",
  },
  {
    id: "itapora",
    nome: "Itaporã",
    slug: "itapora",
    uf: "MS",
    descricao: "Cidade conectada ao território do Celeiro do MS.",
    imagem_principal: "/images/cidades/itapora.jpg",
  },
];

export const eventosMock: IEventoApiResponse[] = [
  {
    id: "evt-1",
    cidade_id: "dourados",
    cidade_slug: "dourados",
    nome: "Festival Gastronômico de Dourados",
    descricao: "Sabores regionais, música e experiências culturais.",
    categoria: "Gastronomia",
    data_inicio: "2026-03-20",
    data_fim: "2026-03-22",
    data_formatada: "20 a 22 de março de 2026",
    local: "Parque dos Ipês",
    imagem_principal: "/images/highlights/festival-gastronomico.jpg",
    destaque: true,
  },
];
export const pontosMock: IPontoTuristicoApiResponse[] = [
  {
    id: "pto-1",
    cidade_id: "dourados",
    cidade_slug: "dourados",
    nome: "Parque Antenor Martins",
    descricao: "Área verde com lago, pista de caminhada e espaço de lazer.",
    categoria: "Natureza",
    endereco: "Rua Antônio Emílio de Figueiredo",
    horario_funcionamento: "Todos os dias",
    imagem_principal: "/images/highlights/parque-antenor-martins.jpg",
    destaque: true,
  },
];

export async function mockDelay(delayMs: number = 250): Promise<void> {
  await new Promise<void>((resolve: () => void) => {
    window.setTimeout(resolve, delayMs);
  });
}