import { useEffect, useState } from "react";
import type { IEvent } from "@/entities/event/event.types";
import { publicApiClient } from "@/services/public-api/client";

export interface IUsePublishedEventByIdResult {
  event: IEvent | null;
  isLoading: boolean;
  notFound: boolean;
}

function isValidId(id: number | undefined): id is number {
  return id !== undefined && Number.isFinite(id) && id > 0;
}

export function usePublishedEventById(
  id: number | undefined,
): IUsePublishedEventByIdResult {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isValidId(id));
  const [notFound, setNotFound] = useState<boolean>(!isValidId(id));

  useEffect(() => {
    let isActive: boolean = true;

    async function loadEvent(): Promise<void> {
      if (!isValidId(id)) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const response: IEvent | null =
          await publicApiClient.getPublishedEventById(id);

        if (!isActive) {
          return;
        }

        if (!response) {
          setNotFound(true);
          return;
        }

        setEvent(response);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadEvent();

    return () => {
      isActive = false;
    };
  }, [id]);

  return { event, isLoading, notFound };
}
