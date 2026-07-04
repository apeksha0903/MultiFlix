import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Plus, Eye } from 'lucide-react';
import { getTVDetails } from '@/api/tmdb.api';
import { markAsWatched } from '@/api/watchHistory.api';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ContentRow } from '@/components/content/ContentRow';
import { ContentBadge } from '@/components/content/ContentBadge';
import { QueryState, PageSkeleton } from '@/components/ui/query-state';
import { Button } from '@/components/ui/button';
import { buildImageUrl } from '@/utils/imageUrl';
import { formatRuntime, getReleaseYear } from '@/utils/formatters';
import { useProfile } from '@/hooks/useProfile';
import { useWatchlist } from '@/hooks/useWatchlist';
import toast from 'react-hot-toast';

export default function TVDetail() {
  const { id } = useParams<{ id: string }>();
  const tvId = Number(id);
  const { activeProfile } = useProfile();
  const watchlist = useWatchlist(activeProfile?._id);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['tv', tvId],
    queryFn: () => getTVDetails(tvId),
    enabled: !!tvId,
    staleTime: 5 * 60 * 1000,
  });

  const runtime = data?.episode_run_time?.[0];

  const watchedMutation = useMutation({
    mutationFn: () =>
      markAsWatched(activeProfile!._id, tvId, 'tv', (runtime ?? 45) * 60),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watch-history'] });
      toast.success('Marked as watched');
    },
    onError: () => toast.error('Failed to mark as watched'),
  });

  const inList = watchlist.isInWatchlist(tvId, 'tv');

  return (
    <PageWrapper>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        skeleton={<PageSkeleton />}
      >
        {data && (
          <>
            <section className="relative h-[50vh] min-h-[300px]">
              <img
                src={buildImageUrl(data.backdrop_path, 'w780')}
                alt={data.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            </section>

            <div className="relative -mt-32 px-4 pb-24 md:px-8">
              <h1 className="mb-2 text-3xl font-bold md:text-5xl">{data.name}</h1>
              {data.tagline && (
                <p className="mb-4 text-foreground-secondary italic">{data.tagline}</p>
              )}
              <div className="mb-4 flex flex-wrap gap-2">
                {data.genres?.map((g) => (
                  <ContentBadge key={g.id}>{g.name}</ContentBadge>
                ))}
              </div>
              <div className="mb-6 flex flex-wrap gap-4 text-sm text-foreground-secondary">
                {runtime && <span>{formatRuntime(runtime)}/ep</span>}
                {data.number_of_seasons && <span>{data.number_of_seasons} seasons</span>}
                <span>{getReleaseYear(data)}</span>
                <span>★ {data.vote_average.toFixed(1)}</span>
              </div>
              <p className="mb-8 max-w-3xl text-foreground-secondary">{data.overview}</p>

              {data.credits?.cast && (
                <section className="mb-8">
                  <h2 className="mb-4 text-lg font-semibold">Cast</h2>
                  <div className="scrollbar-hide flex gap-4 overflow-x-auto">
                    {data.credits.cast.slice(0, 12).map((person) => (
                      <div key={person.id} className="w-20 shrink-0 text-center">
                        <img
                          src={buildImageUrl(person.profile_path, 'w185')}
                          alt={person.name}
                          className="mx-auto mb-2 h-16 w-16 rounded-full object-cover bg-background-tertiary"
                        />
                        <p className="truncate text-xs font-medium">{person.name}</p>
                        <p className="truncate text-[10px] text-foreground-muted">{person.character}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.similar?.results && (
                <ContentRow
                  title="Similar titles"
                  items={data.similar.results}
                  mediaType="tv"
                  inWatchlist={watchlist.isInWatchlist}
                  onToggleWatchlist={(tmdbId, type) => {
                    if (watchlist.isInWatchlist(tmdbId, type)) {
                      watchlist.removeMutation.mutate({ tmdbId, mediaType: type });
                    } else {
                      watchlist.addMutation.mutate({ tmdbId, mediaType: type });
                    }
                  }}
                />
              )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:left-56">
              <div className="mx-auto flex max-w-4xl gap-3">
                <Button
                  onClick={() =>
                    inList
                      ? watchlist.removeMutation.mutate({ tmdbId: tvId, mediaType: 'tv' })
                      : watchlist.addMutation.mutate({ tmdbId: tvId, mediaType: 'tv' })
                  }
                  className="gap-2"
                >
                  {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {inList ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => watchedMutation.mutate()}
                  disabled={watchedMutation.isPending}
                >
                  <Eye className="h-4 w-4" /> Mark as Watched
                </Button>
              </div>
            </div>
          </>
        )}
      </QueryState>
    </PageWrapper>
  );
}
