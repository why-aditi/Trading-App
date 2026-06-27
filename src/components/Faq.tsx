"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Do I need a crypto wallet to get started?",
    a: "No. When you sign in with Apple or Google, ChadWallet automatically creates a Solana wallet for you. No seed phrase, no browser extension needed.",
  },
  {
    q: "Is ChadWallet custodial?",
    a: "No. Your private keys are secured inside your device via Privy's embedded wallet tech — ChadWallet never has access to your funds.",
  },
  {
    q: "Which tokens can I trade?",
    a: "Any Solana token with sufficient liquidity on Jupiter's aggregator. The trending list shows the highest-volume tokens updated every 45 seconds.",
  },
  {
    q: "What are the fees?",
    a: "ChadWallet charges a small platform fee on swaps. Jupiter's routing ensures you always get the best available on-chain price minus that fee.",
  },
  {
    q: "Is trading available on the web app?",
    a: "Yes — full web trading is coming. For now, sign in to reserve your wallet, and download the mobile app for the fastest trading experience.",
  },
  {
    q: "Which chains are supported?",
    a: "Solana is the primary chain for v1. Cross-chain support (Base, BNB, Monad) is planned for a future release.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-chad-bg">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="lower text-4xl sm:text-5xl font-black text-center mb-12">
          questions, answered
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-chad-border rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold hover:bg-white/5 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <span
                  className="ml-4 flex-shrink-0 text-chad-accent text-xl transition-transform duration-200"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0)" }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-chad-muted text-sm leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
