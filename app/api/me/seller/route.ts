import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/session";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });

  const [seller, credential] = await Promise.all([
    prisma.seller.findUnique({ where: { userId: session.user.id } }),
    prisma.oAuthCredential.findUnique({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({
    isSeller: !!seller,
    googleConnected: !!credential,
  });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });

  await prisma.$transaction([
    prisma.user.update({ where: { id: session.user.id }, data: { role: "SELLER" } }),
    prisma.seller.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    }),
  ]);

  return NextResponse.json({ ok: true });
}
