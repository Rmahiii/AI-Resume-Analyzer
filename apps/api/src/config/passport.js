import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env.js";
import { User } from "../models/User.js";

const adminEmails = new Set(env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase()));
const hasGoogleOAuthConfig = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    done(null, await User.findById(id));
  } catch (error) {
    done(error);
  }
});

if (hasGoogleOAuthConfig) {
  passport.use(new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.SERVER_URL}/auth/google/callback`
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) return done(null, false, { message: "Google profile did not include an email address." });

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName || email.split("@")[0],
            email,
            googleId: profile.id,
            role: adminEmails.has(email) ? "admin" : "user",
            lastLoginAt: new Date()
          });
        } else {
          user.googleId = user.googleId || profile.id;
          user.lastLoginAt = new Date();
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
}

export { hasGoogleOAuthConfig, passport };
