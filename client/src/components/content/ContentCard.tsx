import { useNavigate } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { buildImageUrl } from '@/utils/imageUrl';
import { getMediaTitle } from '@/utils/formatters';
import type { TMDbMediaItem, MediaType } from '@/types/tmdb.types';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  item: TMDbMediaItem;
  mediaType?: MediaType;
  inWatchlist?: boolean;
  onToggleWatchlist?: (e: React.MouseEvent) => void;
  progress?: number;
}

export function ContentCard({
  item,
  mediaType,
  inWatchlist,
  onToggleWatchlist,
  progress,
}: ContentCardProps) {
  const navigate = useNavigate();
  const type = mediaType ?? item.media_type ?? 'movie';
  const title = getMediaTitle(item);

  const handleClick = () => {
    navigate(`/${type}/${item.id}`);
  };

  return (
    <div
      className="group relative w-[120px] shrink-0 cursor-pointer sm:w-[140px] md:w-[160px]"
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-background-tertiary transition-transform duration-300 group-hover:scale-105 group-hover:z-10">
        <img
          src={buildImageUrl(item.poster_path, 'w342')}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-background-tertiary">
            <div
              className="h-full bg-brand"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
        )}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <p className="truncate px-2 pb-2 text-xs font-medium text-white">{title}</p>
        </div>
        {onToggleWatchlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(e);
            }}
            className={cn(
              'absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full opacity-0 transition-all group-hover:opacity-100',
              inWatchlist ? 'bg-brand text-white' : 'bg-black/60 text-white hover:bg-brand',
            )}
          >
            {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        )}
        {inWatchlist && (
          <div className="absolute left-2 top-2 rounded bg-brand/90 px-1.5 py-0.5 text-[10px] font-medium text-white">
            Saved
          </div>
        )}
      </div>
    </div>
  );
}
