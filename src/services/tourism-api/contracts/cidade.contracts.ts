export interface ICidadeApiResponse {
  id: string;
  nome: string;
  slug: string;
  uf: string;
  descricao?: string;
  imagem_principal?: string;
}