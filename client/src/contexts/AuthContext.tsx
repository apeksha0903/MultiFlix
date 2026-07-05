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
import { getMe } from '@/api/account.api';
import { useAuthStore } from '@/store/authStore';
import type { JwtPayload, User } from '@/types/auth.types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, user, setAuth, clearAuth, hydrate } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const normalizeUser = useCallback((nextUser: User): User => ({
    ...nextUser,
    id: nextUser.id ?? nextUser._id ?? '',
    onboardingComplete: nextUser.onboardingComplete ?? false,
  }), []);

  const refreshUser = useCallback(async () => {
    const activeToken = localStorage.getItem('multiflix_token');
    if (!activeToken) return null;
    const fullUser = normalizeUser(await getMe());
    setAuth(activeToken, fullUser);
    return fullUser;
  }, [normalizeUser, setAuth]);

  useEffect(() => {
    hydrate();
    void refreshUser().finally(() => setIsLoading(false));
  }, [hydrate, refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await loginApi({ email, password });
      setAuth(data.token, normalizeUser({ ...data.user, onboardingComplete: false }));
      await refreshUser();
    },
    [normalizeUser, refreshUser, setAuth],
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      const data = await signupApi({ email, password });
      setAuth(data.token, normalizeUser({ ...data.user, onboardingComplete: false }));
      await refreshUser();
    },
    [normalizeUser, refreshUser, setAuth],
  );

  const loginWithToken = useCallback(
    async (token: string) => {
      const decoded = jwtDecode<JwtPayload>(token);
      setAuth(token, {
        id: decoded.userId,
        role: decoded.role,
        email: decoded.email ?? '',
        onboardingComplete: false,
      });
      await refreshUser();
    },
    [refreshUser, setAuth],
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
      refreshUser,
      logout,
    }),
    [user, token, isLoading, login, signup, loginWithToken, refreshUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
