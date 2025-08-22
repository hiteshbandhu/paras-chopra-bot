// Example usage of PostHog tracking
// You can import and use these functions in your components

import { trackEvent, identifyUser, resetUser } from '@/lib/posthog'

// Example: Track when a user starts a chat
export function trackChatStarted(model?: string, isNewUser?: boolean) {
  trackEvent('chat_started', {
    model: model || 'default',
    is_new_user: isNewUser || false,
    timestamp: new Date().toISOString(),
  })
}

// Example: Track when a user sends a message
export function trackMessageSent(messageLength: number, hasAttachments: boolean) {
  trackEvent('message_sent', {
    message_length: messageLength,
    has_attachments: hasAttachments,
    timestamp: new Date().toISOString(),
  })
}

// Example: Track when a user creates an artifact
export function trackArtifactCreated(artifactType: string, title?: string) {
  trackEvent('artifact_created', {
    artifact_type: artifactType,
    has_title: !!title,
    timestamp: new Date().toISOString(),
  })
}

// Example: Track user sign up
export function trackUserSignUp(userId: string, email?: string, source?: string) {
  identifyUser(userId, {
    email: email,
    signup_source: source || 'direct',
    signup_date: new Date().toISOString(),
  })

  trackEvent('user_signed_up', {
    user_id: userId,
    signup_source: source || 'direct',
    has_email: !!email,
  })
}

// Example: Track user sign out
export function trackUserSignOut() {
  trackEvent('user_signed_out')
  resetUser()
}

// Example: Track search usage
export function trackSearchUsed(query: string, resultsCount: number) {
  trackEvent('search_used', {
    query_length: query.length,
    results_count: resultsCount,
    has_results: resultsCount > 0,
  })
}

// Example: Track model selection
export function trackModelSelected(modelName: string, previousModel?: string) {
  trackEvent('model_selected', {
    selected_model: modelName,
    previous_model: previousModel || 'none',
    timestamp: new Date().toISOString(),
  })
}
