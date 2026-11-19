"use client";

import { useEffect, useState } from "react";

type TransactionType = {
  _id: string;
  vendorId: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  succeeded: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-200 text-gray-600",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/transactions`);
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load transactions.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[#241A17]">
        Transactions
      </h1>
      <p className="mt-1 text-[#6F5E56]">
        All premium subscription payments. View only.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      {transactions.length === 0 ? (
        <p className="mt-6 rounded-[20px] border border-[#F0DCD5] bg-white p-8 text-center text-[#6F5E56]">
          No transactions yet.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {transactions.map((txn) => (
            <div
              key={txn._id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#F0DCD5] bg-white p-5"
            >
              <div>
                <p className="font-semibold capitalize text-[#241A17]">
                  {txn.plan} Plan
                </p>
                <p className="mt-1 text-sm text-[#6F5E56]">
                  Vendor: {txn.vendorId} •{" "}
                  {new Date(txn.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-serif text-xl font-bold text-[#241A17]">
                  ৳{txn.amount.toLocaleString()}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColors[txn.status] || "bg-gray-200 text-gray-600"}`}
                >
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
