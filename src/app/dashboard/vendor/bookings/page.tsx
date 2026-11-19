"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { ServiceType } from "@/app/Components/Service";

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

const statusColors: Record<BookingType["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-600",
};

export default function VendorBookingsPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Button click er pore reload korar jonno
  const reloadBookings = async () => {
    if (!userId) return;
    try {
      const [bookingRes, serviceRes] = await Promise.all([
        fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/bookings?vendorId=${userId}`),
        fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/services`),
      ]);
      const bookingData = await bookingRes.json();
      const serviceData = await serviceRes.json();
      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
    } catch {
      setError("Could not load booking requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prothombar data ana - loadData ekhon useEffect er vitorei
  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const [bookingRes, serviceRes] = await Promise.all([
          fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/bookings?vendorId=${userId}`),
          fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/services`),
        ]);
        const bookingData = await bookingRes.json();
        const serviceData = await serviceRes.json();
        setBookings(Array.isArray(bookingData) ? bookingData : []);
        setServices(Array.isArray(serviceData) ? serviceData : []);
      } catch {
        setError("Could not load booking requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

const handleStatus = async (
  bookingId: string,
  status: "accepted" | "rejected",
) => {
  try {
    const res = await fetch(
      `${process.env.SERVER_URL || "http://localhost:5000"}/bookings/${bookingId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, vendorId: userId }),
      },
    );

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Could not update this booking.");
      return;
    }

    reloadBookings();
  } catch {
    setError("Could not update this booking.");
  }
};


  const getServiceName = (serviceId: string): string =>
    services.find((service) => service._id === serviceId)?.serviceName ||
    "Wedding Service";

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading requests...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[#241A17]">
        Booking Requests
      </h1>

      {error && (
        <p className="mt-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      {bookings.length === 0 ? (
        <p className="mt-6 rounded-[20px] border border-[#F0DCD5] bg-white p-8 text-center text-[#6F5E56]">
          No booking requests yet.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-[20px] border border-[#F0DCD5] bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-[#241A17]">
                  {getServiceName(booking.serviceId)}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColors[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#6F5E56]">
                📅 {booking.eventDate} • 📍 {booking.eventLocation}
              </p>

              {booking.message && (
                <p className="mt-2 text-sm text-[#6F5E56]">
                  {booking.message}
                </p>
              )}

              {booking.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleStatus(booking._id, "accepted")}
                    className="rounded-full bg-[#2E7D5B] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#256B4D]"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatus(booking._id, "rejected")}
                    className="rounded-full bg-[#DC2626] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#B91C1C]"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
