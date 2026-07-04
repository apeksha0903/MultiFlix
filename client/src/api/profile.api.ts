import api from './axiosInstance';
import type { Profile } from '@/types/user.types';

export const getProfiles = () =>
  api.get<Profile[]>('/profiles').then((r) => r.data);

export const createProfile = (name: string) =>
  api.post<Profile>('/profiles', { name }).then((r) => r.data);

export const deleteProfile = (id: string) =>
  api.delete(`/profiles/${id}`).then((r) => r.data);
