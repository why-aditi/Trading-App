import Image from "next/image";
import Link from "next/link";

const ANDROID = "https://play.google.com/store/apps/details?id=xyz.chadwallet.www";
const IOS = "https://apps.apple.com/us/app/chadwallet/id6757367474";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#05060d]">
      <div className="pointer-events-none absolute inset-0 starfield opacity-25" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo-dark.png" alt="ChadWallet" width={28} height={28} className="rounded-lg" />
              <span className="lower font-black">chadwallet</span>
            </div>
            <p className="lower text-chad-muted text-sm leading-relaxed">
              where degens become legends.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-[0.18em] text-chad-muted">PRODUCT</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="#web" className="hover:text-chad-accent transition-colors">Web app</Link></li>
              <li><Link href="#features" className="hover:text-chad-accent transition-colors">Features</Link></li>
              <li><Link href="#faq" className="hover:text-chad-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Download */}
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-[0.18em] text-chad-muted">DOWNLOAD</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href={IOS} target="_blank" rel="noopener noreferrer" className="hover:text-chad-accent transition-colors">App Store</a></li>
              <li><a href={ANDROID} target="_blank" rel="noopener noreferrer" className="hover:text-chad-accent transition-colors">Google Play</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-[0.18em] text-chad-muted">LEGAL</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="#" className="hover:text-chad-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-chad-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-chad-muted sm:flex-row">
          <p>© {new Date().getFullYear()} ChadWallet. All rights reserved.</p>
          <p className="max-w-md text-center sm:text-right">
            Crypto trading carries significant risk. Prices are volatile — never invest more than you can afford to lose. ChadWallet is non-custodial.
          </p>
        </div>
      </div>
    </footer>
  );
}
