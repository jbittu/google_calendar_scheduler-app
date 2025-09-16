import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "Scheduler App",
  description: "Google Calendar integration for Buyers and Sellers",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
