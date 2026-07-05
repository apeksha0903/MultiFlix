import { useQuery } from '@tanstack/react-query';
import { getTrending } from '@/api/tmdb.api';

export function useTrending(type: 'movie' | 'tv' = 'movie') {
  return useQuery({
    queryKey: ['trending', type],
    queryFn: () => getTrending(type, 'week'),
    staleTime: 5 * 60 * 1000,
  });
}
