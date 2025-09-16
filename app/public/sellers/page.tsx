"use client";

import useSWR from "swr";
import Link from "next/link";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load sellers");
  return res.json();
}

export default function SellersPage() {
  const { data } = useSWR("/api/sellers", fetcher);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sellers</h2>
      <ul className="space-y-3">
        {data?.map((s: any) => (
          <li key={s.id} className="border p-4 rounded shadow-sm">
            <h3 className="font-medium">
              <Link href={`/public/sellers/${encodeURIComponent(s.id)}`} className="text-indigo-600 underline">
                {s.name || s.email}
              </Link>
            </h3>
            <p className="text-sm text-gray-500">{s.email}</p>
            <p className="text-xs text-gray-400">{s.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
