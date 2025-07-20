'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getCurrentUserMetadata, UserMetadata } from '@/lib/user-utils';

interface AuthState {
  user: User | null;
  metadata: UserMetadata | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    metadata: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            // Fetch user metadata from Firestore
            const metadata = await getCurrentUserMetadata(user.uid);
            setAuthState({
              user,
              metadata,
              loading: false,
              error: null,
            });
          } catch (error) {
            console.error('Error fetching user metadata:', error);
            setAuthState({
              user,
              metadata: null,
              loading: false,
              error: 'Failed to load user data',
            });
          }
        } else {
          setAuthState({
            user: null,
            metadata: null,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        setAuthState({
          user: null,
          metadata: null,
          loading: false,
          error: error.message,
        });
      }
    );

    return () => unsubscribe();
  }, []);

  return authState;
}
