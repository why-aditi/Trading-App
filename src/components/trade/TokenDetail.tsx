"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PriceChart } from "./PriceChart";
import { useTokenTrades } from "@/hooks/useTokenTrades";
import { readStashedToken } from "@/lib/token-nav";
import type { TradeItem } from "@/app/api/tokens/[mint]/trades/route";
import type { BirdEyeToken, TokenHolder, TokenOverview, OhlcvCandle } from "@/lib/birdeye";
import { tokenToOverview } from "@/lib/birdeye";

const overviewCache = new Map<string, TokenOverview>();

function resolveSeedOverview(mint: string, trending: BirdEyeToken[]): TokenOverview | null {
  const cached = overviewCache.get(mint);
  if (cached) return cached;

  const fromTrending = trending.find((t) => t.address === mint);
  if (fromTrending) return tokenToOverview(fromTrending);

  const stashed = readStashedToken(mint);
  if (stashed) return tokenToOverview(stashed);

  return null;
}

function fmt(n: number | undefined | null) {
  if (n == null || isNaN(n)) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtPrice(p: number) {
  if (p < 0.0001) return `$${p.toExponential(3)}`;
  if (p < 1) return `$${p.toFixed(5)}`;
  return `$${p.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function TradeRow({ trade }: { trade: TradeItem }) {
  const buy = trade.side === "buy";
  const time = new Date(trade.blockUnixTime * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return (
    <div className="flex items-center justify-between py-1.5 px-4 hover:bg-white/5 text-xs">
      <span className={`font-semibold w-8 ${buy ? "text-chad-green" : "text-chad-red"}`}>
        {buy ? "BUY" : "SELL"}
      </span>
      <span className="text-chad-muted">{time}</span>
      <span className="font-mono">
        {Number(trade.from.amount).toFixed(3)} {trade.from.symbol}
      </span>
      <span className="text-chad-muted">→</span>
      <span className="font-mono">
        {Number(trade.to.amount).toFixed(3)} {trade.to.symbol}
      </span>
    </div>
  );
}

interface Props {
  mint: string;
  initialTrending: BirdEyeToken[];
  initialCandles: OhlcvCandle[];
  initialOverview?: TokenOverview | null;
}

export function TokenDetail({ mint, initialTrending, initialCandles, initialOverview }: Props) {
  const [overview, setOverview] = useState<TokenOverview | null>(
    () => initialOverview ?? resolveSeedOverview(mint, initialTrending)
  );
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [holdersLoading, setHoldersLoading] = useState(true);
  const trades = useTokenTrades(mint);
  const mintRef = useRef(mint);

  useEffect(() => {
    mintRef.current = mint;
    const seed = resolveSeedOverview(mint, initialTrending);
    if (seed) setOverview(seed);

    setHoldersLoading(true);

    fetch(`/api/tokens/${mint}/bundle`)
      .then((r) => r.json())
      .then((body: { overview?: TokenOverview | null; holders?: TokenHolder[] }) => {
        if (mintRef.current !== mint) return;
        if (body.overview) {
          overviewCache.set(mint, body.overview);
          setOverview(body.overview);
        }
        setHolders(Array.isArray(body.holders) ? body.holders : []);
      })
      .catch(() => {})
      .finally(() => {
        if (mintRef.current === mint) setHoldersLoading(false);
      });
  }, [mint, initialTrending]);

  const up = (overview?.priceChange24hPercent ?? 0) >= 0;

  return (
    <div className="p-4 space-y-5">
      {!overview ? (
        <div className="h-16 bg-chad-card rounded-2xl animate-pulse" />
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            {overview.logoURI && (
              <Image
                src={overview.logoURI}
                alt={overview.symbol}
                width={40}
                height={40}
                className="rounded-full"
                unoptimized
              />
            )}
            <div>
              <div className="font-black text-xl">{overview.symbol}</div>
              <div className="text-chad-muted text-xs">{overview.name}</div>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold">{fmtPrice(overview.price)}</span>
            <span className={`text-sm font-semibold ${up ? "text-chad-green" : "text-chad-red"}`}>
              {up ? "+" : ""}
              {overview.priceChange24hPercent.toFixed(2)}%
            </span>
          </div>

          <div className="flex gap-4 text-xs text-chad-muted ml-auto">
            <div><div className="text-white font-semibold">{fmt(overview.mc)}</div>Mkt Cap</div>
            <div><div className="text-white font-semibold">{fmt(overview.v24hUSD)}</div>24h Vol</div>
            <div><div className="text-white font-semibold">{fmt(overview.liquidity)}</div>Liquidity</div>
            <div><div className="text-white font-semibold">{overview.holder?.toLocaleString() ?? "—"}</div>Holders</div>
          </div>
        </div>
      )}

      <div className="bg-chad-card rounded-2xl border border-chad-border p-4">
        <PriceChart mint={mint} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-chad-card rounded-2xl border border-chad-border overflow-hidden">
          <div className="px-4 py-3 border-b border-chad-border text-xs font-semibold text-chad-muted uppercase tracking-wider">
            Top Holders
          </div>
          {holdersLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 rounded bg-chad-border/40 animate-pulse" />
              ))}
            </div>
          ) : holders.length === 0 ? (
            <div className="p-4 text-chad-muted text-xs text-center">No holder data</div>
          ) : (
            <div>
              {holders.map((h, i) => (
                <div key={h.address} className="flex items-center justify-between px-4 py-2 hover:bg-white/5 text-xs">
                  <span className="text-chad-muted w-5">#{i + 1}</span>
                  <span className="font-mono text-chad-muted flex-1 mx-2 truncate">
                    {h.address.slice(0, 6)}...{h.address.slice(-4)}
                  </span>
                  <span className="font-semibold">{Number(h.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-chad-card rounded-2xl border border-chad-border overflow-hidden">
          <div className="px-4 py-3 border-b border-chad-border flex items-center gap-2">
            <span className="text-xs font-semibold text-chad-muted uppercase tracking-wider">Live Trades</span>
            <span className="w-1.5 h-1.5 rounded-full bg-chad-green animate-pulse" />
          </div>
          {trades.length === 0 ? (
            <div className="p-4 text-chad-muted text-xs text-center">Waiting for trades…</div>
          ) : (
            <div className="divide-y divide-chad-border">
              {trades.slice(0, 15).map((t) => (
                <TradeRow key={t.txHash} trade={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
