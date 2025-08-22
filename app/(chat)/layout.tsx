import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '../(auth)/auth';
import Script from 'next/script';
import { DataStreamProvider } from '@/components/data-stream-provider';
import type { Metadata } from 'next';

export const experimental_ppr = true;

export const metadata: Metadata = {
  metadataBase: new URL('https://askparas.hiteshisbuilding.xyz'),
  title: "Ask Paras - AI Chatbot with Paras Chopra's Knowledge",
  description:
    "Get answers from Paras Chopra's essays and threads with citations. No hallucinations, sources included. Chat with AI trained on 200+ essays from Inverted Passion.",
  keywords: [
    'Paras Chopra bot',
    'hitesh bandhu',
    'hitesh bandhu bot',
    'hitesh bandhu ai',
    'hitesh bandhu ai chatbot',
    'hitesh bandhu ai chatbot with paras chopra',
    'hitesh bandhu ai chatbot with paras chopra knowledge',
    'hitesh bandhu ai chatbot with paras chopra essays',
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
    url: 'https://askparas.hiteshisbuilding.xyz',
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
    canonical: 'https://askparas.hiteshisbuilding.xyz',
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

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value === 'false';

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar user={session?.user} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </DataStreamProvider>
    </>
  );
}
