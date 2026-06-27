"use client";

import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";

const ANDROID = "https://play.google.com/store/apps/details?id=xyz.chadwallet.www";
const IOS = "https://apps.apple.com/us/app/chadwallet/id6757367474";

export function Hero() {
  const { ready, authenticated, login } = usePrivy();

  return (
    <section className="relative isolate overflow-hidden space-bg">
      {/* Starfield + orbital glow layers */}
      <div className="pointer-events-none absolute inset-0 starfield opacity-60" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[760px] h-[760px] rounded-full blur-3xl animate-pulse-glow"
        style={{ background: "radial-gradient(circle, rgba(61,214,245,0.45) 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-chad-accent/30 bg-chad-accent/10 text-chad-accent text-xs font-semibold mb-8 backdrop-blur">
          <span className="w-1.5 h-1.5 rounded-full bg-chad-accent animate-pulse" />
          now live on Solana
        </div>

        {/* Headline */}
        <h1 className="lower text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-5 max-w-4xl">
          where degens become{" "}
          <span className="text-gradient">legends.</span>
        </h1>

        <p className="text-chad-muted text-lg sm:text-xl mb-10 max-w-xl">
          From memecoins to the next 100x, trade any Solana token in seconds.
          Sign in with Apple or Google — no seed phrase, no hassle.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <a
            href={IOS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-chad-bg glow-accent hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #3DD6F5, #56C7B0)" }}
          >
            Download app
          </a>
          {!authenticated && (
            <button
              onClick={login}
              disabled={!ready}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold text-white border border-white/15 bg-white/5 backdrop-blur hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Trade on web
            </button>
          )}
        </div>

        {/* Store row */}
        <div className="flex items-center gap-5 text-chad-muted text-sm mb-16">
          <a href={IOS} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            App Store
          </a>
          <span className="w-px h-4 bg-white/15" />
          <a href={ANDROID} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M3.18 23.76c.3.17.64.22.97.14l.08-.05 9.33-9.33-2.12-2.12-8.26 8.26v-.01c-.34.34-.46.84-.3 1.31.07.21.18.4.3.8zm16.64-12.69l-2.48-1.44-2.37 2.37 2.37 2.37 2.5-1.45c.71-.41.71-1.43-.02-1.85zM2.09 1.13c-.27.28-.4.68-.4 1.12v19.5c0 .44.13.84.4 1.12l.06.06 10.92-10.92v-.26L2.15 1.07l-.06.06zm13.87 8.78L5.68 1.63l-.07-.07c-.46-.27-1.02-.25-1.46.04l10.82 10.82 1.33-1.33-1.34-1.18z" />
            </svg>
            Google Play
          </a>
        </div>

        {/* Floating phone trio */}
        <div className="relative flex items-end justify-center gap-0 sm:gap-4">
          <div
            className="pointer-events-none absolute inset-x-0 -top-10 mx-auto w-[420px] h-[420px] rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(circle, #56C7B0 0%, transparent 65%)" }}
          />
          <div className="hidden sm:block relative w-40 lg:w-48 translate-y-6 opacity-90">
            <Image src="/screens/portfolio.png" alt="Portfolio" width={240} height={520} className="rounded-[2rem] border border-white/10 shadow-2xl" />
          </div>
          <div className="relative w-56 lg:w-64 z-10 animate-float">
            <Image src="/screens/discover.png" alt="Discover trending tokens" width={320} height={690} className="rounded-[2.2rem] border border-white/10 shadow-2xl" priority />
          </div>
          <div className="hidden sm:block relative w-40 lg:w-48 translate-y-6 opacity-90">
            <Image src="/screens/token.png" alt="Token detail" width={240} height={520} className="rounded-[2rem] border border-white/10 shadow-2xl" />
          </div>
        </div>
      </div>

      {/* Fade into next section */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-chad-bg" />
    </section>
  );
}
