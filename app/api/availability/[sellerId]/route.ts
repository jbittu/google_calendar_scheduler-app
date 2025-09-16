import { prisma } from "@/lib/db";
import { getFreeBusy } from "@/lib/google";
import { NextRequest, NextResponse } from "next/server";
import { addMinutes, eachMinuteOfInterval, isBefore } from "date-fns";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  const { sellerId: sellerUserId } = await params;
  const seller = await prisma.seller.findUnique({
    where: { userId: sellerUserId },
  });
  if (!seller) return NextResponse.json({ slots: [] });

  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const freebusy = await getFreeBusy(sellerUserId, timeMin, timeMax);
  const busy = freebusy.calendars?.primary?.busy ?? [];

  const candidates: { start: Date; end: Date }[] = [];
  for (let d = 0; d < 14; d++) {
    const dayStart = new Date();
    dayStart.setDate(dayStart.getDate() + d);
    dayStart.setHours(9, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(18, 0, 0, 0);

    const steps = eachMinuteOfInterval(
      { start: dayStart, end: addMinutes(dayEnd, -seller.slotDurationM) },
      { step: seller.slotDurationM }
    );

    for (const s of steps) {
      const e = addMinutes(s, seller.slotDurationM);
      const overlaps = busy.some(
        (b) => b?.start && b?.end && !(new Date(b.end) <= s || e <= new Date(b.start))
      );
      if (!overlaps && isBefore(new Date(), s))
        candidates.push({ start: s, end: e });
    }
  }

  return NextResponse.json({ slots: candidates.slice(0, 200) });
}
