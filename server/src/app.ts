import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport";
import authRoutes from "./routes/auth";
import inviteRoutes from "./routes/invite";
import profileRoutes from "./routes/profiles";
import tmdbRoutes from "./routes/tmdb";
import watchHistoryRoutes from "./routes/watchHistory";
import watchlistRoutes from "./routes/watchlist";
import continueWatchingRoutes from "./routes/continueWatching";
import billingRoutes from "./routes/billing";
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/invites", inviteRoutes);
app.use ("/profiles",profileRoutes);
app.use("/tmdb", tmdbRoutes);
app.use("/watch-history", watchHistoryRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/continue-watching", continueWatchingRoutes);
app.use("/billing", billingRoutes);
export default app;