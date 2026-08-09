// @ts-nocheck
import { createInitialDemoState } from "./seed";
import {
  clearDemoSession,
  getDemoSessionUserId,
  setDemoSessionUserId,
} from "./session";
import type { DemoState, DemoUser } from "./types";
import { safeJsonParse } from "@/app/lib/utils/safeJson";

const STORE_KEY = "demo-store-v1";

let memoryState: DemoState | null = null;

type DemoEntity = {
  id?: string;
  slug?: string;
  sku?: string;
};

function matchesEntity(left: DemoEntity, right: DemoEntity): boolean {
  return Boolean(
    (left.id && right.id && left.id === right.id) ||
      (left.slug && right.slug && left.slug === right.slug) ||
      (left.sku && right.sku && left.sku === right.sku),
  );
}

function hasUsefulValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function mergeEntityWithSeed<T extends DemoEntity>(seeded: T, stored: T): T {
  const merged: Record<string, unknown> = { ...seeded };

  Object.entries(stored).forEach(([key, value]) => {
    if (!hasUsefulValue(value)) return;

    const seededValue = merged[key];
    if (
      key === "variants" &&
      Array.isArray(seededValue) &&
      Array.isArray(value)
    ) {
      merged[key] = mergeSeededEntities(seededValue, value);
      return;
    }

    merged[key] = value;
  });

  return merged as T;
}

function mergeSeededEntities<T extends DemoEntity>(
  seeded: T[],
  stored?: T[],
): T[] {
  if (!stored) return seeded;

  const remainingStored = [...stored];
  const mergedSeeded = seeded.map((seededItem) => {
    const storedIndex = remainingStored.findIndex((storedItem) =>
      matchesEntity(seededItem, storedItem),
    );
    if (storedIndex === -1) return seededItem;

    const [storedItem] = remainingStored.splice(storedIndex, 1);
    return mergeEntityWithSeed(seededItem, storedItem);
  });

  return [...mergedSeeded, ...remainingStored];
}

function loadFromStorage(): DemoState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const parsed = safeJsonParse<DemoState>(raw);
    if (!parsed) {
      if (raw !== null) localStorage.removeItem(STORE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(state: DemoState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

function normalizeDemoState(state: DemoState | Partial<DemoState>): DemoState {
  const initial = createInitialDemoState();
  return {
    ...initial,
    ...state,
    users: state.users ?? initial.users,
    carts: state.carts ?? initial.carts,
    orders: state.orders ?? initial.orders,
    products: mergeSeededEntities(initial.products, state.products),
    categories: state.categories ?? initial.categories,
    attributes: state.attributes ?? initial.attributes,
    variants: mergeSeededEntities(initial.variants, state.variants),
    transactions: state.transactions ?? initial.transactions,
    logs: state.logs ?? initial.logs,
    reviews: state.reviews ?? initial.reviews,
    mrkEnquiries: state.mrkEnquiries ?? initial.mrkEnquiries,
    mrkDealerApplications:
      state.mrkDealerApplications ?? initial.mrkDealerApplications,
    mrkContactSubmissions:
      state.mrkContactSubmissions ?? initial.mrkContactSubmissions,
    mrkDealers: state.mrkDealers ?? initial.mrkDealers,
    mrkDownloadAssets: state.mrkDownloadAssets ?? initial.mrkDownloadAssets,
    mrkTestimonials: state.mrkTestimonials ?? initial.mrkTestimonials,
    mrkSiteSetting: state.mrkSiteSetting ?? initial.mrkSiteSetting,
  };
}

export function getDemoState(): DemoState {
  if (!memoryState) {
    memoryState = normalizeDemoState(loadFromStorage() ?? createInitialDemoState());
  }
  return memoryState;
}

export function setDemoState(updater: (state: DemoState) => DemoState): DemoState {
  const next = updater(getDemoState());
  memoryState = next;
  saveToStorage(next);
  return next;
}

export function resetDemoState(): void {
  memoryState = createInitialDemoState();
  saveToStorage(memoryState);
  clearDemoSession();
}

export function getCurrentDemoUser(): DemoUser | null {
  const userId = getDemoSessionUserId();
  if (!userId) return null;
  return getDemoState().users.find((u) => u.id === userId) ?? null;
}

export function getCartOwnerKey(): string {
  return getDemoSessionUserId() ?? "guest";
}

export function loginDemoUser(user: DemoUser): void {
  setDemoSessionUserId(user.id);
}

export function logoutDemoUser(): void {
  clearDemoSession();
}

export function demoId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
