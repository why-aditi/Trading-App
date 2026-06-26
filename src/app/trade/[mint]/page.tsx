import { getOhlcv, getTrendingTokens, type OhlcvCandle } from "@/lib/birdeye";
import { TradeClient } from "./TradeClient";

export default async function TradePage({ params }: { params: { mint: string } }) {
  const [trending, ohlcv] = await Promise.all([
    getTrendingTokens().catch(() => []),
    getOhlcv(params.mint, "1H").catch(() => ({ candles: [] as OhlcvCandle[] })),
  ]);

  return (
    <TradeClient
      mint={params.mint}
      initialTrending={trending}
      initialCandles={ohlcv.candles}
    />
  );
}
