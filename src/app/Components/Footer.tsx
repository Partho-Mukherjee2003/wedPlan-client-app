import Link from "next/link";

// Simple flower for decoration
function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="20"
          cy="10"
          rx="6"
          ry="9"
          fill="currentColor"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="4.5" fill="#C9A86A" />
    </svg>
  );
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

const categories = [
  {
    label: "Photography & Videography",
    href: "/services?category=Photography & Videography",
  },
  { label: "Wedding Venues", href: "/services?category=Wedding Venues" },
  {
    label: "Decoration & Florist",
    href: "/services?category=Decoration & Florist",
  },
  { label: "Catering Services", href: "/services?category=Catering Services" },
  { label: "Makeup & Styling", href: "/services?category=Makeup & Styling" },
  { label: "Wedding Fashion", href: "/services?category=Wedding Fashion" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#241A17] text-[#FFF9F5]">
      {/* Top gold line */}
      <div className="h-1 bg-gradient-to-r from-[#C9A86A] via-[#C75B5B] to-[#C9A86A]" />

      {/* Soft flowers */}
      <Flower className="absolute -left-6 top-8 h-24 w-24 text-white/5" />
      <Flower className="absolute -right-6 bottom-20 h-28 w-28 text-white/5" />

      {/* Container */}
      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Logo + Description + Social */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDECEA] ring-1 ring-[#F0DCD5]">
                <Flower className="h-6 w-6 text-[#C75B5B]" />
              </span>
              <span className="font-serif text-2xl font-semibold tracking-wide">
                Wed<span className="text-[#C75B5B]">Plan</span>
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Your dream wedding, planned beautifully. Find trusted vendors,
              book venues and services, and celebrate your special day without
              any stress.
            </p>

            {/* Social Media */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition hover:bg-[#C75B5B] hover:text-white"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition hover:bg-[#C75B5B] hover:text-white"
              >
                ◎
              </a>
              <a
                href="https://x.com"
                target="_blank"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition hover:bg-[#C75B5B] hover:text-white"
              >
                𝕏
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition hover:bg-[#C75B5B] hover:text-white"
              >
                ▶
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">
              Quick Links
            </h3>
            <span className="mt-2 block h-0.5 w-10 bg-[#C9A86A]" />
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 transition hover:text-[#C75B5B]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Wedding Services */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">
              Wedding Services
            </h3>
            <span className="mt-2 block h-0.5 w-10 bg-[#C9A86A]" />
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="text-white/70 transition hover:text-[#C75B5B]"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact Information */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">
              Contact Us
            </h3>
            <span className="mt-2 block h-0.5 w-10 bg-[#C9A86A]" />
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>📍 Mirpur-13, Dhaka, Bangladesh</li>
              <li>📞 +880 1700-000000</li>
              <li>✉️ hello@wedplan.com</li>
              <li>🕙 Sat – Thu: 9:00 AM – 9:00 PM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar - Copyright */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-white/60 sm:flex-row sm:px-6 sm:text-left">
          <p>© 2026 WedPlan. All rights reserved.</p>
          <p>
            Made with <span className="text-[#C75B5B]">❤</span> in Bangladesh
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
