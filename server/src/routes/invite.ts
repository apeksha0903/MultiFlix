import { Router, Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Invite from "../models/Invite";
import User from "../models/User";
import { requireAuth, requireRole } from "../middlewares/auth";
import { signToken } from "../utils/auth";
import { sendInviteEmail } from "../utils/mailer";

const router = Router();

const INVITE_EXPIRY_DAYS = 7;

/**
 * POST /invites
 * Owner-only. Creates an invite for a new member.
 */
router.post("/", requireAuth, requireRole("owner"), async (req: Request, res: Response) => {
  try {
    const memberCount = await User.countDocuments({
      billingAccountId: req.user!.billingAccountId,
      role: "member",
    });
    if (memberCount >= 1) {
      return res.status(403).json({
        message: "Member limit reached. Your plan allows 1 member in addition to yourself.",
        limitReached: true,
      });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const invite = await Invite.create({
      email: email.toLowerCase(),
      token,
      billingAccountId: req.user!.billingAccountId,
      expiresAt,
    });

    const owner = await User.findById(req.user!.userId).select("email");
    const ownerEmail = owner?.email || "your host";
    const inviteLink = `${process.env.CLIENT_URL}/accept-invite?token=${token}`;

    sendInviteEmail(invite.email, inviteLink, ownerEmail).catch((err) => {
      console.error("Failed to send invite email:", err);
    });

    res.status(201).json({
      message: "Invite sent",
      ...(process.env.NODE_ENV !== "production" && { inviteLink }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating invite" });
  }
});

/**
 * GET /invites/:token
 * Public. Lets the accept-invite page check validity + show the email.
 */
router.get("/:token", async (req: Request, res: Response) => {
  const invite = await Invite.findOne({ token: req.params.token });

  if (!invite || invite.accepted || invite.expiresAt < new Date()) {
    return res.status(404).json({ message: "Invite is invalid or expired" });
  }

  res.json({ email: invite.email });
});

/**
 * POST /invites/:token/accept
 * Public. Creates a new independent User account under the SAME
 * billingAccountId as the inviting owner.
 */
router.post("/:token/accept", async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const invite = await Invite.findOne({ token: req.params.token });
    if (!invite || invite.accepted || invite.expiresAt < new Date()) {
      return res.status(404).json({ message: "Invite is invalid or expired" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: invite.email,
      passwordHash,
      role: "member",
      billingAccountId: invite.billingAccountId,
    });

    invite.accepted = true;
    await invite.save();

    const jwtToken = signToken({
      userId: user.id.toString(),
      role: user.role,
      billingAccountId: user.billingAccountId.toString(),
      email: user.email,
    });

    res.status(201).json({
      token: jwtToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error accepting invite" });
  }
});

export default router;
