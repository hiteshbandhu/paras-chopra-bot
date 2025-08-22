'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  getPostHog,
  usePostHogPageView,
  trackPageVisit,
  trackSessionStart,
} from '@/lib/posthog';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  usePostHogPageView();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionStarted = useRef(false);

  // Track session start on first load
  useEffect(() => {
    if (!sessionStarted.current) {
      trackSessionStart();
      sessionStarted.current = true;
    }
  }, []);

  useEffect(() => {
    const posthog = getPostHog();
    if (posthog) {
      // Track page views on route changes
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }

      // Standard PostHog pageview
      posthog.capture('$pageview', {
        $current_url: url,
        $pathname: pathname,
        $search: searchParams.toString(),
      });

      // Custom page visit tracking with meaningful categories
      let pageType: 'home' | 'chat' | 'auth' | 'landing' | 'other' = 'other';
      if (pathname === '/') {
        pageType = 'landing';
      } else if (pathname.startsWith('/chat')) {
        pageType = 'chat';
      } else if (
        pathname.startsWith('/auth') ||
        pathname.includes('/login') ||
        pathname.includes('/register')
      ) {
        pageType = 'auth';
      }

      trackPageVisit(pageType, pathname);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
