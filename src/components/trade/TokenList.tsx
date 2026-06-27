"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import type { BirdEyeToken } from "@/lib/birdeye";
import { stashTokenForNavigation } from "@/lib/token-nav";
import { useTrendingTokens } from "@/hooks/useTrendingTokens";

function formatPrice(p: number) {
  if (p < 0.0001) return `$${p.toExponential(2)}`;
  if (p < 1) return `$${p.toFixed(4)}`;
  return `$${p.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

const ERROR_MESSAGES: Record<string, string> = {
  rate_limited: "Trending list rate limited — try again shortly",
  unavailable: "Trending data unavailable",
};

interface Props {
  mint: string;
  initialTrending?: BirdEyeToken[];
  layout?: "vertical" | "horizontal";
}

export function TokenList({ mint, initialTrending, layout = "vertical" }: Props) {
  const { tokens, loading, error: errCode } = useTrendingTokens(initialTrending);
  const router = useRouter();
  const { authenticated, logout } = usePrivy();
  const error = errCode ? (ERROR_MESSAGES[errCode] ?? ERROR_MESSAGES.unavailable) : null;

  const list = (
    <>
      {loading
        ? Array.from({ length: layout === "vertical" ? 10 : 6 }).map((_, i) => (
            <div
              key={i}
              className={`${layout === "vertical" ? "mx-3 my-1.5 h-12" : "mx-2 my-2 h-10 w-28 flex-shrink-0"} rounded-xl bg-chad-card animate-pulse`}
            />
          ))
        : error
          ? <div className="p-4 text-chad-muted text-xs text-center">{error}</div>
          : tokens.map((token) => {
              const active = token.address === mint;
              const up = token.priceChange24hPercent >= 0;
              return (
                <button
                  key={token.address}
                  onClick={() => {
                    stashTokenForNavigation(token);
                    router.push(`/trade/${token.address}`);
                  }}
                  className={`${layout === "vertical" ? "w-full px-4 py-2.5" : "flex-shrink-0 w-36 px-3 py-2 mx-2 my-2 rounded-xl border border-chad-border"} flex items-center gap-3 hover:bg-white/5 transition-colors text-left ${
                    active ? (layout === "vertical" ? "bg-white/10 border-r-2 border-chad-accent" : "bg-white/10 border-chad-accent") : ""
                  }`}
                >
                  {token.logoURI ? (
                    <Image
                      src={token.logoURI}
                      alt={token.symbol}
                      width={28}
                      height={28}
                      className="rounded-full flex-shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-chad-border flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{token.symbol}</div>
                    <div className="text-xs text-chad-muted">{formatPrice(token.price)}</div>
                  </div>
                  <span className={`text-xs font-bold ${up ? "text-chad-green" : "text-chad-red"}`}>
                    {up ? "+" : ""}
                    {token.priceChange24hPercent.toFixed(1)}%
                  </span>
                </button>
              );
            })}
    </>
  );

  if (layout === "horizontal") {
    return (
      <div className="flex py-1">
        {list}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-chad-border">
        <p className="text-xs font-semibold text-chad-muted uppercase tracking-wider">Trending</p>
      </div>
      <div className="flex-1 overflow-y-auto">{list}</div>
      {authenticated && (
        <div className="p-3 border-t border-chad-border">
          <button
            onClick={async () => { await logout(); router.replace("/"); }}
            className="w-full py-2 rounded-lg text-xs text-chad-muted hover:text-chad-red hover:bg-white/5 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
