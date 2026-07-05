import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { requireAuth } from "../middlewares/auth";
import User from "../models/User";
import { GOOGLE_OAUTH_NO_PASSWORD } from "../utils/constants";

const router = Router();
const allowedStyles = ["avataaars", "bottts", "pixel-art", "lorelei", "thumbs"];

router.use(requireAuth);

function serializeUser(user: any) {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.passwordHash;
  return {
    ...obj,
    id: obj._id?.toString(),
    isGoogleUser: user.passwordHash === GOOGLE_OAUTH_NO_PASSWORD,
  };
}

router.get("/me", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(serializeUser(user));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/me", async (req: Request, res: Response) => {
  try {
    const { displayName, avatarStyle } = req.body;

    if (avatarStyle && !allowedStyles.includes(avatarStyle)) {
      return res.status(400).json({ message: "Invalid avatar style" });
    }

    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      {
        ...(displayName !== undefined && { displayName }),
        ...(avatarStyle && { avatarStyle }),
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(serializeUser(user));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/password", async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await User.findById(req.user!.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.passwordHash === GOOGLE_OAUTH_NO_PASSWORD) {
      return res.status(400).json({ message: "Google sign-in accounts cannot set a password here" });
    }

    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Current password is incorrect" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/complete-onboarding", async (req: Request, res: Response) => {
  try {
    const { displayName, avatarStyle } = req.body;

    await User.findByIdAndUpdate(req.user!.userId, {
      displayName,
      avatarStyle: allowedStyles.includes(avatarStyle) ? avatarStyle : "avataaars",
      onboardingComplete: true,
    });

    res.json({ message: "Onboarding complete" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
