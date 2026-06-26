export const runtime = "nodejs";

const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 10_000;

export interface TradeItem {
  blockUnixTime: number;
  side: "buy" | "sell";
  from: { amount: number; symbol: string };
  to: { amount: number; symbol: string };
  txHash: string;
}

export async function GET(_: Request, { params }: { params: { mint: string } }) {
  const { mint } = params;
  const cached = cache.get(mint);
  if (cached && Date.now() - cached.ts < TTL) return Response.json(cached.data);

  const key = process.env.BIRDEYE_API_KEY;
  if (!key) return Response.json([]);

  const res = await fetch(
    `https://public-api.birdeye.so/defi/txs/token?address=${mint}&offset=0&limit=20&tx_type=swap`,
    { headers: { "X-API-KEY": key, "x-chain": "solana" } }
  );

  if (!res.ok) return Response.json(cache.get(mint)?.data ?? []);

  const json = await res.json();
  const items: TradeItem[] = json.data?.items ?? [];
  cache.set(mint, { data: items, ts: Date.now() });
  return Response.json(items, {
    headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5" },
  });
}
