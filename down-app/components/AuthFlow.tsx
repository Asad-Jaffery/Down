'use client';

import { useState } from 'react';
import PhoneAuth from './PhoneAuth';
import { logout } from '@/lib/logout';
import { useUser } from '@/contexts/UserContext';

interface AuthFlowProps {
  onAuthSuccess: () => void;
  onAuthError: (error: string) => void;
}

export default function AuthFlow({
  onAuthSuccess,
  onAuthError,
}: AuthFlowProps) {
  const { user, loading } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleAuthSuccess = () => {
    onAuthSuccess();
  };

  const handleAuthError = (error: string) => {
    onAuthError(error);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // UserContext will automatically update when auth state changes
    } catch (error) {
      console.error('Logout error:', error);
      onAuthError('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className='max-w-sm mx-auto p-6 rounded-lg shadow-lg'>
        <div className='text-center'>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className='max-w-sm mx-auto p-6 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-4'>
          Welcome!
        </h2>

        <div className='text-center space-y-2 mb-6'>
          <p className='text-lg font-medium text-gray-700'>
            {user.displayName || 'User'}
          </p>
          <p className='text-sm text-gray-500'>@{user.username}</p>
          <p className='text-xs text-gray-400'>
            {user.authMethod} Authentication
          </p>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className='w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
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
