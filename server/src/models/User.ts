import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRole } from "../types";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  billingAccountId: Types.ObjectId;
  displayName?: string;
  avatarStyle?: string;
  onboardingComplete: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["owner", "member"], required: true },
  billingAccountId: { type: Schema.Types.ObjectId, ref: "BillingAccount", required: true },
  displayName: { type: String, trim: true },
  avatarStyle: { type: String, default: "avataaars" },
  onboardingComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.index({ billingAccountId: 1 });

export default mongoose.model<IUser>("User", UserSchema);
