"use client";

import { useState } from "react";
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
    // Stripe checkout ekhane bosbe - porer step e
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
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[#241A17]">
        Subscription
      </h1>
      <p className="mt-1 text-[#6F5E56]">
        Choose the plan that fits your business.
      </p>

      {message && (
        <p className="mt-4 rounded-xl bg-[#FFF3D6] px-4 py-3 text-sm font-medium text-[#A8864A]">
          {message}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              plan.isCurrent
                ? "rounded-[24px] border-2 border-[#C75B5B] bg-white p-6"
                : "rounded-[24px] border border-[#F0DCD5] bg-white p-6"
            }
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#241A17]">
                {plan.name}
              </h2>
              {plan.isCurrent && (
                <span className="rounded-full bg-[#FDECEA] px-3 py-1 text-xs font-bold text-[#C75B5B]">
                  Current Plan
                </span>
              )}
            </div>
            <p className="mt-3 font-serif text-4xl font-bold text-[#C75B5B]">
              {plan.price}
            </p>

            <ul className="mt-5 flex flex-col gap-2 text-sm text-[#6F5E56]">
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            {plan.name === "Premium Plan" && !plan.isCurrent && (
              <button
                onClick={handleUpgrade}
                className="mt-6 w-full rounded-full bg-[#C75B5B] py-3.5 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
