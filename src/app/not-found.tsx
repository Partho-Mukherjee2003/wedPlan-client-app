"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#FFF9F5] px-4 py-16">
      {/* Background flowers */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -left-10 top-10"
      >
        <Flower className="h-32 w-32 text-[#FDECEA]" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute -right-10 bottom-10"
      >
        <Flower className="h-36 w-36 text-[#FDECEA]" />
      </motion.div>

      <div className="relative text-center">
        {/* Floating rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto h-24 w-32"
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-2 top-2 block h-16 w-16 rounded-full border-4 border-[#C9A86A]"
          />
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute right-2 top-6 block h-16 w-16 rounded-full border-4 border-[#C75B5B]"
          />
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 font-serif text-7xl font-bold text-[#C75B5B] sm:text-8xl"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl"
        >
          This Page Said{" "}
          <span className="italic text-[#C75B5B]">Not Today</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-4 max-w-md leading-relaxed text-[#6F5E56]"
        >
          The page you are looking for could not be found. It may have been
          moved, or the link might be wrong. Lets take you back to
          your wedding planning journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="rounded-full bg-[#C75B5B] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
          >
            ← Back to Home
          </Link>
          <Link
            href="/services"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#C75B5B] ring-1 ring-[#F0DCD5] transition hover:bg-[#FDECEA]"
          >
            Browse Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
