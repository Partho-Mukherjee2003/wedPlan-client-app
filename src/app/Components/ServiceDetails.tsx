"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ServiceType } from "@/app/Components/Service";
import { authClient } from "@/app/lib/auth-client";
import Image from "next/image";
type VendorType = {
  _id?: string;
  id?: string;
  name: string;
  image?: string | null;
  businessName?: string;
  subscriptionPlan?: "free" | "premium";
};

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
  businessName?: string;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt?: string;
};

const dummyVendors: Record<
  string,
  { name: string; businessName: string; premium: boolean }
> = {
  user_vendor_01: {
    name: "Ayesha Rahman",
    businessName: "Dream Wedding Studio",
    premium: true,
  },
  user_vendor_02: {
    name: "Tanvir Hasan",
    businessName: "Royal Palace Convention",
    premium: true,
  },
  user_vendor_03: {
    name: "Nusrat Jahan",
    businessName: "Bloom & Bliss Decor",
    premium: false,
  },
  user_vendor_04: {
    name: "Rakibul Islam",
    businessName: "Taste of Dhaka Catering",
    premium: false,
  },
  user_vendor_05: {
    name: "Mehjabin Chowdhury",
    businessName: "Glamour Bridal Studio",
    premium: true,
  },
};

const features = [
  "Dedicated wedding coordinator",
  "Customized package options",
  "Professional team with experience",
  "On-time setup and delivery",
  "Flexible payment options",
];

export default function ServiceDetails({ service }: { service: ServiceType }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as UserType | undefined;

  const [vendor, setVendor] = useState<VendorType | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVendor = async () => {
      try {
        const res = await fetch(
          `${process.env.SERVER_URL || "http://localhost:5000"}/users`,
        );
        const users = await res.json();
        if (Array.isArray(users)) {
          const found = users.find(
            (u: VendorType) => (u._id || u.id) === service.vendorId,
          );
          if (found) setVendor(found);
        }
      } catch {
        setVendor(null);
      }
    };

    loadVendor();
  }, [service.vendorId]);

  const dummyVendor = dummyVendors[service.vendorId];
  const vendorName =
    vendor?.businessName ||
    vendor?.name ||
    dummyVendor?.businessName ||
    dummyVendor?.name ||
    "WedPlan Vendor";
  const vendorImage =
    vendor?.image || "https://randomuser.me/api/portraits/lego/1.jpg";
  const isPremiumVendor = vendor
    ? vendor.subscriptionPlan === "premium"
    : dummyVendor?.premium || false;

  const images =
    service.images && service.images.length > 0
      ? service.images
      : [
          "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
        ];

  const isOwnService = user && user.id === service.vendorId;
  const isAdmin = user?.role === "admin";
  const isApproved = service.status === "approved";

  const handleBookClick = () => {
    if (!user) {
      router.push(`/sign-in?callbackURL=/services/${service._id}`);
      return;
    }
    setShowForm(true);
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setMessage("");
    setError("");

    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    const bookingData = {
      serviceId: service._id,
      vendorId: service.vendorId,
      customerId: user.id,
      eventDate: formValues.eventDate,
      eventLocation: formValues.eventLocation,
      message: formValues.message,
    };

    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not send your booking request.");
        return;
      }

      setMessage("Booking request sent! The vendor will review it soon.");
      setShowForm(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: images + details */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-2"
        >
          {/* Main image */}
          <div className="overflow-hidden rounded-[28px] border border-[#F0DCD5] shadow-[0_12px_40px_rgba(90,40,30,0.08)]">
            <Image
              src={images[selectedImage]}
              alt={service.serviceName}
              width={640}
              height={420}
              className="h-[320px] w-full object-cover sm:h-[420px]"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={
                    selectedImage === index
                      ? "overflow-hidden rounded-xl ring-[3px] ring-[#C75B5B]"
                      : "overflow-hidden rounded-xl opacity-70 transition hover:opacity-100"
                  }
                >
                  <Image
                    width={112}
                    height={80}
                    src={image}
                    alt={`${service.serviceName} photo ${index + 1}`}
                    className="h-20 w-28 object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#FDECEA] px-4 py-1.5 text-xs font-bold text-[#C75B5B]">
              {service.category}
            </span>
            <span className="text-sm text-[#6F5E56]">
              📍 {service.location}
            </span>
            <span className="text-sm font-semibold text-[#C9A86A]">
              ★ 4.9 (120 reviews)
            </span>
            {!isApproved && (
              <span className="rounded-full bg-yellow-100 px-4 py-1.5 text-xs font-bold capitalize text-yellow-700">
                {service.status}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
            {service.serviceName}
          </h1>

          <p className="mt-4 leading-relaxed text-[#6F5E56]">
            {service.description}
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-[#241A17]">
            {"What's Included"}
          </h2>
          <ul className="mt-3 space-y-2.5">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2.5 text-[#6F5E56]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FDECEA] text-xs font-bold text-[#C75B5B]">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          {/* Vendor card */}
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[24px] border border-[#F0DCD5] bg-white p-5">
            <Image
              width={64}
              height={64}
              src={vendorImage}
              alt={vendorName}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-[#F0DCD5]"
            />
            <div className="min-w-[200px] flex-1">
              <p className="font-serif text-lg font-bold text-[#241A17]">
                {vendorName}
              </p>
              <p className="text-sm text-[#A08D84]">Wedding Service Provider</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#E6F4EC] px-4 py-1.5 text-xs font-bold text-[#2E7D5B]">
                ✓ Verified Vendor
              </span>
              {isPremiumVendor && (
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="rounded-full bg-gradient-to-r from-[#C9A86A] via-[#F0D9A8] to-[#C9A86A] bg-[length:200%_100%] px-4 py-1.5 text-xs font-bold text-[#241A17]"
                >
                  ★ Premium Vendor
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right: price + booking card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <div className="rounded-[28px] bg-[#241A17] p-7 text-white shadow-[0_20px_50px_rgba(36,26,23,0.25)] lg:sticky lg:top-24">
            <p className="text-sm text-white/60">Starting from</p>
            <p className="mt-1 font-serif text-4xl font-bold text-[#F0D9A8]">
              ৳{service.price.toLocaleString()}
            </p>

            {message && (
              <p className="mt-5 rounded-xl bg-green-500/15 px-4 py-3 text-sm font-medium text-green-300">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-5 rounded-xl bg-red-500/15 px-4 py-3 text-sm font-medium text-red-300">
                {error}
              </p>
            )}

            {!isApproved ? (
              <p className="mt-5 rounded-xl bg-yellow-500/15 px-4 py-3 text-sm font-medium text-yellow-200">
                This service is not available for booking right now.
              </p>
            ) : isOwnService ? (
              <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white/80">
                This is your own service. You cannot book it.
              </p>
            ) : isAdmin ? (
              <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white/80">
                Admin accounts cannot make bookings.
              </p>
            ) : !showForm ? (
              <button
                onClick={handleBookClick}
                className="mt-6 w-full rounded-full bg-[#C75B5B] py-3.5 font-semibold text-white transition hover:bg-[#B04A4A]"
              >
                Book This Service
              </button>
            ) : (
              <form onSubmit={handleBooking} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/80">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    min={today}
                    required
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none [color-scheme:dark] focus:border-[#C9A86A]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80">
                    Event Location
                  </label>
                  <input
                    name="eventLocation"
                    required
                    placeholder="e.g. Banani, Dhaka"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#C9A86A]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Tell the vendor about your event..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#C9A86A]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#C75B5B] py-3.5 font-semibold text-white transition hover:bg-[#B04A4A] disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Booking Request"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
