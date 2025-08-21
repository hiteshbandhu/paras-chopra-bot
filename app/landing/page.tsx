// app/landing/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-semibold mb-3">welcome to ask paras</h1>
        <p className="text-gray-600 mb-8">sign in to continue.</p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            sign in
          </button>
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            sign up
          </button>
        </div>
      </div>
    </main>
  );
}
