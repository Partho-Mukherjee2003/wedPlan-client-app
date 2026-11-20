"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";

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

const freeFeatures = [
  "Up to 3 active services",
  "Receive booking requests",
  "Basic vendor profile",
  "Standard support",
];

const premiumFeatures = [
  "Unlimited services",
  "Premium vendor badge on all services",
  "Priority listing in search",
  "Receive booking requests",
  "Priority support",
];

export default function SubscriptionPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as UserType | undefined;
  const currentPlan = user?.subscriptionPlan || "free";

  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    if (!user) return;

    setUpgrading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId: user.id, vendorEmail: user.email }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.message || "Could not start payment. Please try again.");
        setUpgrading(false);
        return;
      }

      // Stripe er payment page e pathiye dao
      window.location.href = data.url;
    } catch {
      setError("Could not start payment. Please try again.");
      setUpgrading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
          Subscription <span className="italic text-[#C75B5B]">Plans</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">
          You are currently on the{" "}
          <span className="font-bold capitalize text-[#241A17]">
            {currentPlan}
          </span>{" "}
          plan.
        </p>
      </motion.div>

      {error && (
        <p className="mx-auto mt-5 max-w-xl rounded-xl bg-[#FDECEC] px-4 py-3 text-center text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Free plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[28px] border border-[#F0DCD5] bg-white p-7 shadow-[0_8px_30px_rgba(90,40,30,0.05)]"
        >
          <p className="font-serif text-xl font-bold text-[#241A17]">
            Free Plan
          </p>
          <p className="mt-3 font-serif text-4xl font-bold text-[#241A17]">
            ৳0
            <span className="text-base font-normal text-[#A08D84]">
              {" "}
              / forever
            </span>
          </p>

          <ul className="mt-6 space-y-3">
            {freeFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2.5 text-sm text-[#6F5E56]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FDECEA] text-xs font-bold text-[#C75B5B]">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          {currentPlan === "free" ? (
            <button
              disabled
              className="mt-7 w-full cursor-not-allowed rounded-full bg-[#F3D9D0] py-3.5 font-semibold text-[#A08D84]"
            >
              Current Plan
            </button>
          ) : (
            <button
              disabled
              className="mt-7 w-full cursor-not-allowed rounded-full border border-[#E8D5CE] py-3.5 font-semibold text-[#A08D84]"
            >
              Free Plan
            </button>
          )}
        </motion.div>

        {/* Premium plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-[28px] bg-[#241A17] p-7 text-white shadow-[0_20px_50px_rgba(36,26,23,0.25)]"
        >
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#C9A86A] to-[#F0D9A8] px-5 py-1.5 text-xs font-bold text-[#241A17]">
            ★ POPULAR
          </span>

          <p className="font-serif text-xl font-bold text-[#F0D9A8]">
            Premium Plan
          </p>
          <p className="mt-3 font-serif text-4xl font-bold text-white">
            ৳4,999
            <span className="text-base font-normal text-white/50">
              {" "}
              / 30 days
            </span>
          </p>

          <ul className="mt-6 space-y-3">
            {premiumFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2.5 text-sm text-white/80"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A86A]/25 text-xs font-bold text-[#F0D9A8]">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          {currentPlan === "premium" ? (
            <button
              disabled
              className="mt-7 w-full cursor-not-allowed rounded-full bg-gradient-to-r from-[#C9A86A] to-[#F0D9A8] py-3.5 font-semibold text-[#241A17]"
            >
              ★ Current Plan
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="mt-7 w-full rounded-full bg-[#C75B5B] py-3.5 font-semibold text-white transition hover:bg-[#B04A4A] disabled:opacity-60"
            >
              {upgrading ? "Redirecting to payment..." : "Upgrade to Premium"}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
