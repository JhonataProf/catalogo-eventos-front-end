export interface IApiListMeta {
  page: number;
  limit: number;
  total: number;
}

export interface IApiListResponse<TItem> {
  items: TItem[];
  meta: IApiListMeta;
}