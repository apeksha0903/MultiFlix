export const buildImageUrl = (path: string | null, size = 'w500'): string => {
  if (!path) return '/placeholder-poster.svg';
  return `${import.meta.env.VITE_TMDB_IMAGE_BASE}/${size}${path}`;
};
