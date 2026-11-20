import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import ConditionalLayout from "@/app/Components/ConditionalLayout";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WedPlan — Wedding Planning Platform",
  description: "Plan your dream wedding with trusted vendors in Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${jakarta.variable} flex min-h-screen flex-col bg-[#FFF9F5] font-sans antialiased`}
      >
        <ToastContainer position="top-center" autoClose={3000} theme="light" />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
