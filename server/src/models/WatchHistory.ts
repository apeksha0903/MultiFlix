import mongoose, { Schema, Document, Types } from "mongoose";
import { MediaType } from "../services/tmdb";

export interface IWatchHistory extends Document {
  profileId: Types.ObjectId;
  tmdbId: number;
  mediaType: MediaType;
  watchedAt: Date;
  progressSeconds: number;
}

const WatchHistorySchema = new Schema<IWatchHistory>({
  profileId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  tmdbId: { type: Number, required: true },
  mediaType: { type: String, enum: ["movie", "tv"], required: true },
  watchedAt: { type: Date, default: Date.now },
  progressSeconds: { type: Number, default: 0 },
});

// Common query: "get this profile's watch history, newest first"
WatchHistorySchema.index({ profileId: 1, watchedAt: -1 });

export default mongoose.model<IWatchHistory>("WatchHistory", WatchHistorySchema);