import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type UserType = {
  role: "admin" | "vendor" | "customer";
};

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const user = session.user as unknown as UserType;

  // Vendor chara onno keu ei dashboard e dhukte parbe na
  if (user.role !== "vendor") {
    redirect(`/dashboard/${user.role}`);
  }

  return <>{children}</>;
}
