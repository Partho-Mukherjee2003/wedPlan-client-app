"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E6F4EC] text-5xl"
      >
        ✅
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-7 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl"
      >
        Payment <span className="italic text-[#2E7D5B]">Successful!</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-3 max-w-md text-[#6F5E56]"
      >
        Thank you! Your Premium plan is being activated. It may take a few
        seconds — please refresh your dashboard to see your new plan.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        <Link
          href="/dashboard/vendor"
          className="rounded-full bg-[#C75B5B] px-8 py-3.5 font-semibold text-white transition hover:bg-[#B04A4A]"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/"
          className="rounded-full border border-[#E8D5CE] bg-white px-8 py-3.5 font-semibold text-[#241A17] transition hover:border-[#C75B5B] hover:text-[#C75B5B]"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
