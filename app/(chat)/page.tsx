import { cookies } from 'next/headers';
import type { Metadata } from 'next';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '../(auth)/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Chat with Paras - Ask Paras AI',
  description:
    "Start chatting with the AI trained on Paras Chopra's knowledge. Get answers to your questions about startups, business, and productivity with citations.",
  openGraph: {
    title: 'Chat with Paras - Ask Paras AI',
    description:
      "Start chatting with the AI trained on Paras Chopra's knowledge. Get answers to your questions about startups, business, and productivity with citations.",
    url: 'https://askparas.com/chat',
    siteName: 'Ask Paras',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: "Ask Paras - AI Chatbot with Paras Chopra's Knowledge",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chat with Paras - Ask Paras AI',
    description:
      "Start chatting with the AI trained on Paras Chopra's knowledge. Get answers to your questions about startups, business, and productivity with citations.",
    images: ['/twitter-image'],
    creator: '@_hiteshbandhu',
    site: '@_hiteshbandhu',
  },
  alternates: {
    canonical: 'https://askparas.com/chat',
  },
};

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/landing');
  }

  const id = generateUUID();
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model')?.value;

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={modelIdFromCookie || DEFAULT_CHAT_MODEL}
        initialVisibilityType="private"
        isReadonly={false}
        session={session}
        autoResume={false}
      />
      <DataStreamHandler />
    </>
  );
}
