'use client';

import { useState, useRef, useEffect } from 'react';
import { sendOTP, verifyOTP } from '@/lib/otp-verification';
import { checkUserExists } from '@/lib/new-user-check';
import { createUserProfile } from '@/lib/onboarding';
import { User, ConfirmationResult } from 'firebase/auth';
import { UserMetadata } from '@/lib/user-utils';

interface PhoneAuthProps {
  onSuccess: (user: User, metadata: UserMetadata) => void;
  onError: (error: string) => void;
}

export default function PhoneAuth({ onSuccess, onError }: PhoneAuthProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    if (recaptchaRef.current) {
      recaptchaRef.current.id = 'recaptcha-container';
    }
  }, []);

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      setMessage('Please enter a phone number');
      return;
    }

    setLoading(true);
    setMessage('Sending OTP...');

    try {
      const result = await sendOTP(phoneNumber, 'recaptcha-container');

      if (result.success && result.confirmationResult) {
        setConfirmationResult(result.confirmationResult);
        setStep('otp');
        setMessage('OTP sent successfully!');
      } else {
        setMessage(result.error || 'Failed to send OTP');
      }
    } catch (error) {
      setMessage('Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage('Please enter the OTP');
      return;
    }

    if (!confirmationResult) {
      setMessage('No OTP confirmation available');
      return;
    }

    setLoading(true);
    setMessage('Verifying OTP...');

    try {
      // Step 1: Verify OTP with Firebase
      const otpResult = await verifyOTP(confirmationResult, otp);

      if (!otpResult.success || !otpResult.user) {
        setMessage(otpResult.error || 'Failed to verify OTP');
        return;
      }

      // Step 2: Check if user exists in Firestore
      const userCheckResult = await checkUserExists(otpResult.user);

      if (!userCheckResult.success) {
        setMessage(userCheckResult.error || 'Failed to check user');
        return;
      }

      if (userCheckResult.isExistingUser && userCheckResult.metadata) {
        // Existing user - log them in
        onSuccess(otpResult.user, userCheckResult.metadata);
        setMessage('Welcome back!');
      } else {
        // New user - show profile creation
        setCurrentUser(otpResult.user);
        setStep('profile');
        setMessage('Please create your profile');
      }
    } catch (error) {
      setMessage('Error during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!username || !displayName) {
      setMessage('Please fill in all fields');
      return;
    }

    if (!currentUser) {
      setMessage('No user found');
      return;
    }

    setLoading(true);
    setMessage('Creating profile...');

    try {
      const result = await createUserProfile(
        currentUser.uid,
        username,
        displayName
      );

      if (result.success && result.metadata) {
        onSuccess(currentUser, result.metadata);
        setMessage('Profile created successfully!');
      } else {
        setMessage(result.error || 'Failed to create profile');
      }
    } catch (error) {
      setMessage('Error creating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg'>
      {/* reCAPTCHA container */}
      <div ref={recaptchaRef} id='recaptcha-container' className='mb-4'></div>

      {step === 'phone' && (
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-center text-gray-800'>
            Sign In with Phone
          </h2>
          <p className='text-center text-gray-600'>
            Enter your phone number to receive a verification code
          </p>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Phone Number
            </label>
            <input
              type='tel'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder='+1234567890'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSendOTP}
            disabled={loading || !phoneNumber}
            className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-center text-gray-800'>
            Verify OTP
          </h2>
          <p className='text-center text-gray-600'>
            Enter the 6-digit code sent to {phoneNumber}
          </p>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              OTP Code
            </label>
            <input
              type='text'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder='123456'
              maxLength={6}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest'
              disabled={loading}
            />
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            className='w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            onClick={() => setStep('phone')}
            className='w-full text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50'
          >
            Back to Phone
          </button>
        </div>
      )}

      {step === 'profile' && (
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-center text-gray-800'>
            Create Profile
          </h2>
          <p className='text-center text-gray-600'>
            Welcome! Please create your username and display name
          </p>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Username
            </label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='username'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Display Name
            </label>
            <input
              type='text'
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder='Your Name'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <button
            onClick={handleCreateProfile}
            disabled={loading || !username || !displayName}
            className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating...' : 'Create Profile'}
          </button>
        </div>
      )}

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('Error') || message.includes('Failed')
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
