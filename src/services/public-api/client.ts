import type { ICity } from "@/entities/city/city.types";
import type { IEvent } from "@/entities/event/event.types";
import type { IInstitutionalContent } from "@/entities/institutional/institutional.types";
import type { ISocialLink } from "@/entities/social-link/socialLink.types";
import type { ITouristPoint } from "@/entities/tourist-point/touristPoint.types";
import { adminApiClient } from "@/services/admin-api/client";
import type {
  IPublicApiClient,
  IPublicHomeHighlightsResponse,
  IPublicListParams,
  IPublicListResponse,
} from "./publicApi.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesSearch(source: string | undefined, search: string | undefined): boolean {
  if (!search) {
    return true;
  }

  if (!source) {
    return false;
  }

  return normalizeText(source).includes(normalizeText(search));
}

function paginateItems<TItem>(
  items: TItem[],
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): IPublicListResponse<TItem> {
  const safePage: number = page > 0 ? page : DEFAULT_PAGE;
  const safeLimit: number = limit > 0 ? limit : DEFAULT_LIMIT;

  const startIndex: number = (safePage - 1) * safeLimit;
  const endIndex: number = startIndex + safeLimit;

  return {
    items: items.slice(startIndex, endIndex),
    total: items.length,
    page: safePage,
    limit: safeLimit,
  };
}

export const publicApiClient: IPublicApiClient = {
  async listPublishedCities(): Promise<ICity[]> {
    const cities: ICity[] = await adminApiClient.listCities();

    return cities.filter((item: ICity) => item.published);
  },

  async getPublishedCityBySlug(slug: string): Promise<ICity | null> {
    const city: ICity | null = await adminApiClient.getCityBySlug(slug);

    if (!city || !city.published) {
      return null;
    }

    return city;
  },

  async listPublishedEvents(
    params: IPublicListParams
  ): Promise<IPublicListResponse<IEvent>> {
    const events: IEvent[] = await adminApiClient.listEvents();

    const filteredItems: IEvent[] = events.filter((item: IEvent) => {
      const matchesPublished: boolean = item.published;
      const matchesCity: boolean = !params.citySlug || item.citySlug === params.citySlug;
      const matchesCategory: boolean =
        !params.category || item.category === params.category;
      const matchesText: boolean =
        matchesSearch(item.name, params.search) ||
        matchesSearch(item.description, params.search);

      return matchesPublished && matchesCity && matchesCategory && matchesText;
    });

    return paginateItems(filteredItems, params.page, params.limit);
  },

  async getPublishedEventById(id: string): Promise<IEvent | null> {
    const event: IEvent | null = await adminApiClient.getEventById(id);

    if (!event || !event.published) {
      return null;
    }

    return event;
  },

  async listPublishedTouristPoints(
    params: IPublicListParams
  ): Promise<IPublicListResponse<ITouristPoint>> {
    const touristPoints: ITouristPoint[] =
      await adminApiClient.listTouristPoints();

    const filteredItems: ITouristPoint[] = touristPoints.filter(
      (item: ITouristPoint) => {
        const matchesPublished: boolean = item.published;
        const matchesCity: boolean =
          !params.citySlug || item.citySlug === params.citySlug;
        const matchesCategory: boolean =
          !params.category || item.category === params.category;
        const matchesText: boolean =
          matchesSearch(item.name, params.search) ||
          matchesSearch(item.description, params.search);

        return matchesPublished && matchesCity && matchesCategory && matchesText;
      }
    );

    return paginateItems(filteredItems, params.page, params.limit);
  },

  async getPublishedTouristPointById(id: string): Promise<ITouristPoint | null> {
    const touristPoint: ITouristPoint | null =
      await adminApiClient.getTouristPointById(id);

    if (!touristPoint || !touristPoint.published) {
      return null;
    }

    return touristPoint;
  },

  async getInstitutionalContent(): Promise<IInstitutionalContent> {
    return adminApiClient.getInstitutionalContent();
  },

  async listActiveSocialLinks(): Promise<ISocialLink[]> {
    const items: ISocialLink[] = await adminApiClient.listSocialLinks();

    return items.filter((item: ISocialLink) => item.active);
  },

  async getHomeHighlights(): Promise<IPublicHomeHighlightsResponse> {
    const [events, touristPoints] = await Promise.all([
      adminApiClient.listEvents(),
      adminApiClient.listTouristPoints(),
    ]);

    return {
      events: events.filter((item: IEvent) => item.published && item.featured),
      touristPoints: touristPoints.filter(
        (item: ITouristPoint) => item.published && item.featured
      ),
    };
  },
};