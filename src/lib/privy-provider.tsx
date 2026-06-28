"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function ChadPrivyProvider({ children }: { children: React.ReactNode }) {
  // ponytail: guard — Privy throws at init without a valid app ID (fails next build with no .env)
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) return <>{children}</>;

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["google"],
        embeddedWallets: {
          solana: { createOnLogin: "users-without-wallets" },
          ethereum: { createOnLogin: "off" },
        },
        appearance: {
          theme: "dark",
          accentColor: "#6D5BFF",
          logo: "/logo-dark.png",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
