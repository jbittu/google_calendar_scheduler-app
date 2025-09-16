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
    async jwt({ token, user }) {
      // On first JWT callback after sign in, persist id/role
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }

      // If token lacks role/id, hydrate from DB using subject
      if (!token.role || !token.id) {
        const userId = (token.id as string) ?? (token.sub as string) ?? null;
        if (userId) {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token.id as string) ?? (token.sub as string);
        (session.user as any).role = token.role as any;
      }
      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Only handle redirect for Google OAuth sign-ins
      if (account?.provider === "google") {
        const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "";
        const role = (user as any)?.role === "SELLER" ? "SELLER" : "BUYER";
        const destination = role === "SELLER" ? "/dashboard/seller" : "/dashboard/buyer";
        return `${baseUrl}${destination}`;
      }
      return true;
    },
  },
  events: {
    // 🔑 Safe place to persist OAuthCredential
    async linkAccount({ user, account }) {
      if (account.provider === "google" && account.refresh_token) {
        await prisma.oAuthCredential.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            provider: "google",
            refreshTokenEnc: encrypt(account.refresh_token),
            accessToken: account.access_token ?? null,
            accessTokenExp: account.expires_at
              ? new Date(account.expires_at * 1000)
              : null,
            scope: account.scope ?? null,
            tokenType: account.token_type ?? null,
          },
          update: {
            refreshTokenEnc: encrypt(account.refresh_token),
            accessToken: account.access_token ?? null,
            accessTokenExp: account.expires_at
              ? new Date(account.expires_at * 1000)
              : null,
            scope: account.scope ?? null,
            tokenType: account.token_type ?? null,
          },
        });
      }
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
};

// ✅ Helper to use on server-side
export async function auth() {
  return await getServerSession(authOptions);
}
