"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";
import { getAuthHeader } from "@/app/lib/authHeader";
import { ServiceType } from "@/app/Components/Service";
import Image from "next/image";

const statusColors: Record<ServiceType["status"], string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const locations = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

export default function MyServicesPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const reloadServices = async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/services`,
      );
      const data = await res.json();
      setServices(
        Array.isArray(data)
          ? data.filter((s: ServiceType) => s.vendorId === userId)
          : [],
      );
    } catch {
      setError("Could not load your services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const res = await fetch(
          `${process.env.SERVER_URL || "http://localhost:5000"}/services`,
        );
        const data = await res.json();
        setServices(
          Array.isArray(data)
            ? data.filter((s: ServiceType) => s.vendorId === userId)
            : [],
        );
      } catch {
        setError("Could not load your services.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleDelete = async (service: ServiceType) => {
    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/services/${service._id}?vendorId=${userId}`,
        { method: "DELETE", headers: await getAuthHeader() },
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

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    service: ServiceType,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = String(formData.get("serviceName"));

    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/services/${service._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(await getAuthHeader()),
          },
          body: JSON.stringify({
            vendorId: userId,
            serviceName: newName,
            category: String(formData.get("category")),
            description: String(formData.get("description")),
            price: Number(formData.get("price")),
            location: String(formData.get("location")),
          }),
        },
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = data?.message || "Could not update this service.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success(`Service '${newName}' updated successfully`);
      setEditingId(null);
      reloadServices();
    } catch {
      const message = "Could not update this service.";
      setError(message);
      toast.error(message);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#E8D5CE] px-4 py-3 text-sm outline-none focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20";

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
          My <span className="italic text-[#C75B5B]">Services</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">
          You have {services.length} service{services.length !== 1 ? "s" : ""}{" "}
          in total.
        </p>
      </div>

      {error && (
        <p className="mx-auto mt-5 max-w-xl rounded-xl bg-[#FDECEC] px-4 py-3 text-center text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      {services.length === 0 ? (
        <p className="mx-auto mt-8 max-w-xl rounded-[20px] border border-[#F0DCD5] bg-white p-8 text-center text-[#6F5E56]">
          You have not added any service yet.
        </p>
      ) : (
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="w-full max-w-sm overflow-hidden rounded-[24px] border border-[#F0DCD5] bg-white shadow-[0_8px_30px_rgba(90,40,30,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(199,91,91,0.12)]"
            >
              <Image
                width={800}
                height={600}
                src={service.images?.[0]}
                alt={service.serviceName}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-serif text-lg font-bold text-[#241A17]">
                    {service.serviceName}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColors[service.status]}`}
                  >
                    {service.status}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-[#6F5E56]">
                  {service.category} • 📍 {service.location}
                </p>
                <p className="mt-2 font-serif text-2xl font-bold text-[#C75B5B]">
                  ৳{service.price.toLocaleString()}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      setEditingId(
                        editingId === service._id ? null : service._id,
                      )
                    }
                    className="flex-1 rounded-full bg-[#FDECEA] py-2.5 text-xs font-semibold text-[#C75B5B] transition hover:bg-[#F9DCDC]"
                  >
                    {editingId === service._id ? "Cancel" : "Update"}
                  </button>
                  <button
                    onClick={() => handleDelete(service)}
                    className="flex-1 rounded-full bg-[#FDECEC] py-2.5 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FBD5D5]"
                  >
                    Delete
                  </button>
                </div>

                {editingId === service._id && (
                  <form
                    onSubmit={(e) => handleUpdate(e, service)}
                    className="mt-4 flex flex-col gap-3 border-t border-[#F7E8E2] pt-4"
                  >
                    <input
                      name="serviceName"
                      defaultValue={service.serviceName}
                      required
                      className={inputClass}
                    />
                    <select
                      name="category"
                      defaultValue={service.category}
                      className={inputClass}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <select
                      name="location"
                      defaultValue={service.location}
                      className={inputClass}
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <textarea
                      name="description"
                      defaultValue={service.description}
                      required
                      rows={3}
                      className={inputClass}
                    />
                    <input
                      name="price"
                      type="number"
                      defaultValue={service.price}
                      required
                      min={1}
                      className={inputClass}
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#C75B5B] py-2.5 text-xs font-semibold text-white transition hover:bg-[#B04A4A]"
                    >
                      Save Changes
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
