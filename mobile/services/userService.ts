import { api } from "@/utils/api";
import { AuthUser } from "./authService";

interface UserResponse {
  success: boolean;
  user: AuthUser;
}

export const userService = {
  getMe: () => api.get<UserResponse>("/users/me"),

  updateProfile: (data: Partial<Pick<AuthUser, "firstName" | "lastName" | "email" | "phone" | "countryCode" | "location">>) =>
    api.put<UserResponse>("/users/profile", data),

  updatePassword: (currentPassword: string, newPassword: string) =>
    api.put("/users/password", { currentPassword, newPassword }),

  uploadAvatar: (base64Image: string) =>
    api.post<UserResponse>("/users/avatar", { image: base64Image }),
};
