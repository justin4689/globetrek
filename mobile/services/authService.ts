import { api } from "@/utils/api";
import { storage } from "@/utils/storage";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  location: string;
  avatar: string;
  isEmailVerified: boolean;
}

interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const authService = {
  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    return api.post<{ success: boolean; message: string; email: string }>(
      "/auth/register",
      data,
      { skipAuth: true }
    );
  },

  login: async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/login", { email, password }, { skipAuth: true });
    await storage.setTokens(res.accessToken, res.refreshToken);
    return res;
  },

  logout: async () => {
    await api.post("/auth/logout", {});
    await storage.clearTokens();
  },

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }, { skipAuth: true }),

  verifyOtp: (email: string, otp: string, purpose?: string) =>
    api.post<AuthResponse & { resetToken?: string }>("/auth/verify-otp", { email, otp, purpose }, { skipAuth: true }),

  resetPassword: (resetToken: string, password: string) =>
    api.post("/auth/reset-password", { resetToken, password }, { skipAuth: true }),
};
