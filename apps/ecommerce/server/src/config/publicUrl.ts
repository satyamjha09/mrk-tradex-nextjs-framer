type OAuthProvider = "google" | "facebook" | "twitter";

const callbackEnvNames: Record<
  OAuthProvider,
  { dev: string; prod: string }
> = {
  google: {
    dev: "GOOGLE_CALLBACK_URL_DEV",
    prod: "GOOGLE_CALLBACK_URL_PROD",
  },
  facebook: {
    dev: "FACEBOOK_CALLBACK_URL_DEV",
    prod: "FACEBOOK_CALLBACK_URL_PROD",
  },
  twitter: {
    dev: "TWITTER_CALLBACK_URL_DEV",
    prod: "TWITTER_CALLBACK_URL_PROD",
  },
};

const withoutTrailingSlash = (value?: string) =>
  value?.trim().replace(/\/+$/, "");

export function getVercelUrl() {
  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

  if (!vercelUrl) return undefined;

  const normalized = vercelUrl.startsWith("http")
    ? vercelUrl
    : `https://${vercelUrl}`;

  return withoutTrailingSlash(normalized);
}

export function getClientUrl() {
  const devUrl = withoutTrailingSlash(
    process.env.CLIENT_URL_DEV || "http://localhost:3000",
  );
  const prodUrl = withoutTrailingSlash(
    process.env.CLIENT_URL_PROD || getVercelUrl(),
  );

  return process.env.NODE_ENV === "production" ? prodUrl || devUrl : devUrl;
}

export function getApiPublicUrl() {
  const explicitUrl = withoutTrailingSlash(process.env.API_PUBLIC_URL);
  if (explicitUrl) return explicitUrl;

  const clientUrl = getClientUrl();
  return clientUrl ? `${clientUrl}/api/v1` : undefined;
}

export function getOAuthCallbackUrl(provider: OAuthProvider) {
  const envNames = callbackEnvNames[provider];
  const configuredUrl = withoutTrailingSlash(
    process.env.NODE_ENV === "production"
      ? process.env[envNames.prod]
      : process.env[envNames.dev],
  );

  if (configuredUrl) return configuredUrl;

  const apiUrl = getApiPublicUrl();
  return apiUrl ? `${apiUrl}/auth/${provider}/callback` : undefined;
}
