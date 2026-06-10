import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";

export function useLoginMutation() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
  });
}

export function useRegisterMutation() {
  const { register } = useAuth();
  return useMutation({
    mutationFn: (data: { firstName: string; lastName: string; email: string; password: string }) =>
      register(data),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: ({ email, otp, purpose }: { email: string; otp: string; purpose?: string }) =>
      authService.verifyOtp(email, otp, purpose),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      userService.updatePassword(currentPassword, newPassword),
  });
}
