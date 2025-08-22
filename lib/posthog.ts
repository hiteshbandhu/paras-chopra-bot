import type { PostHog } from 'posthog-js';
import { useEffect } from 'react';

export interface PostHogConfig {
  key: string;
  host: string;
}

// Initialize PostHog
let posthog: PostHog | null = null;

export function getPostHog(): PostHog | null {
  if (typeof window === 'undefined') return null;

  if (!posthog) {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!posthogKey) {
      console.warn('PostHog: NEXT_PUBLIC_POSTHOG_KEY is not set');
      return null;
    }

    try {
      const { posthog: ph } = require('posthog-js');
      posthog = ph as any; // Type assertion for PostHog

      if (posthog) {
        posthog.init(posthogKey, {
          api_host: posthogHost || 'https://app.posthog.com',
          loaded: (posthogInstance: any) => {
            if (process.env.NODE_ENV === 'development') {
              posthogInstance.debug();
            }
          },
          // Enable minimal autocapture for basic interactions
          autocapture: {
            url_allowlist: [
              'askparas.com',
              'askparas.hiteshisbuilding.xyz',
              'localhost',
              'localhost:3000',
              'localhost:3001',
              '127.0.0.1',
              '127.0.0.1:3000',
              '127.0.0.1:3001',
            ],
            dom_event_allowlist: ['click', 'submit'],
          },
          // Enable session recording for user behavior insights
          session_recording: {
            recordBody: true,
          },
        });
      }
    } catch (error) {
      console.error('PostHog initialization failed:', error);
    }
  }

  return posthog;
}

// Hook to track page views
export function usePostHogPageView() {
  useEffect(() => {
    const posthog = getPostHog();
    if (posthog) {
      // Track initial page view
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        $pathname: window.location.pathname,
        $search: window.location.search,
      });
    }
  }, []);
}

// Custom event tracking
export function trackEvent(event: string, properties?: Record<string, any>) {
  const posthog = getPostHog();
  if (posthog) {
    posthog.capture(event, properties);
  }
}

// User identification
export function identifyUser(userId: string, properties?: Record<string, any>) {
  const posthog = getPostHog();
  if (posthog) {
    posthog.identify(userId, properties);
  }
}

// Reset user when they log out
export function resetUser() {
  const posthog = getPostHog();
  if (posthog) {
    posthog.reset();
  }
}

// === SPECIFIC TRACKING FUNCTIONS FOR YOUR METRICS ===

// Track message sending (your main metric)
export function trackMessageSent(properties: {
  messageLength?: number;
  hasAttachments?: boolean;
  model?: string;
  conversationId?: string;
  isFirstMessage?: boolean;
  responseTime?: number;
}) {
  trackEvent('message_sent', {
    message_length: properties.messageLength || 0,
    has_attachments: properties.hasAttachments || false,
    model: properties.model || 'unknown',
    conversation_id: properties.conversationId,
    is_first_message: properties.isFirstMessage || false,
    response_time_ms: properties.responseTime,
    timestamp: new Date().toISOString(),
  });
}

// Track page views with meaningful names
export function trackPageView(
  pageName: string,
  properties?: Record<string, any>,
) {
  trackEvent('page_view', {
    page_name: pageName,
    url: typeof window !== 'undefined' ? window.location.href : '',
    pathname: typeof window !== 'undefined' ? window.location.pathname : '',
    ...properties,
  });
}

// Track user engagement
export function trackUserEngagement(
  action: string,
  properties?: Record<string, any>,
) {
  trackEvent('user_engagement', {
    action,
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

// Track chat interactions
export function trackChatInteraction(
  action: string,
  properties?: Record<string, any>,
) {
  trackEvent('chat_interaction', {
    action,
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

// Track when users start a new conversation
export function trackNewConversation(conversationId: string, source?: string) {
  trackEvent('new_conversation', {
    conversation_id: conversationId,
    source: source || 'direct',
    timestamp: new Date().toISOString(),
  });
}

// Track when users view specific pages
export function trackPageVisit(
  pageType: 'home' | 'chat' | 'auth' | 'landing' | 'other',
  pagePath: string,
) {
  trackEvent('page_visit', {
    page_type: pageType,
    page_path: pagePath,
    timestamp: new Date().toISOString(),
  });
}

// Track user sessions
export function trackSessionStart() {
  trackEvent('session_start', {
    user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
    referrer: typeof window !== 'undefined' ? document.referrer : '',
    timestamp: new Date().toISOString(),
  });
}

export function trackSessionEnd(duration: number) {
  trackEvent('session_end', {
    session_duration_seconds: duration,
    timestamp: new Date().toISOString(),
  });
}
