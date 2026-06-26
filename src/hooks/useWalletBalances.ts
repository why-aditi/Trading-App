"use client";

import { useState, useEffect, useMemo } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export interface WalletBalances {
  sol: number;
  token: number;
  loading: boolean;
}

export function useWalletBalances(
  walletAddress: string | null,
  mint: string,
  refreshKey: number
): WalletBalances {
  const [sol, setSol] = useState(0);
  const [token, setToken] = useState(0);
  const [loading, setLoading] = useState(false);

  const connection = useMemo(() => {
    const rpc = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
    return rpc ? new Connection(rpc) : null;
  }, []);

  useEffect(() => {
    if (!walletAddress || !connection || !mint) return;

    let cancelled = false;
    setLoading(true);

    async function fetch() {
      try {
        const pubkey = new PublicKey(walletAddress!);

        const [lamports, tokenAccounts] = await Promise.all([
          connection!.getBalance(pubkey),
          connection!.getParsedTokenAccountsByOwner(pubkey, { mint: new PublicKey(mint) }),
        ]);

        if (cancelled) return;
        setSol(lamports / LAMPORTS_PER_SOL);
        setToken(
          tokenAccounts.value[0]?.account.data.parsed.info.tokenAmount.uiAmount ?? 0
        );
      } catch {
        // keep previous values
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [walletAddress, mint, refreshKey, connection]);

  return { sol, token, loading };
}
