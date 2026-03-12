// src/shared/lib/httpClient.ts
export interface IHttpRequestConfig extends RequestInit {
  headers?: HeadersInit;
}

export interface IHttpClient {
  get<TResponse>(url: string, config?: IHttpRequestConfig): Promise<TResponse>;
  post<TRequest, TResponse>(
    url: string,
    body: TRequest,
    config?: IHttpRequestConfig
  ): Promise<TResponse>;
}

async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const contentType: string | null = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return undefined as TResponse;
}

class FetchHttpClient implements IHttpClient {
  async get<TResponse>(
    url: string,
    config?: IHttpRequestConfig
  ): Promise<TResponse> {
    const response: Response = await fetch(url, {
      method: "GET",
      ...config,
    });

    return parseResponse<TResponse>(response);
  }

  async post<TRequest, TResponse>(
    url: string,
    body: TRequest,
    config?: IHttpRequestConfig
  ): Promise<TResponse> {
    const response: Response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      body: JSON.stringify(body),
      ...config,
    });

    return parseResponse<TResponse>(response);
  }
}

export const httpClient: IHttpClient = new FetchHttpClient();