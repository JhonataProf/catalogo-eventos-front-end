import { useEffect, useState } from "react";
import type { ICity } from "@/entities/city/city.types";
import { getOrCreateSessionPromise } from "@/domains/public-portal/cache/sessionFetchCache";
import { publicApiClient } from "@/services/public-api/client";

interface IUsePublicCitiesResult {
  cities: ICity[];
  isLoading: boolean;
  error: string;
}

const CACHE_KEY = "public:published-cities";

export function usePublicCities(): IUsePublicCitiesResult {
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isActive: boolean = true;

    async function loadCities(): Promise<void> {
      try {
        setIsLoading(true);
        setError("");

        const response: ICity[] = await getOrCreateSessionPromise(
          CACHE_KEY,
          () => publicApiClient.listPublishedCities(),
        );

        if (!isActive) {
          return;
        }

        setCities(response.filter((item: ICity) => item.published));
      } catch {
        if (!isActive) {
          return;
        }

        setError("Não foi possível carregar as cidades.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCities();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    cities,
    isLoading,
    error,
  };
}
