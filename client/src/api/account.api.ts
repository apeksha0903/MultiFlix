import api from './axiosInstance';
import type { User } from '@/types/auth.types';

export const getMe = () => api.get<User>('/account/me').then((r) => r.data);

export const updateMe = (data: { displayName?: string; avatarStyle?: string }) =>
  api.patch<User>('/account/me', data).then((r) => r.data);

export const changePassword = (data: { currentPassword: string; newPassword: string }) =>
  api.patch('/account/password', data).then((r) => r.data);

export const completeOnboarding = (data: { displayName: string; avatarStyle: string }) =>
  api.post('/account/complete-onboarding', data).then((r) => r.data);
