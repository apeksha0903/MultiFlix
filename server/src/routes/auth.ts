import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import passport from "../config/passport";
import User from "../models/User";
import BillingAccount from "../models/BillingAccount";
import { signToken } from "../utils/auth";
import { GOOGLE_OAUTH_NO_PASSWORD } from "../utils/constants";

const router = Router();

/**
 * POST /auth/signup
 * Creates a new BillingAccount AND its owner User in one step.
 * Members join later via invites, not direct signup.
 */
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const billingAccount = await BillingAccount.create({
      plan: "free",
    });

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role: "owner",
      billingAccountId: billingAccount._id,
    });

    billingAccount.ownerUserId = user._id;
    await billingAccount.save();

    const token = signToken({
      userId: user.id.toString(),
      role: user.role,
      billingAccountId: billingAccount.id.toString(),
      email: user.email,
    });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

/**
 * POST /auth/login
 * Works for both owners and members.
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.passwordHash === GOOGLE_OAUTH_NO_PASSWORD) {
      return res.status(401).json({
        message: "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      userId: user.id.toString(),
      role: user.role,
      billingAccountId: user.billingAccountId.toString(),
      email: user.email,
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});

/**
 * GET /auth/google
 * Redirects user to Google's consent screen.
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * GET /auth/google/callback
 * Google redirects here after user approves.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as { token: string } | undefined;

    if (!user?.token) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
    }

    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${user.token}`);
  }
);

export default router;
