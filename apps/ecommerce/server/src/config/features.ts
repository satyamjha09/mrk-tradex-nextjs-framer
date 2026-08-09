export type MrkFeatureFlags = {
  commerceEnabled: boolean;
  customerAuthEnabled: boolean;
  reviewsEnabled: boolean;
  liveChatEnabled: boolean;
  enquiryEnabled: boolean;
  dealerLocatorEnabled: boolean;
  downloadsEnabled: boolean;
  hindiEnabled: boolean;
};

const readBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

export const mrkFeatures: MrkFeatureFlags = {
  commerceEnabled: readBoolean(process.env.FEATURE_COMMERCE, false),
  customerAuthEnabled: readBoolean(process.env.FEATURE_CUSTOMER_AUTH, false),
  reviewsEnabled: readBoolean(process.env.FEATURE_REVIEWS, false),
  liveChatEnabled: readBoolean(process.env.FEATURE_LIVE_CHAT, false),
  enquiryEnabled: readBoolean(process.env.FEATURE_ENQUIRY, true),
  dealerLocatorEnabled: readBoolean(process.env.FEATURE_DEALER_LOCATOR, true),
  downloadsEnabled: readBoolean(process.env.FEATURE_DOWNLOADS, true),
  hindiEnabled: readBoolean(process.env.FEATURE_HINDI, false),
};

export type MrkFeatureName = keyof MrkFeatureFlags;
