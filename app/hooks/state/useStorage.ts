// @ts-nocheck
import { useState, useEffect } from "react";
import { safeJsonParse } from "@/app/lib/utils/safeJson";

type StorageType = "local" | "session";

function useStorage<T>(
  key: string,
  initialValue: T,
  storageType: StorageType = "local"
) {
  const isClient = typeof window !== "undefined";
  const storage = isClient
    ? storageType === "local"
      ? window.localStorage
      : window.sessionStorage
    : null;

  const getStoredValue = (): T => {
    if (!isClient || !storage) return initialValue;
    try {
      const item = storage.getItem(key);
      const parsed = safeJsonParse<T>(item);
      if (parsed === null) {
        if (item !== null) storage.removeItem(key);
        return initialValue;
      }
      return parsed;
    } catch (error) {
      console.warn(`Error reading storage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  useEffect(() => {
    if (!isClient || !storage) return;
    try {
      storage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting storage key "${key}":`, error);
    }
  }, [key, storedValue, storage, isClient]);

  return [storedValue, setStoredValue] as const;
}

export default useStorage;
