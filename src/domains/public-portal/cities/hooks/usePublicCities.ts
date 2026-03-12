import { useEffect, useState } from "react";
import type { ICity } from "@/entities/city/city.types";
import { adminApiClient } from "@/services/admin-api/client";

export interface IUsePublicCitiesResult {
  cities: ICity[];
  isLoading: boolean;
  error: string;
}

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

        const response: ICity[] = await adminApiClient.listCities();

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