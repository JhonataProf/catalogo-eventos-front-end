import axios from "axios";
import { unwrapResource } from "@/services/api/httpEnvelope";
import type { IAdminAuthSession } from "@/domains/admin-cms/auth/auth.types";

type LoginPayload = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

const ADMIN_ROLE = "Admin";

export async function loginWithPassword(
  baseURL: string,
  email: string,
  password: string,
): Promise<IAdminAuthSession> {
  const http = axios.create({
    baseURL,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    timeout: 30_000,
  });

  const { data } = await http.post<unknown>("/auth/login", { email, password });
  const payload = unwrapResource<LoginPayload>(data);

  if (payload.user.role !== ADMIN_ROLE) {
    throw new Error("Acesso negado: perfil não é administrador.");
  }

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    user: {
      id: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
      role: ADMIN_ROLE,
      token: payload.accessToken,
    },
  };
}

export async function refreshAccessToken(
  baseURL: string,
  refreshToken: string,
): Promise<string> {
  const http = axios.create({
    baseURL,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    timeout: 30_000,
  });
  const { data } = await http.post<unknown>("/auth/refresh-token", {
    refreshToken,
  });
  const payload = unwrapResource<{ accessToken: string }>(data);
  return payload.accessToken;
}
