import mongoose, { Schema, Document, Types } from "mongoose";

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete";

export interface IBillingAccount extends Document {
  plan: string;
  ownerUserId?: Types.ObjectId;

  // Payment-related fields (for future Stripe/Razorpay integration)
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus: SubscriptionStatus;
  currentPeriodEnd?: Date;

  createdAt: Date;
}

const BillingAccountSchema = new Schema<IBillingAccount>({
  plan: { type: String, default: "free" },
  ownerUserId: { type: Schema.Types.ObjectId, ref: "User"},

  // These stay undefined/null until real payment integration happens
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  subscriptionStatus: {
    type: String,
    enum: ["active", "trialing", "past_due", "canceled", "incomplete"],
    default: "active", // default to "active" since v1 has no real billing yet
  },
  currentPeriodEnd: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBillingAccount>("BillingAccount", BillingAccountSchema);