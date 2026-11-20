import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardSidebar from "@/app/Components/DashboardSidebar";

export const dynamic = "force-dynamic";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "vendor" | "customer";
  isBlocked?: boolean;
  subscriptionPlan: "free" | "premium";
};

type DbUser = {
  _id?: string;
  id?: string;
  email: string;
  isBlocked?: boolean;
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const user = session.user as unknown as UserType;

  // Database theke fresh blocked status ano (session e nao thakte pare)
  let isBlocked = user.isBlocked === true;

  try {
    const res = await fetch(
      `${process.env.SERVER_URL || "http://localhost:5000"}/users`,
      { cache: "no-store" },
    );
    const data = await res.json();
    if (Array.isArray(data)) {
      const dbUser = data.find(
        (u: DbUser) => (u._id || u.id) === user.id || u.email === user.email,
      );
      if (dbUser) isBlocked = dbUser.isBlocked === true;
    }
  } catch {
    // Backend bondho thakle session er value tai use hobe
  }

  // Blocked user dashboard e dhukte parbe na
  if (isBlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F5] px-4">
        <div className="max-w-md rounded-[28px] border border-[#F0DCD5] bg-white p-8 text-center shadow-[0_8px_30px_rgba(90,40,30,0.06)]">
          <p className="text-5xl">🚫</p>
          <h1 className="mt-4 font-serif text-2xl font-bold text-[#241A17]">
            Account Blocked
          </h1>
          <p className="mt-2 text-sm text-[#6F5E56]">
            Your account has been blocked by the admin. You cannot access
            protected platform features. Please contact support.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-[#C75B5B] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF9F5] md:flex-row">
      <DashboardSidebar user={user} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
