import { createInitialDemoState } from "./seed";
import {
  clearDemoSession,
  getDemoSessionUserId,
  setDemoSessionUserId,
} from "./session";
import type { DemoState, DemoUser } from "./types";

const STORE_KEY = "demo-store-v1";

let memoryState: DemoState | null = null;

function loadFromStorage(): DemoState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoState;
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
    products: state.products ?? initial.products,
    categories: state.categories ?? initial.categories,
    attributes: state.attributes ?? initial.attributes,
    variants: state.variants ?? initial.variants,
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
