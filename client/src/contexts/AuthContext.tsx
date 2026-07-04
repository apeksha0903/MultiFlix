import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as loginApi, signup as signupApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import type { JwtPayload, User } from '@/types/auth.types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, user, setAuth, clearAuth, hydrate } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    hydrate();
    setIsLoading(false);
  }, [hydrate]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await loginApi({ email, password });
      setAuth(data.token, data.user);
    },
    [setAuth],
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      const data = await signupApi({ email, password });
      setAuth(data.token, data.user);
    },
    [setAuth],
  );

  const loginWithToken = useCallback(
    (token: string) => {
      const decoded = jwtDecode<JwtPayload>(token);
      setAuth(token, {
        id: decoded.userId,
        role: decoded.role,
        email: decoded.email ?? '',
      });
    },
    [setAuth],
  );

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      signup,
      loginWithToken,
      logout,
    }),
    [user, token, isLoading, login, signup, loginWithToken, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
