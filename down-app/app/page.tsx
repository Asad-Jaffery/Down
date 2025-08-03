'use client';

import { useUser } from '@/contexts/UserContext';
import AuthFlow from '@/components/AuthFlow';
import HomePageContent from '@/components/HomePageContent';
import { EventContext, useEventContext } from '@/contexts/EventContext';

export default function HomePage() {
  const { user, loading } = useUser();
  const eventContextValue = useEventContext();

  const handleAuthSuccess = () => {
    // Auth succeeded - UserContext will automatically update
    console.log('User authenticated successfully');
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication error:', error);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth flow if user is not authenticated
  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='max-w-md w-full'>
          <div className='rounded-xl shadow-lg border border-gray-200 p-8'>
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-white-900 mb-2'>down?</h1>
              <p className='text-gray-600'>
                Sign in to start creating and joining events
              </p>
            </div>

            <AuthFlow
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show main app content for authenticated users
  return (
    <EventContext.Provider value={eventContextValue}>
      <HomePageContent />
    </EventContext.Provider>
  );
}
