"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-6 text-indigo-800">Scheduler App</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Link
          href="/dashboard/seller"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          I am a Seller
        </Link>
        <Link
          href="/dashboard/buyer"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
        >
          I am a Buyer
        </Link>
      </div>

      <div className="mb-4">
        {session ? (
          <button
            onClick={() => signOut()}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg shadow hover:bg-rose-600 transition"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg shadow hover:bg-slate-900 transition"
          >
            Sign In with Google
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600">
        Or browse {""}
        <Link href="/public/sellers" className="text-indigo-600 underline">
          Sellers
        </Link>{" "}
        without signing in
      </p>
    </div>
  );
}
