import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    // Remove the authorized callback to prevent conflicts with middleware
    // Let middleware handle all authentication routing
  },
} satisfies NextAuthConfig;
