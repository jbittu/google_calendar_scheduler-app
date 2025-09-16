import { auth } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ items: [] });

  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!me) return NextResponse.json({ items: [] });

  const items = await prisma.booking.findMany({
    where: { OR: [{ buyerId: me.id }, { sellerId: me.id }] },
    include: { buyer: true, seller: true },
    orderBy: { start: "desc" },
    take: 100,
  });

  return NextResponse.json({ items });
}
