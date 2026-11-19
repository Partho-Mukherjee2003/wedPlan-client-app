"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import {useRouter} from "next/navigation"

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

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter()

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);

    try {
      const { error: signUpError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (signUpError) {
        setError(signUpError.message ?? "Google sign-up failed.");
      }
    } catch {
      setError("Could not connect to the authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!hasMinLength || !hasUppercase || !hasLowercase) {
      setError(
        "Password must be at least 8 characters and include uppercase and lowercase letters.",
      );
      return;
    }

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const role = String(formData.get("role")) as "customer" | "vendor";

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        password,
        role,
        callbackURL: "/",
      });

      if (signUpError) {
        setError(signUpError.message ?? "Account creation failed.");
      }
    } catch {
      setError("Could not connect to the authentication server.");
    } finally {
      setIsLoading(false);
    }
    router.push("/sign-in");
  };

  return (
    <div className="relative isolate flex min-h-[calc(100svh-4rem)] justify-center bg-[#FFF9F5] px-4 py-6 sm:px-6 sm:py-8 lg:items-center lg:py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[24px] border border-[#F0DCD5] bg-[#FDECEA] shadow-[0_12px_40px_rgba(90,40,30,0.07)] lg:min-h-[calc(100svh-9rem)] lg:grid-cols-2">
        {/* ===== Left side - Romantic heading - hidden on mobile ===== */}
        <section className="relative hidden flex-col justify-center overflow-hidden bg-[#FDECEA] px-8 py-12 sm:px-12 lg:flex xl:px-16">
          <Flower className="absolute -left-8 -top-8 h-40 w-40 text-[#F9DCDC]" />
          <Flower className="absolute -bottom-10 -right-10 h-44 w-44 text-[#F9DCDC]" />

          <div className="relative mx-auto w-full max-w-lg">
            <span className="inline-flex rounded-full bg-white px-4 py-1 text-xs font-bold tracking-widest text-[#C75B5B]">
              ✿ WEDPLAN
            </span>

            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-[#241A17] xl:text-5xl">
              Begin Your <span className="italic text-[#C75B5B]">Forever</span>
              <br />
              Journey With Us
            </h1>

            <p className="mt-4 max-w-md leading-relaxed text-[#6F5E56]">
              Join WedPlan and plan the wedding you have always dreamed of —
              beautiful venues, trusted vendors and everything in one place.
            </p>

            <div className="mt-8 flex flex-col gap-4 text-sm font-medium text-[#241A17]">
              <p>❤ &nbsp; Find trusted wedding vendors</p>
              <p>❤ &nbsp; Book venues, photography & catering</p>
              <p>❤ &nbsp; Manage all bookings in one dashboard</p>
            </div>

            <p className="mt-10 font-serif text-xl italic text-[#C75B5B]">
              “Two hearts, one beautiful beginning.”
            </p>
          </div>
        </section>

        {/* ===== Right side - Form ===== */}
        <section className="relative flex items-center justify-center bg-[#FFF9F5] px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <Flower className="absolute -right-6 top-6 h-24 w-24 text-[#FDECEA]" />

        <div className="relative w-full max-w-md rounded-[20px] border border-[#F0DCD5] bg-white p-6 shadow-[0_8px_30px_rgba(90,40,30,0.08)] sm:p-8 xl:p-10">
          <div className="mb-4 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDECEA] ring-1 ring-[#F0DCD5]">
              <Flower className="h-9 w-9 text-[#C75B5B]" />
            </span>
          </div>

          <h2 className="text-center font-serif text-3xl font-bold text-[#241A17]">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-[#6F5E56]">
            Join WedPlan — it only takes a minute
          </p>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-[#E8D5CE] bg-white py-3 text-sm font-semibold text-[#241A17] transition hover:bg-[#FFF9F5] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="text-lg font-bold text-[#4285F4]">G</span>
            Sign up with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-[#A08D84]">
            <span className="h-px flex-1 bg-[#F0DCD5]" />
            OR CONTINUE WITH EMAIL
            <span className="h-px flex-1 bg-[#F0DCD5]" />
          </div>

          {error && (
            <p role="alert" className="mb-5 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-semibold text-[#241A17]"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                required
                className="w-full rounded-xl border border-[#E8D5CE] px-4 py-3 text-sm outline-none placeholder:text-[#B8A89F] focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-semibold text-[#241A17]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-[#E8D5CE] px-4 py-3 text-sm outline-none placeholder:text-[#B8A89F] focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-semibold text-[#241A17]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E8D5CE] px-4 py-3 pr-16 text-sm outline-none placeholder:text-[#B8A89F] focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#C75B5B]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Password Rules */}
              <ul className="mt-2 space-y-1 text-xs">
                <li
                  className={hasMinLength ? "text-[#2E7D5B]" : "text-[#A08D84]"}
                >
                  {hasMinLength ? "✓" : "•"} Minimum 8 characters
                </li>
                <li
                  className={hasUppercase ? "text-[#2E7D5B]" : "text-[#A08D84]"}
                >
                  {hasUppercase ? "✓" : "•"} One uppercase letter (A-Z)
                </li>
                <li
                  className={hasLowercase ? "text-[#2E7D5B]" : "text-[#A08D84]"}
                >
                  {hasLowercase ? "✓" : "•"} One lowercase letter (a-z)
                </li>
              </ul>
            </div>

            {/* Account Role */}
            <div>
              <p className="mb-2 text-sm font-semibold text-[#241A17]">
                Account Role
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer rounded-xl border border-[#E8D5CE] px-4 py-3 text-center text-sm font-semibold text-[#6F5E56] has-checked:border-[#C75B5B] has-checked:bg-[#FDECEA] has-checked:text-[#C75B5B]">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    defaultChecked
                    className="hidden"
                  />
                  Customer
                </label>
                <label className="cursor-pointer rounded-xl border border-[#E8D5CE] px-4 py-3 text-center text-sm font-semibold text-[#6F5E56] has-checked:border-[#C75B5B] has-checked:bg-[#FDECEA] has-checked:text-[#C75B5B]">
                  <input
                    type="radio"
                    name="role"
                    value="vendor"
                    className="hidden"
                  />
                  Vendor
                </label>
              </div>
              <p className="mt-2 text-xs text-[#A08D84]">
                Admin accounts cannot be created here. Admin access is assigned
                securely by the WedPlan team.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-full bg-[#C75B5B] py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#B04A4A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6F5E56]">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#C75B5B] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
        </section>
      </div>
    </div>
  );
}
