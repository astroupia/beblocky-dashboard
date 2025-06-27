import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize auth instance
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  cookies: {
    sessionToken: {
      name: "better-auth.session_token",
      options: {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production" ? ".beblocky.com" : undefined,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    transform: (data: { name: string; email: string; password: string }) => {
      return {
        email: data.email,
        password: data.password,
        name: data.name,
        emailVerified: false,
        updatedAt: new Date(),
      };
    },
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub;
        // Ensure all required user fields are present
        session.user = {
          ...session.user,
          name: session.user.name || "",
          email: session.user.email || "",
          emailVerified: session.user.emailVerified || false,
          image: session.user.image || null,
        };
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
