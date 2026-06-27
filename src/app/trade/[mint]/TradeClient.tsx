"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { TokenList } from "@/components/trade/TokenList";
import { TokenDetail } from "@/components/trade/TokenDetail";
import { TradePanel } from "@/components/trade/TradePanel";
import type { BirdEyeToken, OhlcvCandle, TokenOverview } from "@/lib/birdeye";

interface Props {
  mint: string;
  initialTrending: BirdEyeToken[];
  initialCandles: OhlcvCandle[];
  initialOverview: TokenOverview | null;
}

export function TradeClient({ mint, initialTrending, initialCandles, initialOverview }: Props) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [, setRefreshKey] = useState(0);

  return (
    <div className="flex h-screen overflow-hidden bg-chad-bg">
      <aside className="hidden lg:flex w-60 flex-col flex-shrink-0 border-r border-chad-border overflow-y-auto">
        <TokenList mint={mint} initialTrending={initialTrending} />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Nav />
        <div className="lg:hidden border-b border-chad-border overflow-x-auto">
          <TokenList mint={mint} initialTrending={initialTrending} layout="horizontal" />
        </div>
        <main className="flex-1 overflow-y-auto">
          <TokenDetail mint={mint} initialTrending={initialTrending} initialCandles={initialCandles} initialOverview={initialOverview} />
        </main>
      </div>

      <aside className="hidden md:flex w-80 flex-shrink-0 flex-col border-l border-chad-border overflow-y-auto">
        <TradePanel
          mint={mint}
          side={side}
          setSide={setSide}
          amount={amount}
          setAmount={setAmount}
          onSwapSuccess={() => setRefreshKey((k) => k + 1)}
        />
      </aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-chad-border bg-chad-bg max-h-64 overflow-y-auto">
        <TradePanel
          mint={mint}
          side={side}
          setSide={setSide}
          amount={amount}
          setAmount={setAmount}
          onSwapSuccess={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </div>
  );
}
