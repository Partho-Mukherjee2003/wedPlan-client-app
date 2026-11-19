"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { ServiceType } from "@/app/Components/Service";
import Image from "next/image";

type BookingType = {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt?: string;
};

type UserType = {
  _id?: string;
  id?: string;
  name: string;
  businessName?: string;
};

const vendorNames: Record<string, string> = {
  user_vendor_01: "Dream Wedding Studio",
  user_vendor_02: "Royal Palace Convention",
  user_vendor_03: "Bloom & Bliss Decor",
  user_vendor_04: "Taste of Dhaka Catering",
  user_vendor_05: "Glamour Bridal Studio",
};

const statusColors: Record<BookingType["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-600",
};

export default function MyBookingsPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const reloadBookings = async () => {
    if (!userId) return;
    try {
      const [bookingRes, serviceRes, userRes] = await Promise.all([
        fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/bookings?customerId=${userId}`),
        fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/services`),
        fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/users`),
      ]);
      const bookingData = await bookingRes.json();
      const serviceData = await serviceRes.json();
      const userData = await userRes.json();

      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch {
      setError("Could not load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const [bookingRes, serviceRes, userRes] = await Promise.all([
          fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/bookings?customerId=${userId}`),
          fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/services`),
          fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/users`),
        ]);
        const bookingData = await bookingRes.json();
        const serviceData = await serviceRes.json();
        const userData = await userRes.json();

        setBookings(Array.isArray(bookingData) ? bookingData : []);
        setServices(Array.isArray(serviceData) ? serviceData : []);
        setUsers(Array.isArray(userData) ? userData : []);
      } catch {
        setError("Could not load your bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleCancel = async (bookingId: string) => {
    try {
      const res = await fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled", customerId: userId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not cancel this booking.");
        return;
      }
      reloadBookings();
    } catch {
      setError("Could not cancel this booking.");
    }
  };

  const getService = (serviceId: string): ServiceType | undefined =>
    services.find((service) => service._id === serviceId);

  const getVendorName = (vendorId: string): string => {
    if (vendorNames[vendorId]) return vendorNames[vendorId];
    const vendor = users.find((u) => u._id === vendorId || u.id === vendorId);
    return vendor?.businessName || vendor?.name || "WedPlan Vendor";
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[#241A17]">
        My Bookings
      </h1>
      <p className="mt-1 text-[#6F5E56]">
        All your booking requests in one place.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      {bookings.length === 0 ? (
        <p className="mt-6 rounded-[20px] border border-[#F0DCD5] bg-white p-8 text-center text-[#6F5E56]">
          You have not booked any service yet.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {bookings.map((booking) => {
            const service = getService(booking.serviceId);
            const isSelected = selectedId === booking._id;

            return (
              <div
                key={booking._id}
                className="rounded-[20px] border border-[#F0DCD5] bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <Image
                  width={112}
                  height={80}
                    src={
                      service?.images?.[0] ||
                      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop"
                    }
                    alt={service?.serviceName || "Wedding Service"}
                    className="h-20 w-28 rounded-xl object-cover"
                  />

                  <div className="min-w-[200px] flex-1">
                    <p className="font-semibold text-[#241A17]">
                      {service?.serviceName || "Wedding Service"}
                    </p>
                    <p className="mt-1 text-sm text-[#6F5E56]">
                      Vendor: {getVendorName(booking.vendorId)}
                    </p>
                    <p className="mt-1 text-sm text-[#6F5E56]">
                      📅 {booking.eventDate} • 📍 {booking.eventLocation}
                    </p>
                    <p className="mt-1 text-xs text-[#A08D84]">
                      Requested on {formatDate(booking.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColors[booking.status]}`}
                    >
                      {booking.status}
                    </span>

                    <button
                      onClick={() =>
                        setSelectedId(isSelected ? null : booking._id)
                      }
                      className="rounded-full bg-[#FDECEA] px-4 py-2 text-xs font-semibold text-[#C75B5B]"
                    >
                      {isSelected ? "Hide Details" : "View Details"}
                    </button>

                    {booking.status === "pending" && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="rounded-full bg-[#FDECEC] px-4 py-2 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FBD5D5]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-4 border-t border-[#F7E8E2] pt-4">
                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <p>
                        <span className="font-semibold text-[#241A17]">
                          Service:
                        </span>{" "}
                        <span className="text-[#6F5E56]">
                          {service?.serviceName}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-[#241A17]">
                          Category:
                        </span>{" "}
                        <span className="text-[#6F5E56]">
                          {service?.category}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-[#241A17]">
                          Vendor:
                        </span>{" "}
                        <span className="text-[#6F5E56]">
                          {getVendorName(booking.vendorId)}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-[#241A17]">
                          Price:
                        </span>{" "}
                        <span className="text-[#6F5E56]">
                          ৳{service?.price.toLocaleString()}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-[#241A17]">
                          Event Date:
                        </span>{" "}
                        <span className="text-[#6F5E56]">
                          {booking.eventDate}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-[#241A17]">
                          Event Location:
                        </span>{" "}
                        <span className="text-[#6F5E56]">
                          {booking.eventLocation}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-[#241A17]">
                          Request Date:
                        </span>{" "}
                        <span className="text-[#6F5E56]">
                          {formatDate(booking.createdAt)}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-[#241A17]">
                          Status:
                        </span>{" "}
                        <span className="capitalize text-[#6F5E56]">
                          {booking.status}
                        </span>
                      </p>
                    </div>
                    {booking.message && (
                      <p className="mt-3 text-sm text-[#6F5E56]">
                        <span className="font-semibold text-[#241A17]">
                          Your Message:
                        </span>{" "}
                        {booking.message}
                      </p>
                    )}
                    {service?.description && (
                      <p className="mt-3 text-sm leading-relaxed text-[#6F5E56]">
                        {service.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
