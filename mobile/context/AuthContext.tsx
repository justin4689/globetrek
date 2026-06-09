import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, AuthUser } from "@/services/authService";
import { storage } from "@/utils/storage";
import { api } from "@/utils/api";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    (async () => {
      try {
        const token = await storage.getAccessToken();
        if (token) {
          const { user } = await api.get<{ success: boolean; user: AuthUser }>("/users/me");
          setUser(user);
        }
      } catch {
        await storage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    // Stack.Protected redirige automatiquement quand isAuthenticated devient true
  };

  const register = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const res = await authService.register(data);
    setUser(res.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    // Stack.Protected redirige automatiquement vers onboarding quand isAuthenticated devient false
  };

  const updateUser = (updated: AuthUser) => setUser(updated);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
