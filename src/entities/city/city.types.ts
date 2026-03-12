export interface ICityBase {
  name: string;
  slug: string;
  state: string;
  summary: string;
  description?: string;
  imageUrl?: string;
  published: boolean;
}

export interface ICity extends ICityBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ICreateCityInput = ICityBase;

export type IUpdateCityInput = Partial<ICityBase> & Pick<ICity, "id">;

export type ICityPublicSummary = Pick<
  ICity,
  "id" | "name" | "slug" | "state" | "summary" | "imageUrl"
>;

export type ICityPublicDetails = Pick<
  ICity,
  | "id"
  | "name"
  | "slug"
  | "state"
  | "summary"
  | "description"
  | "imageUrl"
  | "published"
>;
