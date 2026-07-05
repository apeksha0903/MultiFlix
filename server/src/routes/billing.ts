import { Router, Request, Response } from "express";
import BillingAccount from "../models/BillingAccount";
import User from "../models/User";
import Invite from "../models/Invite";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);

/**
 * GET /billing/my-plan
 * Returns the current user's plan summary.
 */
router.get("/my-plan", async (req: Request, res: Response) => {
  try {
    const billingAccount = await BillingAccount.findById(req.user!.billingAccountId);
    if (!billingAccount) {
      return res.status(404).json({ message: "Billing account not found" });
    }

    const owner = await User.findById(billingAccount.ownerUserId).select("email");
    const memberCount = await User.countDocuments({
      billingAccountId: req.user!.billingAccountId,
      role: "member",
    });

    res.json({
      plan: billingAccount.plan,
      subscriptionStatus: billingAccount.subscriptionStatus,
      currentPeriodEnd: billingAccount.currentPeriodEnd,
      ownerEmail: owner?.email,
      memberCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch plan info" });
  }
});

/**
 * GET /billing
 * Returns the owner's billing account details.
 */
router.get("/", requireRole("owner"), async (req: Request, res: Response) => {
  const account = await BillingAccount.findById(req.user!.billingAccountId);
  if (!account) {
    return res.status(404).json({ message: "Billing account not found" });
  }
  res.json(account);
});

/**
 * GET /billing/members
 * Returns all users on the billing account plus pending invites.
 */
router.get("/members", requireRole("owner"), async (req: Request, res: Response) => {
  const users = await User.find({
    billingAccountId: req.user!.billingAccountId,
  }).sort({ createdAt: 1 });

  const pendingInvites = await Invite.find({
    billingAccountId: req.user!.billingAccountId,
    accepted: false,
    expiresAt: { $gt: new Date() },
  });

  const members = users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    status: "active" as const,
    joinedAt: u.createdAt,
  }));

  const pending = pendingInvites.map((inv) => ({
    id: inv.id,
    email: inv.email,
    role: "member" as const,
    status: "pending" as const,
    joinedAt: inv.createdAt,
  }));

  res.json([...members, ...pending]);
});

/**
 * DELETE /billing/members/:userId
 * Removes a member from the billing account (cannot remove owner).
 */
router.delete("/members/:userId", requireRole("owner"), async (req: Request, res: Response) => {
  const member = await User.findOne({
    _id: req.params.userId,
    billingAccountId: req.user!.billingAccountId,
  });

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  if (member.role === "owner") {
    return res.status(403).json({ message: "Cannot remove the account owner" });
  }

  await member.deleteOne();
  res.json({ message: "Member removed" });
});

export default router;
