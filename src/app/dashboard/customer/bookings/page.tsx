"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";
import { ServiceType } from "@/app/Components/Service";
import Image from "next/image";
import { toast } from "react-toastify";
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

type AdminUser = {
  _id?: string;
  id?: string;
  name: string;
  businessName?: string;
};

const statusColors: Record<BookingType["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-600",
};

const vendorNames: Record<string, string> = {
  user_vendor_01: "Dream Wedding Studio",
  user_vendor_02: "Royal Palace Convention",
  user_vendor_03: "Bloom & Bliss Decor",
  user_vendor_04: "Taste of Dhaka Catering",
  user_vendor_05: "Glamour Bridal Studio",
};

export default function MyBookingsPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const reloadBookings = async () => {
    if (!userId) return;
    try {
      const [bookingRes, serviceRes, userRes] = await Promise.all([
        fetch(
          `${process.env.SERVER_URL || "http://localhost:5000"}/bookings?customerId=${userId}`,
        ),
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
      setError("Could not load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const [bookingRes, serviceRes, userRes] = await Promise.all([
          fetch(
            `${process.env.SERVER_URL || "http://localhost:5000"}/bookings?customerId=${userId}`,
          ),
          fetch(
            `${process.env.SERVER_URL || "http://localhost:5000"}/services`,
          ),
          fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/users`),
        ]);
        const bookingData = await bookingRes.json();
        const serviceData = await serviceRes.json();
        const userData = await userRes.json();
        setBookings(Array.isArray(bookingData) ? bookingData : []);
        setServices(Array.isArray(serviceData) ? serviceData : []);
        setUsers(Array.isArray(userData) ? userData : []);
      } catch {
        setError("Could not load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleCancel = async (bookingId: string, serviceName: string) => {
    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "cancelled", customerId: userId }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not cancel this booking.");
        toast.error(data.message || "Could not cancel this booking.");
        return;
      }
      toast.success(`Booking cancelled for ${serviceName}`);
      reloadBookings();
    } catch (error) {
      setError("Could not cancel this booking.");
      toast.error(error instanceof Error ? error.message : "Could not cancel this booking.");
    }
  };

  const getService = (serviceId: string): ServiceType | undefined =>
    services.find((service) => service._id === serviceId);

  const getVendorName = (vendorId: string): string => {
    if (vendorNames[vendorId]) return vendorNames[vendorId];
    const vendor = users.find((u) => (u._id || u.id) === vendorId);
    return vendor?.businessName || vendor?.name || "WedPlan Vendor";
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
        <p className="text-[#6F5E56]">Loading bookings...</p>
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
          My <span className="italic text-[#C75B5B]">Bookings</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">
          All your booking requests in one place.
        </p>
      </motion.div>

      {error && (
        <p className="mx-auto mt-5 max-w-xl rounded-xl bg-[#FDECEC] px-4 py-3 text-center text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      {bookings.length === 0 ? (
        <div className="mx-auto mt-8 max-w-xl rounded-[24px] border border-[#F0DCD5] bg-white p-10 text-center">
          <p className="text-4xl">💌</p>
          <p className="mt-3 font-serif text-xl font-bold text-[#241A17]">
            No bookings yet
          </p>
          <p className="mt-1.5 text-sm text-[#6F5E56]">
            You have not booked any service yet. Start planning your wedding!
          </p>
          <Link
            href="/services"
            className="mt-5 inline-block rounded-full bg-[#C75B5B] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
          >
            Browse Services →
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {bookings.map((booking, index) => {
            const service = getService(booking.serviceId);
            const isExpanded = expandedId === booking._id;

            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="rounded-[24px] border border-[#F0DCD5] bg-white p-4 shadow-[0_8px_30px_rgba(90,40,30,0.06)] sm:p-5"
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

                  <div className="min-w-[220px] flex-1">
                    <p className="font-serif text-lg font-bold text-[#241A17]">
                      {service?.serviceName || "Wedding Service"}
                    </p>
                    <p className="mt-0.5 text-sm text-[#6F5E56]">
                      Vendor: {getVendorName(booking.vendorId)}
                    </p>
                    <p className="mt-1 text-sm text-[#6F5E56]">
                      📅 {booking.eventDate} • 📍 {booking.eventLocation}
                    </p>
                    {booking.createdAt && (
                      <p className="mt-0.5 text-xs text-[#A08D84]">
                        Requested on {formatDate(booking.createdAt)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ${statusColors[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : booking._id)
                      }
                      className="rounded-full bg-[#FDECEA] px-4 py-2 text-xs font-semibold text-[#C75B5B] transition hover:bg-[#F9DCDC]"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                    {booking.status === "pending" && (
                      <button
                        onClick={() =>
                          handleCancel(
                            booking._id,
                            getService(booking.serviceId)?.serviceName ||
                              "Wedding Service",
                          )
                        }
                        className="rounded-full bg-[#FDECEC] px-4 py-2 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FBD5D5]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-[#FFF9F5] p-4 ring-1 ring-[#F7E8E2] sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#A08D84]">
                            Category
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#241A17]">
                            {service?.category || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#A08D84]">
                            Price
                          </p>
                          <p className="mt-1 font-serif text-lg font-bold text-[#C75B5B]">
                            ৳{service?.price?.toLocaleString() || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#A08D84]">
                            Event Date
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#241A17]">
                            {booking.eventDate}
                          </p>
                        </div>
                        {booking.message && (
                          <div className="sm:col-span-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#A08D84]">
                              Your Message
                            </p>
                            <p className="mt-1 text-sm italic text-[#6F5E56]">
                              {booking.message}
                            </p>
                          </div>
                        )}
                        {service?.description && (
                          <div className="sm:col-span-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#A08D84]">
                              About this service
                            </p>
                            <p className="mt-1 text-sm text-[#6F5E56]">
                              {service.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
