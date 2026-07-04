import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import Watchlist from "../models/Watchlist";
import { MediaType } from "../services/tmdb";
import Profile from "../models/Profile";
import { requireAuth } from "../middlewares/auth";

const router = Router();
router.use(requireAuth);

async function verifyProfileOwnership(profileId: string, userId: string) {
  if (!Types.ObjectId.isValid(profileId)) return null;
  return Profile.findOne({ _id: profileId, userId });
}

/**
 * GET /watchlist/:profileId
 */
router.get("/:profileId", async (req: Request, res: Response) => {
  const profile = await verifyProfileOwnership(req.params.profileId as string, req.user!.userId);
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const items = await Watchlist.find({ profileId: profile._id }).sort({ addedAt: -1 });
  res.json(items);
});

/**
 * POST /watchlist/:profileId
 */
router.post("/:profileId", async (req: Request, res: Response) => {
  const profile = await verifyProfileOwnership(req.params.profileId as string, req.user!.userId);
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const { tmdbId, mediaType } = req.body;
  if (!tmdbId || !mediaType) {
    return res.status(400).json({ message: "tmdbId and mediaType are required" });
  }

  try {
    const item = await Watchlist.create({ profileId: profile._id, tmdbId, mediaType });
    res.status(201).json(item);
  } catch (err: any) {
    // Mongoose throws error code 11000 on unique index violation
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already in watchlist" });
    }
    throw err;
  }
});

/**
 * DELETE /watchlist/:profileId/:tmdbId/:mediaType
 */
router.delete("/:profileId/:tmdbId/:mediaType", async (req: Request, res: Response) => {
  const profile = await verifyProfileOwnership(req.params.profileId as string, req.user!.userId);
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const tmdbId = parseInt(req.params.tmdbId as string);
  const mediaType = req.params.mediaType as MediaType;
  const result = await Watchlist.findOneAndDelete({
    profileId: profile._id,
    tmdbId,
    mediaType,
  });

  if (!result) {
    return res.status(404).json({ message: "Watchlist item not found" });
  }

  res.json({ message: "Removed from watchlist" });
});

export default router;