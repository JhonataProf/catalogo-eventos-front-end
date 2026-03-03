export type CidadeCeleiro = {
  slug: string;
  nome: string;
  uf: "MS";
  image: string; // caminho (recomendo /public/cidades/*.jpg)
};

export const cidadesCeleiro: CidadeCeleiro[] = [
  { slug: "dourados", nome: "Dourados", uf: "MS", image: "/cidades/dourados.jpg" },
  { slug: "itapora", nome: "Itaporã", uf: "MS", image: "/cidades/itapora.jpg" },
  { slug: "caarapo", nome: "Caarapó", uf: "MS", image: "/cidades/caarapo.jpg" },
  { slug: "fatima-do-sul", nome: "Fátima do Sul", uf: "MS", image: "/cidades/fatima-do-sul.jpg" },
  { slug: "jatei", nome: "Jateí", uf: "MS", image: "/cidades/jatei.jpg" },
  { slug: "deodapolis", nome: "Deodápolis", uf: "MS", image: "/cidades/deodapolis.jpg" },
  { slug: "douradina", nome: "Douradina", uf: "MS", image: "/cidades/douradina.jpg" },
  { slug: "vicentina", nome: "Vicentina", uf: "MS", image: "/cidades/vicentina.jpg" },
  { slug: "juti", nome: "Juti", uf: "MS", image: "/cidades/juti.jpg" },
  { slug: "gloria-de-dourados", nome: "Glória de Dourados", uf: "MS", image: "/cidades/gloria-de-dourados.jpg" },
  { slug: "maracaju", nome: "Maracaju", uf: "MS", image: "/cidades/maracaju.jpg" },
  { slug: "rio-brilhante", nome: "Rio Brilhante", uf: "MS", image: "/cidades/rio-brilhante.jpg" },
];