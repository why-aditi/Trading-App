export const runtime = "nodejs";

import { getTokenOverview } from "@/lib/birdeye";

export async function GET(_: Request, { params }: { params: { mint: string } }) {
  const data = await getTokenOverview(params.mint);
  return Response.json(data, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15" },
  });
}
