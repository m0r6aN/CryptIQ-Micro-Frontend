// [imports]
/*import NextAuth, { DefaultSession, Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { database } from "@/lib/database";
import { GetUserByEmail, GetUserById } from "@/actions/auth.actions";
import authConfig from "@/auth.config";

type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: string;
  twoFactorEnabled: boolean; // [UsernameType]
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  // [CredentialCallback]
  async session({ session, token }: { session: any; token: any }) {
    if (token.id && session.user) {
      session.user.id = token.id.toString();
    }
    if (token.role && session.user) {
      session.user.role = token.role.toString();
    }
    if (session.user) {
      session.user.name = token?.name;
      session.user.email = token?.email;
      session.user.image = token?.image as string; // [AddUsernameInSession]
    }
    return session as Session;
  },
  async jwt({ token, user, account, profile, isNewUser }: { token: any, user?: any, account?: any, profile?: any, isNewUser?: boolean }) {
    if (!token.email) {
      return token;
    }

    const dbUser = await GetUserByEmail(token.email);
    if (!dbUser) return token;

    token.name = dbUser.name;
    token.email = dbUser.email;
    token.image = dbUser?.image; // [AddUsernameInToken]
    token.id = dbUser.id;
    token.role = dbUser.role;

    return token;
  },
  adapter: PrismaAdapter(database),
  ...authConfig,
  session: {
    strategy: "jwt",
  }

  */