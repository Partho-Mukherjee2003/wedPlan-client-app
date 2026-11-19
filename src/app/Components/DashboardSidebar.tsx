"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";
import Image from "next/image";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "vendor" | "customer";
  subscriptionPlan: "free" | "premium";
};

const menus: Record<string, { name: string; href: string }[]> = {
  vendor: [
    { name: "Overview", href: "/dashboard/vendor" },
    { name: "Add Service", href: "/dashboard/vendor/add-service" },
    { name: "My Services", href: "/dashboard/vendor/my-services" },
    { name: "Booking Requests", href: "/dashboard/vendor/bookings" },
    { name: "Subscription", href: "/dashboard/vendor/subscription" },
    { name: "Profile Settings", href: "/profile" },
  ],
  customer: [
    { name: "Overview", href: "/dashboard/customer" },
    { name: "My Bookings", href: "/dashboard/customer/bookings" },
    { name: "Profile Settings", href: "/profile" },
  ],
  admin: [
    { name: "Overview", href: "/dashboard/admin" },
    { name: "Manage Users", href: "/dashboard/admin/users" },
    { name: "Manage Services", href: "/dashboard/admin/services" },
    { name: "Transactions", href: "/dashboard/admin/transactions" },
    { name: "Profile Settings", href: "/profile" },
  ],
};

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDECEA] text-[#C75B5B]">
        <svg viewBox="0 0 40 40" className="h-6 w-6" aria-hidden="true">
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
      </span>
      <span className="font-serif text-2xl font-bold text-[#241A17]">
        Wed<span className="text-[#C75B5B]">Plan</span>
      </span>
    </Link>
  );
}

export default function DashboardSidebar({ user }: { user: UserType }) {
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = menus[user.role] || menus.customer;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  const navLinks = menuItems.map((item) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={
          isActive
            ? "rounded-xl bg-[#C75B5B] px-4 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(199,91,91,0.25)]"
            : "rounded-xl px-4 py-3 text-sm font-medium text-[#6F5E56] transition hover:bg-[#FDECEA] hover:text-[#C75B5B]"
        }
      >
        {item.name}
      </Link>
    );
  });

  const profileCard = (
    <div className="flex items-center gap-3 rounded-2xl bg-[#FFF9F5] p-3 ring-1 ring-[#F0DCD5]">
      <Image
        width={48}
        height={48}
        src={user.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
        alt={user.name}
        className="h-12 w-12 rounded-full object-cover ring-2 ring-[#F0DCD5]"
      />
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#241A17]">{user.name}</p>
        <p className="text-xs capitalize text-[#A08D84]">
          {user.role} • {user.subscriptionPlan} Plan
        </p>
      </div>
    </div>
  );

  const logoutButton = (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full rounded-xl bg-[#FDECEC] px-4 py-3 text-left text-sm font-semibold text-[#DC2626] transition hover:bg-[#FBD5D5] disabled:opacity-70"
    >
      {isLoggingOut ? "Logging out..." : "⏻ Logout"}
    </button>
  );

  return (
    <>
      {/* Mobile top bar - logo + menu button */}
      <div className="sticky top-0 z-40 border-b border-[#F0DCD5] bg-white/95 p-4 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <Logo />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full bg-[#FDECEA] px-4 py-2 text-sm font-semibold text-[#C75B5B]"
          >
            {isOpen ? "Close ✕" : "Menu ☰"}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-col gap-3">
                {profileCard}
                <nav className="flex flex-col gap-1">{navLinks}</nav>
                <div className="border-t border-[#F7E8E2] pt-3">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="mb-2 block rounded-xl px-4 py-3 text-sm font-medium text-[#6F5E56] transition hover:bg-[#FFF9F5] hover:text-[#C75B5B]"
                  >
                    ← Back to Home
                  </Link>
                  {logoutButton}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop sidebar - logo, profile, links, logout niche */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-[#F0DCD5] bg-white p-5 md:flex">
        <Logo />

        <div className="mt-6">{profileCard}</div>

        <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto">
          {navLinks}
        </nav>

        <div className="border-t border-[#F7E8E2] pt-4">
          <Link
            href="/"
            className="mb-2 block rounded-xl px-4 py-3 text-sm font-medium text-[#6F5E56] transition hover:bg-[#FFF9F5] hover:text-[#C75B5B]"
          >
            ← Back to Home
          </Link>
          {logoutButton}
        </div>
      </aside>
    </>
  );
}
