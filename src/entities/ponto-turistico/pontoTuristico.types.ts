export interface IPontoTuristico {
  id: string;
  cidadeId: string;
  cidadeSlug: string;
  nome: string;
  descricao: string;
  categoria?: string;
  endereco?: string;
  horarioFuncionamento?: string;
  imagemPrincipal?: string;
  destaque?: boolean;
}