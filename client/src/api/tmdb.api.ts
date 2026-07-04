import api from './axiosInstance';
import type {
  TMDbMovieDetails,
  TMDbPaginatedResponse,
  TMDbMediaItem,
  TMDbTVDetails,
} from '@/types/tmdb.types';

export const getTrending = (type = 'movie', window = 'week') =>
  api
    .get<TMDbPaginatedResponse<TMDbMediaItem>>(
      `/tmdb/trending?type=${type}&window=${window}`,
    )
    .then((r) => r.data);

export const searchContent = (q: string, page = 1) =>
  api
    .get<TMDbPaginatedResponse<TMDbMediaItem>>(
      `/tmdb/search?q=${encodeURIComponent(q)}&page=${page}`,
    )
    .then((r) => r.data);

export const getMovieDetails = (id: number) =>
  api.get<TMDbMovieDetails>(`/tmdb/movie/${id}`).then((r) => r.data);

export const getTVDetails = (id: number) =>
  api.get<TMDbTVDetails>(`/tmdb/tv/${id}`).then((r) => r.data);

export const getSimilar = (type: 'movie' | 'tv', id: number, page = 1) =>
  api
    .get<TMDbPaginatedResponse<TMDbMediaItem>>(
      `/tmdb/${type}/${id}/similar?page=${page}`,
    )
    .then((r) => r.data);
