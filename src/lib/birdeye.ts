export interface BirdEyeToken {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  price: number;
  priceChange24hPercent: number;
  v24hUSD: number;
  mc: number;
  liquidity: number;
}

export interface TokenOverview {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  price: number;
  priceChange24hPercent: number;
  mc: number;
  v24hUSD: number;
  liquidity: number;
  holder: number;
  decimals: number;
}

export interface TokenHolder {
  address: string;
  amount: string;
}

const BIRDEYE_HEADERS = (key: string) => ({ "X-API-KEY": key, "x-chain": "solana" });

function mapTrendingToken(t: Record<string, unknown>): BirdEyeToken {
  return {
    address: String(t.address),
    symbol: String(t.symbol),
    name: String(t.name),
    logoURI: String(t.logoURI ?? ""),
    price: Number(t.price),
    priceChange24hPercent: Number(t.price24hChangePercent ?? t.priceChange24hPercent ?? 0),
    v24hUSD: Number(t.volume24hUSD ?? t.v24hUSD ?? 0),
    mc: Number(t.marketcap ?? t.mc ?? 0),
    liquidity: Number(t.liquidity ?? 0),
  };
}

// ponytail: module-level cache — resets on cold start, fine for 45s TTL
const trendingCache: { data: BirdEyeToken[] | null; ts: number } = { data: null, ts: 0 };
const overviewCache = new Map<string, { data: TokenOverview; ts: number }>();
const holdersCache = new Map<string, { data: TokenHolder[]; ts: number }>();
const TRENDING_TTL = 45_000;
const OVERVIEW_TTL = 30_000;
const HOLDERS_TTL = 60_000;

export async function getTrendingTokens(): Promise<BirdEyeToken[]> {
  if (trendingCache.data && Date.now() - trendingCache.ts < TRENDING_TTL) return trendingCache.data;

  const key = process.env.BIRDEYE_API_KEY;
  if (!key) return [];

  const res = await fetch(
    "https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=20",
    { headers: BIRDEYE_HEADERS(key), next: { revalidate: 45 } }
  );

  if (!res.ok) {
    if (trendingCache.data) return trendingCache.data;
    throw new Error(`BirdEye ${res.status}`);
  }

  const json = await res.json();
  if (!json.success && json.message) {
    if (trendingCache.data) return trendingCache.data;
    throw new Error(`BirdEye ${json.message}`);
  }

  const tokens = (json.data?.tokens ?? []).map(mapTrendingToken);
  trendingCache.data = tokens;
  trendingCache.ts = Date.now();
  return tokens;
}

export async function getTokenOverview(mint: string): Promise<TokenOverview | null> {
  const cached = overviewCache.get(mint);
  if (cached && Date.now() - cached.ts < OVERVIEW_TTL) return cached.data;

  const key = process.env.BIRDEYE_API_KEY;
  if (!key) return null;

  const res = await fetch(`https://public-api.birdeye.so/defi/token_overview?address=${mint}`, {
    headers: BIRDEYE_HEADERS(key),
    next: { revalidate: 30 },
  });

  if (!res.ok) return overviewCache.get(mint)?.data ?? null;

  const json = await res.json();
  if (!json.data) return overviewCache.get(mint)?.data ?? null;

  overviewCache.set(mint, { data: json.data, ts: Date.now() });
  return json.data;
}

export async function getTokenHolders(mint: string): Promise<TokenHolder[]> {
  const cached = holdersCache.get(mint);
  if (cached && Date.now() - cached.ts < HOLDERS_TTL) return cached.data;

  const key = process.env.BIRDEYE_API_KEY;
  if (!key) return [];

  const res = await fetch(
    `https://public-api.birdeye.so/defi/v3/token/holder?address=${mint}&limit=10`,
    { headers: BIRDEYE_HEADERS(key), next: { revalidate: 60 } }
  );

  if (!res.ok) return holdersCache.get(mint)?.data ?? [];

  const json = await res.json();
  const items: { owner: string; ui_amount?: number; amount?: string }[] = json.data?.items ?? [];
  const holders: TokenHolder[] = items.map((h) => ({
    address: h.owner,
    amount: String(h.ui_amount ?? h.amount ?? 0),
  }));

  holdersCache.set(mint, { data: holders, ts: Date.now() });
  return holders;
}

export function tokenToOverview(token: BirdEyeToken): TokenOverview {
  return {
    address: token.address,
    symbol: token.symbol,
    name: token.name,
    logoURI: token.logoURI,
    price: token.price,
    priceChange24hPercent: token.priceChange24hPercent,
    mc: token.mc,
    v24hUSD: token.v24hUSD,
    liquidity: token.liquidity,
    holder: 0,
    decimals: 9,
  };
}

export interface OhlcvCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const ohlcvCache = new Map<string, { data: OhlcvCandle[]; ts: number }>();
const OHLCV_TTL = 60_000;

export async function getOhlcv(
  mint: string,
  type: string
): Promise<{ candles: OhlcvCandle[]; error?: string }> {
  const cacheKey = `v3:${mint}:${type}`;
  const cached = ohlcvCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < OHLCV_TTL) {
    return { candles: cached.data };
  }

  const key = process.env.BIRDEYE_API_KEY;
  if (!key) return { candles: [], error: "unconfigured" };

  const now = Math.floor(Date.now() / 1000);
  const from = now - 86400 * ohlcvRangeDays(type);

  const res = await fetch(
    `https://public-api.birdeye.so/defi/ohlcv?address=${mint}&type=${type}&time_from=${from}&time_to=${now}`,
    { headers: BIRDEYE_HEADERS(key), next: { revalidate: 60 } }
  );

  if (!res.ok) {
    const stale = ohlcvCache.get(cacheKey)?.data;
    if (stale) return { candles: stale };
    return { candles: [], error: res.status === 429 ? "rate_limited" : "unavailable" };
  }

  const json = await res.json();
  if (!json.success && json.message) {
    const stale = ohlcvCache.get(cacheKey)?.data;
    if (stale) return { candles: stale };
    const error = String(json.message).toLowerCase().includes("rate") ? "rate_limited" : "unavailable";
    return { candles: [], error };
  }

  const candles = (json.data?.items ?? [])
    .map((d: {
      unixTime: number;
      o?: number; h?: number; l?: number; c?: number;
      open?: number; high?: number; low?: number; close?: number;
    }) => ({
      time: d.unixTime,
      open: d.o ?? d.open,
      high: d.h ?? d.high,
      low: d.l ?? d.low,
      close: d.c ?? d.close,
    }))
    .filter((c: OhlcvCandle) => c.open != null && c.high != null && c.low != null && c.close != null);

  if (candles.length) ohlcvCache.set(cacheKey, { data: candles, ts: Date.now() });
  return candles.length ? { candles } : { candles: [], error: "no_data" };
}

export function ohlcvRangeDays(type: string) {
  if (type === "1D") return 30;
  if (type === "4H") return 7;
  return 2;
}

