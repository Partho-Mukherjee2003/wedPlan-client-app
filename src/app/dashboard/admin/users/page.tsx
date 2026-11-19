"use client";

import { useEffect, useState } from "react";

type UserType = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  image?: string | null;
  role?: "admin" | "vendor" | "customer";
  isBlocked?: boolean;
  subscriptionPlan?: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reloadUsers = async () => {
    try {
      const res = await fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/users`);
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
        const res = await fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/users`);
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

  const handleBlock = async (user: UserType) => {
    const userId = user._id || user.id;
    if (!userId) return;
    try {
      await fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/users/${userId}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });
      reloadUsers();
    } catch {
      setError("Could not update this user.");
    }
  };

  const filtered = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[#241A17]">
        Manage Users
      </h1>

      {error && (
        <p className="mt-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 rounded-xl border border-[#E8D5CE] bg-white px-4 py-3 text-sm outline-none focus:border-[#C75B5B]"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-[#E8D5CE] bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-[20px] border border-[#F0DCD5] bg-white p-8 text-center text-[#6F5E56]">
          No users found.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {filtered.map((user) => (
            <div
              key={user._id || user.id}
              className="flex flex-wrap items-center gap-4 rounded-[20px] border border-[#F0DCD5] bg-white p-4"
            >
              <img
                src={
                  user.image || "https://randomuser.me/api/portraits/lego/1.jpg"
                }
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="min-w-[200px] flex-1">
                <p className="font-semibold text-[#241A17]">{user.name}</p>
                <p className="text-sm text-[#6F5E56]">{user.email}</p>
              </div>
              <span className="rounded-full bg-[#FDECEA] px-3 py-1 text-xs font-bold capitalize text-[#C75B5B]">
                {user.role || "customer"}
              </span>
              <span
                className={
                  user.isBlocked
                    ? "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"
                    : "rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
                }
              >
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
              {user.role !== "admin" && (
                <button
                  onClick={() => handleBlock(user)}
                  className={
                    user.isBlocked
                      ? "rounded-full bg-[#2E7D5B] px-4 py-2 text-xs font-semibold text-white"
                      : "rounded-full bg-[#FDECEC] px-4 py-2 text-xs font-semibold text-[#DC2626]"
                  }
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
