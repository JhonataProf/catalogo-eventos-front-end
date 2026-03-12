import type { IAdminUser } from "./auth.types";

const AUTH_STORAGE_KEY = "celeiro-admin-auth";

export function saveAdminUser(user: IAdminUser): void {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function loadAdminUser(): IAdminUser | null {
  try {
    const rawValue: string | null = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (
      typeof parsedValue === "object" &&
      parsedValue !== null &&
      "id" in parsedValue &&
      "name" in parsedValue &&
      "email" in parsedValue &&
      "role" in parsedValue
    ) {
      return parsedValue as IAdminUser;
    }

    return null;
  } catch {
    return null;
  }
}

export function clearAdminUser(): void {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}