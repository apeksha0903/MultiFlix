import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '@/api/recommendations.api';
import type { MediaType } from '@/types/tmdb.types';

export function useRecommendations(profileId: string | undefined, type: MediaType = 'movie') {
  return useQuery({
    queryKey: ['recommendations', profileId, type],
    queryFn: () => getRecommendations(profileId!, type),
    enabled: !!profileId,
    staleTime: 30 * 60 * 1000,
    select: (data) => data.results,
  });
}
