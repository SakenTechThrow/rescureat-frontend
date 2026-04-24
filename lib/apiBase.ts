const LOCAL_API_FALLBACK = "http://localhost:8080";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!fromEnv) {
    return LOCAL_API_FALLBACK;
  }

  if (!/^https?:\/\//i.test(fromEnv)) {
    throw new Error(
      'Invalid NEXT_PUBLIC_API_URL: must start with "http://" or "https://".',
    );
  }

  return normalizeBaseUrl(fromEnv);
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
