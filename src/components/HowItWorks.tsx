const steps = [
  {
    num: "01",
    title: "sign in",
    desc: "Tap Sign in with Apple or Google. We create a Solana wallet for you automatically — no seed phrase required.",
  },
  {
    num: "02",
    title: "fund your wallet",
    desc: "Send SOL to your new address, or top up with Apple Pay through the in-app deposit flow.",
  },
  {
    num: "03",
    title: "trade",
    desc: "Tap any trending token to open the trade screen. Review the Jupiter quote and buy in one tap.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-chad-bg py-20 sm:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #3DD6F5 0%, transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-chad-accent">ZERO COMPLEXITY</span>
          <h2 className="lower mt-4 text-4xl font-black sm:text-5xl">
            three steps to your first trade
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative rounded-3xl border border-chad-border bg-chad-card/60 p-7 backdrop-blur transition-colors hover:border-chad-accent/40"
            >
              <div className="text-gradient mb-4 text-5xl font-black">{s.num}</div>
              <h3 className="lower mb-2 text-xl font-bold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-chad-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
