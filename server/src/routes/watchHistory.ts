import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import WatchHistory from "../models/WatchHistory";
import Profile from "../models/Profile";
import { requireAuth } from "../middlewares/auth";

const router = Router();
router.use(requireAuth);

/**
 * Helper: confirms the profileId in the request actually belongs
 * to the authenticated user. This is the SAME isolation pattern as
 * your /profiles routes - never trust a profileId from the client
 * without checking it's owned by req.user.userId.
 */
async function verifyProfileOwnership(profileId: string, userId: string) {
  if (!Types.ObjectId.isValid(profileId)) return null;
  return Profile.findOne({ _id: profileId, userId });
}

/**
 * GET /watch-history/:profileId
 */
router.get("/:profileId", async (req: Request, res: Response) => {
  const profile = await verifyProfileOwnership(req.params.profileId as string, req.user!.userId);
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const history = await WatchHistory.find({ profileId: profile._id })
    .sort({ watchedAt: -1 })
    .limit(50);

  res.json(history);
});

/**
 * POST /watch-history/:profileId
 * Records a watch event. Called when a user starts/finishes watching something.
 */
router.post("/:profileId", async (req: Request, res: Response) => {
  const profile = await verifyProfileOwnership(req.params.profileId as string, req.user!.userId);
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const { tmdbId, mediaType, progressSeconds } = req.body;
  if (!tmdbId || !mediaType) {
    return res.status(400).json({ message: "tmdbId and mediaType are required" });
  }

  const entry = await WatchHistory.create({
    profileId: profile._id,
    tmdbId,
    mediaType,
    progressSeconds: progressSeconds || 0,
  });

  res.status(201).json(entry);
});

export default router;