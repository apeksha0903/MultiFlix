import { useQuery } from '@tanstack/react-query';
import { searchContent } from '@/api/tmdb.api';

export function useSearch(query: string, page = 1) {
  return useQuery({
    queryKey: ['search', query, page],
    queryFn: () => searchContent(query, page),
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
