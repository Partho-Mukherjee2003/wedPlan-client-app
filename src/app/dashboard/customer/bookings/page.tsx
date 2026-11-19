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

export default function MyBookingsPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cancel button er pore reload korar jonno
  const reloadBookings = async () => {
    if (!userId) return;
    try {
      const [bookingRes, serviceRes] = await Promise.all([
        fetch(`http://localhost:5000/bookings?customerId=${userId}`),
        fetch("http://localhost:5000/services"),
      ]);
      const bookingData = await bookingRes.json();
      const serviceData = await serviceRes.json();
      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
    } catch {
      setError("Could not load your bookings. Please try again.");
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
          fetch(`http://localhost:5000/bookings?customerId=${userId}`),
          fetch("http://localhost:5000/services"),
        ]);
        const bookingData = await bookingRes.json();
        const serviceData = await serviceRes.json();
        setBookings(Array.isArray(bookingData) ? bookingData : []);
        setServices(Array.isArray(serviceData) ? serviceData : []);
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
      await fetch(`http://localhost:5000/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      reloadBookings();
    } catch {
      setError("Could not cancel this booking.");
    }
  };

  const getServiceName = (serviceId: string): string =>
    services.find((service) => service._id === serviceId)?.serviceName ||
    "Wedding Service";

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
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#F0DCD5] bg-white p-5"
            >
              <div>
                <p className="font-semibold text-[#241A17]">
                  {getServiceName(booking.serviceId)}
                </p>
                <p className="mt-1 text-sm text-[#6F5E56]">
                  📅 {booking.eventDate} • 📍 {booking.eventLocation}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColors[booking.status]}`}
                >
                  {booking.status}
                </span>

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
          ))}
        </div>
      )}
    </div>
  );
}
