import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/app/Components/DashboardSidebar";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "vendor" | "customer";
  subscriptionPlan: "free" | "premium";
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#FFF9F5]">
      <DashboardSidebar user={user} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
