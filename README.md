# ChadWallet Web

Web surface for [ChadWallet](https://chadwallet.xyz) — a Solana memecoin trading app. This repo is the marketing landing page and in-browser trading interface that drives installs of the native mobile apps and lets users trade directly on web.

**Mobile apps:** [iOS App Store](https://apps.apple.com/us/app/chadwallet/id6757367474) · [Google Play](https://play.google.com/store/apps/details?id=xyz.chadwallet.www)

---

## Features

**Landing page**
- Animated token marquee banners (top + bottom) with live BirdEye data
- Hero section with app store CTAs
- Trending tokens grid (top 8 by 24h volume)
- Value props, how-it-works, FAQ, footer
- Sign in with Google via Privy — redirects to trading screen on auth

**Trading screen (`/trade/[mint]`)**
- Left sidebar: live trending token list with prices + 24h % change
- Center: token header (price, market cap, volume, liquidity, holders), candlestick price chart (15m / 1H / 4H / 1D), top holders list, live trades feed (polls every 5s)
- Right panel: buy/sell form with real-time Jupiter swap quotes, Privy wallet signing, Alchemy RPC submission
- Fully responsive — horizontal token strip + bottom sheet trade panel on mobile

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS v3 |
| Auth + Wallets | Privy (`@privy-io/react-auth` v3) — Google login, embedded Solana wallet |
| Token data | BirdEye API — trending, OHLCV, trades, token overview |
| Swaps | Jupiter v6 API — quotes + transaction building (no API key needed) |
| RPC | Alchemy — Solana RPC for balances, holders, tx submission |
| Database | Supabase (PostgreSQL) — stores user records on first login |
| Charts | lightweight-charts v5 — candlestick chart |
| Hosting | Vercel |
| DNS | Cloudflare |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/why-aditi/Trading-App
cd Trading-App
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env
```

Then fill in every variable (see table below). The app will build without them but most features will be non-functional.

### 3. Set up Supabase

In your Supabase project's SQL editor, run:

```sql
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  privy_id text unique not null,
  wallet_address text,
  email text,
  created_at timestamptz default now()
);
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

All variables are required. The app guards against missing keys at runtime (returns empty data rather than crashing) but features will be degraded.

| Variable | Description | Where to get it |
|----------|-------------|----------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID (public, exposed to browser) | [privy.io](https://privy.io) → dashboard → App settings |
| `PRIVY_APP_SECRET` | Privy app secret (server-only, used to verify tokens) | Privy dashboard → App settings |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase → Project settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, bypasses RLS) | Supabase → Project settings → API |
| `BIRDEYE_API_KEY` | BirdEye API key — powers all token data | [birdeye.so/data-api](https://birdeye.so/data-api) (free tier available) |
| `NEXT_PUBLIC_ALCHEMY_RPC_URL` | Alchemy Solana RPC URL (browser-side — swap submission, balances) | [alchemy.com](https://alchemy.com) → create Solana app → copy HTTPS URL |
| `ALCHEMY_RPC_URL` | Same Alchemy RPC URL (server-side — holders API route) | Same key, no `NEXT_PUBLIC` prefix needed |

> **Why two Alchemy variables?** Next.js only exposes `NEXT_PUBLIC_*` vars to the browser bundle. The holders API route runs server-side and uses `ALCHEMY_RPC_URL`. The trade panel and balance hook run client-side and use `NEXT_PUBLIC_ALCHEMY_RPC_URL`. Same key, different variable names.

### Privy setup

1. Create an app at [privy.io](https://privy.io)
2. Enable **Google** as a login method
3. Under Login Methods → Google, enter your Google OAuth **Client ID** and **Client Secret**
4. In Google Cloud Console, add `https://auth.privy.io/api/v1/oauth/callback` to **Authorized redirect URIs**
5. Add your domain (and `http://localhost:3000` for dev) to **Authorized JavaScript origins**

---

## Architecture

### Auth flow

1. User clicks "Sign in with Google" → Privy modal opens
2. Privy handles Google OAuth callback at `https://auth.privy.io/api/v1/oauth/callback`
3. Privy creates an embedded Solana wallet automatically (`createOnLogin: "users-without-wallets"`)
4. `usePrivyWallet` hook fires once, POSTs to `/api/auth/upsert` with the Privy access token
5. Server verifies token via `@privy-io/server-auth`, extracts wallet address + email, upserts into Supabase `users` table
6. `AuthSync` component (on landing page) redirects authenticated users to `/trade/[firstTrendingToken]`

### Data flow

- **Trending tokens**: fetched server-side in `page.tsx` and `trade/[mint]/page.tsx` via `getTrendingTokens()` (45s in-memory cache). Passed as props to avoid a client-side round-trip on first load.
- **Token overview**: fetched server-side per mint in the trade page. Also fetched client-side in `TokenDetail` when switching tokens (30s cache).
- **OHLCV (chart data)**: fetched server-side for the initial `1H` interval, then fetched client-side when the user switches intervals (60s cache).
- **Live trades**: polled every 5s via `useTokenTrades` hook (10s server cache).
- **Holders**: fetched via Alchemy RPC through `/api/holders/[mint]` (60s cache).
- **Jupiter quotes**: fetched client-side via `useJupiterQuote` with 500ms debounce. No caching (`no-store`) — quotes must be fresh.

### Swap execution

1. User enters an amount in `TradePanel`
2. `useJupiterQuote` debounces and calls `/api/quote` → proxies to `quote-api.jup.ag/v6/quote`
3. User clicks "Buy" / "Sell" → calls `/api/swap` with the quote + their public key
4. Server builds the transaction via Jupiter's `/v6/swap` endpoint (never touches private keys)
5. Client receives base64-encoded transaction, signs it via Privy's `useSignTransaction`
6. Signed transaction submitted to Solana via Alchemy RPC (`connection.sendRawTransaction`)
7. Explorer link shown on success

> **Note:** Jupiter operates on Solana mainnet only. Make sure your Alchemy app targets **mainnet** for swaps to execute. Devnet RPC can be used for wallet/auth testing only.

### Caching strategy

All BirdEye API calls use a module-level in-memory cache (resets on cold start). This keeps latency low and avoids hitting rate limits during Next.js server-side rendering.

| Endpoint | TTL |
|----------|-----|
| Trending tokens | 45s |
| Token overview | 30s |
| OHLCV | 60s |
| Live trades | 10s |
| Holders | 60s |
| Jupiter quotes | no cache |

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                        # Landing page (server component)
│   ├── layout.tsx                      # Root layout, metadata, font, PrivyProvider
│   ├── globals.css                     # Tailwind base + global styles + animations
│   ├── trade/
│   │   └── [mint]/
│   │       ├── page.tsx                # Server — prefetches trending tokens + initial candles
│   │       └── TradeClient.tsx         # Client shell — layout for sidebar, chart, trade panel
│   └── api/
│       ├── tokens/
│       │   ├── trending/route.ts       # GET top 20 tokens by 24h volume (BirdEye)
│       │   └── [mint]/
│       │       ├── route.ts            # GET token overview (price, mcap, volume, etc.)
│       │       ├── ohlcv/route.ts      # GET candlestick data (15m/1H/4H/1D)
│       │       └── trades/route.ts     # GET last 20 trades
│       ├── holders/[mint]/route.ts     # GET top holders via Alchemy RPC
│       ├── quote/route.ts              # GET Jupiter swap quote (proxy)
│       ├── swap/route.ts               # POST Jupiter swap tx builder
│       └── auth/upsert/route.ts        # POST Privy token → upsert Supabase user
│
├── components/
│   ├── Nav.tsx                         # Sticky nav — logo, links (landing only), wallet dropdown
│   ├── Hero.tsx                        # Landing hero — headline, CTAs, phone mockups
│   ├── TokenBanner.tsx                 # CSS marquee of live token prices (top + bottom)
│   ├── TrendingGrid.tsx                # 4-col grid of top 8 trending tokens
│   ├── ValueProps.tsx                  # 4 feature cards
│   ├── HowItWorks.tsx                  # 3-step onboarding section
│   ├── Faq.tsx                         # Accordion FAQ
│   ├── Footer.tsx                      # Links, disclaimer, copyright
│   ├── AuthSync.tsx                    # Invisible — runs login sync + redirect
│   └── trade/
│       ├── TokenList.tsx               # Trending token sidebar (vertical) / strip (horizontal)
│       ├── TokenDetail.tsx             # Token header, chart, holders, live trades
│       ├── TradePanel.tsx              # Buy/sell form, quote display, swap execution
│       └── PriceChart.tsx             # lightweight-charts v5 candlestick chart
│
├── hooks/
│   ├── usePrivyWallet.ts               # Fires once on login → upserts user into Supabase
│   ├── useTrendingTokens.ts            # Fetches /api/tokens/trending, hydrates from initialTrending
│   ├── useTokenTrades.ts               # Polls /api/tokens/[mint]/trades every 5s
│   ├── useJupiterQuote.ts              # Debounced Jupiter quote fetch (500ms)
│   └── useWalletBalances.ts            # SOL + token balance via Alchemy, re-fetches on swap
│
└── lib/
    ├── birdeye.ts                      # All BirdEye API calls + in-memory caches + types
    ├── privy-provider.tsx              # PrivyProvider config (Google login, Solana wallet)
    └── supabase.ts                     # Lazy Supabase client singleton
```

---

## Deployment

The app is deployed on Vercel connected to this GitHub repo. Every push to `main` triggers a production deploy.

**Required steps when deploying to a new environment:**
1. Add all environment variables in Vercel dashboard (Settings → Environment Variables)
2. Add the production domain to Privy's allowed origins (Privy dashboard → App settings)
3. Add the production domain to Google Cloud Console → Authorized JavaScript origins
4. `https://auth.privy.io/api/v1/oauth/callback` must remain in Google's Authorized redirect URIs (already handles both dev and prod)

---

## Brand

| Token | Value |
|-------|-------|
| Background | `#09090B` |
| Card | `#18181B` |
| Border | `#27272A` |
| Accent (cyan) | `#3DD6F5` |
| Accent end (teal) | `#56C7B0` |
| Muted text | `#A1A1AA` |
| Green (up) | `#22C55E` |
| Red (down) | `#EF4444` |

Font: Inter. Logo: `/public/logo-dark.png`.
