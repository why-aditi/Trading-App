const steps = [
  {
    num: "01",
    title: "Sign in",
    desc: "Tap Sign in with Apple or Google. We create a Solana wallet for you automatically — no seed phrase required.",
  },
  {
    num: "02",
    title: "Fund your wallet",
    desc: "Send SOL to your new wallet address, or use the in-app deposit flow to fund with fiat via the mobile app.",
  },
  {
    num: "03",
    title: "Trade",
    desc: "Tap any trending token to open the trade screen. Review the Jupiter quote and buy in one tap.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-chad-card">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-black text-center mb-12">
          Three steps to your first trade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.num} className="relative flex flex-col items-center text-center md:items-start md:text-left">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-full w-full h-px bg-gradient-to-r from-chad-accent/40 to-transparent -translate-x-4" />
              )}
              <div
                className="text-4xl font-black mb-4 text-gradient"
              >
                {s.num}
              </div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-chad-muted text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
