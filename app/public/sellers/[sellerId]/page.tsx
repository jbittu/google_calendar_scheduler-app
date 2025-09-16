"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  return res.json();
}

export default function SellerBookingPage({ params }: { params: { sellerId: string } }) {
  const sellerId = params.sellerId;
  const { data: slotsData } = useSWR(`/api/availability/${encodeURIComponent(sellerId)}`, fetcher);
  const { push } = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const slots: { start: string; end: string }[] = (slotsData?.slots ?? []).map((s: any) => ({
    start: new Date(s.start).toISOString(),
    end: new Date(s.end).toISOString(),
  }));

  async function book(start: string, end: string) {
    try {
      setSubmitting(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, start, end, summary: "Appointment" }),
      });
      if (res.status === 401) {
        // Redirect to sign-in and return back here after auth
        const url = `/signin?callbackUrl=${encodeURIComponent(`/public/sellers/${sellerId}`)}`;
        push(url);
        return;
      }
      if (!res.ok) {
        const t = await res.json().catch(() => ({}));
        throw new Error(t?.error || "Failed to book");
      }
      // On success, go to buyer dashboard
      push("/dashboard/buyer");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Book a time</h1>
      <p className="mb-4 text-gray-600">Select an available slot below.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {slots.map((slot) => (
          <button
            key={`${slot.start}-${slot.end}`}
            disabled={submitting}
            onClick={() => book(slot.start, slot.end)}
            className="border rounded p-3 text-left hover:bg-indigo-50 disabled:opacity-60"
          >
            <div className="font-medium">{new Date(slot.start).toLocaleString()}</div>
            <div className="text-sm text-gray-500">{new Date(slot.end).toLocaleString()}</div>
          </button>
        ))}
      </div>
      {slots.length === 0 && <p className="text-sm text-gray-500">No available slots found for the next 14 days.</p>}
    </div>
  );
}
