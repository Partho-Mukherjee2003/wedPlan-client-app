"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function DashboardSidebar({ user }: { user: UserType }) {
  const pathname = usePathname();
  const menuItems = menus[user.role] || menus.customer;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#F0DCD5] bg-white p-5 md:block">
      <div className="flex items-center gap-3">
        <img
          src={user.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
          alt={user.name}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-[#F0DCD5]"
        />
        <div>
          <p className="font-semibold text-[#241A17]">{user.name}</p>
          <p className="text-xs capitalize text-[#A08D84]">
            {user.role} • {user.subscriptionPlan} Plan
          </p>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "rounded-xl bg-[#FDECEA] px-4 py-3 text-sm font-semibold text-[#C75B5B]"
                  : "rounded-xl px-4 py-3 text-sm font-medium text-[#6F5E56] hover:bg-[#FFF9F5]"
              }
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
