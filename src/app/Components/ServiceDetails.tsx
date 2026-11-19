"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ServiceType } from "@/app/Components/service";

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
              <img
                src={service.images?.[0]}
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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-5 w-full rounded-full bg-[#C75B5B] py-4 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
              >
                Book This Service →
              </motion.button>

              <p className="mt-3 text-center text-xs text-white/60">
                No payment needed now • Free cancellation for pending bookings
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
