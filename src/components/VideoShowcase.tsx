export function VideoShowcase() {
  return (
    <section className="relative isolate overflow-hidden space-bg py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 starfield opacity-30" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-pulse-glow"
        style={{ background: "radial-gradient(circle, rgba(61,214,245,0.30) 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 px-4 sm:px-6 md:flex-row md:justify-between md:gap-16">
        {/* Copy */}
        <div className="max-w-md text-center md:text-left">
          <span className="text-xs font-semibold tracking-[0.2em] text-chad-accent">SEE IT IN ACTION</span>
          <h2 className="lower mt-4 text-4xl font-black sm:text-5xl">
            from sign-in to your first trade
          </h2>
          <p className="mt-4 text-lg text-chad-muted">
            A real walkthrough of ChadWallet — no edits, no fluff.
          </p>
        </div>

        {/* Phone frame */}
        <div className="relative w-60 shrink-0 sm:w-72 rounded-[2.5rem] border-[6px] border-white/10 bg-black p-1 shadow-2xl ring-1 ring-chad-accent/20">
          <video
            className="h-auto w-full rounded-[2rem]"
            src="/video/chadwallet.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    </section>
  );
}
