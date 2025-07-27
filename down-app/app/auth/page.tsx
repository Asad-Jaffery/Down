'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthFlow from '@/components/AuthFlow';
import { User } from 'firebase/auth';
import { UserMetadata } from '@/lib/auth';

export default function AuthPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = (user: User, metadata: UserMetadata) => {
    console.log('Authentication successful:', { user, metadata });
    setIsAuthenticated(true);
    // Redirect to home page after successful authentication
    router.push('/');
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication error:', error);
  };

  // For demo purposes, show a simple login form
  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='max-w-md w-full'>
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Welcome to Down
              </h1>
              <p className='text-gray-600'>
                Sign in to start creating and joining events
              </p>
            </div>

            <AuthFlow
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
            />

            {/* Demo bypass button */}
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <button
                onClick={() => router.push('/')}
                className='w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors'
              >
                Continue as Demo User
              </button>
              <p className='text-xs text-gray-500 text-center mt-2'>
                Skip authentication for demo purposes
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
