"use client";

import { useState } from "react";
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

// Wedding rings
function Rings({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="24" cy="16" r="12" stroke="#C9A86A" strokeWidth="3" />
      <circle cx="40" cy="16" r="12" stroke="#C75B5B" strokeWidth="3" />
    </svg>
  );
}

// Google logo
function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-6-2.2-7-5.1l-3.9 3C3.1 21.3 7.2 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-3.9-3C.4 8.3 0 10.1 0 12s.4 3.7 1.1 5.3l3.9-3z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.2 0 3.1 2.7 1.1 6.7l3.9 3c1-2.9 3.8-5 7-5z"
      />
    </svg>
  );
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Empty function for you - add your Google login here later
  const handleGoogleSignIn = () => {
    // Add your Google sign-in functionality here
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    setTimeout(() => {
      setIsLoading(false);
      alert(`Welcome back! Email: ${data.email}`);
    }, 1500);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#FFF9F5] px-4 py-10">
      {/* Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(20deg); opacity: 1; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(90vh) rotate(180deg); opacity: 0; }
        }
        .float-slow { animation: float 5s ease-in-out infinite; }
        .float-slower { animation: float 7s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fall { animation: fall 9s linear infinite; }
      `}</style>

      {/* ===== Marriage design on the whole page ===== */}
      {/* Top gold border */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#C9A86A] via-[#C75B5B] to-[#C9A86A]" />

      {/* Falling petals - whole page */}
      <span className="fall absolute left-[10%] top-0 text-lg text-[#C75B5B]">
        ❤
      </span>
      <span
        className="fall absolute left-[30%] top-0 text-sm text-[#C9A86A]"
        style={{ animationDelay: "2s" }}
      >
        ✿
      </span>
      <span
        className="fall absolute left-[55%] top-0 text-lg text-[#C75B5B]"
        style={{ animationDelay: "4s" }}
      >
        ❤
      </span>
      <span
        className="fall absolute left-[75%] top-0 text-sm text-[#C9A86A]"
        style={{ animationDelay: "1s" }}
      >
        ✿
      </span>
      <span
        className="fall absolute left-[90%] top-0 text-base text-[#C75B5B]"
        style={{ animationDelay: "6s" }}
      >
        ❤
      </span>

      {/* Corner flowers */}
      <Flower className="float-slow absolute -left-6 -top-6 h-32 w-32 text-[#F9DCDC]" />
      <Flower className="float-slower absolute -right-8 top-24 h-24 w-24 text-[#FDECEA]" />
      <Flower className="float-slow absolute -bottom-8 -left-8 h-28 w-28 text-[#FDECEA]" />
      <Flower className="float-slower absolute bottom-12 right-6 h-16 w-16 text-[#F9DCDC]" />

      {/* Side wedding rings decoration - desktop only */}
      <div className="pointer-events-none absolute left-8 top-1/2 hidden -translate-y-1/2 text-center lg:block">
        <Rings className="float-slow mx-auto h-10 w-20" />
        <p className="mt-2 font-serif text-lg italic text-[#C75B5B]">
          Together
          <br />
          Forever
        </p>
      </div>
      <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 text-center lg:block">
        <Rings className="float-slower mx-auto h-10 w-20" />
        <p className="mt-2 font-serif text-lg italic text-[#C75B5B]">
          Two Hearts
          <br />
          One Love
        </p>
      </div>

      {/* Card */}
      <div className="fade-up relative w-full max-w-md rounded-[20px] border border-[#F0DCD5] bg-white p-8 shadow-[0_8px_30px_rgba(90,40,30,0.08)] sm:p-10">
        <div className="mb-3 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDECEA] ring-1 ring-[#F0DCD5]">
            <Flower className="h-9 w-9 text-[#C75B5B]" />
          </span>
        </div>

        <Rings className="mx-auto mb-2 h-6 w-12" />

        <h1 className="text-center font-serif text-3xl font-bold text-[#241A17]">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-sm text-[#6F5E56]">
          Sign in to plan your beautiful wedding with WedPlan
        </p>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-full border border-[#E8D5CE] bg-white py-3 text-sm font-semibold text-[#241A17] transition-all hover:-translate-y-0.5 hover:bg-[#FFF9F5] hover:shadow-md"
        >
          <GoogleIcon className="h-5 w-5" />
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3 text-xs text-[#A08D84]">
          <span className="h-px flex-1 bg-[#F0DCD5]" />
          OR CONTINUE WITH EMAIL
          <span className="h-px flex-1 bg-[#F0DCD5]" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              className="w-full rounded-xl border border-[#E8D5CE] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#B8A89F] focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
            />
          </div>

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
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-[#E8D5CE] bg-white px-4 py-3 pr-16 text-sm outline-none placeholder:text-[#B8A89F] focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#C75B5B] hover:text-[#A93F3F]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-[#6F5E56]">
              <input
                type="checkbox"
                name="remember"
                className="accent-[#C75B5B]"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="font-medium text-[#C75B5B] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-full bg-[#C75B5B] py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#B04A4A] hover:shadow-[0_12px_32px_rgba(199,91,91,0.16)] active:bg-[#9E3D3D] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6F5E56]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#C75B5B] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Bottom gold border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A86A] via-[#C75B5B] to-[#C9A86A]" />
    </div>
  );
}
