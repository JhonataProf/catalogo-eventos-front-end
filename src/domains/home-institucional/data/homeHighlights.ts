export type HomeHighlightKind = "evento" | "ponto-turistico";

export interface IHomeHighlight {
  id: string;
  kind: HomeHighlightKind;
  titulo: string;
  descricao: string;
  cidadeNome: string;
  imageUrl: string;
  href: string;
  label: string;
}

export const HOME_HIGHLIGHTS: IHomeHighlight[] = [
  {
    id: "highlight-1",
    kind: "evento",
    titulo: "Festival Gastronômico de Dourados",
    descricao: "Sabores regionais, música e experiências culturais para moradores e visitantes.",
    cidadeNome: "Dourados",
    imageUrl: "/images/highlights/festival-gastronomico.jpg",
    href: "/eventos/evt-1",
    label: "Evento em destaque",
  },
  {
    id: "highlight-2",
    kind: "ponto-turistico",
    titulo: "Parque Antenor Martins",
    descricao: "Um espaço de lazer, convivência e visitação com forte presença no território regional.",
    cidadeNome: "Dourados",
    imageUrl: "/images/highlights/parque-antenor-martins.jpg",
    href: "/pontos-turisticos/pto-1",
    label: "Ponto turístico em destaque",
  },
  {
    id: "highlight-3",
    kind: "evento",
    titulo: "Mostra de Música Regional",
    descricao: "Programação cultural com artistas locais, repertórios regionais e experiências de descoberta.",
    cidadeNome: "Bonito",
    imageUrl: "/images/highlights/mostra-musical.jpg",
    href: "/eventos/evt-3",
    label: "Evento em destaque",
  },
];