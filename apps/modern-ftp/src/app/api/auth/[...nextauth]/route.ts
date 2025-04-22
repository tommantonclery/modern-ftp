import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id; // ✅ attach user.id to the JWT
        }
        return token;
      },
      async session({ session, token }) {
        if (token && session.user) {
          session.user.id = token.id as string; // ✅ expose user.id in session
        }
        return session;
      },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };