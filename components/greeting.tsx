import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Session } from 'next-auth';
import { entitlementsByUserType } from '@/lib/ai/entitlements';

interface GreetingProps {
  session?: Session;
}

export const Greeting = ({ session }: GreetingProps) => {
  const [remainingMessages, setRemainingMessages] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessageCount = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/chat/message-count', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: session.user.id }),
        });

        if (response.ok) {
          const data = await response.json();
          const userType = session.user.type || 'regular';
          const maxMessages =
            entitlementsByUserType[userType].maxMessagesPerDay;
          const usedMessages = data.count || 0;
          setRemainingMessages(Math.max(0, maxMessages - usedMessages));
        }
      } catch (error) {
        console.error('Failed to fetch message count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessageCount();
  }, [session?.user?.id]);

  const getMessageCountText = () => {
    if (isLoading) {
      return 'Loading message count...';
    }

    if (!session?.user?.id) {
      return '<strong>Sign up:</strong> 100 messages per day';
    }

    const userType = session.user.type || 'regular';
    const maxMessages = entitlementsByUserType[userType].maxMessagesPerDay;

    if (remainingMessages === null) {
      return `<strong>Registered users:</strong> ${maxMessages} messages per day`;
    }

    return `<strong>Messages remaining:</strong> ${remainingMessages} / ${maxMessages}`;
  };

  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-semibold"
      >
        ask paras
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-zinc-500"
      >
        answers reconstructed from paras chopra's essays & threads — with
        citations.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.7 }}
        className="text-lg text-zinc-400 mt-4"
      >
        ask a question. the bot retrieves relevant passages from{' '}
        <Link
          href="https://invertedpassion.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline decoration-zinc-400/30 hover:decoration-zinc-400/60 transition-all group"
        >
          invertedpassion.com
          <svg
            className="w-3 h-3 opacity-60 group-hover:opacity-80 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7V17"
            />
          </svg>
        </Link>{' '}
        and composes an answer in his typical structure (deconstruct → rebuild →
        framework). not paras; evidence-based reconstruction.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-zinc-500 mt-2"
        dangerouslySetInnerHTML={{ __html: getMessageCountText() }}
      />
    </div>
  );
};
