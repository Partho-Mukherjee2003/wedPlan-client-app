"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";

type BookingType = {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
};

export default function CustomerOverviewPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/bookings?customerId=${userId}`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => console.log("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p className="text-[#6F5E56]">Loading...</p>;

  const cards = [
    { label: "Total Bookings", value: bookings.length },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
    },
    {
      label: "Accepted",
      value: bookings.filter((b) => b.status === "accepted").length,
    },
    {
      label: "Rejected",
      value: bookings.filter((b) => b.status === "rejected").length,
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[#241A17]">
        My Overview
      </h1>
      <p className="mt-1 text-[#6F5E56]">Welcome back, {session?.user?.name}</p>

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
    </div>
  );
}
