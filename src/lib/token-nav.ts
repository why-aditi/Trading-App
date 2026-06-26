import type { BirdEyeToken } from "@/lib/birdeye";

const PENDING_TOKEN_KEY = "chad:pendingToken";

export function stashTokenForNavigation(token: BirdEyeToken) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PENDING_TOKEN_KEY, JSON.stringify(token));
  } catch {
    // ignore quota / private mode
  }
}

export function readStashedToken(mint: string): BirdEyeToken | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_TOKEN_KEY);
    if (!raw) return null;
    const token = JSON.parse(raw) as BirdEyeToken;
    return token.address === mint ? token : null;
  } catch {
    return null;
  }
}
