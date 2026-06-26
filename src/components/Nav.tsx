"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";

function truncate(addr: string) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export function Nav() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const solWallet = wallets.find((w) => w.walletClientType === "privy");

  function copy() {
    if (!solWallet) return;
    navigator.clipboard.writeText(solWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-chad-border bg-chad-bg/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-dark.png" alt="ChadWallet" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-lg tracking-tight">ChadWallet</span>
        </Link>

        {/* Center links — landing page only */}
        {isLanding && (
          <div className="hidden md:flex items-center gap-6 text-sm text-chad-muted">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {!ready ? (
            <div className="h-8 w-20 rounded-lg bg-chad-card animate-pulse" />
          ) : authenticated && solWallet ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-chad-border bg-chad-card text-sm hover:border-chad-accent/50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-chad-green" />
                {truncate(solWallet.address)}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-chad-border bg-chad-card shadow-xl text-sm overflow-hidden">
                  <button onClick={copy} className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors">
                    {copied ? "Copied!" : "Copy address"}
                  </button>
                  <button onClick={() => logout()} className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-chad-red transition-colors">
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : isLanding ? (
            <button
              onClick={login}
              className="px-4 py-1.5 rounded-full border border-chad-border bg-chad-card text-sm hover:border-chad-accent/50 transition-colors"
            >
              Sign in
            </button>
          ) : null}

          {isLanding && (
            <a
              href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-chad-bg bg-chad-gradient hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #3DD6F5, #56C7B0)" }}
            >
              Get the app
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
