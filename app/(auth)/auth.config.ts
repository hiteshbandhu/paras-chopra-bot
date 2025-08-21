import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth;
      const isOnProtectedRoute =
        nextUrl.pathname === '/' || nextUrl.pathname.startsWith('/chat');
      const isOnAuthRoute = ['/login', '/register'].includes(nextUrl.pathname);
      const isOnLanding = nextUrl.pathname === '/landing';

      // Redirect authenticated users away from auth pages to home
      if (isLoggedIn && (isOnAuthRoute || isOnLanding)) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // Allow access to protected routes only if logged in
      if (isOnProtectedRoute) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
