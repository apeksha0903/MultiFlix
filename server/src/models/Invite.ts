import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInvite extends Document {
  email: string;
  token: string;
  billingAccountId: Types.ObjectId;
  expiresAt: Date;
  accepted: boolean;
  createdAt: Date;
}

const InviteSchema = new Schema<IInvite>({
  email: { type: String, required: true, lowercase: true, trim: true },
  token: { type: String, required: true, unique: true },
  billingAccountId: { type: Schema.Types.ObjectId, ref: "BillingAccount", required: true },
  expiresAt: { type: Date, required: true },
  accepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IInvite>("Invite", InviteSchema);