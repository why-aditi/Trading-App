"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyWallet } from "@/hooks/usePrivyWallet";

const FALLBACK_MINT = "So11111111111111111111111111111111111111112";

export function AuthSync({ defaultMint }: { defaultMint?: string }) {
  usePrivyWallet();
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.replace(`/trade/${defaultMint ?? FALLBACK_MINT}`);
    }
  }, [ready, authenticated, router, defaultMint]);

  // Block render until Privy knows auth state — prevents landing page flash for signed-in users
  if (!ready) return <div className="fixed inset-0 z-50 bg-chad-bg" />;

  return null;
}
