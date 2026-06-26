/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.birdeye.so" },
      { protocol: "https", hostname: "**.solana.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "arweave.net" },
      { protocol: "https", hostname: "**.arweave.net" },
      { protocol: "https", hostname: "**.ipfs.io" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "bafybei*.ipfs.dweb.link" },
    ],
  },
  webpack(config) {
    // ponytail: stub optional Privy peer deps we don't use (fiat on-ramp, farcaster, solana memo)
    config.resolve.alias = {
      ...config.resolve.alias,
      "@stripe/crypto": false,
      "@farcaster/mini-app-solana": false,
      "@solana-program/memo": false,
    };
    return config;
  },
};

export default nextConfig;
