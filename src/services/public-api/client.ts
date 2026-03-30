import type { IPublicApiClient } from "./publicApi.types";
import { createHttpPublicApiClient } from "./httpPublicApiClient";
import { createInMemoryPublicApiClient } from "./inMemoryPublicApiClient";

function resolvePublicBffBaseUrl(): string {
  const raw: string | undefined = import.meta.env.VITE_PUBLIC_BFF_BASE_URL;
  return typeof raw === "string" ? raw.trim() : "";
}

const bffBaseUrl: string = resolvePublicBffBaseUrl();

/**
 * Cliente da API pública. Com `VITE_PUBLIC_BFF_BASE_URL` definido, usa HTTP ao BFF;
 * caso contrário, usa o store em memória (desenvolvimento / fallback).
 */
export const publicApiClient: IPublicApiClient = bffBaseUrl
  ? createHttpPublicApiClient(bffBaseUrl)
  : createInMemoryPublicApiClient();
