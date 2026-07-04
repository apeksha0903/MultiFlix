import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import ContinueWatching from "../models/ContinueWatching";
import WatchHistory from "../models/WatchHistory";
import Profile from "../models/Profile";
import { requireAuth } from "../middlewares/auth";

const router = Router();
router.use(requireAuth);

const COMPLETION_THRESHOLD = 0.9; // 90% watched = considered "finished"

async function verifyProfileOwnership(profileId: string, userId: string) {
  if (!Types.ObjectId.isValid(profileId)) return null;
  return Profile.findOne({ _id: profileId, userId });
}

/**
 * GET /continue-watching/:profileId
 */
router.get("/:profileId", async (req: Request, res: Response) => {
  const profile = await verifyProfileOwnership(req.params.profileId as string, req.user!.userId);
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const items = await ContinueWatching.find({ profileId: profile._id }).sort({ updatedAt: -1 });
  res.json(items);
});

/**
 * PUT /continue-watching/:profileId
 * Upserts progress for a title. If progress crosses the completion
 * threshold, moves it to WatchHistory and removes it from ContinueWatching.
 */
router.put("/:profileId", async (req: Request, res: Response) => {
  const profile = await verifyProfileOwnership(req.params.profileId as string, req.user!.userId);
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const { tmdbId, mediaType, progressSeconds, durationSeconds } = req.body;
  if (!tmdbId || !mediaType || progressSeconds == null || !durationSeconds) {
    return res.status(400).json({ message: "tmdbId, mediaType, progressSeconds, durationSeconds are required" });
  }

  const isFinished = progressSeconds / durationSeconds >= COMPLETION_THRESHOLD;

  if (isFinished) {
    // Move to watch history, remove from continue watching
    await ContinueWatching.deleteOne({ profileId: profile._id, tmdbId, mediaType });
    const historyEntry = await WatchHistory.create({
      profileId: profile._id,
      tmdbId,
      mediaType,
      progressSeconds,
    });
    return res.json({ status: "completed", historyEntry });
  }

  // Still in progress - upsert (update if exists, create if not)
  const entry = await ContinueWatching.findOneAndUpdate(
    { profileId: profile._id, tmdbId, mediaType },
    { progressSeconds, durationSeconds, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  res.json({ status: "in_progress", entry });
});

export default router;