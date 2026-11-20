"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

type CustomerType = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  image?: string | null;
};

const statusColors: Record<BookingType["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-600",
};

// Dummy customer der naam (database e na thakle fallback)
const dummyCustomers: Record<string, { name: string; email: string }> = {
  user_customer_01: { name: "Tanvir Ahmed", email: "tanvir@example.com" },
  user_customer_02: { name: "Sharmin Akter", email: "sharmin@example.com" },
  user_customer_03: { name: "Arif Chowdhury", email: "arif@example.com" },
  user_customer_04: { name: "Lamia Sultana", email: "lamia@example.com" },
};

export default function VendorBookingsPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reloadBookings = async () => {
    if (!userId) return;
    try {
      const [bookingRes, serviceRes, userRes] = await Promise.all([
        fetch(
          `${process.env.SERVER_URL || "http://localhost:5000"}/bookings?vendorId=${userId}`,
        ),
        fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/services`),
        fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/users`),
      ]);
      const bookingData = await bookingRes.json();
      const serviceData = await serviceRes.json();
      const userData = await userRes.json();
      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
      setCustomers(Array.isArray(userData) ? userData : []);
    } catch {
      setError("Could not load booking requests. Please try again.");
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
            `${process.env.SERVER_URL || "http://localhost:5000"}/bookings?vendorId=${userId}`,
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
        setCustomers(Array.isArray(userData) ? userData : []);
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

  const getService = (serviceId: string): ServiceType | undefined =>
    services.find((service) => service._id === serviceId);

  const getCustomer = (customerId: string) => {
    const found = customers.find((c) => (c._id || c.id) === customerId);
    if (found) {
      return {
        name: found.name,
        email: found.email,
        image: found.image || "https://randomuser.me/api/portraits/lego/1.jpg",
      };
    }
    const dummy = dummyCustomers[customerId];
    return {
      name: dummy?.name || "WedPlan Customer",
      email: dummy?.email || "",
      image: "https://randomuser.me/api/portraits/lego/1.jpg",
    };
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
        <p className="text-[#6F5E56]">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
          Booking <span className="italic text-[#C75B5B]">Requests</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">
          You have {bookings.length} booking request
          {bookings.length !== 1 ? "s" : ""} in total.
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
            No booking requests yet
          </p>
          <p className="mt-1.5 text-sm text-[#6F5E56]">
            When customers book your services, their requests will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {bookings.map((booking, index) => {
            const service = getService(booking.serviceId);
            const customer = getCustomer(booking.customerId);
            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-[24px] border border-[#F0DCD5] bg-white p-5 shadow-[0_8px_30px_rgba(90,40,30,0.06)]"
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
                    <p className="font-serif text-lg font-bold text-[#241A17]">
                      {service?.serviceName || "Wedding Service"}
                    </p>
                    <p className="mt-1 text-sm text-[#6F5E56]">
                      📅 {booking.eventDate} • 📍 {booking.eventLocation}
                    </p>
                    {booking.message && (
                      <p className="mt-1.5 text-sm italic text-[#6F5E56]">
                        {booking.message}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ${statusColors[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Customer Information */}
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-[#FFF9F5] p-3 ring-1 ring-[#F7E8E2]">
                  <Image
                    width={44}
                    height={44}
                    src={customer.image}
                    alt={customer.name}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[#F0DCD5]"
                  />
                  <div className="min-w-[180px] flex-1">
                    <p className="text-sm font-semibold text-[#241A17]">
                      {customer.name}
                    </p>
                    {customer.email && (
                      <p className="text-xs text-[#A08D84]">{customer.email}</p>
                    )}
                  </div>
                  {booking.createdAt && (
                    <p className="text-xs text-[#A08D84]">
                      Requested on {formatDate(booking.createdAt)}
                    </p>
                  )}
                </div>

                {booking.status === "pending" && (
                  <div className="mt-4 flex gap-3 border-t border-[#F7E8E2] pt-4">
                    <button
                      onClick={() => handleStatus(booking._id, "accepted")}
                      className="flex-1 rounded-full bg-[#2E7D5B] py-2.5 text-xs font-semibold text-white transition hover:bg-[#256B4D]"
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => handleStatus(booking._id, "rejected")}
                      className="flex-1 rounded-full bg-[#DC2626] py-2.5 text-xs font-semibold text-white transition hover:bg-[#B91C1C]"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
