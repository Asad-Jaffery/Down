'use client';

import { useState } from 'react';
import PhoneAuth from './PhoneAuth';
import { logout } from '@/lib/logout';
import { User } from 'firebase/auth';
import { UserMetadata } from '@/lib/user-utils';

interface AuthFlowProps {
  onAuthSuccess: (user: User, metadata: UserMetadata) => void;
  onAuthError: (error: string) => void;
}

export default function AuthFlow({
  onAuthSuccess,
  onAuthError,
}: AuthFlowProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentMetadata, setCurrentMetadata] = useState<UserMetadata | null>(
    null
  );

  const handleAuthSuccess = (user: User, metadata: UserMetadata) => {
    setCurrentMetadata(metadata);
    setIsAuthenticated(true);
    onAuthSuccess(user, metadata);
  };

  const handleAuthError = (error: string) => {
    onAuthError(error);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setCurrentMetadata(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isAuthenticated) {
    return (
      <div className='max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-4'>
          Welcome!
        </h2>

        <div className='text-center space-y-2 mb-6'>
          <p className='text-lg font-medium text-gray-700'>
            {currentMetadata?.displayName || 'User'}
          </p>
          <p className='text-sm text-gray-500'>@{currentMetadata?.username}</p>
          <p className='text-xs text-gray-400'>Phone Authentication</p>
        </div>

        <button
          onClick={handleLogout}
          className='w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700'
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-sm mx-auto'>
      <PhoneAuth onSuccess={handleAuthSuccess} onError={handleAuthError} />
    </div>
  );
}
