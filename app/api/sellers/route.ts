import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { User as UserType } from "@/types";


type SellerWithUser = Awaited<
  ReturnType<typeof prisma.seller.findMany<{ include: { user: true } }>>
>[number];
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() ?? "";

  const sellers = await prisma.seller.findMany({
    where: {
      isPublic: true,
      user: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
    },
    include: { user: true },
    take: 50,
  });

  return NextResponse.json(
    sellers.map(
      (s: SellerWithUser): Partial<UserType> & { description?: string } => ({
        id: s.userId,
        name: s.user.name ?? "",
        email: s.user.email ?? "",
        description: s.description ?? "",
      })
    )
  );
}
