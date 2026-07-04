import { useQuery } from '@tanstack/react-query';
import { getContinueWatching } from '@/api/continueWatching.api';

export function useContinueWatching(profileId: string | undefined) {
  return useQuery({
    queryKey: ['continue-watching', profileId],
    queryFn: () => getContinueWatching(profileId!),
    enabled: !!profileId,
  });
}
