import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("env GOOGLE_CLIENT_ID is not set");
} else if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("env GOOGLE_CLIENT_SECRET is not set");
} else if (!process.env.ADMIN_USERNAME) {
  throw new Error("env ADMIN_USERNAME is not set");
} else if (!process.env.ADMIN_PASSWORD) {
  throw new Error("env ADMIN_PASSWORD is not set");
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      name: "User Google Account",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Admin Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = {
          id: "1",
          name: "Admin",
          email: "admin@citl.com",
          admin: true,
        };

        if (
          credentials?.password === process.env.ADMIN_USERNAME ||
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
