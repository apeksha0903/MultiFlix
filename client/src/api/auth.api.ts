import api from './axiosInstance';
import type { AuthResponse, LoginCredentials, SignupCredentials } from '@/types/auth.types';

export const login = (credentials: LoginCredentials) =>
  api.post<AuthResponse>('/auth/login', credentials).then((r) => r.data);

export const signup = (credentials: SignupCredentials) =>
  api.post<AuthResponse>('/auth/signup', credentials).then((r) => r.data);
