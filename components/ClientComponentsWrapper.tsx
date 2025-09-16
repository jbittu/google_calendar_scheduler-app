"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";

export default function ClientComponentsWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      {children}
    </SessionProvider>
  );
}
