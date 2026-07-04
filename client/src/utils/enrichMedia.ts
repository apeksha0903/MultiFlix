import { getMovieDetails, getTVDetails } from '@/api/tmdb.api';
import type { MediaType, TMDbMediaItem } from '@/types/tmdb.types';

export async function enrichMediaItems(
  items: { tmdbId: number; mediaType: MediaType }[],
): Promise<TMDbMediaItem[]> {
  const results = await Promise.allSettled(
    items.map(async (item) => {
      if (item.mediaType === 'movie') {
        return getMovieDetails(item.tmdbId);
      }
      return getTVDetails(item.tmdbId);
    }),
  );

  return results.reduce<TMDbMediaItem[]>((acc, result) => {
    if (result.status === 'fulfilled') {
      acc.push(result.value);
    }
    return acc;
  }, []);
}
