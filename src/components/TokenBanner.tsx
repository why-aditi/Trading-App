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

function TokenItem({ token }: { token: BirdEyeToken }) {
  const up = token.priceChange24hPercent >= 0;
  return (
    <Link
      href={`/trade/${token.address}`}
      prefetch
      onClick={() => stashTokenForNavigation(token)}
      className="inline-flex items-center gap-2 mx-4 px-3 py-1.5 rounded-full bg-chad-card border border-chad-border hover:border-chad-accent/50 transition-colors whitespace-nowrap"
    >
      {token.logoURI ? (
        <Image
          src={token.logoURI}
          alt={token.symbol}
          width={20}
          height={20}
          className="rounded-full"
          unoptimized
        />
      ) : (
        <div className="w-5 h-5 rounded-full bg-chad-border" />
      )}
      <span className="text-sm font-medium text-white">{token.symbol}</span>
      <span className="text-sm text-chad-muted">{formatPrice(token.price)}</span>
      <span className={`text-xs font-semibold ${up ? "text-chad-green" : "text-chad-red"}`}>
        {up ? "+" : ""}
        {token.priceChange24hPercent.toFixed(2)}%
      </span>
    </Link>
  );
}

interface Props {
  tokens: BirdEyeToken[];
  reverse?: boolean;
  offset?: number;
}

export function TokenBanner({ tokens, reverse = false, offset = 0 }: Props) {
  if (!tokens.length) return null;

  const shifted = [...tokens.slice(offset % tokens.length), ...tokens.slice(0, offset % tokens.length)];
  const items = [...shifted, ...shifted];

  return (
    <div className="w-full overflow-hidden border-y border-chad-border py-2 pause-on-hover">
      <div
        className={`inline-flex ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ width: "max-content" }}
      >
        {items.map((token, i) => (
          <TokenItem key={`${token.address}-${i}`} token={token} />
        ))}
      </div>
    </div>
  );
}
