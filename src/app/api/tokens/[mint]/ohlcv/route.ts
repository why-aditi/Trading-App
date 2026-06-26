export const runtime = "nodejs";

import { getOhlcv } from "@/lib/birdeye";

export async function GET(req: Request, { params }: { params: { mint: string } }) {
  const type = new URL(req.url).searchParams.get("type") ?? "15m";
  const result = await getOhlcv(params.mint, type);
  return Response.json(result, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
  });
}
