import axios from "axios";

const tmdb = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export type MediaType = "movie" | "tv";
export type TimeWindow = "day" | "week";

/**
 * Trending movies or TV shows.
 * timeWindow: "day" for today's trends, "week" for this week's.
 */
export async function getTrending(mediaType: MediaType, timeWindow: TimeWindow = "week") {
  const { data } = await tmdb.get(`/trending/${mediaType}/${timeWindow}`);
  return data;
}

/**
 * Search across both movies and TV shows.
 */
export async function searchContent(query: string, page: number = 1) {
  const { data } = await tmdb.get("/search/multi", {
    params: { query, page, include_adult: true },
  });
  return data;
}

/**
 * Full movie details including cast, genres, runtime, tagline.
 * append_to_response fetches credits + similar in one request
 * instead of making 3 separate API calls.
 */
export async function getMovieDetails(id: number) {
  const { data } = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "credits,similar" },
  });
  return data;
}

/**
 * Full TV show details.
 */
export async function getTVDetails(id: number) {
  const { data } = await tmdb.get(`/tv/${id}`, {
    params: { append_to_response: "credits,similar" },
  });
  return data;
}

/**
 * Similar titles for a given movie or TV show.
 */
export async function getSimilar(mediaType: MediaType, id: number, page: number = 1) {
  const { data } = await tmdb.get(`/${mediaType}/${id}/similar`, {
    params: { page },
  });
  return data;
}

/**
 * Utility: build a full image URL from a TMDb poster/backdrop path.
 * sizes: w200, w300, w400, w500, w780, original
 * Use w500 for posters, w780 for backdrops.
 */
export function buildImageUrl(path: string, size: string = "w500"): string {
  if (!path) return "";
  return `${process.env.TMDB_IMAGE_BASE_URL}/${size}${path}`;
}