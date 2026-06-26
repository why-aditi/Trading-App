export const runtime = "nodejs";

import { getTokenHolders, getTokenOverview } from "@/lib/birdeye";

export async function GET(_: Request, { params }: { params: { mint: string } }) {
  const [overview, holders] = await Promise.all([
    getTokenOverview(params.mint),
    getTokenHolders(params.mint),
  ]);

  return Response.json(
    { overview, holders },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15" } }
  );
}
