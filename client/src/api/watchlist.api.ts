import api from './axiosInstance';
import type { MediaType, WatchlistItem } from '@/types/tmdb.types';

export const getWatchlist = (profileId: string) =>
  api.get<WatchlistItem[]>(`/watchlist/${profileId}`).then((r) => r.data);

export const addToWatchlist = (
  profileId: string,
  tmdbId: number,
  mediaType: MediaType,
) =>
  api
    .post<WatchlistItem>(`/watchlist/${profileId}`, { tmdbId, mediaType })
    .then((r) => r.data);

export const removeFromWatchlist = (
  profileId: string,
  tmdbId: number,
  mediaType: MediaType,
) =>
  api
    .delete(`/watchlist/${profileId}/${tmdbId}/${mediaType}`)
    .then((r) => r.data);
