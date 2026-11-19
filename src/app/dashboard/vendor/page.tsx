"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { ServiceType } from "@/app/Components/Service";

type BookingType = {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
};

type UserType = {
  id: string;
  name: string;
  subscriptionPlan: "free" | "premium";
};

export default function VendorOverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as UserType | undefined;
  const userId = user?.id;

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [myServices, setMyServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const [bookingRes, serviceRes] = await Promise.all([
          fetch(`http://localhost:5000/bookings?vendorId=${userId}`),
          fetch("http://localhost:5000/services"),
        ]);
        const bookingData = await bookingRes.json();
        const serviceData = await serviceRes.json();

        setBookings(Array.isArray(bookingData) ? bookingData : []);
        setMyServices(
          Array.isArray(serviceData)
            ? serviceData.filter((s: ServiceType) => s.vendorId === userId)
            : [],
        );
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
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading...</p>
      </div>
    );
  }

  const activeServices = myServices.filter(
    (s) => s.status === "approved",
  ).length;
  const pendingRequests = bookings.filter((b) => b.status === "pending").length;
  const acceptedBookings = bookings.filter(
    (b) => b.status === "accepted",
  ).length;

  const cards = [
    { label: "Total Services", value: myServices.length },
    { label: "Active Services", value: activeServices },
    { label: "Pending Booking Requests", value: pendingRequests },
    { label: "Accepted Bookings", value: acceptedBookings },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[#241A17]">
        Vendor Overview
      </h1>
      <p className="mt-1 text-[#6F5E56]">Welcome back, {user?.name}</p>

      {error && (
        <p className="mt-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[20px] border border-[#F0DCD5] bg-white p-6"
          >
            <p className="text-sm text-[#A08D84]">{card.label}</p>
            <p className="mt-2 font-serif text-4xl font-bold text-[#C75B5B]">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[20px] border border-[#F0DCD5] bg-[#241A17] p-6 text-white">
        <p className="text-sm text-white/60">Current Subscription Plan</p>
        <p className="mt-2 font-serif text-3xl font-bold capitalize">
          {user?.subscriptionPlan || "Free"} Plan
        </p>
        <p className="mt-1 text-sm text-white/70">
          {user?.subscriptionPlan === "premium"
            ? "Unlimited active services • Premium Vendor Badge"
            : "Maximum 3 active services • Upgrade for unlimited"}
        </p>
      </div>
    </div>
  );
}
