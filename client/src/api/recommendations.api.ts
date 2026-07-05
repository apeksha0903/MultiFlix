import api from './axiosInstance';
import type { MediaType, TMDbMediaItem } from '@/types/tmdb.types';

interface RecommendationResponse {
  profileId: string;
  mediaType: MediaType;
  results: TMDbMediaItem[];
}

export const getRecommendations = (profileId: string, type: MediaType = 'movie') =>
  api.get<RecommendationResponse>(`/recommendations/${profileId}`, { params: { type } }).then((r) => r.data);
