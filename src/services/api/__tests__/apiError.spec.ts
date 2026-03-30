import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { ApiError, toApiError } from "../apiError";

describe("ApiError", () => {
  it("identifica instâncias via isApiError", () => {
    const e = new ApiError("x", 400);
    expect(ApiError.isApiError(e)).toBe(true);
    expect(ApiError.isApiError(new Error())).toBe(false);
  });
});

describe("toApiError", () => {
  it("repassa ApiError sem alterar", () => {
    const original = new ApiError("já normalizado", 503, "x", "rid");
    const out = toApiError(original);
    expect(out).toBe(original);
  });

  it("normaliza AxiosError com mensagem do body e request id", () => {
    const err = new AxiosError("request failed");
    err.response = {
      status: 422,
      data: { message: "Campo inválido" },
      headers: { "x-request-id": "req-1" },
      statusText: "Unprocessable",
      config: {} as InternalAxiosRequestConfig,
    };
    const out = toApiError(err);
    expect(out).toBeInstanceOf(ApiError);
    expect(out.message).toBe("Campo inválido");
    expect(out.status).toBe(422);
    expect(out.requestId).toBe("req-1");
  });

  it("usa fallback quando body não traz mensagem", () => {
    const err = new AxiosError("timeout");
    err.response = {
      status: 504,
      data: {},
      headers: {},
      statusText: "",
      config: {} as InternalAxiosRequestConfig,
    };
    const out = toApiError(err, "Serviço indisponível.");
    expect(out.message).toBe("timeout");
    expect(out.status).toBe(504);
  });

  it("envolve Error genérico", () => {
    const out = toApiError(new Error("falha local"));
    expect(out.message).toBe("falha local");
    expect(out.status).toBeUndefined();
  });
});
