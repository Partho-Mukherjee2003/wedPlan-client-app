"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ServiceType } from "@/app/Components/Service";
import { authClient } from "@/app/lib/auth-client";
import Image from "next/image";

type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: "admin" | "vendor" | "customer";
  isBlocked: boolean;
  businessName?: string | null;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt?: Date | string | null;
};

const vendorNames: Record<string, string> = {
  user_vendor_01: "Dream Wedding Studio",
  user_vendor_02: "Royal Palace Convention",
  user_vendor_03: "Bloom & Bliss Decor",
  user_vendor_04: "Taste of Dhaka Catering",
  user_vendor_05: "Glamour Bridal Studio",
};

function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="20"
          cy="10"
          rx="6"
          ry="9"
          fill="currentColor"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="4.5" fill="#C9A86A" />
    </svg>
  );
}

export default function ServiceDetails({ service }: { service: ServiceType }) {
  const vendorName = vendorNames[service.vendorId] || "WedPlan Vendor";
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as UserType | undefined;

  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isOwnService = user?.id === service.vendorId;
  const isAdmin = user?.role === "admin";

  const handleBookClick = () => {
    if (!user) {
      router.push(`/sign-in?callbackURL=/services/${service._id}`);
      return;
    }
    setShowForm(!showForm);
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const bookingData = {
      serviceId: service._id,
      vendorId: service.vendorId,
      customerId: user?.id,
      eventDate: String(formData.get("eventDate")),
      eventLocation: String(formData.get("eventLocation")),
      message: String(formData.get("message") || ""),
    };

    try {
      const res = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Booking failed. Please try again.");
        return;
      }

      setSuccess(
        "Booking request sent successfully! The vendor will review it soon.",
      );
      form.reset();
      setShowForm(false);
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FFF9F5] py-10 sm:py-14">
      <Flower className="absolute -left-6 top-10 h-24 w-24 text-[#FDECEA]" />
      <Flower className="absolute -right-6 bottom-10 h-28 w-28 text-[#FDECEA]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/services"
            className="text-sm font-semibold text-[#C75B5B] hover:underline"
          >
            ← Back to Services
          </Link>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left - Images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="group overflow-hidden rounded-[28px] shadow-[0_16px_40px_rgba(90,40,30,0.10)]">
              <Image
                src={service.images?.[0]}
                height={480}
                width={600}
                alt={service.serviceName}
                className="h-[380px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[480px]"
              />
            </div>

            {service.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {service.images.slice(1).map((img, index) => (
                  <motion.img
                    key={index}
                    src={img}
                    alt={`${service.serviceName} ${index + 2}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="h-24 w-full rounded-2xl object-cover sm:h-28"
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Right - Details */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full bg-[#FDECEA] px-4 py-1 text-xs font-bold tracking-widest text-[#C75B5B]"
            >
              {service.category}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 font-serif text-3xl font-bold leading-tight text-[#241A17] sm:text-4xl lg:text-5xl"
            >
              {service.serviceName}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 flex flex-wrap items-center gap-3 text-[#6F5E56]"
            >
              <span>📍 {service.location}</span>
              <span className="text-[#F0DCD5]">|</span>
              <span className="text-[#C9A86A]">★★★★★</span>
              <span className="text-sm">4.9 (120 reviews)</span>
            </motion.div>

            {/* Vendor card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 flex items-center gap-3 rounded-[20px] border border-[#F0DCD5] bg-white p-4"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEA] text-lg font-bold text-[#C75B5B]">
                {vendorName.charAt(0)}
              </span>
              <div>
                <p className="font-semibold text-[#241A17]">{vendorName}</p>
                <p className="text-xs text-[#A08D84]">
                  Verified Vendor • Premium
                </p>
              </div>
              <span className="ml-auto rounded-full bg-[#E6F4EC] px-3 py-1 text-xs font-semibold text-[#2E7D5B]">
                Available
              </span>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-5 rounded-[20px] border border-[#F0DCD5] bg-white p-6"
            >
              <h2 className="font-serif text-lg font-bold text-[#241A17]">
                About this service
              </h2>
              <p className="mt-2 leading-relaxed text-[#6F5E56]">
                {service.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#241A17]">
                <p>✓ Free consultation</p>
                <p>✓ Professional team</p>
                <p>✓ On-time delivery</p>
                <p>✓ Customizable package</p>
              </div>
            </motion.div>

            {/* Price + Booking card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-5 rounded-[20px] border border-[#F0DCD5] bg-[#241A17] p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60">Starting from</p>
                  <p className="font-serif text-3xl font-bold">
                    ৳{service.price.toLocaleString()}
                  </p>
                </div>
                <span className="rounded-full bg-[#C9A86A] px-3 py-1 text-xs font-bold text-[#241A17]">
                  BEST VALUE
                </span>
              </div>

              {isOwnService ? (
                <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-center text-sm text-white/80">
                  This is your own service. You cannot book it.
                </p>
              ) : isAdmin ? (
                <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-center text-sm text-white/80">
                  Admin accounts cannot submit booking requests.
                </p>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookClick}
                  className="mt-5 w-full rounded-full bg-[#C75B5B] py-4 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
                >
                  {showForm ? "Cancel Booking" : "Book This Service →"}
                </motion.button>
              )}

              <p className="mt-3 text-center text-xs text-white/60">
                No payment needed now • Free cancellation for pending bookings
              </p>
            </motion.div>

            {/* Success / Error */}
            {error && (
              <p className="mt-4 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-4 rounded-xl bg-[#E6F4EC] px-4 py-3 text-sm font-medium text-[#2E7D5B]">
                {success}
              </p>
            )}

            {/* Booking Form - click korlei ashbe */}
            <AnimatePresence>
              {showForm && !isOwnService && !isAdmin && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleBooking}
                  className="overflow-hidden"
                >
                  <div className="mt-5 flex flex-col gap-4 rounded-[20px] border border-[#F0DCD5] bg-white p-6">
                    <h3 className="font-serif text-lg font-bold text-[#241A17]">
                      Booking Request
                    </h3>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-[#241A17]">
                        Event Date
                      </label>
                      <input
                        name="eventDate"
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-xl border border-[#E8D5CE] px-4 py-3 text-sm outline-none focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-[#241A17]">
                        Event Location
                      </label>
                      <input
                        name="eventLocation"
                        type="text"
                        placeholder="e.g. Mirpur DOHS Community Centre, Dhaka"
                        required
                        className="w-full rounded-xl border border-[#E8D5CE] px-4 py-3 text-sm outline-none placeholder:text-[#B8A89F] focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-[#241A17]">
                        Message
                      </label>
                      <textarea
                        name="message"
                        placeholder="Write a message for the vendor..."
                        rows={3}
                        className="w-full rounded-xl border border-[#E8D5CE] px-4 py-3 text-sm outline-none placeholder:text-[#B8A89F] focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-full bg-[#C75B5B] py-3.5 text-sm font-semibold text-white transition hover:bg-[#B04A4A] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isLoading ? "Sending..." : "Send Booking Request"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
