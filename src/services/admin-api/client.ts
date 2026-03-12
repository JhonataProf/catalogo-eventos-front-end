import type {
  IInstitutionalContent,
  IUpdateInstitutionalContentInput,
} from "@/entities/institutional/institutional.types";
import type {
  ICreateSocialLinkInput,
  ISocialLink,
  IUpdateSocialLinkInput,
} from "@/entities/social-link/socialLink.types";
import type { IAdminApiClient } from "./adminApi.types";
import {
  adminMockDelay,
  getInstitutionalContentMock,
  getSocialLinksMock,
  setInstitutionalContentMock,
  setSocialLinksMock,
  getCitiesMock,
  setCitiesMock,
  getEventsMock,
  setEventsMock,
  setTouristPointsMock,
  getTouristPointsMock,
} from "./mock-data";

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

export const adminApiClient: IAdminApiClient = {
  async getInstitutionalContent(): Promise<IInstitutionalContent> {
    await adminMockDelay();
    return getInstitutionalContentMock();
  },

  async updateInstitutionalContent(
    input: IUpdateInstitutionalContentInput,
  ): Promise<IInstitutionalContent> {
    await adminMockDelay();

    const nextValue: IInstitutionalContent = {
      ...getInstitutionalContentMock(),
      ...input,
      updatedAt: new Date().toISOString(),
    };

    setInstitutionalContentMock(nextValue);

    return nextValue;
  },

  async listSocialLinks(): Promise<ISocialLink[]> {
    await adminMockDelay();
    return getSocialLinksMock();
  },

  async createSocialLink(input: ICreateSocialLinkInput): Promise<ISocialLink> {
    await adminMockDelay();

    const currentItems: ISocialLink[] = getSocialLinksMock();

    const nextItem: ISocialLink = {
      id: `social-${crypto.randomUUID()}`,
      ...input,
    };

    setSocialLinksMock([...currentItems, nextItem]);

    return nextItem;
  },

  async updateSocialLink(input: IUpdateSocialLinkInput): Promise<ISocialLink> {
    await adminMockDelay();

    const currentItems: ISocialLink[] = getSocialLinksMock();
    const currentItem: ISocialLink | undefined = currentItems.find(
      (item: ISocialLink) => item.id === input.id,
    );

    if (!currentItem) {
      throw new Error("Link social não encontrado.");
    }

    const nextItem: ISocialLink = {
      ...currentItem,
      ...input,
    };

    const nextItems: ISocialLink[] = currentItems.map((item: ISocialLink) =>
      item.id === input.id ? nextItem : item,
    );

    setSocialLinksMock(nextItems);

    return nextItem;
  },

  async deleteSocialLink(id: string): Promise<void> {
    await adminMockDelay();

    const currentItems: ISocialLink[] = getSocialLinksMock();
    const nextItems: ISocialLink[] = currentItems.filter(
      (item: ISocialLink) => item.id !== id,
    );

    setSocialLinksMock(nextItems);
  },

  async listCities(): Promise<ICity[]> {
    await adminMockDelay();
    return getCitiesMock();
  },

  async getCityById(id: string): Promise<ICity | null> {
    await adminMockDelay();

    const currentItems: ICity[] = getCitiesMock();
    const foundItem: ICity | undefined = currentItems.find(
      (item: ICity) => item.id === id,
    );

    return foundItem ?? null;
  },

  async getCityBySlug(slug: string): Promise<ICity | null> {
    await adminMockDelay();

    const currentItems: ICity[] = getCitiesMock();
    const foundItem: ICity | undefined = currentItems.find(
      (item: ICity) => item.slug === slug,
    );

    return foundItem ?? null;
  },

  async createCity(input: ICreateCityInput): Promise<ICity> {
    await adminMockDelay();

    const currentItems: ICity[] = getCitiesMock();

    const nextItem: ICity = {
      id: `city-${crypto.randomUUID()}`,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCitiesMock([...currentItems, nextItem]);

    return nextItem;
  },

  async updateCity(input: IUpdateCityInput): Promise<ICity> {
    await adminMockDelay();

    const currentItems: ICity[] = getCitiesMock();
    const currentItem: ICity | undefined = currentItems.find(
      (item: ICity) => item.id === input.id,
    );

    if (!currentItem) {
      throw new Error("Cidade não encontrada.");
    }

    const nextItem: ICity = {
      ...currentItem,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    const nextItems: ICity[] = currentItems.map((item: ICity) =>
      item.id === input.id ? nextItem : item,
    );

    setCitiesMock(nextItems);

    return nextItem;
  },

  async deleteCity(id: string): Promise<void> {
    await adminMockDelay();

    const currentItems: ICity[] = getCitiesMock();
    const nextItems: ICity[] = currentItems.filter(
      (item: ICity) => item.id !== id,
    );

    setCitiesMock(nextItems);
  },

  async listEvents(): Promise<IEvent[]> {
    await adminMockDelay();
    return getEventsMock();
  },

  async getEventById(id: string): Promise<IEvent | null> {
    await adminMockDelay();

    const currentItems: IEvent[] = getEventsMock();
    const foundItem: IEvent | undefined = currentItems.find(
      (item: IEvent) => item.id === id,
    );

    return foundItem ?? null;
  },

  async createEvent(input: ICreateEventInput): Promise<IEvent> {
    await adminMockDelay();

    const currentItems: IEvent[] = getEventsMock();

    const nextItem: IEvent = {
      id: `event-${crypto.randomUUID()}`,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEventsMock([...currentItems, nextItem]);

    return nextItem;
  },

  async updateEvent(input: IUpdateEventInput): Promise<IEvent> {
    await adminMockDelay();

    const currentItems: IEvent[] = getEventsMock();
    const currentItem: IEvent | undefined = currentItems.find(
      (item: IEvent) => item.id === input.id,
    );

    if (!currentItem) {
      throw new Error("Evento não encontrado.");
    }

    const nextItem: IEvent = {
      ...currentItem,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    const nextItems: IEvent[] = currentItems.map((item: IEvent) =>
      item.id === input.id ? nextItem : item,
    );

    setEventsMock(nextItems);

    return nextItem;
  },

  async deleteEvent(id: string): Promise<void> {
    await adminMockDelay();

    const currentItems: IEvent[] = getEventsMock();
    const nextItems: IEvent[] = currentItems.filter(
      (item: IEvent) => item.id !== id,
    );

    setEventsMock(nextItems);
  },

  async listTouristPoints(): Promise<ITouristPoint[]> {
    await adminMockDelay();
    return getTouristPointsMock();
  },

  async getTouristPointById(id: string): Promise<ITouristPoint | null> {
    await adminMockDelay();

    const currentItems: ITouristPoint[] = getTouristPointsMock();
    const foundItem: ITouristPoint | undefined = currentItems.find(
      (item: ITouristPoint) => item.id === id,
    );

    return foundItem ?? null;
  },

  async createTouristPoint(
    input: ICreateTouristPointInput,
  ): Promise<ITouristPoint> {
    await adminMockDelay();

    const currentItems: ITouristPoint[] = getTouristPointsMock();

    const nextItem: ITouristPoint = {
      id: `tourist-point-${crypto.randomUUID()}`,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTouristPointsMock([...currentItems, nextItem]);

    return nextItem;
  },

  async updateTouristPoint(
    input: IUpdateTouristPointInput,
  ): Promise<ITouristPoint> {
    await adminMockDelay();

    const currentItems: ITouristPoint[] = getTouristPointsMock();
    const currentItem: ITouristPoint | undefined = currentItems.find(
      (item: ITouristPoint) => item.id === input.id,
    );

    if (!currentItem) {
      throw new Error("Ponto turístico não encontrado.");
    }

    const nextItem: ITouristPoint = {
      ...currentItem,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    const nextItems: ITouristPoint[] = currentItems.map(
      (item: ITouristPoint) => (item.id === input.id ? nextItem : item),
    );

    setTouristPointsMock(nextItems);

    return nextItem;
  },

  async deleteTouristPoint(id: string): Promise<void> {
    await adminMockDelay();

    const currentItems: ITouristPoint[] = getTouristPointsMock();
    const nextItems: ITouristPoint[] = currentItems.filter(
      (item: ITouristPoint) => item.id !== id,
    );

    setTouristPointsMock(nextItems);
  },
};
