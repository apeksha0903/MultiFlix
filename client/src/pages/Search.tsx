import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ContentCard } from '@/components/content/ContentCard';
import { GridSkeleton, QueryState } from '@/components/ui/query-state';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/useSearch';
import { useProfile } from '@/hooks/useProfile';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { MediaType, TMDbMediaItem } from '@/types/tmdb.types';

function getMediaType(item: TMDbMediaItem): MediaType | null {
  if (item.media_type === 'movie' || item.media_type === 'tv') return item.media_type;
  if (item.title) return 'movie';
  if (item.name) return 'tv';
  return null;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const { activeProfile } = useProfile();
  const { data, isLoading, isError, error, refetch } = useSearch(debounced);
  const watchlist = useWatchlist(activeProfile?._id);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebounced(query.trim());
  };

  const results = (data?.results ?? []).filter((item) => getMediaType(item));

  const handleToggle = (tmdbId: number, mediaType: MediaType) => {
    if (watchlist.isInWatchlist(tmdbId, mediaType)) {
      watchlist.removeMutation.mutate({ tmdbId, mediaType });
    } else {
      watchlist.addMutation.mutate({ tmdbId, mediaType });
    }
  };

  return (
    <PageWrapper>
      <div className="p-4 md:p-8">
        <form onSubmit={handleSearch} className="relative mb-8 max-w-xl">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies and TV shows..."
            className="pl-10"
          />
        </form>

        {!debounced ? (
          <p className="text-foreground-secondary">Search for your next favorite title.</p>
        ) : (
          <QueryState
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => refetch()}
            isEmpty={!results.length}
            emptyMessage={`No results for "${debounced}"`}
            skeleton={<GridSkeleton />}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results.map((item) => {
                const type = getMediaType(item)!;
                return (
                  <ContentCard
                    key={`${type}-${item.id}`}
                    item={item}
                    mediaType={type}
                    inWatchlist={watchlist.isInWatchlist(item.id, type)}
                    onToggleWatchlist={() => handleToggle(item.id, type)}
                  />
                );
              })}
            </div>
          </QueryState>
        )}
      </div>
    </PageWrapper>
  );
}
