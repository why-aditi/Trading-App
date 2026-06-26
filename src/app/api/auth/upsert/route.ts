import { PrivyClient } from "@privy-io/server-auth";
import { getSupabase } from "@/lib/supabase";

// ponytail: lazy init — avoids build-time crash when env vars not present
function getPrivy() {
  return new PrivyClient(
    process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
    process.env.PRIVY_APP_SECRET!
  );
}

export async function POST(req: Request) {
  try {
    const { privyToken } = await req.json();
    if (!privyToken) return Response.json({ error: "Missing token" }, { status: 400 });

    const privy = getPrivy();
    const claims = await privy.verifyAuthToken(privyToken);
    const privyId = claims.userId;

    const user = await privy.getUser(privyId);
    const solanaWallet = user.linkedAccounts.find(
      (a) => a.type === "wallet" && a.chainType === "solana"
    );
    const walletAddress = solanaWallet && "address" in solanaWallet ? solanaWallet.address : null;
    const emailAccount = user.linkedAccounts.find(
      (a) => a.type === "google_oauth" || a.type === "email"
    ) as { email?: string } | undefined;

    await getSupabase()
      .from("users")
      .upsert(
        { privy_id: privyId, wallet_address: walletAddress, email: emailAccount?.email ?? null },
        { onConflict: "privy_id" }
      );

    return Response.json({ walletAddress });
  } catch (err) {
    console.error("upsert error", err);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
