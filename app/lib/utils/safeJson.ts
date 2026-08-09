// @ts-nocheck
export function safeJsonParse<T>(raw: string | null | undefined): T | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
