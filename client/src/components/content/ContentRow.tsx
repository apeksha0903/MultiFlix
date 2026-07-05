import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { RowSkeleton } from '@/components/ui/query-state';
import type { TMDbMediaItem, MediaType } from '@/types/tmdb.types';

interface ContentRowProps {
  title: string;
  subtitle?: string;
  items: TMDbMediaItem[];
  isLoading?: boolean;
  mediaType?: MediaType;
  emptyMessage?: string;
  inWatchlist?: (id: number, type: MediaType) => boolean;
  onToggleWatchlist?: (id: number, type: MediaType) => void;
  getProgress?: (id: number, type: MediaType) => number | undefined;
}

export function ContentRow({
  title,
  subtitle,
  items,
  isLoading,
  mediaType,
  emptyMessage,
  inWatchlist,
  onToggleWatchlist,
  getProgress,
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -400 : 400,
      behavior: 'smooth',
    });
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="mb-4 flex items-baseline gap-3 px-4 md:px-8">
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <span className="text-sm text-foreground-secondary">{subtitle}</span>}
        </div>
        <RowSkeleton />
      </section>
    );
  }

  if (!items.length) {
    if (!emptyMessage) return null;
    return (
      <section className="mb-8 px-4 md:px-8">
        <div className="mb-4 flex items-baseline gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <span className="text-sm text-foreground-secondary">{subtitle}</span>}
        </div>
        <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-foreground-secondary">
          {emptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="group/row relative mb-8">
      <div className="mb-4 flex items-baseline gap-3 px-4 md:px-8">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <span className="text-sm text-foreground-secondary">{subtitle}</span>}
      </div>
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 z-10 hidden h-full w-10 -translate-y-1/2 items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-3 overflow-x-auto px-4 md:px-8"
      >
        {items.map((item) => {
          const type = mediaType ?? item.media_type ?? 'movie';
          return (
            <ContentCard
              key={`${type}-${item.id}`}
              item={item}
              mediaType={type}
              inWatchlist={inWatchlist?.(item.id, type)}
              onToggleWatchlist={
                onToggleWatchlist
                  ? () => onToggleWatchlist(item.id, type)
                  : undefined
              }
              progress={getProgress?.(item.id, type)}
            />
          );
        })}
      </div>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 z-10 hidden h-full w-10 -translate-y-1/2 items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
    </section>
  );
}
