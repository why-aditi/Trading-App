export async function GET(req: Request) {
  const url = new URL(req.url);
  const inputMint = url.searchParams.get("inputMint");
  const outputMint = url.searchParams.get("outputMint");
  const amount = url.searchParams.get("amount");
  const slippageBps = url.searchParams.get("slippageBps") ?? "50";

  if (!inputMint || !outputMint || !amount) {
    return Response.json({ error: "Missing params" }, { status: 400 });
  }

  const res = await fetch(
    `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`,
    { headers: { "Content-Type": "application/json" } }
  );

  if (!res.ok) return Response.json({ error: "Jupiter error" }, { status: res.status });

  const data = await res.json();
  return Response.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
