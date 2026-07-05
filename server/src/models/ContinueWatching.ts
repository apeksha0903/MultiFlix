import mongoose, { Schema, Document, Types } from "mongoose";
import { MediaType } from "../services/tmdb";

export interface IContinueWatching extends Document {
  profileId: Types.ObjectId;
  tmdbId: number;
  mediaType: MediaType;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: Date;
}

const ContinueWatchingSchema = new Schema<IContinueWatching>({
  profileId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  tmdbId: { type: Number, required: true },
  mediaType: { type: String, enum: ["movie", "tv"], required: true },
  progressSeconds: { type: Number, required: true },
  durationSeconds: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

// One "continue watching" entry per title per profile - updates in place
ContinueWatchingSchema.index({ profileId: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

export default mongoose.model<IContinueWatching>("ContinueWatching", ContinueWatchingSchema);