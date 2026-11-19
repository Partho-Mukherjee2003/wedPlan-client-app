"use client";

import { useEffect, useState } from "react";
import { ServiceType } from "@/app/Components/Service";
import Image from "next/image";

const statusColors: Record<ServiceType["status"], string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ManageServicesPage() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reloadServices = async () => {
    try {
      const res = await fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/services`);
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
        const res = await fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/services`);
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
    serviceId: string,
    status: "approved" | "rejected",
  ) => {
    try {
      await fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/services/${serviceId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      reloadServices();
    } catch {
      setError("Could not update service status.");
    }
  };

  const handleDelete = async (serviceId: string, vendorId: string) => {
    try {
      await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/services/${serviceId}?vendorId=${vendorId}`,
        {
          method: "DELETE",
        },
      );
      reloadServices();
    } catch {
      setError("Could not delete this service.");
    }
  };

  const filtered =
    filter === "all" ? services : services.filter((s) => s.status === filter);

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading services...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[#241A17]">
        Manage Services
      </h1>

      {error && (
        <p className="mt-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-2">
        {["all", "pending", "approved", "rejected"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={
              filter === item
                ? "rounded-full bg-[#C75B5B] px-4 py-2 text-xs font-semibold capitalize text-white"
                : "rounded-full bg-white px-4 py-2 text-xs font-semibold capitalize text-[#6F5E56] ring-1 ring-[#F0DCD5]"
            }
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-[20px] border border-[#F0DCD5] bg-white p-8 text-center text-[#6F5E56]">
          No services found.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {filtered.map((service) => (
            <div
              key={service._id}
              className="flex flex-wrap items-center gap-4 rounded-[20px] border border-[#F0DCD5] bg-white p-4"
            >
              <Image
                width={112}
                height={80}
                src={service.images?.[0]}
                alt={service.serviceName}
                className="h-20 w-28 rounded-xl object-cover"
              />
              <div className="min-w-[200px] flex-1">
                <p className="font-semibold text-[#241A17]">
                  {service.serviceName}
                </p>
                <p className="mt-1 text-sm text-[#6F5E56]">
                  {service.category} • 📍 {service.location} • ৳
                  {service.price.toLocaleString()}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColors[service.status]}`}
              >
                {service.status}
              </span>
              <div className="flex gap-2">
                {service.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatus(service._id, "approved")}
                      className="rounded-full bg-[#2E7D5B] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatus(service._id, "rejected")}
                      className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(service._id, service.vendorId)}
                  className="rounded-full bg-[#FDECEC] px-4 py-2 text-xs font-semibold text-[#DC2626]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
