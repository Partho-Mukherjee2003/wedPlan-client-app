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

// Animation variants - lite and smooth
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function HowWedPlanWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      {/* Soft flowers - halka float animation */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-10"
      >
        <Flower className="h-24 w-24 text-[#FDECEA]" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-6 bottom-10"
      >
        <Flower className="h-28 w-28 text-[#FDECEA]" />
      </motion.div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block rounded-full bg-[#FDECEA] px-4 py-1 text-xs font-bold tracking-widest text-[#C75B5B]"
          >
            ✿ HOW IT WORKS
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mt-4 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl lg:text-5xl"
          >
            Plan Your Wedding in{" "}
            <span className="italic text-[#C75B5B]">3 Easy Steps</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-3 max-w-xl text-[#6F5E56]"
          >
            No stress, no confusion. Just three simple steps from dreaming to
            celebrating.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-14">
          {/* Animated connecting line - desktop only */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            className="absolute left-[16%] right-[16%] top-12 hidden origin-left border-t-2 border-dashed border-[#C75B5B]/30 md:block"
          />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="group relative rounded-[24px] border border-[#F0DCD5] bg-[#FFF9F5] p-8 text-center shadow-[0_8px_30px_rgba(90,40,30,0.05)] hover:shadow-[0_16px_40px_rgba(199,91,91,0.14)]"
              >
                {/* Step number - scale animation */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                  className="absolute right-5 top-5 font-serif text-5xl font-bold text-[#F9DCDC]"
                >
                  {step.number}
                </motion.span>

                {/* Icon - halka floating loop */}
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.4,
                  }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FDECEA] text-3xl ring-1 ring-[#F0DCD5] transition group-hover:bg-[#C75B5B] group-hover:text-white"
                >
                  {step.icon}
                </motion.span>

                <h3 className="mt-5 font-serif text-xl font-bold text-[#241A17]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6F5E56]">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Link
              href="/services"
              className="inline-block rounded-full bg-[#C75B5B] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B04A4A] hover:shadow-[0_12px_32px_rgba(199,91,91,0.16)]"
            >
              Start Planning Now →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
