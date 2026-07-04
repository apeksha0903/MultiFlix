import { useQuery } from '@tanstack/react-query';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ContentCard } from '@/components/content/ContentCard';
import { GridSkeleton, QueryState } from '@/components/ui/query-state';
import { getWatchHistory } from '@/api/watchHistory.api';
import { useProfile } from '@/hooks/useProfile';
import { enrichMediaItems } from '@/utils/enrichMedia';
import type { MediaType } from '@/types/tmdb.types';

export default function WatchHistory() {
  const { activeProfile } = useProfile();

  const history = useQuery({
    queryKey: ['watch-history', activeProfile?._id],
    queryFn: () => getWatchHistory(activeProfile!._id),
    enabled: !!activeProfile,
  });

  const enriched = useQuery({
    queryKey: ['history-enriched', activeProfile?._id, history.data?.length],
    queryFn: () => enrichMediaItems(history.data ?? []),
    enabled: !!history.data?.length,
  });

  return (
    <PageWrapper>
      <div className="p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold">Watch History</h1>
        <QueryState
          isLoading={history.isLoading || enriched.isLoading}
          isError={history.isError}
          error={history.error}
          onRetry={() => history.refetch()}
          isEmpty={!history.data?.length}
          emptyMessage="No watch history yet. Start watching something!"
          skeleton={<GridSkeleton />}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {enriched.data?.map((item) => {
              const type: MediaType = item.title ? 'movie' : 'tv';
              return (
                <ContentCard key={`${type}-${item.id}`} item={item} mediaType={type} />
              );
            })}
          </div>
        </QueryState>
      </div>
    </PageWrapper>
  );
}
