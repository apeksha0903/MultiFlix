import { Router, Request, Response } from "express";
import Profile from "../models/Profile";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/**
 * GET /profiles
 * Returns ONLY profiles belonging to the authenticated user.
 */
router.get("/", requireAuth, async (req: Request, res: Response) => {
  const profiles = await Profile.find({ userId: req.user!.userId });
  res.json(profiles);
});

/**
 * POST /profiles
 * Create a profile under the authenticated user's own account.
 */
router.post("/", requireAuth, async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const profile = await Profile.create({ name, userId: req.user!.userId });
  res.status(201).json(profile);
});

/**
 * DELETE /profiles/:id
 * Only deletes if the profile belongs to the authenticated user.
 * Returns 404 (not 403) if it belongs to someone else - we don't
 * want to confirm/deny existence of other people's resources.
 */
router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  const profile = await Profile.findOne({ _id: req.params.id, userId: req.user!.userId });

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  await profile.deleteOne();
  res.json({ message: "Profile deleted" });
});

export default router;