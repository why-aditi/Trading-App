"use client";

import { useState, useEffect } from "react";
import type { TradeItem } from "@/app/api/tokens/[mint]/trades/route";

export function useTokenTrades(mint: string) {
  const [trades, setTrades] = useState<TradeItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchTrades() {
      try {
        const data = await fetch(`/api/tokens/${mint}/trades`).then((r) => r.json());
        if (!cancelled) setTrades(data ?? []);
      } catch {
        // keep stale data on error
      }
    }

    fetchTrades();
    const id = setInterval(fetchTrades, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [mint]);

  return trades;
}
