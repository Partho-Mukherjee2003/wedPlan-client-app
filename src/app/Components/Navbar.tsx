"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type IconProps = { className?: string };

const links = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
];

/* Simple 5-petal flower. Color comes from the parent's text color. */
function Flower({ className = "" }: IconProps) {
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
      <circle cx="20" cy="20" r="4.5" fill="var(--gold)" />
    </svg>
  );
}

/* Small leaf used in decorations */
function Leaf({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M2 22C2 10 10 2 22 2c0 12-8 20-20 20z" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href
        ? "text-[var(--primary)]"
        : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-main)]">
      {/* Decorative flowers (desktop only, very soft) */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
        <Flower className="absolute -left-4 -top-5 h-16 w-16 rotate-12 text-[var(--primary-light)]" />
        <Leaf className="absolute left-12 top-6 h-5 w-5 rotate-45 text-[var(--primary-bg)]" />
        <Flower className="absolute -right-3 -bottom-6 h-16 w-16 -rotate-12 text-[var(--primary-light)]" />
        <Leaf className="absolute right-14 top-1 h-5 w-5 -rotate-12 text-[var(--primary-bg)]" />
      </div>

      <nav className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-bg)] ring-1 ring-[var(--border)]">
            <Flower className="h-6 w-6 text-[var(--primary)]" />
          </span>
          <span className="font-serif text-2xl font-semibold tracking-wide text-[var(--text-primary)]">
            Wed<span className="text-[var(--primary)]">Plan</span>
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}

          <span className="h-5 w-px bg-[var(--gold)] opacity-50" />

          <Link href="/sign-in" className={linkClass("/sign-in")}>
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)]"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)] transition-colors hover:bg-[var(--primary-bg)] md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg-soft)] md:hidden">
          <Flower className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rotate-12 text-[var(--primary-light)]" />

          <div className="relative flex flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 ${linkClass(l.href)} hover:bg-[var(--primary-bg)]`}
              >
                {l.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-[var(--gold)] opacity-40" />

            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--primary-bg)] hover:text-[var(--primary)]"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-[var(--primary)] px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
