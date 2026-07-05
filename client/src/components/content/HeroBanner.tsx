import { useNavigate } from 'react-router-dom';
import { Info, Plus, Check } from 'lucide-react';
import { buildImageUrl } from '@/utils/imageUrl';
import { getMediaTitle } from '@/utils/formatters';
import type { TMDbMediaItem } from '@/types/tmdb.types';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  item: TMDbMediaItem;
  inWatchlist?: boolean;
  onToggleWatchlist?: () => void;
}

export function HeroBanner({ item, inWatchlist, onToggleWatchlist }: HeroBannerProps) {
  const navigate = useNavigate();
  const title = getMediaTitle(item);
  const mediaType = item.media_type ?? 'movie';

  return (
    <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden md:h-[70vh]">
      <img
        src={buildImageUrl(item.backdrop_path, 'w780')}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="relative flex h-full max-w-2xl flex-col justify-end px-4 pb-16 md:px-8 md:pb-24">
        <h1 className="mb-3 text-3xl font-bold md:text-5xl">{title}</h1>
        <p className="mb-6 line-clamp-3 text-sm text-foreground-secondary md:text-base">
          {item.overview}
        </p>
        <div className="flex gap-3">
          <Button onClick={onToggleWatchlist} className="gap-2">
            {inWatchlist ? (
              <>
                <Check className="h-4 w-4" /> In Watchlist
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add to Watchlist
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => navigate(`/${mediaType}/${item.id}`)}
          >
            <Info className="h-4 w-4" /> More Info
          </Button>
        </div>
      </div>
    </section>
  );
}
