import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebase';
import { UserMetadata } from './user-utils';

export interface UserCheckResult {
  success: boolean;
  isExistingUser: boolean;
  metadata?: UserMetadata;
  error?: string;
}

export const checkUserExists = async (user: User): Promise<UserCheckResult> => {
  try {
    // existing user
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserMetadata;

      await updateDoc(doc(db, 'users', user.uid), {
        lastActive: new Date(),
      });

      return {
        success: true,
        isExistingUser: true,
        metadata: userData,
      };
    } else {
      // new user
      return {
        success: true,
        isExistingUser: false,
      };
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    return {
      success: false,
      isExistingUser: false,
      error: 'Failed to check user existence',
    };
  }
};
