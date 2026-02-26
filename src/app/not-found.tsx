'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-amber-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            The page you&apos;re looking for doesn&apos;t exist. You&apos;ll be redirected to the homepage in a few seconds.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/services"
            className="inline-block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            View Our Services
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Redirecting automatically in 3 seconds...
        </p>
      </div>
    </div>
  );
}
