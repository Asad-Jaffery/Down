import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserMetadata } from './user-utils';

export interface OnboardingResult {
  success: boolean;
  metadata?: UserMetadata;
  error?: string;
}

/**
 * Create user profile for new users
 */
export const createUserProfile = async (
  uid: string,
  username: string,
  displayName: string
): Promise<OnboardingResult> => {
  try {
    // Check if username is unique
    const usernameQuery = query(
      collection(db, 'users'),
      where('username', '==', username)
    );
    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
      return { success: false, error: 'Username already exists' };
    }

    // Create user metadata
    const userMetadata: UserMetadata = {
      uid,
      username,
      displayName,
      authMethod: 'phone',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActive: new Date(),
    };

    // Save user to Firestore
    await setDoc(doc(db, 'users', uid), userMetadata);

    return {
      success: true,
      metadata: userMetadata,
    };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: 'Failed to create user profile' };
  }
};
