"use client";

import useSWR from "swr";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import AppointmentCard from "@/components/AppointmentCard";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load appointments");
  return res.json();
}

export default function BuyerDashboard() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google", { callbackUrl: "/dashboard/buyer" });
    }
  }, [status]);

  const { data } = useSWR(status === "authenticated" ? "/api/me/appointments" : null, fetcher);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Buyer Dashboard</h1>
      <div className="space-y-4">
        {data?.items?.map((appt: any) => (
          <AppointmentCard key={appt.id} appointment={appt} />
        ))}
      </div>
    </div>
  );
}
