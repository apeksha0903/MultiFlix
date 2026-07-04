import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from '@/api/watchlist.api';
import type { MediaType } from '@/types/tmdb.types';
import toast from 'react-hot-toast';

export function useWatchlist(profileId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['watchlist', profileId],
    queryFn: () => getWatchlist(profileId!),
    enabled: !!profileId,
  });

  const addMutation = useMutation({
    mutationFn: ({
      tmdbId,
      mediaType,
    }: {
      tmdbId: number;
      mediaType: MediaType;
    }) => addToWatchlist(profileId!, tmdbId, mediaType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', profileId] });
      toast.success('Added to watchlist');
    },
    onError: () => toast.error('Failed to add to watchlist'),
  });

  const removeMutation = useMutation({
    mutationFn: ({
      tmdbId,
      mediaType,
    }: {
      tmdbId: number;
      mediaType: MediaType;
    }) => removeFromWatchlist(profileId!, tmdbId, mediaType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', profileId] });
      toast.success('Removed from watchlist');
    },
    onError: () => toast.error('Failed to remove from watchlist'),
  });

  const isInWatchlist = (tmdbId: number, mediaType: MediaType) =>
    query.data?.some(
      (item) => item.tmdbId === tmdbId && item.mediaType === mediaType,
    ) ?? false;

  return {
    ...query,
    addMutation,
    removeMutation,
    isInWatchlist,
  };
}
