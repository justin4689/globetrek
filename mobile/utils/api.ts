import Constants from "expo-constants";
import { storage } from "./storage";

const DEV_API_PORT = 5001;

/**
 * API base URL. EXPO_PUBLIC_API_URL (mobile/.env) wins when set. Otherwise, in development, the API
 * is assumed to run on the machine serving the bundle: its LAN address comes from Metro's host, so
 * the app keeps working when the Wi-Fi (and the IP) changes. (Not localhost: on a phone or
 * simulator, localhost is the device itself.)
 */
function resolveApiUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;

  const metroHost = Constants.expoConfig?.hostUri?.split(":")[0];
  if (__DEV__ && metroHost) return `http://${metroHost}:${DEV_API_PORT}/api`;

  throw new Error("EXPO_PUBLIC_API_URL is missing: add it to mobile/.env (see .env.example)");
}

export const BASE_URL = resolveApiUrl().replace(/\/$/, "");

export const API_ORIGIN = BASE_URL.replace(/\/api$/, "");

/** Resolves an image path from the API ("/images/x.jpg" or a full URL) to an Image source. */
export function imageSource(path: string | null | undefined, fallback?: number) {
  if (!path) return fallback;
  return { uri: /^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}` };
}

type RequestOptions = RequestInit & { skipAuth?: boolean };

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (!skipAuth) {
    const token = await storage.getAccessToken();
    if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { headers, ...rest });
  const data = await response.json();

  // Access token expired → refresh (shared by all parallel requests) and replay once
  if (!response.ok && data?.code === "TOKEN_EXPIRED") {
    const outcome = await refreshTokens();
    if (outcome === "refreshed") return request<T>(endpoint, options);
    if (outcome === "expired") await expireSession();
    // "offline": keep the saved session, the request just fails below
  }

  // Session closed on the server (logout elsewhere, password reset, revoked)
  if (!response.ok && data?.code === "SESSION_EXPIRED") {
    await expireSession();
  }

  if (!response.ok) {
    throw new ApiError(data?.message || "Request failed", response.status, data);
  }

  return data as T;
}

// Lets the auth layer sign the user out when the server ends the session
let sessionExpiredHandler: (() => void) | null = null;

export function onSessionExpired(handler: () => void) {
  sessionExpiredHandler = handler;
  return () => {
    if (sessionExpiredHandler === handler) sessionExpiredHandler = null;
  };
}

async function expireSession() {
  await storage.clearTokens();
  sessionExpiredHandler?.();
}

type RefreshOutcome = "refreshed" | "expired" | "offline";

// Single-flight: the API rotates refresh tokens and treats a reused one as stolen, so parallel
// requests must share ONE refresh call instead of each sending the same token.
let refreshInFlight: Promise<RefreshOutcome> | null = null;

function refreshTokens(): Promise<RefreshOutcome> {
  refreshInFlight ??= doRefresh().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function doRefresh(): Promise<RefreshOutcome> {
  const refreshToken = await storage.getRefreshToken();
  if (!refreshToken) return "expired";

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return "offline"; // network error: the session may still be valid
  }

  if (!res.ok) return res.status === 401 ? "expired" : "offline";

  const data = await res.json();
  await storage.setTokens(data.accessToken, data.refreshToken);
  return "refreshed";
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body), ...options }),

  put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body), ...options }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined, ...options }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};
