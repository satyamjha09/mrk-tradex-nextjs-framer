import { getClientUrl, getVercelUrl } from "./publicUrl";

export function getAllowedOrigins(): string[] {
  const fromEnv = process.env.ALLOWED_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (fromEnv?.length) {
    return fromEnv;
  }

  const localOrigins =
    process.env.NODE_ENV === "production"
      ? []
      : ["http://localhost:3000", "http://localhost:5173"];

  return Array.from(
    new Set([...localOrigins, getClientUrl(), getVercelUrl()].filter(Boolean)),
  ) as string[];
}
