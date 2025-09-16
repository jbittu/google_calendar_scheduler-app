"use client";
import type { User } from "@/types";

type SellerWithDesc = Partial<User> & { description?: string; id: string; };
export default function SellerList({ sellers }: { sellers: SellerWithDesc[] }) {
  return (
    <ul className="space-y-3">
      {sellers.map((s) => (
        <li key={s.id} className="border p-4 rounded shadow-sm">
          <h3 className="font-medium">{s.name}</h3>
          <p className="text-sm text-gray-500">{s.email}</p>
          <p className="text-xs text-gray-400">{s.description}</p>
        </li>
      ))}
    </ul>
  );
}
