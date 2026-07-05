export type MediaType = 'movie' | 'tv';

export interface TMDbGenre {
  id: number;
  name: string;
}

export interface TMDbMediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  media_type?: MediaType;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

export interface TMDbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TMDbCredits {
  cast: TMDbCastMember[];
}

export interface TMDbMovieDetails extends TMDbMediaItem {
  title: string;
  tagline?: string;
  runtime?: number;
  genres: TMDbGenre[];
  credits?: TMDbCredits;
  similar?: TMDbPaginatedResponse<TMDbMediaItem>;
}

export interface TMDbTVDetails extends TMDbMediaItem {
  name: string;
  tagline?: string;
  number_of_seasons?: number;
  episode_run_time?: number[];
  genres: TMDbGenre[];
  credits?: TMDbCredits;
  similar?: TMDbPaginatedResponse<TMDbMediaItem>;
}

export interface WatchlistItem {
  _id: string;
  profileId: string;
  tmdbId: number;
  mediaType: MediaType;
  addedAt: string;
}

export interface WatchHistoryItem {
  _id: string;
  profileId: string;
  tmdbId: number;
  mediaType: MediaType;
  watchedAt: string;
  progressSeconds: number;
}

export interface ContinueWatchingItem {
  _id: string;
  profileId: string;
  tmdbId: number;
  mediaType: MediaType;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: string;
}
