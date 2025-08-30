// src/utils/authSession.ts
export const SESSION_KEY = "auth_session";

export function isAuthed(): boolean {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    return !!s?.userId;
  } catch {
    return false;
  }
}

type PendingAddLine = {
  id: string;
  name: string;
  image: string;
  unitPriceIndividual: number;
  unitPriceBulk: number;
  qty: number;
  mode: "individual" | "bulk";
};

type PendingAddPayload = {
  line: PendingAddLine;
  returnTo: string; // path to return after login (e.g., current page)
  source: "products-page" | "home-products-grid";
};

const PENDING_KEY = "pendingAdd";

export function stashPendingAdd(payload: PendingAddPayload) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
}

export function takePendingAdd(): PendingAddPayload | null {
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PendingAddPayload;
    sessionStorage.removeItem(PENDING_KEY);
    return parsed;
  } catch {
    sessionStorage.removeItem(PENDING_KEY);
    return null;
  }
}

export function peekPendingAdd(): PendingAddPayload | null {
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingAddPayload;
  } catch {
    return null;
  }
}
