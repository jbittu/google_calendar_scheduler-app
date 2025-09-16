import { google } from "googleapis";
import { prisma } from "./db";
import { decrypt } from "./crypto";

export async function getGoogleClient(userId: string) {
  const cred = await prisma.oAuthCredential.findUnique({ where: { userId } });
  if (!cred) throw new Error("Google credential missing");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.AUTH_URL ?? ""}/api/auth/callback/google`
  );

  oauth2Client.setCredentials({
    refresh_token: decrypt(cred.refreshTokenEnc),
  });

  const accessTokenResponse = await oauth2Client.getAccessToken();
  const accessToken = accessTokenResponse?.token;

  if (!accessToken) throw new Error("Failed to get access token");

  oauth2Client.setCredentials({
    ...oauth2Client.credentials,
    access_token: accessToken,
  });

  return {
    oauth2Client,
    calendar: google.calendar({ version: "v3", auth: oauth2Client }),
  };
}

// --- New helpers ---

export async function getFreeBusy(userId: string, timeMin: string, timeMax: string) {
  const { calendar } = await getGoogleClient(userId);

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: "primary" }],
    },
  });

  return res.data;
}

export async function createEventForBoth(
  sellerUserId: string,
  buyerUserId: string,
  event: { start: Date; end: Date; summary: string; description?: string }
) {
  const seller = await getGoogleClient(sellerUserId);
  const buyer = await getGoogleClient(buyerUserId);

  const buyerUser = await prisma.user.findUnique({ where: { id: buyerUserId } });
  const sellerUser = await prisma.user.findUnique({ where: { id: sellerUserId } });

  if (!buyerUser?.email || !sellerUser?.email) {
    throw new Error("Missing user email(s)");
  }

  // Create on Seller's calendar with Google Meet
  const sellerEvt = await seller.calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: event.summary,
      description: event.description,
      start: { dateTime: event.start.toISOString() },
      end: { dateTime: event.end.toISOString() },
      attendees: [{ email: buyerUser.email }],
      conferenceData: {
        createRequest: { requestId: `meet-${Date.now()}` },
      },
    },
  });

  // Duplicate to Buyer calendar (optional – invite already sends it)
  const buyerEvt = await buyer.calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: event.summary,
      description: event.description,
      start: { dateTime: event.start.toISOString() },
      end: { dateTime: event.end.toISOString() },
      attendees: [{ email: sellerUser.email }],
    },
  });

  const meetLink =
    sellerEvt.data.hangoutLink ??
    sellerEvt.data.conferenceData?.entryPoints?.[0]?.uri ??
    null;

  return {
    sellerEventId: sellerEvt.data.id!,
    buyerEventId: buyerEvt.data.id!,
    meetLink: meetLink ?? undefined,
  };
}
