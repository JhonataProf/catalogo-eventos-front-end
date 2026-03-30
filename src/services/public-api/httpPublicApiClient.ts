/**
 * Cliente HTTP alinhado ao catalogo-eventos-api (envelope `{ data, links, meta }`).
 *
 * Base URL deve incluir o prefixo da API (ex.: `https://host/api`).
 *
 * Rotas públicas usadas:
 * - GET /public/cities
 * - GET /public/cities/:slug
 * - GET /public/cities/by-id/:id
 * - GET /public/events
 * - GET /public/events/:id
 * - GET /public/tourist-points
 * - GET /public/tourist-points/:id
 * - GET /public/institutional-content
 * - GET /public/social-links
 * - GET /public/home-content
 */
import type { ICity } from "@/entities/city/city.types";
import type { IEvent } from "@/entities/event/event.types";
import type { IInstitutionalContent } from "@/entities/institutional/institutional.types";
import type { ISocialLink } from "@/entities/social-link/socialLink.types";
import type { ITouristPoint } from "@/entities/tourist-point/touristPoint.types";
import axios, { type AxiosInstance, isAxiosError } from "axios";
import { unwrapCollection, unwrapResource } from "./httpPublicApiEnvelope";
import type { HomeHighlightType } from "@/entities/home-content/homeContent.types";
import type {
  IPublicApiClient,
  IPublicHomeContentResponse,
  IPublicHomeHighlightsResponse,
  IPublicListParams,
  IPublicListResponse,
} from "./publicApi.types";

function trimBaseUrl(baseURL: string): string {
  return baseURL.replace(/\/+$/, "");
}

function toIsoString(value: unknown, fallback: string): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === "string") {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}

function mapEventFromApi(raw: Record<string, unknown>): IEvent {
  return {
    id: Number(raw.id),
    cityId: Number(raw.cityId),
    citySlug: String(raw.citySlug ?? ""),
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    category: raw.category !== undefined ? String(raw.category) : undefined,
    startDate:
      raw.startDate !== undefined ? toIsoString(raw.startDate, "") : undefined,
    endDate:
      raw.endDate !== undefined ? toIsoString(raw.endDate, "") : undefined,
    formattedDate:
      raw.formattedDate !== undefined
        ? String(raw.formattedDate)
        : undefined,
    location: raw.location !== undefined ? String(raw.location) : undefined,
    imageUrl: raw.imageUrl !== undefined ? String(raw.imageUrl) : undefined,
    featured: Boolean(raw.featured),
    published: Boolean(raw.published),
    createdAt: toIsoString(raw.createdAt, new Date(0).toISOString()),
    updatedAt: toIsoString(raw.updatedAt, new Date(0).toISOString()),
  };
}

function mapTouristPointFromApi(raw: Record<string, unknown>): ITouristPoint {
  return {
    id: Number(raw.id),
    cityId: Number(raw.cityId),
    citySlug: String(raw.citySlug ?? ""),
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    category: raw.category !== undefined ? String(raw.category) : undefined,
    address: raw.address !== undefined ? String(raw.address) : undefined,
    openingHours:
      raw.openingHours !== undefined ? String(raw.openingHours) : undefined,
    imageUrl: raw.imageUrl !== undefined ? String(raw.imageUrl) : undefined,
    featured: Boolean(raw.featured),
    published: Boolean(raw.published),
    createdAt: toIsoString(raw.createdAt, new Date(0).toISOString()),
    updatedAt: toIsoString(raw.updatedAt, new Date(0).toISOString()),
  };
}

function parseValuesFromInstitutionalApi(
  valuesJson: unknown,
): string[] {
  if (typeof valuesJson !== "string" || valuesJson.trim() === "") {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(valuesJson);
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v));
    }
  } catch {
    /* ignore */
  }
  return [];
}

function mapInstitutionalFromApi(
  raw: Record<string, unknown>,
): IInstitutionalContent {
  return {
    id: Number(raw.id),
    aboutTitle: String(raw.aboutTitle ?? ""),
    aboutText: String(raw.aboutText ?? ""),
    whoWeAreTitle: String(raw.whoWeAreTitle ?? ""),
    whoWeAreText: String(raw.whoWeAreText ?? ""),
    purposeTitle: String(raw.purposeTitle ?? ""),
    purposeText: String(raw.purposeText ?? ""),
    mission: String(raw.mission ?? ""),
    vision: String(raw.vision ?? ""),
    values: parseValuesFromInstitutionalApi(raw.valuesJson),
    updatedAt: toIsoString(raw.updatedAt, new Date(0).toISOString()),
  };
}

function mapCityFromApi(raw: Record<string, unknown>): ICity {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ""),
    state: String(raw.state ?? ""),
    slug: String(raw.slug ?? ""),
    summary: String(raw.summary ?? ""),
    description:
      raw.description !== undefined ? String(raw.description) : undefined,
    imageUrl: raw.imageUrl !== undefined ? String(raw.imageUrl) : undefined,
    published: Boolean(raw.published),
    createdAt: toIsoString(raw.createdAt, new Date(0).toISOString()),
    updatedAt: toIsoString(raw.updatedAt, new Date(0).toISOString()),
  };
}

function mapSocialLinkFromApi(raw: Record<string, unknown>): ISocialLink {
  return {
    id: Number(raw.id),
    platform: raw.platform as ISocialLink["platform"],
    label: String(raw.label ?? ""),
    url: String(raw.url ?? ""),
    active: Boolean(raw.active),
    order: Number(raw.order ?? 0),
  };
}

async function resolveEventCityId(
  http: AxiosInstance,
  params: IPublicListParams,
): Promise<number | undefined> {
  if (params.cityId !== undefined) {
    return params.cityId;
  }
  if (!params.citySlug) {
    return undefined;
  }
  try {
    const { data } = await http.get<unknown>(
      `/public/cities/${encodeURIComponent(params.citySlug)}`,
    );
    const city = unwrapResource<Record<string, unknown>>(data);
    if (!city?.published) {
      return undefined;
    }
    return Number(city.id);
  } catch {
    return undefined;
  }
}

function buildEventQuery(params: IPublicListParams, cityId?: number) {
  const query: Record<string, string | number> = {
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 12),
    sortDir: "asc",
  };
  if (params.search?.trim()) {
    query.name = params.search.trim();
  }
  if (params.category?.trim()) {
    query.category = params.category.trim();
  }
  if (cityId !== undefined) {
    query.cityId = cityId;
  }
  return query;
}

function buildTouristPointQuery(params: IPublicListParams) {
  const query: Record<string, string | number> = {
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 12),
    published: "true",
  };
  if (params.search?.trim()) {
    query.name = params.search.trim();
  }
  if (params.citySlug?.trim()) {
    query.city = params.citySlug.trim();
  }
  return query;
}

const MAX_BY_CITY_PAGES = 50;

export function createHttpPublicApiClient(baseURL: string): IPublicApiClient {
  const http: AxiosInstance = axios.create({
    baseURL: trimBaseUrl(baseURL),
    headers: { Accept: "application/json" },
    timeout: 30_000,
  });

  const client: IPublicApiClient = {
    async listPublishedCities(): Promise<ICity[]> {
      const { data } = await http.get<unknown>("/public/cities");
      const { items } = unwrapCollection<Record<string, unknown>>(data);
      return items
        .map(mapCityFromApi)
        .filter((city: ICity) => city.published);
    },

    async getPublishedCityBySlug(slug: string): Promise<ICity | null> {
      try {
        const { data } = await http.get<unknown>(
          `/public/cities/${encodeURIComponent(slug)}`,
        );
        const raw = unwrapResource<Record<string, unknown>>(data);
        const city = mapCityFromApi(raw);
        if (!city.published) {
          return null;
        }
        return city;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        return null;
      }
    },

    async listPublishedEvents(
      params: IPublicListParams,
    ): Promise<IPublicListResponse<IEvent>> {
      const cityId = await resolveEventCityId(http, params);
      if (params.citySlug && cityId === undefined) {
        return {
          items: [],
          total: 0,
          page: params.page ?? 1,
          limit: params.limit ?? 12,
        };
      }
      const { data } = await http.get<unknown>("/public/events", {
        params: buildEventQuery(params, cityId),
      });
      const parsed = unwrapCollection<Record<string, unknown>>(data);
      const items = parsed.items
        .map(mapEventFromApi)
        .filter((e) => e.published);
      return {
        items,
        total: parsed.total,
        page: parsed.page,
        limit: parsed.limit,
      };
    },

    async getPublishedEventById(id: number): Promise<IEvent | null> {
      try {
        const { data } = await http.get<unknown>(`/public/events/${id}`);
        const raw = unwrapResource<Record<string, unknown>>(data);
        const event = mapEventFromApi(raw);
        if (!event.published) {
          return null;
        }
        return event;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        return null;
      }
    },

    async listPublishedEventByCityId(cityId: number): Promise<IEvent[] | null> {
      const all: IEvent[] = [];
      let page = 1;
      const limit = 100;

      for (let i = 0; i < MAX_BY_CITY_PAGES; i += 1) {
        const { data } = await http.get<unknown>("/public/events", {
          params: { cityId, page, limit, sortDir: "asc" },
        });
        const parsed = unwrapCollection<Record<string, unknown>>(data);
        const batch = parsed.items
          .map(mapEventFromApi)
          .filter((e) => e.published);
        all.push(...batch);
        if (page >= parsed.totalPages || batch.length === 0) {
          break;
        }
        page += 1;
      }

      return all;
    },

    async listPublishedTouristPoints(
      params: IPublicListParams,
    ): Promise<IPublicListResponse<ITouristPoint>> {
      const { data } = await http.get<unknown>("/public/tourist-points", {
        params: buildTouristPointQuery(params),
      });
      const parsed = unwrapCollection<Record<string, unknown>>(data);
      let items = parsed.items
        .map(mapTouristPointFromApi)
        .filter((p) => p.published);

      if (params.category?.trim()) {
        items = items.filter((p) => p.category === params.category);
      }

      return {
        items,
        total: params.category?.trim() ? items.length : parsed.total,
        page: parsed.page,
        limit: parsed.limit,
      };
    },

    async getPublishedTouristPointById(
      id: number,
    ): Promise<ITouristPoint | null> {
      try {
        const { data } = await http.get<unknown>(`/public/tourist-points/${id}`);
        const raw = unwrapResource<Record<string, unknown>>(data);
        const point = mapTouristPointFromApi(raw);
        if (!point.published) {
          return null;
        }
        return point;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        return null;
      }
    },

    async listPublishedTouristPointByCityId(
      cityId: number,
    ): Promise<ITouristPoint[] | null> {
      try {
        const { data: cityBody } = await http.get<unknown>(
          `/public/cities/by-id/${cityId}`,
        );
        const cityRaw = unwrapResource<Record<string, unknown>>(cityBody);
        const city = mapCityFromApi(cityRaw);
        if (!city.published) {
          return null;
        }

        const all: ITouristPoint[] = [];
        let page = 1;
        const limit = 50;

        for (let i = 0; i < MAX_BY_CITY_PAGES; i += 1) {
          const { data } = await http.get<unknown>("/public/tourist-points", {
            params: {
              page,
              limit,
              published: "true",
              city: city.slug,
            },
          });
          const parsed = unwrapCollection<Record<string, unknown>>(data);
          const batch = parsed.items
            .map(mapTouristPointFromApi)
            .filter((p) => p.published && p.cityId === cityId);
          all.push(...batch);
          if (page >= parsed.totalPages || parsed.items.length === 0) {
            break;
          }
          page += 1;
        }

        return all;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        return null;
      }
    },

    async getInstitutionalContent(): Promise<IInstitutionalContent> {
      const { data } = await http.get<unknown>("/public/institutional-content");
      const { items } = unwrapCollection<Record<string, unknown>>(data);
      if (items.length === 0) {
        throw new Error("Conteúdo institucional não encontrado na API pública.");
      }
      const sorted = [...items].sort((a, b) => {
        const ta = new Date(
          String((a as Record<string, unknown>).updatedAt ?? 0),
        ).getTime();
        const tb = new Date(
          String((b as Record<string, unknown>).updatedAt ?? 0),
        ).getTime();
        return tb - ta;
      });
      return mapInstitutionalFromApi(sorted[0] as Record<string, unknown>);
    },

    async listActiveSocialLinks(): Promise<ISocialLink[]> {
      const { data } = await http.get<unknown>("/public/social-links");
      const { items } = unwrapCollection<Record<string, unknown>>(data);
      return items
        .map(mapSocialLinkFromApi)
        .filter((link) => link.active)
        .sort((a, b) => a.order - b.order);
    },

    async getHomeHighlights(): Promise<IPublicHomeHighlightsResponse> {
      const content = await client.getHomeContent();
      const eventIds = new Set<number>();
      const touristIds = new Set<number>();

      for (const h of content.highlights) {
        if (!h.active || h.referenceId === undefined) {
          continue;
        }
        const rid = Number(h.referenceId);
        if (!Number.isFinite(rid)) {
          continue;
        }
        if (h.type === "event") {
          eventIds.add(rid);
        } else if (h.type === "tourist-point") {
          touristIds.add(rid);
        }
      }

      const events = (
        await Promise.all(
          [...eventIds].map((id) => client.getPublishedEventById(id)),
        )
      ).filter((e): e is IEvent => e !== null);

      const touristPoints = (
        await Promise.all(
          [...touristIds].map((id) => client.getPublishedTouristPointById(id)),
        )
      ).filter((p): p is ITouristPoint => p !== null);

      return { events, touristPoints };
    },

    async getHomeContent(): Promise<IPublicHomeContentResponse> {
      const { data } = await http.get<unknown>("/public/home-content");
      const payload = unwrapResource<{
        banners: Array<Record<string, unknown>>;
        highlights: Array<Record<string, unknown>>;
      }>(data);

      const banners = (payload.banners ?? [])
        .filter((b) => Boolean(b.active))
        .map((b) => ({
          id: Number(b.id),
          title: String(b.title ?? ""),
          subtitle:
            b.subtitle !== undefined ? String(b.subtitle) : undefined,
          imageUrl: String(b.imageUrl ?? ""),
          ctaLabel: b.ctaLabel !== undefined ? String(b.ctaLabel) : undefined,
          ctaUrl: b.ctaUrl !== undefined ? String(b.ctaUrl) : undefined,
          active: Boolean(b.active),
          order: Number(b.order ?? 0),
        }))
        .sort((a, b) => a.order - b.order);

      const highlights = (payload.highlights ?? [])
        .filter((h) => Boolean(h.active))
        .map((h) => ({
          id: Number(h.id),
          type: h.type as HomeHighlightType,
          referenceId:
            h.referenceId !== undefined && h.referenceId !== null
              ? String(h.referenceId)
              : undefined,
          title: String(h.title ?? ""),
          description: String(h.description ?? ""),
          cityName:
            h.cityName !== undefined ? String(h.cityName) : undefined,
          imageUrl:
            h.imageUrl !== undefined ? String(h.imageUrl) : undefined,
          ctaUrl: h.ctaUrl !== undefined ? String(h.ctaUrl) : undefined,
          active: Boolean(h.active),
          order: Number(h.order ?? 0),
        }))
        .sort((a, b) => a.order - b.order);

      return { banners, highlights };
    },
  };

  return client;
}
