import prisma from "@/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("env GOOGLE_CLIENT_ID is not set");
} else if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("env GOOGLE_CLIENT_SECRET is not set");
} else if (!process.env.ADMIN_EMAILS) {
  throw new Error("env ADMIN_EMAILS is not set");
}

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

  callbacks: {
    session: async ({ session, token, user }) => {
      if (session?.user) {
        const id = user.id;

        session.user = await prisma.user.findUniqueOrThrow({
          where: {
            id,
          },
        });

        const adminEmails = process.env.ADMIN_EMAILS?.split(", ");

        if (adminEmails?.includes(user.email)) {
          session.user = {
            ...session.user,
            isAdmin: true,
          };
        } else {
          session.user = {
            ...session.user,
            isAdmin: false,
          };
        }
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
