"use client";

import { useState, useEffect } from "react";

export interface JupiterQuote {
  outAmount: string;
  priceImpactPct: string;
  routePlan: { swapInfo: { label: string } }[];
  [key: string]: unknown; // pass full object to /api/swap
}

export function useJupiterQuote(inputMint: string, outputMint: string, amount: string) {
  const [quote, setQuote] = useState<JupiterQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const num = parseFloat(amount);
    if (!num || num <= 0 || !inputMint || !outputMint) {
      setQuote(null);
      setError(null);
      return;
    }

    const amountLamports = Math.round(num * 1e9); // assumes SOL input; caller adjusts for token decimals
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await fetch(
          `/api/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountLamports}&slippageBps=50`
        ).then((r) => r.json());

        if (data.error) {
          setError(data.error);
          setQuote(null);
        } else {
          setQuote(data);
        }
      } catch {
        setError("Quote failed");
        setQuote(null);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputMint, outputMint, amount]);

  return { quote, loading, error };
}
