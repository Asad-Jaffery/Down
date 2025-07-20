import { signOut, AuthError } from 'firebase/auth';
import { auth } from './firebase';

export interface LogoutResult {
  success: boolean;
  error?: string;
}

// sign out current user
export const logout = async (): Promise<LogoutResult> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: authError.message };
  }
};
