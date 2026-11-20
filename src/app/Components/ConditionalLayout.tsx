"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // Dashboard e Navbar/Footer dekhabe na
  if (isDashboard) {
    return (
      <>
        {children}
        <ToastContainer position="top-center" autoClose={3000} theme="light" />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <ToastContainer position="top-center" autoClose={3000} theme="light" />

      <Footer />
    </>
  );
}
