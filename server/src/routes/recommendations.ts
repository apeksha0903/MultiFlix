import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { requireAuth } from "../middlewares/auth";
import Profile from "../models/Profile";
import { getRecommendations } from "../services/recommendations";
import { MediaType } from "../services/tmdb";

const router = Router();
router.use(requireAuth);

router.get("/:profileId", async (req: Request, res: Response) => {
  try {
    const profileId = String(req.params.profileId);
    const mediaType = (req.query.type as MediaType) || "movie";

    if (!Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }

    const profile = await Profile.findOne({
      _id: profileId,
      userId: req.user!.userId,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (!["movie", "tv"].includes(mediaType)) {
      return res.status(400).json({ message: "type must be 'movie' or 'tv'" });
    }

    const recommendations = await getRecommendations(profileId, mediaType);

    res.json({
      profileId,
      mediaType,
      results: recommendations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate recommendations" });
  }
});

export default router;
