const cards = [
  {
    icon: "⚡",
    title: "Instant one-tap buys",
    desc: "See a trending token, buy it in seconds. No multi-step wallet flows, no confirmations hell.",
  },
  {
    icon: "🔑",
    title: "Own your keys",
    desc: "Your wallet lives inside the app — non-custodial, secured by your Apple or Google account.",
  },
  {
    icon: "📈",
    title: "Trending alpha",
    desc: "Live volume-ranked tokens from BirdEye, refreshed every 45 seconds so you never miss a move.",
  },
  {
    icon: "💸",
    title: "Low fees, best routes",
    desc: "Swaps routed through Jupiter for the best on-chain price with minimal slippage.",
  },
];

export function ValueProps() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-chad-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-black text-center mb-12">
          Built for the <span className="text-gradient">FOMO trader</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div
              key={c.title}
              className="p-6 rounded-2xl border border-chad-border bg-chad-card hover:border-chad-accent/40 transition-colors"
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-white mb-2">{c.title}</h3>
              <p className="text-chad-muted text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
