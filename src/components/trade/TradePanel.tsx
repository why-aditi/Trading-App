"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
// ponytail: Privy v3 Solana signing — useWallets + useSignTransaction from /solana subpath
import { useWallets, useSignTransaction } from "@privy-io/react-auth/solana";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { useJupiterQuote } from "@/hooks/useJupiterQuote";
import { useWalletBalances } from "@/hooks/useWalletBalances";

const SOL_MINT = "So11111111111111111111111111111111111111112";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

interface Props {
  mint: string;
  side: "buy" | "sell";
  setSide: (s: "buy" | "sell") => void;
  amount: string;
  setAmount: (a: string) => void;
  onSwapSuccess: () => void;
}

export function TradePanel({ mint, side, setSide, amount, setAmount, onSwapSuccess }: Props) {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const { signTransaction } = useSignTransaction();
  const [swapping, setSwapping] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const solWallet = wallets[0] ?? null;
  const walletAddress = solWallet?.address ?? null;

  const { sol, token } = useWalletBalances(walletAddress, mint, refreshKey);

  const inputMint = side === "buy" ? SOL_MINT : mint === SOL_MINT ? USDC_MINT : mint;
  const outputMint = side === "buy" ? (mint === SOL_MINT ? USDC_MINT : mint) : SOL_MINT;

  const { quote, loading: quoteLoading, error: quoteError } = useJupiterQuote(
    inputMint,
    outputMint,
    amount
  );

  async function executeSwap() {
    if (!solWallet || !quote) return;
    setSwapping(true);
    setSwapError(null);
    setTxSig(null);

    try {
      // 1. Build tx server-side via Jupiter
      const { swapTransaction, error: buildErr } = await fetch("/api/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteResponse: quote, userPublicKey: solWallet.address }),
      }).then((r) => r.json());

      if (buildErr) throw new Error(buildErr);

      const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
      if (!rpcUrl) throw new Error("RPC URL not configured");

      // 2. Sign via Privy (no UI prompt for embedded wallets)
      const txBytes = Buffer.from(swapTransaction, "base64");
      const { signedTransaction } = await signTransaction({
        transaction: new Uint8Array(txBytes),
        wallet: solWallet,
      });

      // 3. Submit signed tx via Alchemy devnet RPC
      const connection = new Connection(rpcUrl, "confirmed");
      const sig = await connection.sendRawTransaction(signedTransaction, {
        skipPreflight: false,
        maxRetries: 3,
      });

      // 4. Confirm
      await connection.confirmTransaction(sig, "confirmed");

      setTxSig(sig);
      setAmount("");
      setRefreshKey((k) => k + 1);
      onSwapSuccess();
    } catch (err) {
      setSwapError(err instanceof Error ? err.message : "Swap failed");
    } finally {
      setSwapping(false);
    }
  }

  function fmtOut(raw: string | undefined) {
    if (!raw) return "—";
    return (Number(raw) / 1e9).toFixed(6);
  }

  if (!ready) return <div className="p-4 h-full animate-pulse bg-chad-card" />;

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
        <p className="text-chad-muted text-sm">Sign in to start trading</p>
        <button
          onClick={login}
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-chad-bg"
          style={{ background: "linear-gradient(135deg, #3DD6F5, #56C7B0)" }}
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 px-3 py-2 text-xs text-yellow-400">
        ⚠ Solana devnet — test only, no real funds
      </div>

      {/* Buy / Sell toggle */}
      <div className="flex rounded-xl overflow-hidden border border-chad-border">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 text-sm font-bold transition-colors ${
            side === "buy" ? "bg-chad-green text-white" : "text-chad-muted hover:text-white"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 text-sm font-bold transition-colors ${
            side === "sell" ? "bg-chad-red text-white" : "text-chad-muted hover:text-white"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Amount */}
      <div className="space-y-1">
        <label className="text-xs text-chad-muted">
          Amount ({side === "buy" ? "SOL" : "tokens"})
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-chad-card border border-chad-border rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-chad-accent"
        />
      </div>

      {/* Quote */}
      <div className="bg-chad-card rounded-xl border border-chad-border p-3 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-chad-muted">You receive</span>
          <span className="font-mono font-semibold">
            {quoteLoading ? "…" : fmtOut(quote?.outAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-chad-muted">Price impact</span>
          <span
            className={`font-semibold ${
              parseFloat(quote?.priceImpactPct ?? "0") > 3 ? "text-chad-red" : "text-chad-green"
            }`}
          >
            {quoteLoading ? "…" : quote ? `${parseFloat(quote.priceImpactPct).toFixed(2)}%` : "—"}
          </span>
        </div>
        {quote?.routePlan?.[0] && (
          <div className="flex justify-between">
            <span className="text-chad-muted">Route</span>
            <span className="text-chad-muted">{quote.routePlan[0].swapInfo.label}</span>
          </div>
        )}
        {quoteError && <div className="text-chad-red">{quoteError}</div>}
      </div>

      {/* Execute */}
      <button
        onClick={executeSwap}
        disabled={swapping || !quote || !!quoteError}
        className="w-full py-3 rounded-xl text-sm font-bold disabled:opacity-40 transition-opacity text-chad-bg"
        style={{ background: side === "buy" ? "#22C55E" : "#EF4444" }}
      >
        {swapping ? "Confirming…" : `${side === "buy" ? "Buy" : "Sell"} now`}
      </button>

      {swapError && (
        <div className="rounded-xl bg-chad-red/10 border border-chad-red/30 px-3 py-2 text-xs text-chad-red">
          {swapError}
        </div>
      )}

      {txSig && (
        <div className="rounded-xl bg-chad-green/10 border border-chad-green/30 px-3 py-2 text-xs text-chad-green">
          ✓ Confirmed:{" "}
          <a
            href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {txSig.slice(0, 8)}…
          </a>
        </div>
      )}

      {/* Positions */}
      <div className="mt-auto border-t border-chad-border pt-4 space-y-2">
        <p className="text-xs font-semibold text-chad-muted uppercase tracking-wider">Your position</p>
        <div className="flex justify-between text-sm">
          <span className="text-chad-muted">SOL balance</span>
          <span className="font-mono font-semibold">{sol.toFixed(4)} SOL</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-chad-muted">Token balance</span>
          <span className="font-mono font-semibold">{token.toLocaleString()}</span>
        </div>
        {walletAddress && (
          <div className="text-xs text-chad-muted truncate">
            {walletAddress.slice(0, 8)}…{walletAddress.slice(-6)}
          </div>
        )}
      </div>
    </div>
  );
}
