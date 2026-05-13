export type AdminSessionRole = "admin" | "expert";

type JwtPayload = {
  exp?: number;
  role?: string;
};

type RefreshResponse = {
  accessToken?: string;
  refreshToken?: string;
};

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:3001";
const SESSION_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  userFullName: "userFullName",
  userEmail: "userEmail",
} as const;
const TOKEN_EXPIRY_SKEW_SECONDS = 30;
const ADMIN_ROLES: readonly AdminSessionRole[] = ["admin", "expert"];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parseJwtPayload(token: string | null): JwtPayload | null {
  if (!token) {
    return null;
  }

  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(SESSION_KEYS.accessToken);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(SESSION_KEYS.refreshToken);
}

export function hasSession(): boolean {
  return Boolean(getAccessToken() || getRefreshToken());
}

export function clearSession(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEYS.accessToken);
  window.localStorage.removeItem(SESSION_KEYS.refreshToken);
  window.localStorage.removeItem(SESSION_KEYS.userFullName);
  window.localStorage.removeItem(SESSION_KEYS.userEmail);
}

export function storeSessionTokens(input: RefreshResponse): void {
  if (!isBrowser()) {
    return;
  }

  if (input.accessToken) {
    window.localStorage.setItem(SESSION_KEYS.accessToken, input.accessToken);
  }

  if (input.refreshToken) {
    window.localStorage.setItem(SESSION_KEYS.refreshToken, input.refreshToken);
  }
}

export function isTokenExpired(token: string | null): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    return true;
  }

  const expiresAtMs = (payload.exp - TOKEN_EXPIRY_SKEW_SECONDS) * 1000;
  return Date.now() >= expiresAtMs;
}

export function readAdminRoleFromAccessToken(token: string | null): AdminSessionRole | null {
  const payload = parseJwtPayload(token);
  return ADMIN_ROLES.find((role) => role === payload?.role) ?? null;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearSession();
    return null;
  }

  try {
    const response = await fetch(`${AUTH_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const payload = (await response.json().catch(() => ({}))) as RefreshResponse;
    if (!response.ok || !payload.accessToken) {
      clearSession();
      return null;
    }

    storeSessionTokens(payload);
    return payload.accessToken;
  } catch {
    clearSession();
    return null;
  }
}

export async function ensureValidAccessToken(): Promise<string | null> {
  const accessToken = getAccessToken();
  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  return refreshAccessToken();
}

export async function logoutSession(): Promise<void> {
  let accessToken = getAccessToken();
  if (accessToken && isTokenExpired(accessToken)) {
    accessToken = await refreshAccessToken();
  }

  try {
    const refreshToken = getRefreshToken();
    if (accessToken || refreshToken) {
      await fetch(`${AUTH_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refreshToken: refreshToken ?? "" }),
      });
    }
  } catch {
    // Best-effort logout; local session is cleared below.
  } finally {
    clearSession();
  }
}
