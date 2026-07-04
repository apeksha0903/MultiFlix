import { useQuery } from '@tanstack/react-query';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ContentCard } from '@/components/content/ContentCard';
import { GridSkeleton, QueryState } from '@/components/ui/query-state';
import { useProfile } from '@/hooks/useProfile';
import { useWatchlist } from '@/hooks/useWatchlist';
import { enrichMediaItems } from '@/utils/enrichMedia';
import type { MediaType } from '@/types/tmdb.types';

export default function Watchlist() {
  const { activeProfile } = useProfile();
  const watchlist = useWatchlist(activeProfile?._id);

  const enriched = useQuery({
    queryKey: ['watchlist-page', activeProfile?._id, watchlist.data?.length],
    queryFn: () => enrichMediaItems(watchlist.data ?? []),
    enabled: !!activeProfile && !!watchlist.data?.length,
  });

  const handleToggle = (tmdbId: number, mediaType: MediaType) => {
    watchlist.removeMutation.mutate({ tmdbId, mediaType });
  };

  return (
    <PageWrapper>
      <div className="p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold">My Watchlist</h1>
        <QueryState
          isLoading={watchlist.isLoading || enriched.isLoading}
          isError={watchlist.isError || enriched.isError}
          error={watchlist.error ?? enriched.error}
          onRetry={() => {
            watchlist.refetch();
            enriched.refetch();
          }}
          isEmpty={!watchlist.data?.length}
          emptyMessage="Your watchlist is empty. Browse and save titles you want to watch."
          skeleton={<GridSkeleton />}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {enriched.data?.map((item) => {
              const type = item.title ? 'movie' : 'tv';
              return (
                <ContentCard
                  key={`${type}-${item.id}`}
                  item={item}
                  mediaType={type as MediaType}
                  inWatchlist
                  onToggleWatchlist={() => handleToggle(item.id, type as MediaType)}
                />
              );
            })}
          </div>
        </QueryState>
      </div>
    </PageWrapper>
  );
}
