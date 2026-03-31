import { useEffect, useState } from "react";
import type { ITouristPoint } from "@/entities/tourist-point/touristPoint.types";
import { toApiError } from "@/services/api/apiError";
import { publicApiClient } from "@/services/public-api/client";

export interface IUsePublishedTouristPointByIdResult {
  touristPoint: ITouristPoint | null;
  isLoading: boolean;
  notFound: boolean;
  error: string | null;
}

function isValidId(id: number | undefined): id is number {
  return id !== undefined && Number.isFinite(id) && id > 0;
}

export function usePublishedTouristPointById(
  id: number | undefined,
): IUsePublishedTouristPointByIdResult {
  const [touristPoint, setTouristPoint] = useState<ITouristPoint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isValidId(id));
  const [notFound, setNotFound] = useState<boolean>(!isValidId(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive: boolean = true;

    async function load(): Promise<void> {
      if (!isValidId(id)) {
        setTouristPoint(null);
        setError(null);
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setNotFound(false);
        setTouristPoint(null);

        const response: ITouristPoint | null =
          await publicApiClient.getPublishedTouristPointById(id);

        if (!isActive) {
          return;
        }

        if (!response) {
          setNotFound(true);
          return;
        }

        setTouristPoint(response);
      } catch (caught) {
        if (!isActive) {
          return;
        }
        setError(toApiError(caught).message);
        setNotFound(false);
        setTouristPoint(null);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, [id]);

  return { touristPoint, isLoading, notFound, error };
}
