import api from './axiosInstance';
import type { ContinueWatchingItem, MediaType } from '@/types/tmdb.types';

export const getContinueWatching = (profileId: string) =>
  api
    .get<ContinueWatchingItem[]>(`/continue-watching/${profileId}`)
    .then((r) => r.data);

export const updateContinueWatching = (
  profileId: string,
  data: {
    tmdbId: number;
    mediaType: MediaType;
    progressSeconds: number;
    durationSeconds: number;
  },
) =>
  api.put(`/continue-watching/${profileId}`, data).then((r) => r.data);
