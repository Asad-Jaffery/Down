'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  authMethod: 'phone' | 'email' | 'google' | string;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  displayName: string;
  username: string;
  status: 'active' | 'inactive';
}

interface UserContextType {
  user: User | null;
  loading: boolean;
}

// Create the context with default undefined (will be set in provider)
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define props for the provider
interface UserProviderProps {
  children: ReactNode;
}

// Helper function to convert Firebase timestamps to Date objects
function convertTimestamps(data: any): any {
  const converted = { ...data };

  // Convert Firebase Timestamps to Date objects
  if (converted.createdAt && converted.createdAt.toDate) {
    converted.createdAt = converted.createdAt.toDate();
  } else if (converted.createdAt) {
    converted.createdAt = new Date(converted.createdAt);
  }

  if (converted.updatedAt && converted.updatedAt.toDate) {
    converted.updatedAt = converted.updatedAt.toDate();
  } else if (converted.updatedAt) {
    converted.updatedAt = new Date(converted.updatedAt);
  }

  if (converted.lastActive && converted.lastActive.toDate) {
    converted.lastActive = converted.lastActive.toDate();
  } else if (converted.lastActive) {
    converted.lastActive = new Date(converted.lastActive);
  }

  return converted;
}

// Provider component
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUserFromFirestore = async (
    authUserId: string
  ): Promise<User | null> => {
    try {
      const firestore = getFirestore();
      const userDocumentRef = doc(firestore, 'users', authUserId);
      const userDocumentSnapshot = await getDoc(userDocumentRef);

      if (userDocumentSnapshot.exists()) {
        const firestoreUserData = userDocumentSnapshot.data();
        const userDataWithConvertedTimestamps =
          convertTimestamps(firestoreUserData);

        const completeUser: User = {
          uid: authUserId,
          ...userDataWithConvertedTimestamps,
        };

        return completeUser;
      } else {
        console.warn(
          `User ${authUserId} exists in Firebase Auth but not in Firestore users collection`
        );
        return null;
      }
    } catch (error) {
      console.error('Error loading user from Firestore:', error);
      return null;
    }
  };

  useEffect(() => {
    const auth = getAuth();
    console.log('Initializing auth listener', auth);

    const authStateUnsubscribe = onAuthStateChanged(auth, async () => {
      const currentAuthUser = auth.currentUser;

      if (currentAuthUser) {
        console.log('User is authenticated:', currentAuthUser.uid);
        const userFromFirestore = await loadUserFromFirestore(
          currentAuthUser.uid
        );
        setUser(userFromFirestore);
      } else {
        console.log('User is not authenticated');
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth listener');
      authStateUnsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to access the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
