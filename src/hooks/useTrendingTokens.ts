"use client";

import { useEffect, useState } from "react";
import type { BirdEyeToken } from "@/lib/birdeye";

let cached: BirdEyeToken[] | null = null;
let cachedAt = 0;
let inflight: Promise<{ tokens: BirdEyeToken[]; error?: string }> | null = null;
const TTL = 45_000;

async function fetchTrending(): Promise<{ tokens: BirdEyeToken[]; error?: string }> {
  if (cached && Date.now() - cachedAt < TTL) return { tokens: cached };

  if (!inflight) {
    inflight = fetch("/api/tokens/trending")
      .then((r) => r.json())
      .then((body: { tokens?: BirdEyeToken[]; error?: string }) => {
        const tokens = body.tokens ?? [];
        if (tokens.length) {
          cached = tokens;
          cachedAt = Date.now();
        }
        return { tokens, error: body.error };
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
}

export function useTrendingTokens(initial?: BirdEyeToken[]) {
  const [tokens, setTokens] = useState<BirdEyeToken[]>(initial ?? cached ?? []);
  const [loading, setLoading] = useState(!initial?.length && !cached?.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial?.length && !cached) {
      cached = initial;
      cachedAt = Date.now();
      setTokens(initial);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(!cached?.length);
    fetchTrending()
      .then(({ tokens: list, error: err }) => {
        if (cancelled) return;
        setTokens(list);
        if (!list.length && err) setError(err);
      })
      .catch(() => {
        if (!cancelled) setError("unavailable");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initial]);

  return { tokens, loading, error };
}
