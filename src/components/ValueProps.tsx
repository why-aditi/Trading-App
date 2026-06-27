/* ---------- mini UI mockups (pure markup, no external images) ---------- */

function LeaderboardMock() {
  const rows = [
    { rank: 1, name: "chadlord", handle: "@chadlord", pnl: "+$1,726,513", medal: "#F5C542" },
    { rank: 2, name: "frank", handle: "@frankdegen", pnl: "+$1,236,362", medal: "#C0C7D1" },
    { rank: 3, name: "logjam", handle: "@_logjam", pnl: "+$810,605", medal: "#CD7F4B" },
    { rank: 4, name: "irulan", handle: "@corrino", pnl: "+$685,392", medal: "" },
  ];
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.rank} className={`flex items-center gap-3 ${r.rank === 4 ? "opacity-40" : ""}`}>
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-chad-bg"
            style={{ background: r.medal || "#27272A", color: r.medal ? "#0a0a0a" : "#A1A1AA" }}
          >
            {r.rank}
          </span>
          <span className="h-8 w-8 shrink-0 rounded-full bg-chad-gradient" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{r.name}</p>
            <p className="truncate text-xs text-chad-muted">{r.handle}</p>
          </div>
          <span className="text-sm font-semibold text-chad-green">{r.pnl}</span>
        </div>
      ))}
    </div>
  );
}

function FeedMock() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-chad-border bg-chad-bg/60 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-chad-gradient" />
          <span className="text-sm font-semibold text-white">remusofmars</span>
          <span className="rounded bg-chad-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-chad-accent">Thesis</span>
          <span className="ml-auto text-xs text-chad-muted">5m</span>
        </div>
        <p className="mb-3 text-sm text-white/90">we&apos;re so back</p>
        <div className="flex items-center justify-between rounded-xl border border-chad-border bg-chad-card px-3 py-2">
          <span className="text-xs text-chad-muted">Position</span>
          <span className="text-sm font-semibold text-white">$242.6K</span>
          <span className="text-xs font-semibold text-chad-green">+$23.2K</span>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-2xl border border-chad-border bg-chad-bg/60 px-4 py-3">
        <span className="h-7 w-7 rounded-full bg-chad-gradient" />
        <span className="text-sm font-semibold text-white">collectible</span>
        <span className="rounded bg-chad-green/15 px-1.5 py-0.5 text-[10px] font-semibold text-chad-green">Buy</span>
        <span className="ml-auto text-xs text-chad-muted">PENGU $34.3K</span>
      </div>
    </div>
  );
}

function AlertMock() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-chad-border bg-chad-bg/70 p-4 shadow-2xl">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-chad-gradient text-sm font-black text-chad-bg">C</span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">DOGE is up 5.98%</p>
          <span className="text-xs text-chad-muted">9:41 AM</span>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-chad-muted">
          <span className="h-2 w-2 rounded-full bg-chad-green" />
          50 top traders bought $88,203.12
        </p>
      </div>
    </div>
  );
}

function OnboardingMock() {
  return (
    <div className="space-y-2.5">
      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
        Continue with Apple
      </button>
      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-chad-border bg-chad-bg px-4 py-2.5 text-sm font-semibold text-white">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-black">G</span>
        Continue with Google
      </button>
      <p className="pt-1 text-center text-xs text-chad-muted">No seed phrase. No extensions.</p>
    </div>
  );
}

function ChainsMock() {
  const chains = ["Solana", "Base", "BNB", "Monad"];
  return (
    <div className="flex flex-wrap gap-2">
      {chains.map((c, i) => (
        <span
          key={c}
          className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
            i === 0 ? "border-chad-accent/40 bg-chad-accent/10 text-chad-accent" : "border-chad-border bg-chad-bg text-chad-muted"
          }`}
        >
          {c}
        </span>
      ))}
      <span className="mt-1 w-full text-xs text-chad-muted">Gasless swaps routed through Jupiter.</span>
    </div>
  );
}

function BuyMock() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-chad-border bg-chad-bg px-4 py-3">
        <span className="text-2xl font-black text-white">$100</span>
        <span className="text-xs text-chad-muted">Enter amount</span>
      </div>
      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
        Pay
      </button>
      <button className="w-full rounded-xl bg-chad-gradient px-4 py-2.5 text-sm font-bold text-chad-bg">Buy now</button>
    </div>
  );
}

/* ---------- card list ---------- */

type Card = { label: string; title: string; mock: React.ReactNode };

const cards: Card[] = [
  { label: "LEADERBOARD", title: "become a legend, top the leaderboard", mock: <LeaderboardMock /> },
  { label: "FEED", title: "discover and follow top traders", mock: <FeedMock /> },
  { label: "ALERTS", title: "real-time alerts on what whales buy", mock: <AlertMock /> },
  { label: "EASY ONBOARDING", title: "an account in an instant", mock: <OnboardingMock /> },
  { label: "ZERO COMPLEXITY", title: "multichain & gasless", mock: <ChainsMock /> },
  { label: "ONE CLICK TO BUY", title: "fund with Apple Pay", mock: <BuyMock /> },
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
              className="flex min-h-[440px] flex-col rounded-3xl border border-chad-border bg-chad-card/60 p-7 backdrop-blur transition-colors hover:border-chad-accent/40"
            >
              <span className="font-mono text-xs font-semibold tracking-[0.18em] text-chad-accent">{c.label}</span>
              <h3 className="lower mt-4 text-2xl font-bold leading-tight text-white">{c.title}</h3>
              <div className="mt-auto pt-8">{c.mock}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
