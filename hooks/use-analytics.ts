import { useCallback } from 'react';
import {
  trackMessageSent,
  trackUserEngagement,
  trackChatInteraction,
  trackNewConversation,
  trackPageView,
  trackSessionEnd,
} from '@/lib/posthog';

export function useAnalytics() {
  // Track message sending - this is your main metric
  const trackMessage = useCallback(
    (properties: {
      messageLength?: number;
      hasAttachments?: boolean;
      model?: string;
      conversationId?: string;
      isFirstMessage?: boolean;
      responseTime?: number;
    }) => {
      trackMessageSent(properties);
    },
    [],
  );

  // Track when user starts typing or engages with chat
  const trackChatStart = useCallback((conversationId?: string) => {
    trackChatInteraction('chat_started', { conversation_id: conversationId });
  }, []);

  // Track when user submits a message
  const trackMessageSubmit = useCallback(
    (message: string, conversationId?: string) => {
      trackChatInteraction('message_submitted', {
        message_length: message.length,
        conversation_id: conversationId,
      });
    },
    [],
  );

  // Track when user receives a response
  const trackResponseReceived = useCallback(
    (responseLength: number, responseTime: number, conversationId?: string) => {
      trackChatInteraction('response_received', {
        response_length: responseLength,
        response_time_ms: responseTime,
        conversation_id: conversationId,
      });
    },
    [],
  );

  // Track new conversation starts
  const trackConversationStart = useCallback(
    (conversationId: string, source?: string) => {
      trackNewConversation(conversationId, source);
    },
    [],
  );

  // Track general user engagement
  const trackEngagement = useCallback(
    (action: string, properties?: Record<string, any>) => {
      trackUserEngagement(action, properties);
    },
    [],
  );

  // Track page views with custom names
  const trackPage = useCallback(
    (pageName: string, properties?: Record<string, any>) => {
      trackPageView(pageName, properties);
    },
    [],
  );

  // Track session end (call this on page unload or user logout)
  const trackEndSession = useCallback((duration: number) => {
    trackSessionEnd(duration);
  }, []);

  // Track chat interactions
  const trackChatInteraction = useCallback(
    (action: string, properties?: Record<string, any>) => {
      trackChatInteraction(action, properties);
    },
    [],
  );

  return {
    trackMessage,
    trackChatStart,
    trackMessageSubmit,
    trackResponseReceived,
    trackConversationStart,
    trackEngagement,
    trackPage,
    trackEndSession,
    trackChatInteraction,
  };
}
