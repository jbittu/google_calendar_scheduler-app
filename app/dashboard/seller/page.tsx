import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SellerDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/dashboard/seller");
  if (session.user.role !== "SELLER") redirect("/dashboard/buyer");

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Seller Dashboard</h1>
      <p className="text-gray-600">
        Here you’ll connect your Google Calendar and manage availability.
      </p>
    </div>
  );
}
