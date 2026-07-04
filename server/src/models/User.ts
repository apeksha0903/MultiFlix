import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRole } from "../types";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  billingAccountId: Types.ObjectId;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["owner", "member"], required: true },
  billingAccountId: { type: Schema.Types.ObjectId, ref: "BillingAccount", required: true },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.index({ billingAccountId: 1 });

export default mongoose.model<IUser>("User", UserSchema);