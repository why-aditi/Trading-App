import { PrivyClient } from "@privy-io/node";
import { getSupabase } from "@/lib/supabase";

// ponytail: lazy init — avoids build-time crash when env vars not present
function getPrivy() {
  return new PrivyClient({
    appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
    appSecret: process.env.PRIVY_APP_SECRET!,
  });
}

export async function POST(req: Request) {
  try {
    const { privyToken } = await req.json();
    if (!privyToken) return Response.json({ error: "Missing token" }, { status: 400 });

    const privy = getPrivy();
    const claims = await privy.utils().auth().verifyAccessToken(privyToken);
    const privyId = claims.user_id;

    const user = await privy.users()._get(privyId);
    const solanaWallet = user.linked_accounts.find(
      (a) => a.type === "wallet" && a.chain_type === "solana"
    );
    const walletAddress = solanaWallet && "address" in solanaWallet ? solanaWallet.address : null;

    const googleAccount = user.linked_accounts.find((a) => a.type === "google_oauth") as
      | { email?: string }
      | undefined;
    const emailAccount = user.linked_accounts.find((a) => a.type === "email") as
      | { address?: string }
      | undefined;
    const email = googleAccount?.email ?? emailAccount?.address ?? null;

    await getSupabase()
      .from("users")
      .upsert(
        { privy_id: privyId, wallet_address: walletAddress, email },
        { onConflict: "privy_id" }
      );

    return Response.json({ walletAddress });
  } catch (err) {
    console.error("upsert error", err);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
