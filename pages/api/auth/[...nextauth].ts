import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, User } from "@prisma/client"

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("env GOOGLE_CLIENT_ID is not set");
} else if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("env GOOGLE_CLIENT_SECRET is not set");
} else if (!process.env.ADMIN_USERNAME) {
  throw new Error("env ADMIN_USERNAME is not set");
} else if (!process.env.ADMIN_PASSWORD) {
  throw new Error("env ADMIN_PASSWORD is not set");
}

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
