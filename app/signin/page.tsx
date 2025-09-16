"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (error === "access_denied") {
      setErrorMessage(
        "Google OAuth Error: This app is currently in testing mode and can only be accessed by test users. Please contact the developer to be added as a test user."
      );
    } else if (error) {
      setErrorMessage(`Authentication error: ${error}`);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-md text-left">
          <p className="font-bold">Error</p>
          <p>{errorMessage}</p>
          <div className="mt-2 text-sm">
            <p>If you are a developer, please ensure:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Your Google OAuth app is properly configured</li>
              <li>Your email is added as a test user in the Google Cloud Console</li>
              <li>You have the correct scopes configured</li>
            </ul>
          </div>
        </div>
      )}

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="mr-2"
        >
          <path
            fill="#fff"
            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
          />
        </svg>
        Sign in with Google
      </button>

      <p className="mt-6 text-sm text-gray-600">
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </p>
    </div>
  );
}
