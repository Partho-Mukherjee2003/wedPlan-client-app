"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";

type UserType = {
  subscriptionPlan: "free" | "premium";
};

export default function SubscriptionPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as UserType | undefined;
  const currentPlan = user?.subscriptionPlan || "free";
  const [message, setMessage] = useState("");

  const handleUpgrade = () => {
    setMessage("Stripe payment will be connected in the next step.");
  };

  const plans = [
    {
      name: "Free Plan",
      price: "৳0",
      features: [
        "Maximum 3 Active Services",
        "Basic Vendor Dashboard",
        "Booking Request Management",
      ],
      isCurrent: currentPlan === "free",
      isPremium: false,
    },
    {
      name: "Premium Plan",
      price: "৳4,999",
      features: [
        "Unlimited Active Services",
        "Premium Vendor Badge",
        "All Free Plan Features",
      ],
      isCurrent: currentPlan === "premium",
      isPremium: true,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
          <span className="italic text-[#C75B5B]">Subscription</span> Plans
        </h1>
        <p className="mt-2 text-[#6F5E56]">
          Choose the plan that fits your business.
        </p>
      </motion.div>

      {message && (
        <p className="mx-auto mt-5 max-w-xl rounded-xl bg-[#FFF3D6] px-4 py-3 text-center text-sm font-medium text-[#A8864A]">
          {message}
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -6 }}
            className={
              plan.isPremium
                ? "relative overflow-hidden rounded-[28px] bg-[#241A17] p-7 text-white shadow-[0_16px_40px_rgba(36,26,23,0.25)]"
                : plan.isCurrent
                  ? "rounded-[28px] border-2 border-[#C75B5B] bg-white p-7 shadow-[0_8px_30px_rgba(90,40,30,0.06)]"
                  : "rounded-[28px] border border-[#F0DCD5] bg-white p-7 shadow-[0_8px_30px_rgba(90,40,30,0.06)]"
            }
          >
            {plan.isPremium && (
              <span className="absolute right-5 top-5 rounded-full bg-[#C9A86A] px-3 py-1 text-xs font-bold text-[#241A17]">
                ★ POPULAR
              </span>
            )}

            <div className="flex items-center gap-3">
              <h2
                className={`font-serif text-2xl font-bold ${plan.isPremium ? "text-white" : "text-[#241A17]"}`}
              >
                {plan.name}
              </h2>
              {plan.isCurrent && (
                <span className="rounded-full bg-[#FDECEA] px-3 py-1 text-xs font-bold text-[#C75B5B]">
                  Current Plan
                </span>
              )}
            </div>

            <p
              className={`mt-4 font-serif text-5xl font-bold ${plan.isPremium ? "text-[#C9A86A]" : "text-[#C75B5B]"}`}
            >
              {plan.price}
            </p>

            <ul
              className={`mt-6 flex flex-col gap-3 text-sm ${plan.isPremium ? "text-white/80" : "text-[#6F5E56]"}`}
            >
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${plan.isPremium ? "bg-[#C9A86A] text-[#241A17]" : "bg-[#FDECEA] text-[#C75B5B]"}`}
                  >
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {plan.isPremium && !plan.isCurrent && (
              <button
                onClick={handleUpgrade}
                className="mt-7 w-full rounded-full bg-[#C75B5B] py-3.5 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
              >
                Upgrade to Premium →
              </button>
            )}

            {!plan.isPremium && plan.isCurrent && (
              <p className="mt-7 rounded-full bg-[#FFF9F5] py-3 text-center text-xs font-semibold text-[#A08D84]">
                You are on the Free Plan
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
