/**
 * Client-only auth helpers (JWT + role in localStorage).
 * Only call from browser code (Client Components / event handlers).
 */

export const AUTH_TOKEN_KEY = "rescuEat_token";
export const AUTH_ROLE_KEY = "rescuEat_role";
export const AUTH_NAME_KEY = "rescuEat_name";
export const AUTH_EMAIL_KEY = "rescuEat_email";

export type UserRole = "STUDENT" | "CAFE_OWNER";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  const r = localStorage.getItem(AUTH_ROLE_KEY);
  if (r === "STUDENT" || r === "CAFE_OWNER") return r;
  return null;
}

export function getStoredName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_NAME_KEY);
}

export function getStoredEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_EMAIL_KEY);
}

export function setAuth(
  token: string,
  role: UserRole,
  options?: { name?: string | null; email?: string | null },
): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_ROLE_KEY, role);
  const name = options?.name;
  if (name != null && name !== "") {
    localStorage.setItem(AUTH_NAME_KEY, name);
  } else {
    localStorage.removeItem(AUTH_NAME_KEY);
  }
  const email = options?.email;
  if (email != null && email !== "") {
    localStorage.setItem(AUTH_EMAIL_KEY, email);
  } else {
    localStorage.removeItem(AUTH_EMAIL_KEY);
  }
  window.dispatchEvent(new Event("auth-change"));
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(AUTH_NAME_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

export function authHeaders(extra?: HeadersInit): HeadersInit {
  const headers = new Headers(extra);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

/** Normalize backend role strings to our UserRole. */
export function normalizeRole(value: unknown): UserRole | null {
  if (value === "STUDENT" || value === "student") return "STUDENT";
  if (value === "CAFE_OWNER" || value === "cafe_owner" || value === "CAFE") return "CAFE_OWNER";
  return null;
}

type JsonRecord = Record<string, unknown>;

function isRecord(v: unknown): v is JsonRecord {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Extract token from common API response shapes.
 */
export function extractTokenFromBody(data: unknown): string | null {
  if (!isRecord(data)) return null;
  const token =
    data.token ??
    data.accessToken ??
    data.access_token ??
    (isRecord(data.data) ? (data.data as JsonRecord).token : undefined);
  return typeof token === "string" ? token : null;
}

export function extractRoleFromBody(data: unknown): UserRole | null {
  if (!isRecord(data)) return null;
  const role =
    data.role ??
    (isRecord(data.user) ? (data.user as JsonRecord).role : undefined);
  return normalizeRole(role);
}

export function extractNameFromBody(data: unknown): string | null {
  if (!isRecord(data)) return null;
  const name =
    data.name ??
    data.userName ??
    (isRecord(data.user) ? (data.user as JsonRecord).name : undefined);
  return typeof name === "string" ? name : null;
}

/**
 * Best-effort message from failed API response body (JSON or plain text).
 */
export function parseErrorFromText(text: string): string {
  if (!text) return "Request failed";
  try {
    const data = JSON.parse(text) as unknown;
    if (isRecord(data)) {
      const msg =
        data.message ??
        data.error ??
        data.detail ??
        (Array.isArray(data.errors) ? String(data.errors[0]) : undefined);
      if (typeof msg === "string") return msg;
    }
  } catch {
    return text;
  }
  return text;
}

export async function readApiErrorMessage(res: Response): Promise<string> {
  const text = await res.text();
  if (!text) return res.statusText || "Request failed";
  return parseErrorFromText(text);
}

const AUTH_API = "https://rescureat-backend-production.up.railway.app";

export type RegisterApiRole = "STUDENT" | "CAFE_OWNER";

/**
 * Register a new account. If the response includes a token, stores auth and returns loggedIn.
 */
export async function registerAccount(
  name: string,
  email: string,
  password: string,
  role: RegisterApiRole,
): Promise<
  | { ok: true; loggedIn: true; role: UserRole }
  | { ok: true; loggedIn: false }
  | { ok: false; message: string }
> {
  const res = await fetch(`${AUTH_API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  const text = await res.text();
  if (!res.ok) {
    return { ok: false, message: parseErrorFromText(text) };
  }
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      return { ok: false, message: "Invalid response from server" };
    }
  }
  const token = extractTokenFromBody(data);
  const userRole = extractRoleFromBody(data);
  const displayName = extractNameFromBody(data);
  if (token && userRole) {
    setAuth(token, userRole, {
      name: displayName ?? name,
      email,
    });
    return { ok: true, loggedIn: true, role: userRole };
  }
  return { ok: true, loggedIn: false };
}

/**
 * Log in and persist JWT + role (+ optional name) in localStorage.
 */
export async function loginWithEmailPassword(
  email: string,
  password: string,
): Promise<{ ok: true; role: UserRole } | { ok: false; message: string }> {
  const res = await fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const text = await res.text();
  if (!res.ok) {
    return { ok: false, message: parseErrorFromText(text) };
  }
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      return { ok: false, message: "Invalid response from server" };
    }
  }
  const token = extractTokenFromBody(data);
  const role = extractRoleFromBody(data);
  const name = extractNameFromBody(data);
  if (!token || !role) {
    return { ok: false, message: "Login response missing token or role." };
  }
  setAuth(token, role, { name: name ?? undefined, email });
  return { ok: true, role };
}
