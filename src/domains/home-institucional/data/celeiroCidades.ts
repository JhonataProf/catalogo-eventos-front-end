export interface ICeleiroCidade {
  id: string;
  nome: string;
  slug: string;
  estado: string;
  imageUrl: string;
  resumo: string;
}

export const CELEIRO_CIDADES: ICeleiroCidade[] = [
  {
    id: "dourados",
    nome: "Dourados",
    slug: "dourados",
    estado: "MS",
    imageUrl: "/images/cidades/dourados.jpg",
    resumo: "Centro regional com forte vida cultural, gastronômica e de eventos.",
  },
  {
    id: "itapora",
    nome: "Itaporã",
    slug: "itapora",
    estado: "MS",
    imageUrl: "/images/cidades/itapora.jpg",
    resumo: "Cidade com tradição, hospitalidade e conexão com o turismo regional.",
  },
  {
    id: "caarapo",
    nome: "Caarapó",
    slug: "caarapo",
    estado: "MS",
    imageUrl: "/images/cidades/caarapo.jpg",
    resumo: "Município com identidade própria e forte presença cultural.",
  },
  {
    id: "fatima-do-sul",
    nome: "Fátima do Sul",
    slug: "fatima-do-sul",
    estado: "MS",
    imageUrl: "/images/cidades/fatima-do-sul.jpg",
    resumo: "Destino regional com potencial turístico e experiências locais.",
  },
  {
    id: "jatei",
    nome: "Jateí",
    slug: "jatei",
    estado: "MS",
    imageUrl: "/images/cidades/jatei.jpg",
    resumo: "Cidade acolhedora com potencial para turismo de proximidade.",
  },
  {
    id: "deodapolis",
    nome: "Deodápolis",
    slug: "deodapolis",
    estado: "MS",
    imageUrl: "/images/cidades/deodapolis.jpg",
    resumo: "Tradição e identidade local em uma experiência regional integrada.",
  },
  {
    id: "douradina",
    nome: "Douradina",
    slug: "douradina",
    estado: "MS",
    imageUrl: "/images/cidades/douradina.jpg",
    resumo: "Município conectado ao território do Celeiro do MS.",
  },
  {
    id: "vicentina",
    nome: "Vicentina",
    slug: "vicentina",
    estado: "MS",
    imageUrl: "/images/cidades/vicentina.jpg",
    resumo: "Cidade com potencial para experiências autênticas e roteiros locais.",
  },
  {
    id: "juti",
    nome: "Juti",
    slug: "juti",
    estado: "MS",
    imageUrl: "/images/cidades/juti.jpg",
    resumo: "Identidade regional e oportunidades para turismo de descoberta.",
  },
  {
    id: "gloria-de-dourados",
    nome: "Glória de Dourados",
    slug: "gloria-de-dourados",
    estado: "MS",
    imageUrl: "/images/cidades/gloria-de-dourados.jpg",
    resumo: "Município integrado à rota territorial do Celeiro do MS.",
  },
  {
    id: "maracaju",
    nome: "Maracaju",
    slug: "maracaju",
    estado: "MS",
    imageUrl: "/images/cidades/maracaju.jpg",
    resumo: "Cidade estratégica com potencial cultural, gastronômico e de eventos.",
  },
  {
    id: "rio-brilhante",
    nome: "Rio Brilhante",
    slug: "rio-brilhante",
    estado: "MS",
    imageUrl: "/images/cidades/rio-brilhante.jpg",
    resumo: "Importante polo regional com atrativos e forte identidade local.",
  },
];

export function findCeleiroCidadeBySlug(
  slug: string
): ICeleiroCidade | undefined {
  return CELEIRO_CIDADES.find((cidade: ICeleiroCidade) => cidade.slug === slug);
}