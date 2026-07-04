import mongoose, { Schema, Document, Types } from "mongoose";
import { MediaType } from "../services/tmdb";

export interface IWatchlist extends Document {
  profileId: Types.ObjectId;
  tmdbId: number;
  mediaType: MediaType;
  addedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlist>({
  profileId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  tmdbId: { type: Number, required: true },
  mediaType: { type: String, enum: ["movie", "tv"], required: true },
  addedAt: { type: Date, default: Date.now },
});

// Prevent the same title being added twice to one profile's watchlist
WatchlistSchema.index({ profileId: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

export default mongoose.model<IWatchlist>("Watchlist", WatchlistSchema);