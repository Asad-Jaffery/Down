import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserMetadata {
  uid: string;
  username: string;
  displayName: string;
  authMethod: 'phone';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
}

/**
 * Get current user metadata from Firestore
 */
export const getCurrentUserMetadata = async (
  uid: string
): Promise<UserMetadata | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserMetadata;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user metadata:', error);
    return null;
  }
};

/**
 * Update user metadata
 */
export const updateUserMetadata = async (
  uid: string,
  updates: Partial<UserMetadata>
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return false;
  }
};
