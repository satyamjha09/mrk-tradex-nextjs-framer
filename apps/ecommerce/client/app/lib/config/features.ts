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

const readPublicBoolean = (
  value: string | undefined,
  fallback: boolean
): boolean => {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

export const mrkFeatures: MrkFeatureFlags = {
  commerceEnabled: readPublicBoolean(
    process.env.NEXT_PUBLIC_FEATURE_COMMERCE,
    false
  ),
  customerAuthEnabled: readPublicBoolean(
    process.env.NEXT_PUBLIC_FEATURE_CUSTOMER_AUTH,
    false
  ),
  reviewsEnabled: readPublicBoolean(
    process.env.NEXT_PUBLIC_FEATURE_REVIEWS,
    false
  ),
  liveChatEnabled: readPublicBoolean(
    process.env.NEXT_PUBLIC_FEATURE_LIVE_CHAT,
    false
  ),
  enquiryEnabled: readPublicBoolean(
    process.env.NEXT_PUBLIC_FEATURE_ENQUIRY,
    true
  ),
  dealerLocatorEnabled: readPublicBoolean(
    process.env.NEXT_PUBLIC_FEATURE_DEALER_LOCATOR,
    true
  ),
  downloadsEnabled: readPublicBoolean(
    process.env.NEXT_PUBLIC_FEATURE_DOWNLOADS,
    true
  ),
  hindiEnabled: readPublicBoolean(
    process.env.NEXT_PUBLIC_FEATURE_HINDI,
    false
  ),
};
