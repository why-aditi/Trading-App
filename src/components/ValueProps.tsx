import Image from "next/image";

/* ---------- feature cards backed by real app screenshots ---------- */

type Card = { label: string; title: string; src: string; alt: string };

const cards: Card[] = [
  { label: "LEADERBOARD", title: "become a legend, top the leaderboard", src: "/screens/kol.png", alt: "Trader leaderboard screen" },
  { label: "FEED", title: "discover and follow top traders", src: "/screens/discover.png", alt: "Discover feed of trending tokens" },
  { label: "ALERTS", title: "real-time alerts on what whales buy", src: "/screens/token.png", alt: "Token detail with live trades" },
  { label: "EASY ONBOARDING", title: "an account in an instant", src: "/screens/splash.png", alt: "Sign in screen" },
  { label: "ZERO COMPLEXITY", title: "search any solana token", src: "/screens/search.png", alt: "Token search screen" },
  { label: "ONE CLICK TO BUY", title: "fund with Apple Pay", src: "/screens/deposit.png", alt: "Deposit and fund screen" },
];

export function ValueProps() {
  return (
    <section id="features" className="relative overflow-hidden bg-chad-bg py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 starfield opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14">
          <h2 className="lower text-5xl font-black sm:text-6xl">never miss out again</h2>
          <p className="lower mt-3 text-xl text-chad-muted sm:text-2xl">the only social-first trading app</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.label}
              className="group flex flex-col overflow-hidden rounded-3xl border border-chad-border bg-chad-card/60 p-7 backdrop-blur transition-colors hover:border-chad-accent/40"
            >
              <span className="font-mono text-xs font-semibold tracking-[0.18em] text-chad-accent">{c.label}</span>
              <h3 className="lower mt-4 text-2xl font-bold leading-tight text-white">{c.title}</h3>
              <div className="relative mt-8 h-72 overflow-hidden rounded-2xl border border-white/10 bg-chad-bg shadow-2xl">
                <Image
                  src={c.src}
                  alt={c.alt}
                  width={1242}
                  height={2688}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-t from-transparent to-chad-card" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-chad-card" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
