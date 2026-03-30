import { useEffect, useState } from "react";
import type { ICity } from "@/entities/city/city.types";
import { publicApiClient } from "@/services/public-api/client";

export interface IUsePublishedCityBySlugResult {
  city: ICity | null;
  isLoading: boolean;
  notFound: boolean;
}

export function usePublishedCityBySlug(
  slug: string | undefined,
): IUsePublishedCityBySlugResult {
  const [city, setCity] = useState<ICity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(slug));
  const [notFound, setNotFound] = useState<boolean>(!slug);

  useEffect(() => {
    let isActive: boolean = true;

    async function loadCity(): Promise<void> {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const response: ICity | null =
          await publicApiClient.getPublishedCityBySlug(slug);

        if (!isActive) {
          return;
        }

        if (!response || !response.published) {
          setNotFound(true);
          return;
        }

        setCity(response);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCity();

    return () => {
      isActive = false;
    };
  }, [slug]);

  return { city, isLoading, notFound };
}
