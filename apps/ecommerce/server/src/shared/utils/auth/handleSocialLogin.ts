import passport from "passport";
import { RequestHandler } from "express";

const handleSocialLogin = (provider: string): RequestHandler => {
  const scopes =
    provider === "google"
      ? ["email", "profile"]
      : provider === "facebook"
      ? ["email", "public_profile"]
      : [];

  return (req, res, next) => {
    const strategy = (passport as any)._strategy(provider);
    if (!strategy) {
      return res.status(503).json({
        status: "error",
        message: `${provider} login is not configured on this deployment.`,
      });
    }

    return passport.authenticate(provider, {
      session: false,
      scope: scopes,
    })(req, res, next);
  };
};

export default handleSocialLogin;
