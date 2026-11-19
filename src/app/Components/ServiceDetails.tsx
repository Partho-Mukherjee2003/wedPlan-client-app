"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";
import { ServiceType } from "@/app/Components/Service";

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
  role: "admin" | "vendor" | "customer";
};

// Dummy vendor der naam (database e na thakle fallback)
const vendorNames: Record<string, string> = {
  user_vendor_01: "Dream Wedding Studio",
  user_vendor_02: "Royal Palace Convention",
  user_vendor_03: "Bloom & Bliss Decor",
  user_vendor_04: "Taste of Dhaka Catering",
  user_vendor_05: "Glamour Bridal Studio",
};

// Dummy premium vendor ra (01, 02, 05 premium — 03, 04 free)
const dummyPremiumVendors = [
  "user_vendor_01",
  "user_vendor_02",
  "user_vendor_05",
];

const features = [
  "Free consultation",
  "Professional team",
  "On-time delivery",
  "Customizable package",
];

export default function ServiceDetails({ service }: { service: ServiceType }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as UserType | undefined;

  const [vendor, setVendor] = useState<VendorType | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Database theke asol vendor er tothho ano
  useEffect(() => {
    const loadVendor = async () => {
      try {
        const res = await fetch(
          `${process.env.SERVER_URL || "http://localhost:5000"}/users`,
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find(
            (u: VendorType) => (u._id || u.id) === service.vendorId,
          );
          setVendor(found || null);
        }
      } catch {
        setVendor(null);
      }
    };

    loadVendor();
  }, [service.vendorId]);

  // Premium kina check — database e vendor thakle tar plan, na thakle dummy list
  const isPremiumVendor = vendor
    ? vendor.subscriptionPlan === "premium"
    : dummyPremiumVendors.includes(service.vendorId);

  const vendorName =
    vendor?.businessName ||
    vendor?.name ||
    vendorNames[service.vendorId] ||
    "WedPlan Vendor";

  const vendorImage =
    vendor?.image || "https://randomuser.me/api/portraits/lego/1.jpg";

  const isOwnService = user?.id === service.vendorId;
  const isAdmin = user?.role === "admin";

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      router.push(`/sign-in?callbackURL=/services/${service._id}`);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    setIsBooking(true);

    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId: service._id,
            vendorId: service.vendorId,
            customerId: user.id,
            eventDate: String(formData.get("eventDate")),
            eventLocation: String(formData.get("eventLocation")),
            message: String(formData.get("message") || ""),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not complete the booking.");
        return;
      }

      setSuccess("Booking request sent! The vendor will review it soon.");
      form.reset();
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setIsBooking(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const inputClass =
    "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#C9A86A]";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left side - service details */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="overflow-hidden rounded-[28px] border border-[#F0DCD5] bg-white shadow-[0_8px_30px_rgba(90,40,30,0.06)]">
            <img
              src={service.images?.[0]}
              alt={service.serviceName}
              className="h-72 w-full object-cover sm:h-96"
            />

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#FDECEA] px-3.5 py-1.5 text-xs font-bold text-[#C75B5B]">
                  {service.category}
                </span>
                <span className="rounded-full bg-[#FFF9F5] px-3.5 py-1.5 text-xs font-bold text-[#6F5E56] ring-1 ring-[#F0DCD5]">
                  📍 {service.location}
                </span>
              </div>

              <h1 className="mt-4 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
                {service.serviceName}
              </h1>

              <p className="mt-2 text-sm text-[#A08D84]">
                ⭐ 4.9 (120 reviews)
              </p>

              <p className="mt-5 leading-relaxed text-[#6F5E56]">
                {service.description}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <p
                    key={feature}
                    className="flex items-center gap-2 text-sm text-[#6F5E56]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FDECEA] text-xs text-[#C75B5B]">
                      ✓
                    </span>
                    {feature}
                  </p>
                ))}
              </div>

              {/* Vendor card - ekhon real data */}
              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[24px] bg-[#FFF9F5] p-5 ring-1 ring-[#F0DCD5]">
                <img
                  src={vendorImage}
                  alt={vendorName}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-[#F0DCD5]"
                />
                <div className="min-w-[200px] flex-1">
                  <p className="font-serif text-xl font-bold text-[#241A17]">
                    {vendorName}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#E6F4EC] px-3 py-1 text-xs font-bold text-[#2E7D5B]">
                      ✓ Verified Vendor
                    </span>

                    {/* Premium badge - sudhu asol premium vendor er jonno */}
                    {isPremiumVendor && (
                      <motion.span
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, #C9A86A, #EADFC6, #C9A86A)",
                          backgroundSize: "200% auto",
                        }}
                        className="rounded-full px-3 py-1 text-xs font-bold text-[#241A17] shadow-[0_4px_14px_rgba(201,168,106,0.45)]"
                      >
                        ★ Premium Vendor
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - price + booking card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="h-fit rounded-[28px] bg-[#241A17] p-6 text-white shadow-[0_16px_40px_rgba(36,26,23,0.25)] sm:p-7 lg:sticky lg:top-24"
        >
          <p className="text-sm text-white/60">Starting Price</p>
          <p className="mt-2 font-serif text-4xl font-bold text-[#C9A86A]">
            ৳{service.price.toLocaleString()}
          </p>

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

          {isOwnService ? (
            <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/80">
              This is your own service. You cannot book it.
            </p>
          ) : isAdmin ? (
            <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/80">
              Admin accounts cannot make bookings.
            </p>
          ) : (
            <form onSubmit={handleBooking} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Event Date
                </label>
                <input
                  name="eventDate"
                  type="date"
                  required
                  min={today}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Event Location
                </label>
                <input
                  name="eventLocation"
                  type="text"
                  required
                  placeholder="e.g. Mirpur, Dhaka"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Message (optional)
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Tell the vendor about your event..."
                  className={inputClass}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isBooking}
                className="w-full rounded-full bg-[#C75B5B] py-3.5 text-sm font-semibold text-white transition hover:bg-[#B04A4A] disabled:opacity-70"
              >
                {isBooking ? "Booking..." : "Book This Service"}
              </motion.button>
              {!user && (
                <p className="text-center text-xs text-white/50">
                  You need to sign in to book this service.
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
