"use client";

import { motion } from "framer-motion";

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

export default function Loading() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#FFF9F5] px-4">
      <div className="text-center">
        {/* Spinner with flower in middle */}
        <div className="relative mx-auto h-24 w-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-[#F3D9D0] border-t-[#C75B5B]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Flower className="h-10 w-10 text-[#C75B5B]" />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 font-serif text-2xl font-bold text-[#241A17]"
        >
          Wed<span className="text-[#C75B5B]">Plan</span>
        </motion.p>

        <p className="mt-2 text-sm text-[#6F5E56]">
          Loading your wedding dreams
          <span className="inline-flex">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              >
                .
              </motion.span>
            ))}
          </span>
        </p>

        {/* Progress bar */}
        <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-[#F3D9D0]">
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 rounded-full bg-[#C75B5B]"
          />
        </div>
      </div>
    </section>
  );
}
