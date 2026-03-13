import { useEffect, useState } from "react";
import type { IInstitutionalContent } from "@/entities/institutional/institutional.types";
import { publicApiClient } from "@/services/public-api/client";

export interface IUseInstitutionalContentResult {
  content: IInstitutionalContent | null;
  isLoading: boolean;
  error: string;
}

export function useInstitutionalContent(): IUseInstitutionalContentResult {
  const [content, setContent] = useState<IInstitutionalContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isActive: boolean = true;

    async function loadContent(): Promise<void> {
      try {
        setIsLoading(true);
        setError("");

        const response: IInstitutionalContent =
          await publicApiClient.getInstitutionalContent();

        if (!isActive) {
          return;
        }

        setContent(response);
      } catch {
        if (!isActive) {
          return;
        }

        setError("Não foi possível carregar o conteúdo institucional.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadContent();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    content,
    isLoading,
    error,
  };
}
