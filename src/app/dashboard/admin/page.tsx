"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ServiceType } from "@/app/Components/Service";

type AdminUser = {
  _id?: string;
  id?: string;
  role: "admin" | "vendor" | "customer";
};

type TransactionType = {
  _id: string;
  amount: number;
  status: "succeeded" | "pending" | "failed" | "refunded";
};

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [userRes, serviceRes, bookingRes, transactionRes] =
          await Promise.all([
            fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/users`),
            fetch(
              `${process.env.SERVER_URL || "http://localhost:5000"}/services`,
            ),
            fetch(
              `${process.env.SERVER_URL || "http://localhost:5000"}/bookings`,
            ),
            fetch(
              `${process.env.SERVER_URL || "http://localhost:5000"}/transactions`,
            ),
          ]);

        const userData = await userRes.json();
        const serviceData = await serviceRes.json();
        const bookingData = await bookingRes.json();
        const transactionData = await transactionRes.json();

        setUsers(Array.isArray(userData) ? userData : []);
        setServices(Array.isArray(serviceData) ? serviceData : []);
        setBookings(Array.isArray(bookingData) ? bookingData : []);
        setTransactions(Array.isArray(transactionData) ? transactionData : []);
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
      <div className="flex items-center justify-center gap-3 py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading...</p>
      </div>
    );
  }

  const totalVendors = users.filter((u) => u.role === "vendor").length;
  const totalCustomers = users.filter((u) => u.role === "customer").length;
  const pendingServices = services.filter((s) => s.status === "pending").length;
  const totalRevenue = transactions
    .filter((t) => t.status === "succeeded")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const cards = [
    { label: "Total Registered Users", value: users.length, icon: "👥" },
    { label: "Total Vendors", value: totalVendors, icon: "🏪" },
    { label: "Total Customers", value: totalCustomers, icon: "🧑‍🤝‍🧑" },
    { label: "Total Services", value: services.length, icon: "🎁" },
    { label: "Pending Services", value: pendingServices, icon: "⏳" },
    { label: "Total Bookings", value: bookings.length, icon: "💍" },
    { label: "Total Transactions", value: transactions.length, icon: "💳" },
    {
      label: "Total Revenue (BDT)",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: "💰",
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
          Admin <span className="italic text-[#C75B5B]">Overview</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">Platform summary at a glance.</p>
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
            transition={{ duration: 0.5, delay: index * 0.07 }}
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
    </div>
  );
}
