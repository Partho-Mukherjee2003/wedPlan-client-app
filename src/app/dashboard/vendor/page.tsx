"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { ServiceType } from "@/app/Components/Service";

type BookingType = {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
};

type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: "admin" | "vendor" | "customer";
  isBlocked: boolean;
  businessName?: string;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt?: string;
};

export default function VendorOverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as UserType | undefined;
  const userId = user?.id;

  const [services, setServices] = useState<ServiceType[]>([]);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [freshPlan, setFreshPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const [serviceRes, bookingRes, userRes] = await Promise.all([
          fetch(
            `${process.env.SERVER_URL || "http://localhost:5000"}/services?vendorId=${userId}`,
          ),
          fetch(
            `${process.env.SERVER_URL || "http://localhost:5000"}/bookings?vendorId=${userId}`,
          ),
          fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/users`),
        ]);
        const serviceData = await serviceRes.json();
        const bookingData = await bookingRes.json();
        const userData = await userRes.json();
        setServices(Array.isArray(serviceData) ? serviceData : []);
        setBookings(Array.isArray(bookingData) ? bookingData : []);
        if (Array.isArray(userData)) {
          const me = userData.find(
            (u: { _id?: string; id?: string }) => (u._id || u.id) === userId,
          );
          if (me) setFreshPlan(me.subscriptionPlan || "free");
        }
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

  const displayPlan = freshPlan || user?.subscriptionPlan || "free";
  const activeServices = services.filter((s) => s.status === "approved").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const acceptedBookings = bookings.filter(
    (b) => b.status === "accepted",
  ).length;

  const cards = [
    { label: "Total Services", value: services.length, icon: "🎁" },
    { label: "Active Services", value: activeServices, icon: "✅" },
    { label: "Pending Booking Requests", value: pendingBookings, icon: "⏳" },
    { label: "Accepted Bookings", value: acceptedBookings, icon: "💍" },
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
          Vendor <span className="italic text-[#C75B5B]">Overview</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">Welcome back, {user?.name}!</p>
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
            transition={{ duration: 0.5, delay: index * 0.08 }}
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

      {/* Subscription banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.35 }}
        className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-[#241A17] p-7 text-white shadow-[0_20px_50px_rgba(36,26,23,0.25)]"
      >
        <div>
          <p className="text-sm text-white/60">Current Subscription Plan</p>
          <p className="mt-1 font-serif text-2xl font-bold capitalize text-[#F0D9A8]">
            {displayPlan === "premium" ? "★ Premium Plan" : "Free Plan"}
          </p>
          <p className="mt-1 text-sm text-white/60">
            {displayPlan === "premium"
              ? "You can add unlimited services with the premium badge."
              : "You can add up to 3 active services on the Free plan."}
          </p>
        </div>

        {displayPlan !== "premium" && (
          <Link
            href="/dashboard/vendor/subscription"
            className="rounded-full bg-[#C75B5B] px-7 py-3.5 font-semibold text-white transition hover:bg-[#B04A4A]"
          >
            Upgrade to Premium →
          </Link>
        )}
      </motion.div>
    </div>
  );
}
