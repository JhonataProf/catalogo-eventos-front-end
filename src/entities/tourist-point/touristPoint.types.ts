export interface ITouristPointBase {
  cityId: string;
  citySlug: string;
  name: string;
  description: string;
  category?: string;
  address?: string;
  openingHours?: string;
  imageUrl?: string;
  featured: boolean;
  published: boolean;
}

export interface ITouristPoint extends ITouristPointBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ICreateTouristPointInput = Omit<
  ITouristPoint,
  "id" | "createdAt" | "updatedAt"
>;

export type IUpdateTouristPointInput = Partial<ICreateTouristPointInput> &
  Pick<ITouristPoint, "id">;

export type ITouristPointPublicSummary = Pick<
  ITouristPoint,
  | "id"
  | "cityId"
  | "citySlug"
  | "name"
  | "description"
  | "category"
  | "address"
  | "openingHours"
  | "imageUrl"
  | "featured"
  | "published"
>;