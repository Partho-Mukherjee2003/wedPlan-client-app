"use client";

import { useEffect, useState } from "react";
import { ServiceType } from "@/app/Components/Service";

type UserType = { _id: string; role?: string };
type BookingType = { _id: string; status: string };
type TransactionType = { _id: string; amount: number; status: string };

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, serviceRes, bookingRes, txnRes] = await Promise.all([
          fetch("http://localhost:5000/users"),
          fetch("http://localhost:5000/services"),
          fetch("http://localhost:5000/bookings"),
          fetch("http://localhost:5000/transactions"),
        ]);

        setUsers(Array.isArray(await userRes.json()) ? await userRes.clone().json().catch(() => []) : []);
        // Uporer line e problem hole niche r moto alada kore nao:
      } catch {
        setError("Could not load overview data.");
      } finally {
        setLoading(false);
      }
    };

    const loadAll = async () => {
      try {
        const [userRes, serviceRes, bookingRes, txnRes] = await Promise.all([
          fetch("http://localhost:5000/users"),
          fetch("http://localhost:5000/services"),
          fetch("http://localhost:5000/bookings"),
          fetch("http://localhost:5000/transactions"),
        ]);

        const userData = await userRes.json();
        const serviceData = await serviceRes.json();
        const bookingData = await bookingRes.json();
        const txnData = await txnRes.json();

        setUsers(Array.isArray(userData) ? userData : []);
        setServices(Array.isArray(serviceData) ? serviceData : []);
        setBookings(Array.isArray(bookingData) ? bookingData : []);
        setTransactions(Array.isArray(txnData) ? txnData : []);
      } catch {
        setError("Could not load overview data.");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading...</p>
      </div>
    );
  }

  const totalRevenue = transactions
    .filter((t) => t.status === "succeeded")
    .reduce((sum, t) => sum + t.amount, 0);

  const cards = [
    { label: "Total Users", value: users.length },
    { label: "Total Services", value: services.length },
    { label: "Pending Services", value: services.filter((s) => s.status === "pending").length },
    { label: "Total Bookings", value: bookings.length },
    { label: "Total Transactions", value: transactions.length },
    { label: "Total Revenue (BDT)", value: totalRevenue.toLocaleString() },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[#241A17]">Admin Overview</h1>
      <p className="mt-1 text-[#6F5E56]">Platform summary at a glance.</p>

      {error && <p className="mt-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[20px] border border-[#F0DCD5] bg-white p-6">
            <p className="text-sm text-[#A08D84]">{card.label}</p>
            <p className="mt-2 font-serif text-4xl font-bold text-[#C75B5B]">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
