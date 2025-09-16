"use client";

import Link from "next/link";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-indigo-800 text-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Scheduler
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/(public)/sellers">Sellers</Link>
          {session?.user ? (
            <>
              <Link href="/dashboard/buyer">Dashboard</Link>
              <button
                onClick={() => signOut()}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
