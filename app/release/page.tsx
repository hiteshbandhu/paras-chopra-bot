'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ReleasePage() {
  const router = useRouter();

  const handleBackToLanding = () => {
    router.push('/');
  };

  return (
    <>
      {/* Alpha Banner - Sticky */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-orange-100 border-b border-orange-200 py-3 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-marquee whitespace-nowrap">
              <p className="text-sm md:text-base text-orange-800 font-medium">
                <span className="mx-4">⚠️ Alpha Version - Expect some bugs</span>
                <span className="mx-4">📱 Best viewed on big screens</span>
                <span className="mx-4">
                  🧵 Threads not available yet but coming soon
                </span>
                <span className="mx-4">
                  🤖 More models will be available soon
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Container with Sticky Footer */}
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-white">
          <div className="px-4 pt-20 md:pt-28 max-w-4xl mx-auto">
            <div className="text-center space-y-12">
              {/* Header */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
                  Release v0.1.0 Alpha
                </h1>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
                  <span>
                    by{' '}
                    <span className="font-medium text-gray-800">
                      @hiteshbandhu
                    </span>
                  </span>
                  <span className="hidden sm:block">•</span>
                  <span>
                    data by{' '}
                    <span className="font-medium text-gray-800">
                      @paraschopra
                    </span>
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full border border-orange-200 text-sm text-orange-700">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  Alpha Version - Expect Bugs
                </div>

                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  The first public release of ask paras
                </p>
              </div>

              {/* Release Date */}
              <div className="text-gray-500">
                <p className="text-lg">Released: January 2025</p>
              </div>

              {/* Features */}
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  What's Included
                </h2>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <div className="text-left space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Core Features
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>
                          Chat interface with Paras Chopra's knowledge base
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Source citations for all answers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>50 free messages per session</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Chat history preservation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>User authentication system</span>
                      </li>
                    </ul>
                  </div>

                  <div className="text-left space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Knowledge Base
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>200+ essays from Inverted Passion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Public Twitter threads</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Real-time search and retrieval</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Coming Soon */}
                <div className="space-y-6 pt-8">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    Coming Soon
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <div className="text-left space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Features
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">→</span>
                          <span>Thread support (currently unavailable)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">→</span>
                          <span>More AI models for chat</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">→</span>
                          <span>Enhanced mobile experience</span>
                        </li>
                      </ul>
                    </div>

                    <div className="text-left space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Improvements
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">→</span>
                          <span>Better bug fixes and stability</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">→</span>
                          <span>Performance optimizations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">→</span>
                          <span>Enhanced UI/UX</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="pt-8">
                <Button
                  onClick={handleBackToLanding}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3"
                >
                  Back to Landing
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer - Sticky to Bottom */}
        <footer className="mt-auto px-4 pt-6 pb-4 border-t border-gray-200 bg-white">
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
      </div>
    </>
  );
}
