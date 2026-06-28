import Image from "next/image";

export function CrossDevice() {
  return (
    <section id="web" className="relative isolate overflow-hidden bg-chad-bg py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 starfield opacity-20" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, #6D5BFF 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-chad-accent">NOW AVAILABLE ON WEB</span>
          <h2 className="lower mt-4 text-4xl font-black sm:text-5xl">
            trade from anywhere. <span className="text-gradient">never lose a beat.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-chad-muted">
            Open a trade on your phone, close it on your desktop — all in one app.
          </p>
        </div>

        {/* Desktop browser frame + phone overlay */}
        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-chad-border bg-chad-card shadow-2xl ring-1 ring-chad-accent/10">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-chad-border bg-[#0d0d12] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <div className="ml-4 flex-1">
                <div className="mx-auto max-w-xs rounded-full bg-chad-bg px-4 py-1 text-center text-xs text-chad-muted">
                  app.chadwallet.xyz
                </div>
              </div>
            </div>
            <div className="aspect-[2/1] w-full overflow-hidden">
              <Image
                src="/flow/buy-sell.png"
                alt="ChadWallet on the web"
                width={3840}
                height={2160}
                className="h-full w-full object-cover object-bottom"
              />
            </div>
          </div>

          {/* Phone overlay */}
          <div className="absolute -bottom-8 -right-2 hidden w-32 overflow-hidden rounded-[1.75rem] border-[5px] border-white/10 bg-black shadow-2xl ring-1 ring-chad-accent/25 sm:block sm:w-40">
            <div className="aspect-[9/16] w-full overflow-hidden">
              <Image
                src="/screens/token.png"
                alt="ChadWallet on mobile"
                width={1242}
                height={2688}
                className="h-full w-full object-cover object-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
