import { auth } from "@/lib/session";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { createEventForBoth } from "@/lib/google";
import { NextResponse } from "next/server";

const Body = z.object({
  sellerId: z.string().min(1),
  start: z.string().datetime(),
  end: z.string().datetime(),
  summary: z.string().default("Appointment"),
  description: z.string().optional(),
  location: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const buyer = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!buyer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = Body.parse(await req.json());
  const { sellerId, start, end, summary, description } = body;

  const cred = await prisma.oAuthCredential.findUnique({
    where: { userId: sellerId },
  });
  if (!cred)
    return NextResponse.json(
      { error: "Seller not connected to Google" },
      { status: 400 }
    );

  const { sellerEventId, buyerEventId, meetLink } = await createEventForBoth(
    sellerId,
    buyer.id,
    { start: new Date(start), end: new Date(end), summary, description }
  );

  const booking = await prisma.booking.create({
    data: {
      sellerId,
      buyerId: buyer.id,
      start: new Date(start),
      end: new Date(end),
      summary,
      description,
      meetLink: meetLink ?? undefined,
      googleEventIdSeller: sellerEventId,
      googleEventIdBuyer: buyerEventId,
    },
  });

  return NextResponse.json({ booking });
}
