"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ServiceType } from "@/app/Components/Service";
import Image from "next/image";

const statusColors: Record<ServiceType["status"], string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const tabs = ["all", "pending", "approved", "rejected"] as const;

export default function ManageServicesPage() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("all");
  const [search, setSearch] = useState("");

  const reloadServices = async () => {
    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/services`,
      );
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          `${process.env.SERVER_URL || "http://localhost:5000"}/services`,
        );
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load services.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStatus = async (
    service: ServiceType,
    status: "approved" | "rejected",
  ) => {
    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/services/${service._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = data?.message || "Could not update this service.";
        setError(message);
        toast.error(message);
        return;
      }

      if (status === "approved") {
        toast.success(`'${service.serviceName}' is now live 💍`);
      } else {
        toast.success(`'${service.serviceName}' has been rejected`);
      }
      reloadServices();
    } catch {
      const message = "Could not update this service.";
      setError(message);
      toast.error(message);
    }
  };

  const handleDelete = async (service: ServiceType) => {
    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/services/${service._id}`,
        { method: "DELETE" },
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = data?.message || "Could not delete this service.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success(`Service '${service.serviceName}' deleted`);
      reloadServices();
    } catch {
      const message = "Could not delete this service.";
      setError(message);
      toast.error(message);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesTab = activeTab === "all" || service.status === activeTab;
    const searchText = search.toLowerCase();
    const matchesSearch =
      service.serviceName.toLowerCase().includes(searchText) ||
      service.category.toLowerCase().includes(searchText) ||
      service.location.toLowerCase().includes(searchText);
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading services...</p>
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
          Manage <span className="italic text-[#C75B5B]">Services</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">
          {services.length} services on the platform.
        </p>
      </motion.div>

      {error && (
        <p className="mx-auto mt-5 max-w-xl rounded-xl bg-[#FDECEC] px-4 py-3 text-center text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      {/* Search */}
      <div className="mx-auto mt-7 max-w-xl">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by service name, category or location..."
          className="w-full rounded-full border border-[#E8D5CE] bg-white px-5 py-3.5 text-sm outline-none focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
        />
      </div>

      {/* Status filter tabs */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "rounded-full bg-[#C75B5B] px-5 py-2.5 text-sm font-semibold capitalize text-white shadow-[0_6px_20px_rgba(199,91,91,0.25)]"
                : "rounded-full border border-[#E8D5CE] bg-white px-5 py-2.5 text-sm font-medium capitalize text-[#6F5E56] transition hover:border-[#C75B5B] hover:text-[#C75B5B]"
            }
          >
            {tab}
            <span className="ml-1.5 text-xs opacity-70">
              {tab === "all"
                ? services.length
                : services.filter((s) => s.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {filteredServices.length === 0 ? (
        <div className="mx-auto mt-8 max-w-xl rounded-[24px] border border-[#F0DCD5] bg-white p-10 text-center">
          <p className="text-4xl">🎁</p>
          <p className="mt-3 font-serif text-xl font-bold text-[#241A17]">
            No services found
          </p>
          <p className="mt-1.5 text-sm text-[#6F5E56]">
            Try a different search or filter.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-wrap items-center gap-4 rounded-[24px] border border-[#F0DCD5] bg-white p-4 shadow-[0_8px_30px_rgba(90,40,30,0.05)] sm:p-5"
            >
              <Image
                width={112}
                height={80}
                src={service.images?.[0]}
                alt={service.serviceName}
                className="h-20 w-28 rounded-xl object-cover"
              />

              <div className="min-w-[220px] flex-1">
                <p className="font-serif text-lg font-bold text-[#241A17]">
                  {service.serviceName}
                </p>
                <p className="mt-1 text-sm text-[#6F5E56]">
                  {service.category} • 📍 {service.location} •{" "}
                  <span className="font-semibold text-[#C75B5B]">
                    ৳{service.price.toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ${statusColors[service.status]}`}
                >
                  {service.status}
                </span>

                {/* Pending: Approve + Reject */}
                {service.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatus(service, "approved")}
                      className="rounded-full bg-[#2E7D5B] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#256B4D]"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleStatus(service, "rejected")}
                      className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#B91C1C]"
                    >
                      ✕ Reject
                    </button>
                  </>
                )}

                {/* Approved (published): Reject kore unpublish kora jabe */}
                {service.status === "approved" && (
                  <button
                    onClick={() => handleStatus(service, "rejected")}
                    className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#B91C1C]"
                  >
                    ✕ Reject
                  </button>
                )}

                {/* Rejected: abar Approve kora jabe */}
                {service.status === "rejected" && (
                  <button
                    onClick={() => handleStatus(service, "approved")}
                    className="rounded-full bg-[#2E7D5B] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#256B4D]"
                  >
                    ✓ Approve
                  </button>
                )}

                <button
                  onClick={() => handleDelete(service)}
                  className="rounded-full bg-[#FDECEC] px-4 py-2 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FBD5D5]"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
