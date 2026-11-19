import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

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
  businessName?: string | null;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt?: Date | string | null;
};


export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const role = (session?.user as UserType | undefined)?.role;

  if (role === "vendor") redirect("/dashboard/vendor");
  if (role === "admin") redirect("/dashboard/admin");
  redirect("/dashboard/customer");
}
