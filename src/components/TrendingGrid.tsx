"use client";

import Link from "next/link";
import Image from "next/image";
import type { BirdEyeToken } from "@/lib/birdeye";
import { stashTokenForNavigation } from "@/lib/token-nav";

function formatPrice(p: number) {
  if (p < 0.0001) return `$${p.toExponential(2)}`;
  if (p < 1) return `$${p.toFixed(4)}`;
  return `$${p.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function formatVolume(v: number) {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

export function TrendingGrid({ tokens }: { tokens: BirdEyeToken[] }) {
  return (
    <section className="py-16 sm:py-24 bg-chad-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black">
            Trending <span className="text-gradient">now</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-chad-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-chad-green animate-pulse" />
            Live · 45s cache
          </div>
        </div>

        {tokens.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-chad-card border border-chad-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tokens.slice(0, 8).map((token, rank) => {
              const up = token.priceChange24hPercent >= 0;
              return (
                <Link
                  key={token.address}
                  href={`/trade/${token.address}`}
                  prefetch
                  onClick={() => stashTokenForNavigation(token)}
                  className="group p-4 rounded-2xl border border-chad-border bg-chad-card hover:border-chad-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {token.logoURI ? (
                        <Image
                          src={token.logoURI}
                          alt={token.symbol}
                          width={32}
                          height={32}
                          className="rounded-full"
                          unoptimized
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-chad-border" />
                      )}
                      <div>
                        <div className="font-bold text-sm">{token.symbol}</div>
                        <div className="text-xs text-chad-muted truncate max-w-[80px]">{token.name}</div>
                      </div>
                    </div>
                    <span className="text-xs text-chad-muted">#{rank + 1}</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-mono font-bold">{formatPrice(token.price)}</div>
                      <div className="text-xs text-chad-muted">Vol {formatVolume(token.v24hUSD)}</div>
                    </div>
                    <span className={`text-sm font-bold ${up ? "text-chad-green" : "text-chad-red"}`}>
                      {up ? "+" : ""}
                      {token.priceChange24hPercent.toFixed(1)}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
