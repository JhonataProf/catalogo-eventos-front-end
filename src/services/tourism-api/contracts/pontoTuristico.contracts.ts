export interface IPontoTuristicoApiResponse {
  id: string;
  cidade_id: string;
  cidade_slug: string;
  nome: string;
  descricao: string;
  categoria?: string;
  endereco?: string;
  horario_funcionamento?: string;
  imagem_principal?: string;
  destaque?: boolean;
}