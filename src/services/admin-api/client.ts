import type { IAdminApiClient } from "./adminApi.types";
import { resolveAdminBffBaseUrl } from "./adminBffConfig";
import { createHttpAdminApiClient } from "./httpAdminApiClient";
import { createInMemoryAdminApiClient } from "./inMemoryAdminApiClient";

const baseURL = resolveAdminBffBaseUrl();

/**
 * Com URL da API (`VITE_PUBLIC_BFF_BASE_URL` ou `VITE_ADMIN_BFF_BASE_URL`), usa HTTP + JWT.
 * Sem URL, mantém mock in-memory (desenvolvimento local sem backend).
 */
export const adminApiClient: IAdminApiClient = baseURL
  ? createHttpAdminApiClient(baseURL)
  : createInMemoryAdminApiClient();
