import "./globals.css";
import { ReactNode } from "react";
import ClientComponentsWrapper from "../components/ClientComponentsWrapper";

export const metadata = {
  title: "Scheduler App",
  description: "Google Calendar integration for Buyers and Sellers",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        {/* Client-only components go here */}
        <ClientComponentsWrapper>
          <main className="container mx-auto px-4 py-6">{children}</main>
        </ClientComponentsWrapper>
      </body>
    </html>
  );
}
