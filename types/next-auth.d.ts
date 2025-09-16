import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "BUYER" | "SELLER";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "BUYER" | "SELLER";
  }
}
