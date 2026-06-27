import { getTrendingTokens } from "@/lib/birdeye";
import { TokenBanner } from "@/components/TokenBanner";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { HowItWorks } from "@/components/HowItWorks";
import { TrendingGrid } from "@/components/TrendingGrid";
import { Faq } from "@/components/Faq";
import { LegendsCta } from "@/components/LegendsCta";
import { Footer } from "@/components/Footer";
import { AuthSync } from "@/components/AuthSync";

export default async function Home() {
  // Fetch once server-side — no HTTP round-trip, shared cache
  const tokens = await getTrendingTokens().catch(() => []);

  return (
    <>
      <AuthSync defaultMint={tokens[0]?.address} />
      <Nav />
      <TokenBanner tokens={tokens} />
      <Hero />
      <ValueProps />
      <HowItWorks />
      <TrendingGrid tokens={tokens} />
      <Faq />
      <LegendsCta />
      <Footer />
      <TokenBanner tokens={tokens} reverse offset={10} />
    </>
  );
}
