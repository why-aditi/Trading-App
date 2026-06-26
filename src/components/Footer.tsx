import Image from "next/image";
import Link from "next/link";

const ANDROID = "https://play.google.com/store/apps/details?id=xyz.chadwallet.www";
const IOS = "https://apps.apple.com/us/app/chadwallet/id6757367474";

export function Footer() {
  return (
    <footer className="border-t border-chad-border bg-chad-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo-dark.png" alt="ChadWallet" width={28} height={28} className="rounded-lg" />
              <span className="font-bold">ChadWallet</span>
            </div>
            <p className="text-chad-muted text-sm leading-relaxed">
              The fastest way to trade trending Solana tokens. Never miss the next breakout.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-chad-muted">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Get the app */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Download</h4>
            <div className="flex flex-col gap-2">
              <a
                href={IOS}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-chad-muted hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store (iOS)
              </a>
              <a
                href={ANDROID}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-chad-muted hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.64.22.97.14l.08-.05 9.33-9.33-2.12-2.12-8.26 8.26v-.01c-.34.34-.46.84-.3 1.31.07.21.18.4.3.8zm16.64-12.69l-2.48-1.44-2.37 2.37 2.37 2.37 2.5-1.45c.71-.41.71-1.43-.02-1.85zM2.09 1.13c-.27.28-.4.68-.4 1.12v19.5c0 .44.13.84.4 1.12l.06.06 10.92-10.92v-.26L2.15 1.07l-.06.06zm13.87 8.78L5.68 1.63l-.07-.07c-.46-.27-1.02-.25-1.46.04l10.82 10.82 1.33-1.33-1.34-1.18z" />
                </svg>
                Google Play (Android)
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-chad-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-chad-muted">
          <p>© {new Date().getFullYear()} ChadWallet. All rights reserved.</p>
          <p className="text-center max-w-md">
            ⚠️ Crypto trading involves significant risk. Token prices are highly volatile. Never invest more than you can afford to lose. ChadWallet is non-custodial — you are responsible for your keys and funds.
          </p>
        </div>
      </div>
    </footer>
  );
}
