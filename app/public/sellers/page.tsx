"use client";

import useSWR from "swr";

async function fetcher(url: string) {
  const res = await fetch(url);
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
            <h3 className="font-medium">{s.name}</h3>
            <p className="text-sm text-gray-500">{s.email}</p>
            <p className="text-xs text-gray-400">{s.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
