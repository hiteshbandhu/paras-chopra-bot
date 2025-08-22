# PostHog Analytics Setup

This document explains how to set up PostHog analytics to track user behavior and message sending metrics.

## Setup Instructions

### 1. Create a PostHog Account

1. Go to [https://app.posthog.com/signup](https://app.posthog.com/signup)
2. Create a new account or sign in to an existing one
3. Create a new project for your application

### 2. Get Your Project API Key

1. In your PostHog dashboard, go to **Project Settings** → **Project Variables**
2. Copy your **Project API Key** (it looks like `phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 3. Add Environment Variables

Add the following to your `.env.local` file (replace with your actual key):

```bash
# PostHog Analytics Configuration
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 4. Restart Your Development Server

```bash
pnpm dev
```

## What Gets Tracked

### 📊 Key Metrics (Your Main Focus)

#### 1. **Message Sending** (`message_sent`)

- **Total messages sent** - Your primary metric
- Message length
- Whether message has attachments
- AI model used
- Conversation ID
- Response time
- Whether it's the first message in conversation

#### 2. **Page Visits** (`page_visit`)

- **Users visiting each page** - Your secondary metric
- Page type: `landing`, `chat`, `auth`, `other`
- Specific page paths
- Timestamp

### 📈 Additional Useful Metrics

#### 3. **User Sessions** (`session_start`, `session_end`)

- Total unique users
- Session duration
- User agent/browser info
- Referrer information

#### 4. **Chat Interactions** (`chat_interaction`)

- Chat started
- Message submitted
- Response received
- Message errors

#### 5. **User Engagement** (`user_engagement`)

- General user interactions
- Feature usage

## How to View Your Analytics

### In PostHog Dashboard:

1. **Total Messages**: Go to **Insights** → Create new insight

   - Event: `message_sent`
   - Aggregation: **Count**
   - Group by: **Date** (for trends)

2. **Unique Users per Page**: Go to **Insights** → Create new insight

   - Event: `page_visit`
   - Aggregation: **Count unique** (users)
   - Group by: **Page Type**

3. **Message Response Times**: Go to **Insights** → Create new insight

   - Event: `message_sent`
   - Property: `response_time_ms`
   - Aggregation: **Average**

4. **Daily Active Users**: Go to **Insights** → Create new insight
   - Event: `session_start`
   - Aggregation: **Count unique** (users)
   - Group by: **Date**

## Advanced Analytics Ideas

### Custom Dashboards

Create dashboards for:

- **Message Volume Trends** (daily/weekly/monthly)
- **User Retention** (returning vs new users)
- **Popular Pages** (which pages get the most visits)
- **Chat Success Rate** (messages sent vs errors)

### Funnels

Track user journeys:

- Landing → Sign up → First message
- Chat page → Message sent → Response received

### Cohorts

Analyze user behavior by:

- Signup date
- First message date
- Geographic location

## Privacy & Compliance

The current setup:

- ✅ Only tracks essential metrics
- ✅ No personal data collection
- ✅ Respects privacy settings
- ✅ Minimal autocapture enabled for domains: askparas.com, askparas.hiteshisbuilding.xyz, localhost (all ports)
- ❌ No canvas recording (for performance)
- ❌ No sensitive data tracking

## Troubleshooting

### Analytics Not Working?

1. Check your environment variables are set correctly
2. Check browser console for PostHog errors
3. Verify your PostHog project API key is valid
4. Make sure you're not in incognito/private browsing mode

### Missing Data?

1. Check if events are being fired (use browser dev tools)
2. Verify PostHog is initialized (check console for debug messages)
3. Check your PostHog project settings

## Integration Examples

### Track Custom Events

```typescript
import { useAnalytics } from "@/hooks/use-analytics";

const MyComponent = () => {
  const analytics = useAnalytics();

  const handleClick = () => {
    analytics.trackEngagement("button_clicked", {
      button_name: "download_report",
      page: "dashboard",
    });
  };

  return <button onClick={handleClick}>Download Report</button>;
};
```

### Track User Properties

```typescript
import { identifyUser } from "@/lib/posthog";

// When user signs up
identifyUser(userId, {
  email: user.email,
  plan: user.plan,
  signup_date: new Date().toISOString(),
});
```

## Localhost Development

The analytics works seamlessly on localhost for development and testing:

### Supported Localhost URLs:

- `http://localhost`
- `http://localhost:3000` (Next.js default)
- `http://localhost:3001` (alternative port)
- `http://127.0.0.1`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

### Testing Locally:

1. **Add environment variables** to your `.env.local`:

   ```bash
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

2. **Start development server**:

   ```bash
   pnpm dev
   ```

3. **View analytics data** in your PostHog dashboard
   - All events will be tracked with development mode enabled
   - You'll see debug messages in the browser console
   - Data appears in real-time in your PostHog dashboard

## Performance Impact

- Minimal performance impact
- Events are batched automatically
- Only loads when environment variables are configured
- No tracking in development unless explicitly enabled

---

**Ready to get insights!** Once you've added your PostHog API key, you'll start seeing data flow into your dashboard immediately.
