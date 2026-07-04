import api from './axiosInstance';
import type { MediaType, WatchHistoryItem } from '@/types/tmdb.types';

export const getWatchHistory = (profileId: string) =>
  api.get<WatchHistoryItem[]>(`/watch-history/${profileId}`).then((r) => r.data);

export const markAsWatched = (
  profileId: string,
  tmdbId: number,
  mediaType: MediaType,
  progressSeconds = 0,
) =>
  api
    .post<WatchHistoryItem>(`/watch-history/${profileId}`, {
      tmdbId,
      mediaType,
      progressSeconds,
    })
    .then((r) => r.data);
