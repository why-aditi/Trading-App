"use client";

import { useEffect, useRef } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";

// Fires once per login to upsert user+wallet into Supabase via /api/auth/upsert
export function usePrivyWallet() {
  const { authenticated, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const done = useRef(false);

  useEffect(() => {
    if (!authenticated || done.current) return;
    const solWallet = wallets.find((w) => w.walletClientType === "privy");
    if (!solWallet) return; // wallet not ready yet, effect will re-run

    done.current = true;
    getAccessToken().then((token) => {
      if (!token) return;
      fetch("/api/auth/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privyToken: token }),
      }).catch(console.error);
    });
  }, [authenticated, wallets, getAccessToken]);
}
