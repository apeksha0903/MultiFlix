import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProfile extends Document {
  name: string;
  userId: Types.ObjectId;
  createdAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  name: { type: String, required: true, trim: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

ProfileSchema.index({ userId: 1 });

export default mongoose.model<IProfile>("Profile", ProfileSchema);