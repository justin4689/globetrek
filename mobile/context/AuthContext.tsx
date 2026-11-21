import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, AuthUser } from "@/services/authService";
import { storage } from "@/utils/storage";
import { api, ApiError, onSessionExpired } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";

const ONBOARDING_KEY = "hasBeenOnboarding";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  markOnboardingComplete: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<{ email: string }>;
  loginWithTokens: (accessToken: string, refreshToken: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [token, onboarded] = await Promise.all([
          storage.getAccessToken(),
          AsyncStorage.getItem(ONBOARDING_KEY),
        ]);

        setHasSeenOnboarding(onboarded === "true");

        if (token) {
          const { user } = await api.get<{ success: boolean; user: AuthUser }>("/users/me");
          setUser(user);
        }
      } catch (err) {
        // Only a rejected session signs the user out; a network error keeps the saved session
        if (err instanceof ApiError && err.status === 401) await storage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Server ended the session (other device logout, password reset…): back to the login screen
  useEffect(
    () =>
      onSessionExpired(() => {
        setUser(null);
        queryClient.clear();
      }),
    [queryClient]
  );

  const markOnboardingComplete = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setHasSeenOnboarding(true);
  };

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setUser(res.user);
  };

  const register = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const res = await authService.register(data);
    return { email: res.email };
  };

  const loginWithTokens = async (accessToken: string, refreshToken: string, user: AuthUser) => {
    await storage.setTokens(accessToken, refreshToken);
    setUser(user);
  };

  const logout = async () => {
    try {
      await authService.logout();
      
    } catch {
      // server unreachable — still clear locally
    } finally {
      await storage.clearTokens();
      setUser(null);
      queryClient.clear(); // never show the previous user's data to the next one
    }
  };

  const updateUser = (updated: AuthUser) => setUser(updated);

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated: !!user,
      hasSeenOnboarding, markOnboardingComplete,
      login, register, loginWithTokens, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
