import { Platform } from "react-native";
import { storage } from "./storage";

// Pour Expo Go sur appareil physique, remplace par l'IP de ta machine (ex: 192.168.1.42)
// Pour émulateur Android : 10.0.2.2 | Pour simulateur iOS : localhost
const LOCAL_IP = "192.168.1.100";

export const BASE_URL = __DEV__
  ? `http://${Platform.OS === "android" ? LOCAL_IP : "localhost"}:5000/api`
  : "https://api.globetrek.com/api";

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

  // Token expiré → on tente un refresh puis on rejoue la requête une fois
  if (!response.ok && data?.code === "TOKEN_EXPIRED") {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(endpoint, options);
  }

  if (!response.ok) {
    throw new ApiError(data?.message || "Request failed", response.status, data);
  }

  return data as T;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const refreshToken = await storage.getRefreshToken();
    if (!refreshToken) return false;

    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      await storage.clearTokens();
      return false;
    }

    const data = await res.json();
    await storage.setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    await storage.clearTokens();
    return false;
  }
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
