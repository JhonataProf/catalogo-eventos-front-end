import type { ICity } from "@/entities/city/city.types";
import type { IEvent } from "@/entities/event/event.types";
import type { ITouristPoint } from "@/entities/tourist-point/touristPoint.types";
import type { IInstitutionalContent } from "@/entities/institutional/institutional.types";
import type { ISocialLink } from "@/entities/social-link/socialLink.types";
import type {
  IHomeBanner,
  IHomeHighlight,
} from "@/entities/home-content/homeContent.types";

export interface IPublicListParams {
  citySlug?: string;
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface IPublicListResponse<TItem> {
  items: TItem[];
  total: number;
  page: number;
  limit: number;
}

export interface IPublicHomeHighlightsResponse {
  events: IEvent[];
  touristPoints: ITouristPoint[];
}

export interface IPublicHomeContentResponse {
  banners: IHomeBanner[];
  highlights: IHomeHighlight[];
}

export interface IPublicApiClient {
  listPublishedCities: () => Promise<ICity[]>;
  getPublishedCityBySlug: (slug: string) => Promise<ICity | null>;

  listPublishedEvents: (
    params: IPublicListParams,
  ) => Promise<IPublicListResponse<IEvent>>;
  getPublishedEventById: (id: string) => Promise<IEvent | null>;

  listPublishedTouristPoints: (
    params: IPublicListParams,
  ) => Promise<IPublicListResponse<ITouristPoint>>;
  getPublishedTouristPointById: (id: string) => Promise<ITouristPoint | null>;

  getInstitutionalContent: () => Promise<IInstitutionalContent>;
  listActiveSocialLinks: () => Promise<ISocialLink[]>;
  getHomeHighlights: () => Promise<IPublicHomeHighlightsResponse>;
  getHomeContent: () => Promise<IPublicHomeContentResponse>;
}
