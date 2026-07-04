import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import BillingAccount from "../models/BillingAccount";
import { signToken } from "../utils/auth";
import { GOOGLE_OAUTH_NO_PASSWORD } from "../utils/constants";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email returned from Google"), undefined);
        }

        let user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
          const token = signToken({
            userId: user.id.toString(),
            role: user.role,
            billingAccountId: user.billingAccountId.toString(),
            email: user.email,
          });
          return done(null, { token } as Express.User);
        }

        const billingAccount = await BillingAccount.create({
          plan: "free",
          subscriptionStatus: "active",
        });

        user = await User.create({
          email: email.toLowerCase(),
          passwordHash: GOOGLE_OAUTH_NO_PASSWORD,
          role: "owner",
          billingAccountId: billingAccount._id,
        });

        billingAccount.ownerUserId = user._id;
        await billingAccount.save();

        const token = signToken({
          userId: user.id.toString(),
          role: user.role,
          billingAccountId: billingAccount.id.toString(),
          email: user.email,
        });

        return done(null, { token } as Express.User);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => done(null, user));
passport.deserializeUser((obj: Express.User, done) => done(null, obj));

export default passport;
