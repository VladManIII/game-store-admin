const baseUrl = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, init);

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  return (text ? JSON.parse(text) : undefined) as T;
}

function jsonInit(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const httpClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, jsonInit("POST", body)),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, jsonInit("PUT", body)),
  delete: <T = void>(path: string) => request<T>(path, { method: "DELETE" }),
};
