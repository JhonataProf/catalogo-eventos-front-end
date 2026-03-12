export interface IEventoApiResponse {
  id: string;
  cidade_id: string;
  cidade_slug: string;
  nome: string;
  descricao: string;
  categoria?: string;
  data_inicio?: string;
  data_fim?: string;
  data_formatada?: string;
  local?: string;
  imagem_principal?: string;
  destaque?: boolean;
}