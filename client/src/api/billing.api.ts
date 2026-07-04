import api from './axiosInstance';
import type { BillingAccount, BillingMember } from '@/types/user.types';

export const getBillingAccount = () =>
  api.get<BillingAccount>('/billing').then((r) => r.data);

export const getBillingMembers = () =>
  api.get<BillingMember[]>('/billing/members').then((r) => r.data);

export const removeMember = (userId: string) =>
  api.delete(`/billing/members/${userId}`).then((r) => r.data);
