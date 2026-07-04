import api from './axiosInstance';
import type { AuthResponse } from '@/types/auth.types';
import type { InvitePreview, InviteResponse } from '@/types/user.types';

export const getInvite = (token: string) =>
  api.get<InvitePreview>(`/invites/${token}`).then((r) => r.data);

export const acceptInvite = (token: string, password: string) =>
  api
    .post<AuthResponse>(`/invites/${token}/accept`, { password })
    .then((r) => r.data);

export const sendInvite = (email: string) =>
  api.post<InviteResponse>('/invites', { email }).then((r) => r.data);
