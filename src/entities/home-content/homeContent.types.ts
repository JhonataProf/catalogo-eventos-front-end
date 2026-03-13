export type HomeHighlightType = "event" | "tourist-point" | "custom";

export interface IHomeBannerBase {
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaLabel?: string;
  ctaUrl?: string;
  active: boolean;
  order: number;
}

export interface IHomeBanner extends IHomeBannerBase {
  id: string;
}

export type ICreateHomeBannerInput = Omit<IHomeBanner, "id">;

export type IUpdateHomeBannerInput = Partial<ICreateHomeBannerInput> &
  Pick<IHomeBanner, "id">;

export interface IHomeHighlightBase {
  type: HomeHighlightType;
  referenceId?: string;
  title: string;
  description: string;
  cityName?: string;
  imageUrl?: string;
  ctaUrl?: string;
  active: boolean;
  order: number;
}

export interface IHomeHighlight extends IHomeHighlightBase {
  id: string;
}

export type ICreateHomeHighlightInput = Omit<IHomeHighlight, "id">;

export type IUpdateHomeHighlightInput = Partial<ICreateHomeHighlightInput> &
  Pick<IHomeHighlight, "id">;