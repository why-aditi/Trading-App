# ChadWallet Web

Web surface for [ChadWallet](https://chadwallet.xyz) — marketing landing page + in-browser Solana trading.

**Mobile apps:** [iOS](https://apps.apple.com/us/app/chadwallet/id6757367474) · [Android](https://play.google.com/store/apps/details?id=xyz.chadwallet.www)

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Privy** — Google login, embedded Solana wallet
- **BirdEye** — trending tokens, price charts (OHLCV), live trades
- **Jupiter** — swap quotes + transaction building
- **Alchemy** — Solana RPC (balances, holders, tx submission)
- **Supabase** — user table (privy_id, wallet, email)
- **Vercel** — hosting · **Cloudflare** — DNS

## Local dev

```bash
cp .env.local.example .env
# fill in all keys (see below)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | [privy.io](https://privy.io) dashboard |
| `PRIVY_APP_SECRET` | Privy dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings |
| `BIRDEYE_API_KEY` | [birdeye.so/data-api](https://birdeye.so/data-api) |
| `NEXT_PUBLIC_ALCHEMY_RPC_URL` | [alchemy.com](https://alchemy.com) → Solana app → HTTP URL |
| `ALCHEMY_RPC_URL` | same Alchemy key, no `NEXT_PUBLIC` prefix |

## Supabase setup

Run once in the SQL editor:

```sql
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  privy_id text unique not null,
  wallet_address text,
  email text,
  created_at timestamptz default now()
);
```

## Project structure

```
src/
  app/
    page.tsx                  # Landing page (server)
    trade/[mint]/             # Trading page
      page.tsx                # Server — prefetches trending + candles
      TradeClient.tsx         # Client shell
    api/
      tokens/trending/        # BirdEye trending list
      tokens/[mint]/          # Token overview, OHLCV, trades
      holders/[mint]/         # Top holders via Alchemy
      quote/                  # Jupiter quote proxy
      swap/                   # Jupiter swap tx builder
      auth/upsert/            # Privy → Supabase user sync
  components/
    Nav.tsx / Hero.tsx / Footer.tsx / ...
    trade/
      TokenList.tsx           # Left sidebar
      TokenDetail.tsx         # Chart + holders + live trades
      TradePanel.tsx          # Buy / sell form
      PriceChart.tsx          # lightweight-charts v5 candlesticks
  hooks/
    usePrivyWallet.ts         # Login → Supabase upsert
    useTokenTrades.ts         # 5s polling for live trades
    useJupiterQuote.ts        # Debounced Jupiter quote
    useWalletBalances.ts      # SOL + token balance via Alchemy
  lib/
    birdeye.ts                # BirdEye API + in-memory cache
    privy-provider.tsx        # PrivyProvider wrapper
    supabase.ts               # Lazy Supabase singleton
```
