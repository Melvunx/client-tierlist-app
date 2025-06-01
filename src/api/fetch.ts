const { VITE_BACKEND_API_URL } = import.meta.env;

export class ApiError extends Error {
  constructor(status: number, message: string) {
    super(message);
    this.name = `Api error with status ${status}`;
  }
}


export const apiFetcher = async <T>(
  url: string,
  {
    data,
    method,
  }: { data?: Record<string, unknown>; method?: string } = {}
): Promise<T> => {
  method ??= data ? "POST" : "GET";

  const options: RequestInit = {
    method,
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const res = await fetch(`${VITE_BACKEND_API_URL}${url}`, options);

  
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new ApiError(res.status, errorMessage);
  }

  if (res.status === 204) {
    return {} as T; // Return an empty object for 204 No Content
  }

  const json = await res.json();
  return json as T;

};
