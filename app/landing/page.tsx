'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const router = useRouter();
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartChatting = () => {
    router.push('/register');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="px-4 pt-16 md:pt-24 max-w-4xl mx-auto">
          <div className="text-center space-y-12">
            {/* Headlines */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
                ask paras
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                ask a real question. get an answer with receipts.
              </p>

              {/* Trust Pills */}
              <div className="flex flex-wrap justify-center gap-3">
                <span className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 bg-white">
                  no hallucinations
                </span>
                <span className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 bg-white">
                  sources included
                </span>
                <span className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 bg-white">
                  not affiliated
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleStartChatting}
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium"
                  aria-label="Start chatting with 100 messages and history"
                >
                  Start chatting — 50 & history
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tweet Section */}
        <section className="px-4 py-8">
          <div className="max-w-4xl mx-auto flex justify-center">
            <blockquote className="twitter-tweet" data-conversation="none">
              <p lang="en" dir="ltr">
                wow! i actually enjoyed this :)
              </p>
              &mdash; Paras Chopra (@paraschopra)
              <a href="https://twitter.com/paraschopra/status/1958079945445449927">
                August 20, 2025
              </a>
            </blockquote>
          </div>
        </section>

        {/* Credibility Section
        <section className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 text-xs text-gray-500">
                <span>indexed: 200+ essays & threads</span>
                <span>·</span>
                <span>last updated: aug 20, 2025</span>
              </div>
            </div>
          </div>
        </section> */}

        {/* Footer */}
        <footer className="px-4 pt-6 mb-0 border-t border-gray-200 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-gray-500">
              style-informed answers from paras chopra's public essays & threads
              (
              <a
                href="https://invertedpassion.com"
                className="underline hover:text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                invertedpassion.com
              </a>
              ). sources cited. independent; not affiliated or endorsed (yet!)
            </p>
          </div>
        </footer>
      </main>

      {/* Mobile Sticky CTA Bar */}
      {showStickyBar && (
        <div className="fixed bottom-3 left-4 right-4 md:hidden z-50">
          <div className="w-full max-w-sm mx-auto">
            <Button
              onClick={handleStartChatting}
              size="lg"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
              aria-label="Start chatting with 100 messages"
            >
              start chatting — 100 & history
            </Button>
          </div>
        </div>
      )}

      {/* Twitter Widget Script */}
      <script
        async
        src="https://platform.twitter.com/widgets.js"
        charSet="utf-8"
      />
    </>
  );
}
