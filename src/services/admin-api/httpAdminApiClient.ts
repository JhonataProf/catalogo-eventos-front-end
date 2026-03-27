import type {
  IInstitutionalContent,
  IUpdateInstitutionalContentInput,
} from "@/entities/institutional/institutional.types";
import type {
  ICreateSocialLinkInput,
  ISocialLink,
  IUpdateSocialLinkInput,
} from "@/entities/social-link/socialLink.types";
import type {
  ICity,
  ICreateCityInput,
  IUpdateCityInput,
} from "@/entities/city/city.types";
import type {
  ICreateEventInput,
  IEvent,
  IUpdateEventInput,
} from "@/entities/event/event.types";
import type {
  ICreateTouristPointInput,
  ITouristPoint,
  IUpdateTouristPointInput,
} from "@/entities/tourist-point/touristPoint.types";
import type {
  ICreateHomeBannerInput,
  ICreateHomeHighlightInput,
  IHomeBanner,
  IHomeHighlight,
  IUpdateHomeBannerInput,
  IUpdateHomeHighlightInput,
} from "@/entities/home-content/homeContent.types";
import type { IAdminApiClient } from "./adminApi.types";
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";
import { unwrapCollection, unwrapResource } from "@/services/api/httpEnvelope";
import { loadAdminSession, updateAdminAccessToken } from "@/domains/admin-cms/auth/auth.storage";
import { refreshAccessToken } from "./adminAuth.api";
import { notifyAdminAuthExpired } from "./adminAuthEvents";
import { webImagePayloadFromImageUrlField } from "./adminWebImage";

function trimBaseUrl(baseURL: string): string {
  return baseURL.replace(/\/+$/, "");
}

function toIso(value: unknown, fallback: string): string {
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

function mapCity(raw: Record<string, unknown>): ICity {
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
    createdAt: toIso(raw.createdAt, new Date(0).toISOString()),
    updatedAt: toIso(raw.updatedAt, new Date(0).toISOString()),
  };
}

function mapEvent(raw: Record<string, unknown>): IEvent {
  return {
    id: Number(raw.id),
    cityId: Number(raw.cityId),
    citySlug: String(raw.citySlug ?? ""),
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    category: raw.category !== undefined ? String(raw.category) : undefined,
    startDate:
      raw.startDate !== undefined ? toIso(raw.startDate, "") : undefined,
    endDate: raw.endDate !== undefined ? toIso(raw.endDate, "") : undefined,
    formattedDate:
      raw.formattedDate !== undefined ? String(raw.formattedDate) : undefined,
    location: raw.location !== undefined ? String(raw.location) : undefined,
    imageUrl: raw.imageUrl !== undefined ? String(raw.imageUrl) : undefined,
    featured: Boolean(raw.featured),
    published: Boolean(raw.published),
    createdAt: toIso(raw.createdAt, new Date(0).toISOString()),
    updatedAt: toIso(raw.updatedAt, new Date(0).toISOString()),
  };
}

function mapTouristPoint(raw: Record<string, unknown>): ITouristPoint {
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
    createdAt: toIso(raw.createdAt, new Date(0).toISOString()),
    updatedAt: toIso(raw.updatedAt, new Date(0).toISOString()),
  };
}

function mapSocialLink(raw: Record<string, unknown>): ISocialLink {
  return {
    id: Number(raw.id),
    platform: raw.platform as ISocialLink["platform"],
    label: String(raw.label ?? ""),
    url: String(raw.url ?? ""),
    active: Boolean(raw.active),
    order: Number(raw.order ?? 0),
  };
}

function parseInstitutionalValues(valuesJson: unknown): string[] {
  if (typeof valuesJson !== "string" || !valuesJson.trim()) {
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

function mapInstitutional(raw: Record<string, unknown>): IInstitutionalContent {
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
    values: parseInstitutionalValues(raw.valuesJson),
    updatedAt: toIso(raw.updatedAt, new Date(0).toISOString()),
  };
}

function mapBanner(raw: Record<string, unknown>): IHomeBanner {
  return {
    id: Number(raw.id),
    title: String(raw.title ?? ""),
    subtitle: raw.subtitle !== undefined ? String(raw.subtitle) : undefined,
    imageUrl: String(raw.imageUrl ?? ""),
    ctaLabel: raw.ctaLabel !== undefined ? String(raw.ctaLabel) : undefined,
    ctaUrl: raw.ctaUrl !== undefined ? String(raw.ctaUrl) : undefined,
    active: Boolean(raw.active),
    order: Number(raw.order ?? 0),
  };
}

function mapHighlight(raw: Record<string, unknown>): IHomeHighlight {
  const ref = raw.referenceId;
  return {
    id: Number(raw.id),
    type: raw.type as IHomeHighlight["type"],
    referenceId:
      ref !== undefined && ref !== null ? String(ref) : undefined,
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    cityName: raw.cityName !== undefined ? String(raw.cityName) : undefined,
    imageUrl: raw.imageUrl !== undefined ? String(raw.imageUrl) : undefined,
    ctaUrl: raw.ctaUrl !== undefined ? String(raw.ctaUrl) : undefined,
    active: Boolean(raw.active),
    order: Number(raw.order ?? 0),
  };
}

function createAdminAxios(baseURL: string): AxiosInstance {
  const http = axios.create({
    baseURL: trimBaseUrl(baseURL),
    headers: { Accept: "application/json" },
    timeout: 60_000,
  });

  http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const session = loadAdminSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  });

  http.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!isAxiosError(error) || !error.config) {
        return Promise.reject(error);
      }

      const original = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const reqUrl = original.url ?? "";

      if (
        !error.response ||
        error.response.status !== 401 ||
        original._retry ||
        reqUrl.includes("/auth/login") ||
        reqUrl.includes("/auth/refresh-token")
      ) {
        return Promise.reject(error);
      }

      original._retry = true;
      const session = loadAdminSession();
      if (!session?.refreshToken) {
        notifyAdminAuthExpired();
        return Promise.reject(error);
      }

      try {
        const nextAccess = await refreshAccessToken(
          trimBaseUrl(baseURL),
          session.refreshToken,
        );
        updateAdminAccessToken(nextAccess);
        original.headers.Authorization = `Bearer ${nextAccess}`;
        return http.request(original);
      } catch {
        notifyAdminAuthExpired();
        return Promise.reject(error);
      }
    },
  );

  return http;
}

async function pickInstitutional(
  http: AxiosInstance,
): Promise<IInstitutionalContent> {
  const { data } = await http.get<unknown>("/admin/institutional-content");
  const { items } = unwrapCollection<Record<string, unknown>>(data);
  if (items.length === 0) {
    throw new Error("Nenhum conteúdo institucional encontrado na API.");
  }
  const sorted = [...items].sort((a, b) => {
    const ta = new Date(String(a.updatedAt ?? 0)).getTime();
    const tb = new Date(String(b.updatedAt ?? 0)).getTime();
    return tb - ta;
  });
  return mapInstitutional(sorted[0] as Record<string, unknown>);
}

export function createHttpAdminApiClient(baseURL: string): IAdminApiClient {
  const http = createAdminAxios(baseURL);

  return {
    async getInstitutionalContent(): Promise<IInstitutionalContent> {
      return pickInstitutional(http);
    },

    async updateInstitutionalContent(
      input: IUpdateInstitutionalContentInput,
    ): Promise<IInstitutionalContent> {
      const body: Record<string, unknown> = {};
      if (input.aboutTitle !== undefined) {
        body.aboutTitle = input.aboutTitle;
      }
      if (input.aboutText !== undefined) {
        body.aboutText = input.aboutText;
      }
      if (input.whoWeAreTitle !== undefined) {
        body.whoWeAreTitle = input.whoWeAreTitle;
      }
      if (input.whoWeAreText !== undefined) {
        body.whoWeAreText = input.whoWeAreText;
      }
      if (input.purposeTitle !== undefined) {
        body.purposeTitle = input.purposeTitle;
      }
      if (input.purposeText !== undefined) {
        body.purposeText = input.purposeText;
      }
      if (input.mission !== undefined) {
        body.mission = input.mission;
      }
      if (input.vision !== undefined) {
        body.vision = input.vision;
      }
      if (input.values !== undefined) {
        body.valuesJson = JSON.stringify(input.values);
      }

      const { data } = await http.patch<unknown>(
        `/admin/institutional-content/${input.id}`,
        body,
      );
      const raw = unwrapResource<Record<string, unknown>>(data);
      return mapInstitutional(raw);
    },

    async listSocialLinks(): Promise<ISocialLink[]> {
      const { data } = await http.get<unknown>("/admin/social-links");
      const { items } = unwrapCollection<Record<string, unknown>>(data);
      return items.map((row) => mapSocialLink(row as Record<string, unknown>));
    },

    async createSocialLink(
      input: ICreateSocialLinkInput,
    ): Promise<ISocialLink> {
      const { data } = await http.post<unknown>("/admin/social-links", input);
      return mapSocialLink(
        unwrapResource<Record<string, unknown>>(data),
      );
    },

    async updateSocialLink(
      input: IUpdateSocialLinkInput,
    ): Promise<ISocialLink> {
      const { id, ...rest } = input;
      const { data } = await http.patch<unknown>(
        `/admin/social-links/${id}`,
        rest,
      );
      return mapSocialLink(
        unwrapResource<Record<string, unknown>>(data),
      );
    },

    async deleteSocialLink(id: number): Promise<void> {
      await http.delete(`/admin/social-links/${id}`);
    },

    async listCities(): Promise<ICity[]> {
      const { data } = await http.get<unknown>("/admin/cities");
      const { items } = unwrapCollection<Record<string, unknown>>(data);
      return items.map((row) => mapCity(row as Record<string, unknown>));
    },

    async getCityById(id: number): Promise<ICity | null> {
      try {
        const { data } = await http.get<unknown>(`/admin/cities/${id}`);
        return mapCity(unwrapResource<Record<string, unknown>>(data));
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },

    async getCityBySlug(slug: string): Promise<ICity | null> {
      try {
        const { data } = await http.get<unknown>(
          `/public/cities/${encodeURIComponent(slug)}`,
        );
        return mapCity(unwrapResource<Record<string, unknown>>(data));
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },

    async createCity(input: ICreateCityInput): Promise<ICity> {
      const image = webImagePayloadFromImageUrlField(
        input.imageUrl,
        "Imagem da cidade",
      );
      const { data } = await http.post<unknown>("/admin/cities", {
        name: input.name,
        slug: input.slug,
        state: input.state,
        summary: input.summary,
        description: input.description ?? "",
        published: input.published,
        image,
      });
      return mapCity(unwrapResource<Record<string, unknown>>(data));
    },

    async updateCity(input: IUpdateCityInput): Promise<ICity> {
      const body: Record<string, unknown> = {};
      if (input.name !== undefined) {
        body.name = input.name;
      }
      if (input.slug !== undefined) {
        body.slug = input.slug;
      }
      if (input.state !== undefined) {
        body.state = input.state;
      }
      if (input.summary !== undefined) {
        body.summary = input.summary;
      }
      if (input.description !== undefined) {
        body.description = input.description;
      }
      if (input.published !== undefined) {
        body.published = input.published;
      }
      if (input.imageUrl !== undefined && input.imageUrl.trim() !== "") {
        body.image = webImagePayloadFromImageUrlField(
          input.imageUrl,
          "Imagem da cidade",
        );
      }

      const { data } = await http.patch<unknown>(
        `/admin/cities/${input.id}`,
        body,
      );
      return mapCity(unwrapResource<Record<string, unknown>>(data));
    },

    async deleteCity(id: number): Promise<void> {
      await http.delete(`/admin/cities/${id}`);
    },

    async listEvents(): Promise<IEvent[]> {
      const { data } = await http.get<unknown>("/admin/events", {
        params: { page: 1, limit: 100, sortDir: "asc" },
      });
      const { items } = unwrapCollection<Record<string, unknown>>(data);
      return items.map((row) => mapEvent(row as Record<string, unknown>));
    },

    async getEventById(id: number): Promise<IEvent | null> {
      try {
        const { data } = await http.get<unknown>(`/admin/events/${id}`);
        return mapEvent(unwrapResource<Record<string, unknown>>(data));
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },

    async createEvent(input: ICreateEventInput): Promise<IEvent> {
      const image = webImagePayloadFromImageUrlField(
        input.imageUrl,
        "Imagem do evento",
      );
      const { data } = await http.post<unknown>("/admin/events", {
        cityId: input.cityId,
        citySlug: input.citySlug,
        name: input.name,
        description: input.description,
        category: input.category,
        startDate: input.startDate,
        endDate: input.endDate,
        formattedDate: input.formattedDate,
        location: input.location,
        featured: input.featured,
        published: input.published,
        image,
      });
      return mapEvent(unwrapResource<Record<string, unknown>>(data));
    },

    async updateEvent(input: IUpdateEventInput): Promise<IEvent> {
      const { id, ...rest } = input;
      const body: Record<string, unknown> = { ...rest };
      if (rest.imageUrl !== undefined && rest.imageUrl.trim() !== "") {
        body.image = webImagePayloadFromImageUrlField(
          rest.imageUrl,
          "Imagem do evento",
        );
        delete body.imageUrl;
      }
      const { data } = await http.patch<unknown>(`/admin/events/${id}`, body);
      return mapEvent(unwrapResource<Record<string, unknown>>(data));
    },

    async deleteEvent(id: number): Promise<void> {
      await http.delete(`/admin/events/${id}`);
    },

    async listTouristPoints(): Promise<ITouristPoint[]> {
      const all: ITouristPoint[] = [];
      for (let page = 1; page <= 20; page += 1) {
        const { data } = await http.get<unknown>("/admin/tourist-points", {
          params: { page, limit: 50, sortDir: "asc" },
        });
        const parsed = unwrapCollection<Record<string, unknown>>(data);
        const batch = parsed.items.map((row) =>
          mapTouristPoint(row as Record<string, unknown>),
        );
        all.push(...batch);
        if (page >= parsed.totalPages || batch.length === 0) {
          break;
        }
      }
      return all;
    },

    async getTouristPointById(id: number): Promise<ITouristPoint | null> {
      try {
        const { data } = await http.get<unknown>(`/admin/tourist-points/${id}`);
        return mapTouristPoint(
          unwrapResource<Record<string, unknown>>(data),
        );
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },

    async createTouristPoint(
      input: ICreateTouristPointInput,
    ): Promise<ITouristPoint> {
      const image = webImagePayloadFromImageUrlField(
        input.imageUrl,
        "Imagem do ponto turístico",
      );
      const { data } = await http.post<unknown>("/admin/tourist-points", {
        cityId: input.cityId,
        citySlug: input.citySlug,
        name: input.name,
        description: input.description,
        category: input.category,
        address: input.address,
        openingHours: input.openingHours,
        featured: input.featured,
        published: input.published,
        image,
      });
      return mapTouristPoint(
        unwrapResource<Record<string, unknown>>(data),
      );
    },

    async updateTouristPoint(
      input: IUpdateTouristPointInput,
    ): Promise<ITouristPoint> {
      const { id, ...rest } = input;
      const body: Record<string, unknown> = { ...rest };
      if (rest.imageUrl !== undefined && rest.imageUrl.trim() !== "") {
        body.image = webImagePayloadFromImageUrlField(
          rest.imageUrl,
          "Imagem do ponto turístico",
        );
        delete body.imageUrl;
      }
      const { data } = await http.put<unknown>(
        `/admin/tourist-points/${id}`,
        body,
      );
      return mapTouristPoint(
        unwrapResource<Record<string, unknown>>(data),
      );
    },

    async deleteTouristPoint(id: number): Promise<void> {
      await http.delete(`/admin/tourist-points/${id}`);
    },

    async listHomeBanners(): Promise<IHomeBanner[]> {
      const { data } = await http.get<unknown>("/admin/home-banners");
      const { items } = unwrapCollection<Record<string, unknown>>(data);
      return items.map((row) => mapBanner(row as Record<string, unknown>));
    },

    async createHomeBanner(
      input: ICreateHomeBannerInput,
    ): Promise<IHomeBanner> {
      const image = webImagePayloadFromImageUrlField(
        input.imageUrl,
        "Imagem do banner",
      );
      const subtitle =
        input.subtitle && input.subtitle.length >= 3
          ? input.subtitle
          : "Subtítulo";
      const { data } = await http.post<unknown>("/admin/home-banners", {
        title: input.title,
        subtitle,
        image,
        ctaLabel: input.ctaLabel ?? "Saiba mais",
        ctaUrl: input.ctaUrl ?? "https://example.com",
        active: input.active,
        order: input.order,
      });
      return mapBanner(unwrapResource<Record<string, unknown>>(data));
    },

    async updateHomeBanner(
      input: IUpdateHomeBannerInput,
    ): Promise<IHomeBanner> {
      const { id, ...rest } = input;
      const body: Record<string, unknown> = { ...rest };
      if (rest.imageUrl !== undefined && rest.imageUrl.trim() !== "") {
        body.image = webImagePayloadFromImageUrlField(
          rest.imageUrl,
          "Imagem do banner",
        );
        delete body.imageUrl;
      }
      const { data } = await http.patch<unknown>(
        `/admin/home-banners/${id}`,
        body,
      );
      return mapBanner(unwrapResource<Record<string, unknown>>(data));
    },

    async deleteHomeBanner(id: number): Promise<void> {
      await http.delete(`/admin/home-banners/${id}`);
    },

    async listHomeHighlights(): Promise<IHomeHighlight[]> {
      const { data } = await http.get<unknown>("/admin/home-highlights");
      const { items } = unwrapCollection<Record<string, unknown>>(data);
      return items.map((row) => mapHighlight(row as Record<string, unknown>));
    },

    async createHomeHighlight(
      input: ICreateHomeHighlightInput,
    ): Promise<IHomeHighlight> {
      const image = webImagePayloadFromImageUrlField(
        input.imageUrl,
        "Imagem do destaque",
      );
      const ref = input.referenceId !== undefined ? Number(input.referenceId) : NaN;
      if (!Number.isFinite(ref)) {
        throw new Error("referenceId numérico é obrigatório para criar destaque.");
      }
      const { data } = await http.post<unknown>("/admin/home-highlights", {
        type: input.type,
        referenceId: ref,
        title: input.title,
        description: input.description,
        cityName: input.cityName && input.cityName.length >= 3 ? input.cityName : "Cidade",
        image,
        ctaUrl: input.ctaUrl ?? "https://example.com",
        active: input.active,
        order: input.order,
      });
      return mapHighlight(unwrapResource<Record<string, unknown>>(data));
    },

    async updateHomeHighlight(
      input: IUpdateHomeHighlightInput,
    ): Promise<IHomeHighlight> {
      const { id, ...rest } = input;
      const body: Record<string, unknown> = { ...rest };
      if (rest.referenceId !== undefined) {
        body.referenceId = Number(rest.referenceId);
      }
      if (rest.imageUrl !== undefined && rest.imageUrl.trim() !== "") {
        body.image = webImagePayloadFromImageUrlField(
          rest.imageUrl,
          "Imagem do destaque",
        );
        delete body.imageUrl;
      }
      const { data } = await http.patch<unknown>(
        `/admin/home-highlights/${id}`,
        body,
      );
      return mapHighlight(unwrapResource<Record<string, unknown>>(data));
    },

    async deleteHomeHighlight(id: number): Promise<void> {
      await http.delete(`/admin/home-highlights/${id}`);
    },
  };
}
