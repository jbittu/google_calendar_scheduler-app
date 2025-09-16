import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import { encrypt } from "./crypto";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // Add include_granted_scopes to help with testing mode
          include_granted_scopes: "true",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar.events",
            "https://www.googleapis.com/auth/calendar.readonly",
          ].join(" "),
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "BUYER" as const,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user, profile, email, credentials }) {
      // Handle potential access_denied error
      if (!account || !user) {
        console.error("Sign in failed - missing account or user data");
        return false;
      }
      
      // Capture refresh_token when user connects Google
      if (account?.provider === "google" && account.refresh_token) {
        await prisma.oAuthCredential.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            provider: "google",
            refreshTokenEnc: encrypt(account.refresh_token),
            accessToken: account.access_token ?? null,
            accessTokenExp: account.expires_at ? new Date(account.expires_at * 1000) : null,
            scope: account.scope ?? null,
            tokenType: account.token_type ?? null,
          },
          update: {
            refreshTokenEnc: encrypt(account.refresh_token),
            accessToken: account.access_token ?? null,
            accessTokenExp: account.expires_at ? new Date(account.expires_at * 1000) : null,
            scope: account.scope ?? null,
            tokenType: account.token_type ?? null,
          },
        });
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        // ✅ thanks to type augmentation, role is recognized
        session.user.id = user.id;
        session.user.role = user.role as "BUYER" | "SELLER";
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { 
    signIn: "/signin",
    error: "/signin"
  },
};

// Helper to get session server-side
export async function auth() {
  return await getServerSession(authOptions);
}
