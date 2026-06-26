export const runtime = "nodejs";

import { getTrendingTokens } from "@/lib/birdeye";

export async function GET() {
  try {
    const tokens = await getTrendingTokens();
    return Response.json({ tokens }, {
      headers: { "Cache-Control": "public, s-maxage=45, stale-while-revalidate=30" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    const error = msg.includes("429") || msg.toLowerCase().includes("rate") ? "rate_limited" : "unavailable";
    return Response.json({ tokens: [], error }, { status: 200 });
  }
}
