"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";

type BookingType = {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
};

export default function CustomerOverviewPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name;

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const res = await fetch(
          `${process.env.SERVER_URL || "http://localhost:5000"}/bookings?customerId=${userId}`,
        );
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load overview data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading...</p>
      </div>
    );
  }

  const cards = [
    { label: "Total Bookings", value: bookings.length, icon: "💍" },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: "⏳",
    },
    {
      label: "Accepted",
      value: bookings.filter((b) => b.status === "accepted").length,
      icon: "✅",
    },
    {
      label: "Rejected",
      value: bookings.filter((b) => b.status === "rejected").length,
      icon: "❌",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
          My <span className="italic text-[#C75B5B]">Overview</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">Welcome back, {userName}</p>
      </motion.div>

      {error && (
        <p className="mx-auto mt-5 max-w-xl rounded-xl bg-[#FDECEC] px-4 py-3 text-center text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="rounded-[24px] border border-[#F0DCD5] bg-white p-6 shadow-[0_8px_30px_rgba(90,40,30,0.06)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#A08D84]">{card.label}</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDECEA] text-lg">
                {card.icon}
              </span>
            </div>
            <p className="mt-3 font-serif text-4xl font-bold text-[#C75B5B]">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-[#241A17] p-6 text-white sm:p-8"
      >
        <div>
          <p className="font-serif text-2xl font-bold sm:text-3xl">
            Planning your dream wedding?
          </p>
          <p className="mt-1.5 text-sm text-white/70">
            Browse trusted vendors for venues, catering, photography and more.
          </p>
        </div>
        <Link
          href="/services"
          className="rounded-full bg-[#C75B5B] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
        >
          Browse Services →
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[#F0DCD5] bg-white p-6 shadow-[0_8px_30px_rgba(90,40,30,0.06)] sm:p-8"
      >
        <div>
          <p className="font-serif text-2xl font-bold text-[#241A17]">
            Track your bookings
          </p>
          <p className="mt-1.5 text-sm text-[#6F5E56]">
            See the status of all your booking requests in one place.
          </p>
        </div>
        <Link
          href="/dashboard/customer/bookings"
          className="rounded-full bg-[#FDECEA] px-7 py-3.5 text-sm font-semibold text-[#C75B5B] transition hover:bg-[#F9DCDC]"
        >
          My Bookings →
        </Link>
      </motion.div>
    </div>
  );
}
