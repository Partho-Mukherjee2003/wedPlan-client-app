"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client"; // change if your path is different
import Image from "next/image";
type IconProps = { className?: string };

const links = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
];

const dropdownLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile Settings", href: "/profile" },
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

/* Profile image, or the first letter of the name if there is no image */
/* Border color = footer dark color (#241A17) */
function Avatar({ name, image }: { name: string; image?: string | null }) {
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <Image
        width={36}
        height={36}
        src={image}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-[#241A17]"
      />
    );
  }

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white ring-2 ring-[#241A17]">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Better Auth: updates automatically when the user signs in or out
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Close the profile dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message ?? "Logout failed. Please try again.");
        return;
      }

      toast.success("Logged out successfully. See you soon 💍");
      setProfileOpen(false);
      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not connect to the authentication server.");
    }
  };

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
          onClick={() => setMenuOpen(false)}
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

          {/* Loading placeholder, so buttons don't flash */}
          {isPending && (
            <span className="h-9 w-9 animate-pulse rounded-full bg-[var(--primary-light)]" />
          )}

          {/* Public: not logged in */}
          {!isPending && !user && (
            <>
              <Link href="/sign-in" className={linkClass("/sign-in")}>
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)]"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Authenticated: profile dropdown */}
          {!isPending && user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                className="rounded-full transition-opacity hover:opacity-80"
              >
                <Avatar name={user.name} image={user.image} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
                  {/* User info */}
                  <div className="flex items-center gap-3 bg-[var(--primary-bg)] px-4 py-4">
                    <Avatar name={user.name} image={user.image} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[var(--text-muted)]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="p-2">
                    {dropdownLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setProfileOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--primary-bg)] hover:text-[var(--primary)]"
                      >
                        {l.label}
                      </Link>
                    ))}

                    <div className="my-1 h-px bg-[var(--border)]" />

                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary-bg)]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
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
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg-soft)] md:hidden">
          <Flower className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rotate-12 text-[var(--primary-light)]" />

          <div className="relative flex flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 ${linkClass(l.href)} hover:bg-[var(--primary-bg)]`}
              >
                {l.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-[var(--gold)] opacity-40" />

            {/* Public: not logged in */}
            {!isPending && !user && (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--primary-bg)] hover:text-[var(--primary)]"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 rounded-full bg-[var(--primary)] px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)]"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Authenticated */}
            {!isPending && user && (
              <>
                <div className="mb-1 flex items-center gap-3 rounded-xl bg-[var(--primary-bg)] px-3 py-3">
                  <Avatar name={user.name} image={user.image} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[var(--text-muted)]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {dropdownLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--primary-bg)] hover:text-[var(--primary)]"
                  >
                    {l.label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="mt-1 rounded-full border border-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
