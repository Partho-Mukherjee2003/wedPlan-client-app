"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type AdminUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "vendor" | "customer";
  isBlocked?: boolean;
  subscriptionPlan?: "free" | "premium";
};

const roleStyles: Record<string, string> = {
  vendor: "bg-[#FDECEA] text-[#C75B5B]",
  customer: "bg-[#E6F4EC] text-[#2E7D5B]",
  admin: "bg-[#241A17] text-[#C9A86A]",
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const reloadUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/users`,
      );
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          `${process.env.SERVER_URL || "http://localhost:5000"}/users`,
        );
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load users.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBlockToggle = async (user: AdminUser) => {
    const userId = user._id || user.id;
    if (!userId) return;

    try {
      await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/users/${userId}/block`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isBlocked: !user.isBlocked }),
        },
      );
      reloadUsers();
    } catch {
      setError("Could not update this user.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading users...</p>
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
          Manage <span className="italic text-[#C75B5B]">Users</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">
          {users.length} registered users on the platform.
        </p>
      </motion.div>

      {error && (
        <p className="mx-auto mt-5 max-w-xl rounded-xl bg-[#FDECEC] px-4 py-3 text-center text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 rounded-full border border-[#E8D5CE] bg-white px-5 py-3.5 text-sm outline-none focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-full border border-[#E8D5CE] bg-white px-5 py-3.5 text-sm outline-none focus:border-[#C75B5B]"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="mx-auto mt-8 max-w-xl rounded-[24px] border border-[#F0DCD5] bg-white p-10 text-center">
          <p className="text-4xl">👥</p>
          <p className="mt-3 font-serif text-xl font-bold text-[#241A17]">
            No users found
          </p>
          <p className="mt-1.5 text-sm text-[#6F5E56]">
            Try a different search or filter.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user._id || user.id || user.email}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-wrap items-center gap-4 rounded-[24px] border border-[#F0DCD5] bg-white p-4 shadow-[0_8px_30px_rgba(90,40,30,0.05)] sm:p-5"
            >
              <img
                src={
                  user.image || "https://randomuser.me/api/portraits/lego/1.jpg"
                }
                alt={user.name}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-[#F0DCD5]"
              />

              <div className="min-w-[180px] flex-1">
                <p className="font-semibold text-[#241A17]">{user.name}</p>
                <p className="text-sm text-[#A08D84]">{user.email}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ${roleStyles[user.role] || roleStyles.customer}`}
                >
                  {user.role}
                </span>

                {user.role === "vendor" &&
                  user.subscriptionPlan === "premium" && (
                    <span className="rounded-full bg-[#C9A86A] px-3.5 py-1.5 text-xs font-bold text-[#241A17]">
                      ★ Premium
                    </span>
                  )}

                <span
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${user.isBlocked ? "bg-[#FDECEC] text-[#DC2626]" : "bg-[#E6F4EC] text-[#2E7D5B]"}`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>

                {user.role !== "admin" && (
                  <button
                    onClick={() => handleBlockToggle(user)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      user.isBlocked
                        ? "bg-[#E6F4EC] text-[#2E7D5B] hover:bg-[#C8E6D5]"
                        : "bg-[#FDECEC] text-[#DC2626] hover:bg-[#FBD5D5]"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
