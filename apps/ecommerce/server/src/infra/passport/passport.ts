import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Profile } from "passport";
import prisma from "@/infra/database/database.config";
import logger from "@/infra/winston/logger";
import { getOAuthCallbackUrl } from "@/config/publicUrl";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/shared/utils/auth/tokenUtils";

export default function configurePassport() {
  configureGoogleStrategy();
  configureFacebookStrategy();
  configureTwitterStrategy();
}

function configureGoogleStrategy() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = getOAuthCallbackUrl("google");

  if (!clientID || !clientSecret || !callbackURL) {
    logger.warn("Google OAuth disabled because its environment variables are missing.");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: any
      ) => {
        try {
          let user = await prisma.user.findUnique({
            where: { email: profile.emails![0].value },
          });

          if (user) {
            if (!user.googleId) {
              user = await prisma.user.update({
                where: { email: profile.emails![0].value },
                data: {
                  googleId: profile.id,
                  avatar: profile.photos![0]?.value || "",
                },
              });
            }
          } else {
            user = await prisma.user.create({
              data: {
                email: profile.emails![0].value,
                name: profile.displayName,
                googleId: profile.id,
                avatar: profile.photos![0]?.value || "",
              },
            });
          }

          const id = user.id;
          const newAccessToken = generateAccessToken(id);
          const newRefreshToken = generateRefreshToken(id);

          return done(null, {
            ...user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          console.error("Google Strategy error:", error);
          return done(error);
        }
      }
    )
  );
}

function configureFacebookStrategy() {
  const clientID = process.env.FACEBOOK_APP_ID;
  const clientSecret = process.env.FACEBOOK_APP_SECRET;
  const callbackURL = getOAuthCallbackUrl("facebook");

  if (!clientID || !clientSecret || !callbackURL) {
    logger.warn("Facebook OAuth disabled because its environment variables are missing.");
    return;
  }

  passport.use(
    new FacebookStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        profileFields: ["id", "emails", "name"],
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) => {
        console.log("facebook profile: ", profile);
        try {
          let user = await prisma.user.findUnique({
            where: { email: profile.emails?.[0]?.value || "" },
          });

          if (user) {
            if (!user.facebookId) {
              user = await prisma.user.update({
                where: { email: profile.emails?.[0]?.value || "" },
                data: {
                  facebookId: profile.id,
                  avatar: profile.photos?.[0]?.value || "",
                },
              });
            }
          } else {
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0]?.value || "",
                name: `${profile.name?.givenName} ${profile.name?.familyName}`,
                facebookId: profile.id,
                avatar: profile.photos?.[0]?.value || "",
              },
            });
          }

          const id = user.id;
          const newAccessToken = generateAccessToken(id);
          const newRefreshToken = generateRefreshToken(id);

          return done(null, {
            ...user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          console.error("Facebook Strategy error:", error);
          return done(error);
        }
      }
    )
  );
}

function configureTwitterStrategy() {
  const consumerKey = process.env.TWITTER_CONSUMER_KEY;
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
  const callbackURL = getOAuthCallbackUrl("twitter");

  if (!consumerKey || !consumerSecret || !callbackURL) {
    logger.warn("Twitter OAuth disabled because its environment variables are missing.");
    return;
  }

  passport.use(
    new TwitterStrategy(
      {
        consumerKey,
        consumerSecret,
        callbackURL,
        includeEmail: true,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: any
      ) => {
        console.log("Twitter accessToken:", accessToken);
        console.log("Twitter refreshToken:", refreshToken);
        console.log("Twitter profile:", JSON.stringify(profile, null, 2));
        try {
          if (!profile || !profile.id) {
            console.error("Twitter profile is missing or invalid:", profile);
            return done(new Error("Failed to fetch valid Twitter profile"));
          }

          const email =
            profile.emails?.[0]?.value ||
            `twitter-${profile.id}@placeholder.com`;
          const name =
            profile.displayName ||
            profile.username ||
            `Twitter User ${profile.id}`;
          const avatar = profile.photos?.[0]?.value || "";

          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            if (!user.twitterId) {
              user = await prisma.user.update({
                where: { email },
                data: {
                  twitterId: profile.id,
                  avatar,
                },
              });
            }
          } else {
            user = await prisma.user.create({
              data: {
                email,
                name,
                twitterId: profile.id,
                avatar,
              },
            });
          }

          const id = user.id;
          const newAccessToken = generateAccessToken(id);
          const newRefreshToken = generateRefreshToken(id);

          return done(null, {
            ...user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          console.error("Twitter Strategy error:", error);
          return done(error);
        }
      }
    )
  );
}
