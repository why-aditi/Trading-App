export const runtime = "nodejs";

import { getTokenHolders } from "@/lib/birdeye";

export async function GET(_: Request, { params }: { params: { mint: string } }) {
  const holders = await getTokenHolders(params.mint);
  return Response.json(holders, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
  });
}
