import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { IEvent } from "@/entities/event/event.types";
import { adminApiClient } from "@/services/admin-api/client";

export interface IUseAdminEventsListResult {
  items: IEvent[];
  setItems: Dispatch<SetStateAction<IEvent[]>>;
  isLoading: boolean;
  error: string;
  reload: () => Promise<void>;
}

export function useAdminEventsList(): IUseAdminEventsListResult {
  const [items, setItems] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const reload = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");

      const response: IEvent[] = await adminApiClient.listEvents();
      setItems(response);
    } catch {
      setError("Não foi possível carregar os eventos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, setItems, isLoading, error, reload };
}
