import { compare } from 'bcrypt-ts';
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUser } from '@/lib/db/queries';
import { authConfig } from './auth.config';
import { DUMMY_PASSWORD } from '@/lib/constants';
import type { DefaultJWT } from 'next-auth/jwt';

export type UserType = 'regular';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        console.log('🔐 Auth: Attempting to authorize user:', email);

        try {
          const users = await getUser(email);
          console.log('🔍 Auth: Found users:', users.length);

          if (users.length === 0) {
            console.log('❌ Auth: No user found with email:', email);
            await compare(password, DUMMY_PASSWORD);
            return null;
          }

          const [user] = users;
          console.log('👤 Auth: User found:', {
            id: user.id,
            email: user.email,
            hasPassword: !!user.password,
          });

          if (!user.password) {
            console.log('❌ Auth: User has no password');
            await compare(password, DUMMY_PASSWORD);
            return null;
          }

          const passwordsMatch = await compare(password, user.password);
          console.log('🔑 Auth: Password match:', passwordsMatch);

          if (!passwordsMatch) {
            console.log('❌ Auth: Password does not match');
            return null;
          }

          console.log(
            '✅ Auth: Authentication successful for user:',
            user.email,
          );
          return { ...user, type: 'regular' };
        } catch (error) {
          console.error('💥 Auth: Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.type = user.type;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
      }

      return session;
    },
  },
});
