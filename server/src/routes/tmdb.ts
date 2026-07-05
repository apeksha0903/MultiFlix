import { Router, Request, Response } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  getTrending,
  searchContent,
  getMovieDetails,
  getTVDetails,
  getSimilar,
  buildImageUrl,
  MediaType,
} from "../services/tmdb";

const router = Router();

// All TMDb routes require a logged-in user —
// content is only accessible to members of a billing account.
router.use(requireAuth);

/**
 * GET /tmdb/trending?type=movie&window=week
 */
router.get("/trending", async (req: Request, res: Response) => {
  try {
    const mediaType = (req.query.type as MediaType) || "movie";
    const timeWindow = (req.query.window as "day" | "week") || "week";
    const data = await getTrending(mediaType, timeWindow);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch trending content" });
  }
});

/**
 * GET /tmdb/search?q=inception&page=1
 */
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }
    const page = parseInt(req.query.page as string) || 1;
    const data = await searchContent(query, page);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to search content" });
  }
});

/**
 * GET /tmdb/movie/:id
 */
router.get("/movie/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const data = await getMovieDetails(id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch movie details" });
  }
});

/**
 * GET /tmdb/tv/:id
 */
router.get("/tv/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const data = await getTVDetails(id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch TV details" });
  }
});

/**
 * GET /tmdb/movie/:id/similar
 * GET /tmdb/tv/:id/similar
 */
router.get("/:type/:id/similar", async (req: Request, res: Response) => {
  try {
    const mediaType = req.params.type as MediaType;
    if (!["movie", "tv"].includes(mediaType)) {
      return res.status(400).json({ message: "Type must be 'movie' or 'tv'" });
    }
    const id = parseInt(req.params.id as string);
    const page = parseInt(req.query.page as string) || 1;
    const data = await getSimilar(mediaType, id, page);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch similar content" });
  }
});

export default router;