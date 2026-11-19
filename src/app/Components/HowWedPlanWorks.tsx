"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Simple flower for decoration
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

const steps = [
  {
    number: "01",
    icon: "🔍",
    title: "Browse Services",
    text: "Explore 500+ trusted venues, photographers, caterers and decorators. Search by category, price and location.",
  },
  {
    number: "02",
    icon: "💌",
    title: "Book Your Vendor",
    text: "Send a booking request with your event date and location. The vendor will accept it within 24 hours.",
  },
  {
    number: "03",
    icon: "❤",
    title: "Celebrate Your Day",
    text: "Relax and enjoy your wedding. Track all your bookings from one beautiful dashboard.",
  },
];

export default function HowWedPlanWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      {/* Soft flowers */}
      <Flower className="absolute -left-6 top-10 h-24 w-24 text-[#FDECEA]" />
      <Flower className="absolute -right-6 bottom-10 h-28 w-28 text-[#FDECEA]" />

      {/* Container */}
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Heading - fade up on scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="rounded-full bg-[#FDECEA] px-4 py-1 text-xs font-bold tracking-widest text-[#C75B5B]">
            ✿ HOW IT WORKS
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
            Plan Your Wedding in{" "}
            <span className="italic text-[#C75B5B]">3 Easy Steps</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#6F5E56]">
            No stress, no confusion. Just three simple steps from dreaming to
            celebrating.
          </p>
        </motion.div>

        {/* Steps - stagger animation */}
        <div className="relative mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Connecting dashed line - desktop only */}
          <div className="absolute left-[16%] right-[16%] top-12 hidden border-t-2 border-dashed border-[#F0DCD5] md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="relative rounded-[20px] border border-[#F0DCD5] bg-[#FFF9F5] p-8 text-center shadow-[0_8px_30px_rgba(90,40,30,0.05)] transition-shadow hover:shadow-[0_12px_32px_rgba(199,91,91,0.12)]"
            >
              {/* Step number */}
              <span className="absolute right-5 top-5 font-serif text-4xl font-bold text-[#F9DCDC]">
                {step.number}
              </span>

              {/* Icon */}
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FDECEA] text-3xl ring-1 ring-[#F0DCD5]">
                {step.icon}
              </span>

              <h3 className="mt-5 font-serif text-xl font-bold text-[#241A17]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6F5E56]">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <Link
            href="/services"
            className="inline-block rounded-full bg-[#C75B5B] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B04A4A] hover:shadow-[0_12px_32px_rgba(199,91,91,0.16)]"
          >
            Start Planning Now →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
