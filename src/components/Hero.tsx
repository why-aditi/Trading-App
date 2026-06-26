"use client";

import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";

const ANDROID = "https://play.google.com/store/apps/details?id=xyz.chadwallet.www";
const IOS = "https://apps.apple.com/us/app/chadwallet/id6757367474";

export function Hero() {
  const { ready, authenticated, login } = usePrivy();

  return (
    <section className="relative overflow-hidden bg-chad-bg">
      {/* Gradient orb */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #3DD6F5 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12">
        {/* Text + CTAs */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-chad-accent/30 bg-chad-accent/10 text-chad-accent text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-chad-accent animate-pulse" />
            Live on Solana
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
            Find the next{" "}
            <span className="text-gradient">100x memecoins</span>
            {" "}here
          </h1>

          <p className="text-chad-muted text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
            Buy trending Solana tokens in one tap. Sign in with Apple or Google — no seed phrase,
            no wallet setup, no hassle.
          </p>

          {/* Store badges */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
            <a
              href={IOS}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on App Store
            </a>
            <a
              href={ANDROID}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl border border-chad-border bg-chad-card text-white font-semibold hover:border-chad-accent/50 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M3.18 23.76c.3.17.64.22.97.14l.08-.05 9.33-9.33-2.12-2.12-8.26 8.26v-.01c-.34.34-.46.84-.3 1.31.07.21.18.4.3.8zm16.64-12.69l-2.48-1.44-2.37 2.37 2.37 2.37 2.5-1.45c.71-.41.71-1.43-.02-1.85zM2.09 1.13c-.27.28-.4.68-.4 1.12v19.5c0 .44.13.84.4 1.12l.06.06 10.92-10.92v-.26L2.15 1.07l-.06.06zm13.87 8.78L5.68 1.63l-.07-.07c-.46-.27-1.02-.25-1.46.04l10.82 10.82 1.33-1.33-1.34-1.18z" />
              </svg>
              Get it on Google Play
            </a>
          </div>

          {/* Sign in entry */}
          {!authenticated && (
            <div className="flex flex-col items-center lg:items-start gap-2">
              <p className="text-chad-muted text-sm">Or trade on web</p>
              <button
                onClick={login}
                disabled={!ready}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-chad-bg transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #3DD6F5, #56C7B0)" }}
              >
                Sign in with Google
              </button>
            </div>
          )}
        </div>

        {/* Phone mockup */}
        <div className="relative flex-shrink-0 w-64 sm:w-72 lg:w-80">
          <div
            className="absolute inset-0 rounded-3xl opacity-30 blur-2xl"
            style={{ background: "linear-gradient(135deg, #3DD6F5, #56C7B0)" }}
          />
          <Image
            src="/phone-discover.png"
            alt="ChadWallet app"
            width={320}
            height={650}
            className="relative rounded-3xl shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
