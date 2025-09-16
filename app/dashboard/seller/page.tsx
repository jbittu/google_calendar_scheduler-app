import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function SellerDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/dashboard/seller");

  const [seller, credential] = await Promise.all([
    prisma.seller.findUnique({ where: { userId: session.user.id } }),
    prisma.oAuthCredential.findUnique({ where: { userId: session.user.id } }),
  ]);

  const googleConnected = !!credential;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Seller Dashboard</h1>
      {!seller && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mb-4">
          <p>You don't have a seller profile yet.</p>
          <form action="/api/me/seller" method="post">
            <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded">Become a Seller</button>
          </form>
        </div>
      )}

      <div className="border p-4 rounded mb-4">
        <h2 className="font-medium mb-2">Google Calendar</h2>
        {googleConnected ? (
          <p className="text-green-700">Connected ✅</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">Not connected.</p>
            <a
              href="/api/auth/signin/google?callbackUrl=%2Fdashboard%2Fseller"
              className="px-4 py-2 bg-blue-600 text-white rounded inline-block"
            >
              Connect Google
            </a>
          </div>
        )}
      </div>

      <p className="text-gray-600">
        Manage your availability is currently based on working hours (9am–6pm) and your Google busy times.
      </p>
    </div>
  );
}
