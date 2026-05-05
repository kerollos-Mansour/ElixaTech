// In Clean Architecture, the infrastructure layer handles the details of the API communication.
// Using relative URLs allows the Next.js rewrite/proxy to handle the request, avoiding CORS issues.
const BASE_URL = "/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure the endpoint doesn't duplicate the /api prefix if already present
  const sanitizedEndpoint = endpoint.startsWith("/api") 
    ? endpoint.replace("/api", "") 
    : endpoint;

  const headers = new Headers(options.headers);
  
  if (headers.get("Content-Type") === "undefined") {
    headers.delete("Content-Type");
  } else if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Automatically add the auth_token if it exists in localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${BASE_URL}${sanitizedEndpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
}
