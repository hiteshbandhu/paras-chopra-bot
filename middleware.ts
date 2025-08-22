import { NextResponse, type NextRequest } from 'next/server';
import { auth } from './app/(auth)/auth';
// import { isDevelopmentEnvironment } from './lib/constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith('/ping')) {
    return new Response('pong', { status: 200 });
  }

  console.log('🛣️  Middleware: Processing request to:', pathname);

  // Skip auth check for public routes
  const publicRoutes = ['/landing', '/login', '/register'];
  if (publicRoutes.includes(pathname)) {
    console.log('✅ Middleware: Public route, allowing access');
    return NextResponse.next();
  }

  // Protect root and routes inside the (chat) group
  if (pathname === '/' || pathname.startsWith('/chat')) {
    console.log('🔒 Middleware: Protected route, checking authentication');

    const session = await auth();
    console.log('🎫 Middleware: Session exists:', !!session);

    if (!session) {
      console.log('🚪 Middleware: No session, redirecting to /landing');
      return NextResponse.redirect(new URL('/landing', request.url));
    }

    console.log('✅ Middleware: Session valid, allowing access');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
