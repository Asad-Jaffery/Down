import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  User,
  AuthError,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from './firebase';

export interface OTPVerificationResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Initialize reCAPTCHA verifier for phone auth
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initializeRecaptcha = (containerId: string) => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      },
    });
  }
  return recaptchaVerifier;
};

// verify phone number and send OTP
export const sendOTP = async (
  phoneNumber: string,
  containerId: string
): Promise<{
  success: boolean;
  confirmationResult?: ConfirmationResult;
  error?: string;
}> => {
  try {
    const verifier = initializeRecaptcha(containerId);
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      verifier
    );

    return {
      success: true,
      confirmationResult,
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      success: false,
      error: authError.message,
    };
  }
};

// verify OTP and get Firebase user
export const verifyOTP = async (
  confirmationResult: ConfirmationResult,
  otp: string
): Promise<OTPVerificationResult> => {
  try {
    const userCredential = await confirmationResult.confirm(otp);
    const user = userCredential.user;

    return {
      success: true,
      user,
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      success: false,
      error: authError.message,
    };
  }
};
