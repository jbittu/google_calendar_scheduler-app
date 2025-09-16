"use client";

import useSWR from "swr";
import AppointmentCard from "@/components/AppointmentCard";

async function fetcher(url: string) {
  const res = await fetch(url);
  return res.json();
}

export default function BuyerDashboard() {
  const { data } = useSWR("/api/me/appointments", fetcher);

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
