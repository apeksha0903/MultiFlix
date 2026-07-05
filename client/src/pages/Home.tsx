import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { HeroBanner } from '@/components/content/HeroBanner';
import { ContentRow } from '@/components/content/ContentRow';
import { PageSkeleton } from '@/components/ui/query-state';
import { useTrending } from '@/hooks/useTrending';
import { useProfile } from '@/hooks/useProfile';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import { useRecommendations } from '@/hooks/useRecommendations';
import { enrichMediaItems } from '@/utils/enrichMedia';
import type { MediaType } from '@/types/tmdb.types';

export default function Home() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?._id;

  const trendingMovies = useTrending('movie');
  const trendingTV = useTrending('tv');
  const { data: continueData, isLoading: continueLoading } = useContinueWatching(profileId);
  const { data: recommendations, isLoading: recsLoading } = useRecommendations(profileId, 'movie');
  const watchlist = useWatchlist(profileId);

  const watchlistEnriched = useQuery({
    queryKey: ['watchlist-enriched', profileId, watchlist.data?.length],
    queryFn: () => enrichMediaItems(watchlist.data ?? []),
    enabled: !!profileId && !!watchlist.data?.length,
  });

  const continueEnriched = useQuery({
    queryKey: ['continue-enriched', profileId, continueData?.length],
    queryFn: () => enrichMediaItems(continueData ?? []),
    enabled: !!profileId && !!continueData?.length,
  });

  const heroItem = trendingMovies.data?.results[0];

  const handleToggleWatchlist = (tmdbId: number, mediaType: MediaType) => {
    if (watchlist.isInWatchlist(tmdbId, mediaType)) {
      watchlist.removeMutation.mutate({ tmdbId, mediaType });
    } else {
      watchlist.addMutation.mutate({ tmdbId, mediaType });
    }
  };

  const getProgress = useMemo(() => {
    const map = new Map<string, number>();
    continueData?.forEach((item) => {
      map.set(`${item.mediaType}-${item.tmdbId}`, item.progressSeconds / item.durationSeconds);
    });
    return (id: number, type: MediaType) => map.get(`${type}-${id}`);
  }, [continueData]);

  if (trendingMovies.isLoading) {
    return (
      <PageWrapper>
        <PageSkeleton />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {heroItem && (
        <HeroBanner
          item={heroItem}
          inWatchlist={watchlist.isInWatchlist(heroItem.id, 'movie')}
          onToggleWatchlist={() => handleToggleWatchlist(heroItem.id, 'movie')}
        />
      )}
      <div className="py-8">
        <ContentRow
          title="Trending Movies"
          items={trendingMovies.data?.results ?? []}
          isLoading={trendingMovies.isLoading}
          mediaType="movie"
          inWatchlist={watchlist.isInWatchlist}
          onToggleWatchlist={handleToggleWatchlist}
        />
        {activeProfile && (
          <ContentRow
            title="Recommended for you"
            subtitle={
              recommendations && recommendations.length > 0
                ? 'Based on your watch history'
                : 'Popular right now'
            }
            items={recommendations ?? []}
            isLoading={recsLoading}
            mediaType="movie"
            emptyMessage="Start watching something to get personalized recommendations"
            inWatchlist={watchlist.isInWatchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}
        <ContentRow
          title="Trending TV Shows"
          items={trendingTV.data?.results ?? []}
          isLoading={trendingTV.isLoading}
          mediaType="tv"
          inWatchlist={watchlist.isInWatchlist}
          onToggleWatchlist={handleToggleWatchlist}
        />
        <ContentRow
          title="Continue Watching"
          items={continueEnriched.data ?? []}
          isLoading={continueLoading || continueEnriched.isLoading}
          inWatchlist={watchlist.isInWatchlist}
          onToggleWatchlist={handleToggleWatchlist}
          getProgress={getProgress}
        />
        <ContentRow
          title="My Watchlist"
          items={watchlistEnriched.data ?? []}
          isLoading={watchlist.isLoading || watchlistEnriched.isLoading}
          inWatchlist={watchlist.isInWatchlist}
          onToggleWatchlist={handleToggleWatchlist}
        />
      </div>
    </PageWrapper>
  );
}
