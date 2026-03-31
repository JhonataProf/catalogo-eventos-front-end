import { isAxiosError } from "axios";

/**
 * Erro normalizado da camada HTTP (BFF). A UI não deve depender de AxiosError.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | undefined,
    readonly code?: string,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static isApiError(value: unknown): value is ApiError {
    return value instanceof ApiError;
  }
}

function readMessageFromResponseData(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }
  const rec = data as Record<string, unknown>;
  if (typeof rec.message === "string" && rec.message.trim() !== "") {
    return rec.message;
  }
  if (typeof rec.error === "string" && rec.error.trim() !== "") {
    return rec.error;
  }
  const nestedError = rec.error;
  if (typeof nestedError === "object" && nestedError !== null) {
    const errRec = nestedError as Record<string, unknown>;
    if (typeof errRec.message === "string" && errRec.message.trim() !== "") {
      return errRec.message;
    }
  }
  return undefined;
}

function readCorrelationIdFromResponseData(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }
  const meta = (data as Record<string, unknown>).meta;
  if (typeof meta !== "object" || meta === null) {
    return undefined;
  }
  const id = (meta as Record<string, unknown>).correlationId;
  return typeof id === "string" && id.trim() !== "" ? id : undefined;
}

/**
 * Converte falha de rede/HTTP em {@link ApiError}. Útil após verificar 404/not found.
 */
export function toApiError(error: unknown, fallbackMessage = "Falha na comunicação com o servidor."): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    const headers = error.response?.headers;
    const requestIdHeader =
      typeof headers?.["x-request-id"] === "string"
        ? headers["x-request-id"]
        : typeof headers?.["X-Request-Id"] === "string"
          ? headers["X-Request-Id"]
          : undefined;
    const correlationId = readCorrelationIdFromResponseData(data);
    const requestId = requestIdHeader ?? correlationId;
    const fromBody = readMessageFromResponseData(data);
    const message =
      fromBody ?? error.message ?? fallbackMessage;
    return new ApiError(message, status, undefined, requestId);
  }
  if (error instanceof Error) {
    return new ApiError(error.message, undefined, undefined, undefined);
  }
  return new ApiError(String(error), undefined, undefined, undefined);
}
