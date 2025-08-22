import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { PostHogProvider } from '@/components/posthog-provider';
import { Suspense } from 'react';

import './globals.css';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://askparas.com'),
  title: "Ask Paras - AI Chatbot with Paras Chopra's Knowledge",
  description:
    "Get answers from Paras Chopra's essays and threads with citations. No hallucinations, sources included. Chat with AI trained on 200+ essays from Inverted Passion.",
  keywords: [
    'Paras Chopra',
    'AI chatbot',
    'Inverted Passion',
    'startup advice',
    'entrepreneurship',
    'productivity',
    'business insights',
    'founder advice',
  ],
  authors: [{ name: 'Hitesh Bandhu', url: 'https://x.com/_hiteshbandhu' }],
  creator: 'Hitesh Bandhu',
  publisher: 'Ask Paras',
  category: 'Technology',
  classification: 'AI Chatbot',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-icon', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://askparas.com',
    siteName: 'Ask Paras',
    title: "Ask Paras - AI Chatbot with Paras Chopra's Knowledge",
    description:
      "Get answers from Paras Chopra's essays and threads with citations. No hallucinations, sources included. Chat with AI trained on 200+ essays from Inverted Passion.",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: "Ask Paras - AI Chatbot with Paras Chopra's Knowledge",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@_hiteshbandhu',
    creator: '@_hiteshbandhu',
    title: "Ask Paras - AI Chatbot with Paras Chopra's Knowledge",
    description:
      "Get answers from Paras Chopra's essays and threads with citations. No hallucinations, sources included.",
    images: ['/twitter-image'],
  },
  alternates: {
    canonical: 'https://askparas.com',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'application-name': 'Ask Paras',
    'apple-mobile-web-app-title': 'Ask Paras',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#667eea',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <Suspense fallback={null}>
          <PostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster position="top-center" />
              <SessionProvider>{children}</SessionProvider>
            </ThemeProvider>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
