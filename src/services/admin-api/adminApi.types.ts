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

export interface IAdminApiClient {
  getInstitutionalContent: () => Promise<IInstitutionalContent>;
  updateInstitutionalContent: (
    input: IUpdateInstitutionalContentInput,
  ) => Promise<IInstitutionalContent>;

  listSocialLinks: () => Promise<ISocialLink[]>;
  createSocialLink: (input: ICreateSocialLinkInput) => Promise<ISocialLink>;
  updateSocialLink: (input: IUpdateSocialLinkInput) => Promise<ISocialLink>;
  deleteSocialLink: (id: string) => Promise<void>;

  listCities: () => Promise<ICity[]>;
  getCityById: (id: string) => Promise<ICity | null>;
  getCityBySlug: (slug: string) => Promise<ICity | null>;
  createCity: (input: ICreateCityInput) => Promise<ICity>;
  updateCity: (input: IUpdateCityInput) => Promise<ICity>;
  deleteCity: (id: string) => Promise<void>;

  listEvents: () => Promise<IEvent[]>;
  getEventById: (id: string) => Promise<IEvent | null>;
  createEvent: (input: ICreateEventInput) => Promise<IEvent>;
  updateEvent: (input: IUpdateEventInput) => Promise<IEvent>;
  deleteEvent: (id: string) => Promise<void>;

  listTouristPoints: () => Promise<ITouristPoint[]>;
  getTouristPointById: (id: string) => Promise<ITouristPoint | null>;
  createTouristPoint: (
    input: ICreateTouristPointInput,
  ) => Promise<ITouristPoint>;
  updateTouristPoint: (
    input: IUpdateTouristPointInput,
  ) => Promise<ITouristPoint>;
  deleteTouristPoint: (id: string) => Promise<void>;
}
