"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type TransactionType = {
  _id: string;
  vendorId: string;
  plan: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  createdAt?: string;
};

type AdminUser = {
  _id?: string;
  id?: string;
  name: string;
  businessName?: string;
};

const statusColors: Record<TransactionType["status"], string> = {
  succeeded: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-200 text-gray-600",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactionRes, userRes] = await Promise.all([
          fetch(
            `${process.env.SERVER_URL || "http://localhost:5000"}/transactions`,
          ),
          fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/users`),
        ]);
        const transactionData = await transactionRes.json();
        const userData = await userRes.json();
        setTransactions(Array.isArray(transactionData) ? transactionData : []);
        setUsers(Array.isArray(userData) ? userData : []);
      } catch {
        setError("Could not load transactions.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getVendorName = (vendorId: string): string => {
    const vendor = users.find((u) => (u._id || u.id) === vendorId);
    return vendor?.businessName || vendor?.name || vendorId;
  };

  const totalRevenue = transactions
    .filter((t) => t.status === "succeeded")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
          <span className="italic text-[#C75B5B]">Transactions</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">
          All premium subscription payments. View only.
        </p>
      </motion.div>

      {error && (
        <p className="mx-auto mt-5 max-w-xl rounded-xl bg-[#FDECEC] px-4 py-3 text-center text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-[#241A17] p-6 text-white sm:p-8"
      >
        <div>
          <p className="text-sm text-white/60">
            Total Revenue (Succeeded Payments)
          </p>
          <p className="mt-2 font-serif text-4xl font-bold text-[#C9A86A]">
            ৳{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">Total Transactions</p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {transactions.length}
          </p>
        </div>
      </motion.div>

      {transactions.length === 0 ? (
        <div className="mx-auto mt-6 max-w-xl rounded-[24px] border border-[#F0DCD5] bg-white p-10 text-center">
          <p className="text-4xl">💳</p>
          <p className="mt-3 font-serif text-xl font-bold text-[#241A17]">
            No transactions yet
          </p>
          <p className="mt-1.5 text-sm text-[#6F5E56]">
            Premium subscription payments will appear here after Stripe is
            connected.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-wrap items-center gap-4 rounded-[24px] border border-[#F0DCD5] bg-white p-4 shadow-[0_8px_30px_rgba(90,40,30,0.05)] sm:p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEA] text-xl">
                💳
              </span>

              <div className="min-w-[200px] flex-1">
                <p className="font-semibold text-[#241A17]">
                  {getVendorName(transaction.vendorId)}
                </p>
                <p className="text-sm capitalize text-[#A08D84]">
                  {transaction.plan} Plan
                  {transaction.createdAt &&
                    ` • ${new Date(transaction.createdAt).toLocaleDateString("en-GB")}`}
                </p>
              </div>

              <p className="font-serif text-xl font-bold text-[#C75B5B]">
                ৳{transaction.amount.toLocaleString()}
              </p>

              <span
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ${statusColors[transaction.status]}`}
              >
                {transaction.status}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
