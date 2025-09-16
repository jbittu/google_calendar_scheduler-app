"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-3xl font-bold mb-6">Scheduler App</h1>

      <div className="flex gap-4">
        <Link href="/dashboard/seller" className="px-6 py-3 bg-green-600 text-white rounded">
          I am a Seller
        </Link>
        <Link href="/dashboard/buyer" className="px-6 py-3 bg-blue-600 text-white rounded">
          I am a Buyer
        </Link>
      </div>

      <p className="mt-8 text-sm text-gray-600">
        Or browse{" "}
        <Link href="/(public)/sellers" className="text-blue-600 underline">
          Sellers
        </Link>
      </p>
    </div>
  );
}
