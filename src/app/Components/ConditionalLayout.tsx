"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      

      {isDashboard ? (
        <>{children}</>
      ) : (
        <>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </>
      )}
    </>
  );
}
