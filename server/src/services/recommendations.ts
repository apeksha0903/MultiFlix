import axios from "axios";
import WatchHistory from "../models/WatchHistory";
import { MediaType } from "./tmdb";

const tmdb = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN || process.env.TMDB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

interface GenreCount {
  genreId: number;
  count: number;
}

// Simple in-memory cache: portfolio-appropriate; Redis would be the production choice.
const genreCache = new Map<string, { genres: number[]; cachedAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

const recommendationCache = new Map<string, { results: any[]; cachedAt: number }>();
const RECOMMENDATION_TTL_MS = 30 * 60 * 1000;

async function getWatchedItems(profileId: string) {
  return WatchHistory.find({ profileId }).sort({ watchedAt: -1 }).limit(50);
}

async function fetchGenres(tmdbId: number, mediaType: MediaType): Promise<number[]> {
  const cacheKey = `${mediaType}:${tmdbId}`;
  const cached = genreCache.get(cacheKey);

  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.genres;
  }

  try {
    const { data } = await tmdb.get(`/${mediaType}/${tmdbId}`);
    const genres = data.genre_ids || data.genres?.map((genre: { id: number }) => genre.id) || [];
    genreCache.set(cacheKey, { genres, cachedAt: Date.now() });
    return genres;
  } catch (err) {
    console.error(`Failed to fetch genres for ${mediaType}:${tmdbId}`, err);
    return [];
  }
}

async function buildGenreProfile(
  watchedItems: Awaited<ReturnType<typeof getWatchedItems>>
): Promise<GenreCount[]> {
  const genreMap = new Map<number, number>();

  const genreArrays = await Promise.all(
    watchedItems.map((item) => fetchGenres(item.tmdbId, item.mediaType))
  );

  genreArrays.flat().forEach((genreId) => {
    genreMap.set(genreId, (genreMap.get(genreId) || 0) + 1);
  });

  return Array.from(genreMap.entries())
    .map(([genreId, count]) => ({ genreId, count }))
    .sort((a, b) => b.count - a.count);
}

async function discoverByGenres(
  genreIds: number[],
  mediaType: MediaType,
  page: number = 1
) {
  const { data } = await tmdb.get(`/discover/${mediaType}`, {
    params: {
      with_genres: genreIds.slice(0, 3).join(","),
      sort_by: "popularity.desc",
      page,
      include_adult: false,
    },
  });
  return data.results || [];
}

function filterWatched(results: any[], watchedIds: Set<number>): any[] {
  return results.filter((item) => !watchedIds.has(item.id));
}

function uniqueTopTwenty(results: any[]): any[] {
  const seen = new Set<number>();
  return results
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, 20);
}

async function getTrendingFallback(mediaType: MediaType, watchedIds = new Set<number>()) {
  const { data } = await tmdb.get(`/trending/${mediaType}/week`);
  return uniqueTopTwenty(filterWatched(data.results || [], watchedIds));
}

export async function getRecommendations(
  profileId: string,
  mediaType: MediaType = "movie"
): Promise<any[]> {
  const cacheKey = `${profileId}:${mediaType}`;
  const cached = recommendationCache.get(cacheKey);

  if (cached && Date.now() - cached.cachedAt < RECOMMENDATION_TTL_MS) {
    console.log(`Cache hit for recommendations: ${cacheKey}`);
    return cached.results;
  }

  const watchedItems = await getWatchedItems(profileId);

  if (watchedItems.length === 0) {
    const fallback = await getTrendingFallback(mediaType);
    recommendationCache.set(cacheKey, { results: fallback, cachedAt: Date.now() });
    return fallback;
  }

  const watchedIds = new Set(watchedItems.map((item) => item.tmdbId));
  const genreProfile = await buildGenreProfile(watchedItems);

  if (genreProfile.length === 0) {
    const fallback = await getTrendingFallback(mediaType, watchedIds);
    recommendationCache.set(cacheKey, { results: fallback, cachedAt: Date.now() });
    return fallback;
  }

  const topGenreIds = genreProfile.map((genre) => genre.genreId);
  const discovered = await discoverByGenres(topGenreIds, mediaType);
  const filtered = filterWatched(discovered, watchedIds);

  if (filtered.length < 10) {
    const trending = await getTrendingFallback(mediaType, watchedIds);
    const padded = uniqueTopTwenty([...filtered, ...trending]);
    recommendationCache.set(cacheKey, { results: padded, cachedAt: Date.now() });
    return padded;
  }

  const results = filtered.slice(0, 20);
  recommendationCache.set(cacheKey, { results, cachedAt: Date.now() });
  return results;
}
