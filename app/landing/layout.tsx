import type { ReactNode } from 'react';
import type { Metadata } from 'next';

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
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://askparas.hiteshisbuilding.xyz',
    siteName: 'Ask Paras',
    title: "Ask Paras - AI Chatbot with Paras Chopra's Knowledge",
    description:
      "Get answers from Paras Chopra's essays and threads with citations. No hallucinations, sources included. Chat with AI trained on 200+ essays from Inverted Passion.",
    images: ['/opengraph-image.png'],
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

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
