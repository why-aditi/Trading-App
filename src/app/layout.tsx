import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ChadPrivyProvider } from "@/lib/privy-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://chadwallet.xyz"),
  title: "ChadWallet — Find the next 100x memecoins",
  description:
    "Buy trending Solana tokens in one tap. Sign in with Apple or Google — no seed phrase, no hassle.",
  icons: { icon: "/logo-dark.png" },
  openGraph: {
    title: "ChadWallet",
    description: "Find the next 100x memecoins here.",
    images: ["/logo-dark.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-chad-bg text-white">
        <ChadPrivyProvider>{children}</ChadPrivyProvider>
      </body>
    </html>
  );
}
