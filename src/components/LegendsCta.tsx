"use client";

const IOS = "https://apps.apple.com/us/app/chadwallet/id6757367474";

export function LegendsCta() {
  return (
    <section className="relative isolate overflow-hidden space-bg py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 starfield opacity-50" />

      {/* Orbital rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-spin-slow h-[640px] w-[640px] rounded-full border border-white/5" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[440px] w-[440px] rounded-full border border-chad-accent/10" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-pulse-glow"
        style={{ background: "radial-gradient(circle, rgba(61,214,245,0.35) 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <span className="text-xs font-semibold tracking-[0.2em] text-chad-accent">JOIN THE FAMILY</span>
        <h2 className="lower mt-5 text-4xl font-black leading-[0.95] sm:text-6xl">
          a trading app for{" "}
          <span className="text-gradient">the rest of us</span>
        </h2>
        <p className="mt-5 max-w-md text-lg text-chad-muted">
          Thousands of traders are already making their name on ChadWallet. Your turn.
        </p>
        <a
          href={IOS}
          target="_blank"
          rel="noopener noreferrer"
          className="glow-accent mt-9 inline-flex items-center gap-2 rounded-full px-9 py-3.5 text-base font-bold text-chad-bg transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #3DD6F5, #56C7B0)" }}
        >
          Download app
        </a>
      </div>
    </section>
  );
}
