'use client';

import Image from 'next/image';
import AuthFlow from '@/components/AuthFlow';
import { User } from 'firebase/auth';
import { UserMetadata } from '@/lib/auth';

export default function Home() {
  const handleAuthSuccess = (user: User, metadata: UserMetadata) => {
    console.log('Authentication successful:', { user, metadata });
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication error:', error);
  };

  return (
    <div className='font-sans min-h-screen bg-gray-50 p-4'>
      <div className='max-w-md mx-auto pt-8'>
        <div className='text-center mb-8'>
          <Image
            className='dark:invert mx-auto mb-4'
            src='/next.svg'
            alt='Next.js logo'
            width={120}
            height={25}
            priority
          />
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Welcome to Your PWA
          </h1>
          <p className='text-gray-600'>
            Mobile-first authentication with Firebase
          </p>
        </div>

        <AuthFlow
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
        />
      </div>
    </div>
  );
}
