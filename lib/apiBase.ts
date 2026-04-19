const DEFAULT_API_BASE = "http://localhost:8080";

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!configured) return DEFAULT_API_BASE;
  return normalizeBaseUrl(configured);
}

/**
 * Build full backend URL from a path.
 * Example: apiUrl("/api/deals") => "https://api.example.com/api/deals"
 */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
