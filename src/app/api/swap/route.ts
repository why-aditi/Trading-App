// Build Jupiter swap tx server-side — client signs, we never touch the key
export async function POST(req: Request) {
  let body: { quoteResponse: unknown; userPublicKey: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { quoteResponse, userPublicKey } = body;
  if (!quoteResponse || !userPublicKey) {
    return Response.json({ error: "Missing quoteResponse or userPublicKey" }, { status: 400 });
  }

  // Basic base58 validation — public keys are 32–44 chars, alphanumeric (no 0/O/I/l)
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(userPublicKey)) {
    return Response.json({ error: "Invalid public key" }, { status: 400 });
  }

  const res = await fetch("https://quote-api.jup.ag/v6/swap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: "auto",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: "Jupiter swap error", detail: err }, { status: res.status });
  }

  const { swapTransaction } = await res.json();
  return Response.json({ swapTransaction });
}
